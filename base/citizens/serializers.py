from rest_framework import serializers
from .models import *


class RecursiveField(serializers.Serializer):
    def to_representation(self, value):
        serializer = self.parent.parent.__class__(value, context=self.context)
        return serializer.data


class JobSerializer(serializers.ModelSerializer):
    class Meta:
        model = Job
        fields = ('id', 'name', 'avg_wage', 'status',)


class StatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = Status
        fields = ('id', 'name', 'importance',)


class ShortCitizenSerializer(serializers.ModelSerializer):
    class Meta:
        model = Citizen
        fields = ('id', 'name',)


class CitizenSerializer(serializers.ModelSerializer):
    job_detail = JobSerializer(source='job', read_only=True)
    status_detail = StatusSerializer(source='status', read_only=True)
    # children = RecursiveField(source='subordinates', many=True, read_only=True)

    class Meta:
        model = Citizen
        fields = (
            'id', 'first_name', 'last_name', 'name', 'years', 'status',
            'status_detail',
            'job',
            'job_detail',
            'obey',
            'subordinates',
            # 'children',
            'wage',
        )
        read_only_fields = ('subordinates',)
