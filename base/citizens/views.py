import random

from django_seed import Seed
from rest_framework import viewsets
from rest_framework.decorators import action, api_view
from rest_framework.response import Response

from .models import *
from .serializers import *


@api_view(['POST'])
def check_authorization(request):
    return Response(status=200)


class CitizenViewSet(viewsets.ModelViewSet):
    queryset = Citizen.objects.all()
    serializer_class = CitizenSerializer

    def get_queryset(self):
        if self.kwargs.get('pk'):
            return self.queryset
        status = self.request.query_params.get('status')
        if status:
            self.serializer_class = ShortCitizenSerializer
            return Citizen.objects.prefetch_related('status').filter(status__importance=status)
        return Citizen.objects.prefetch_related('job').prefetch_related('status').prefetch_related('subordinates').all()

    @action(methods=['POST'], detail=False)
    def create_seeds(self, request):
        data = request.data
        count = data.get('create', 10)
        if count > 500:
            count = 500
        Citizen.objects.get_or_create(first_name='Главный', last_name='Самый',
                                      status=Status.objects.get(importance__gte=4),
                                      job=Job.objects.get(name='Король'), years=25, wage=25000)
        seeder = Seed.seeder(locale='ru_RU')
        status = [i for i in Status.objects.exclude(importance=4)]
        seeder.add_entity(Citizen, int(count), {
            'status': lambda x: random.choice(status),
            'years': lambda x: random.randint(16, 70),
        })
        seeder.execute()
        citizens = Citizen.objects.prefetch_related('status').all()
        bulk_list = []
        for citizen in citizens:
            if citizen.job and citizen.job.name == 'Король':
                continue
            job = citizen.status.jobs.order_by('?').first()
            citizen.job = job
            citizen.obey = citizens.filter(status__importance=citizen.status.importance + 1).order_by(
                '?').first()
            citizen.wage = job.avg_wage * random.uniform(0.9, 1.1)
            bulk_list.append(citizen)
        Citizen.objects.bulk_update(bulk_list, ['job', 'obey', 'wage'])
        return Response(status=200)


class JobViewSet(viewsets.ModelViewSet):
    queryset = Job.objects.all()
    serializer_class = JobSerializer

    def get_queryset(self):
        status = self.request.query_params.get('status')
        if status:
            return Job.objects.filter(status=status)
        return self.queryset


class StatusViewSet(viewsets.ModelViewSet):
    queryset = Status.objects.all()
    serializer_class = StatusSerializer
