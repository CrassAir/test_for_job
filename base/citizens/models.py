from django.db import models


class Citizen(models.Model):
    first_name = models.CharField(max_length=120)
    last_name = models.CharField(max_length=120)
    years = models.PositiveIntegerField(blank=True, null=True)
    status = models.ForeignKey('Status', on_delete=models.PROTECT, related_name='citizens')
    job = models.ForeignKey('Job', on_delete=models.PROTECT, blank=True, null=True)
    obey = models.ForeignKey('self', on_delete=models.CASCADE, related_name='subordinates', blank=True, null=True)
    wage = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f'{self.pk} - {self.name} -{self.job.name if self.job else ""}'

    @property
    def name(self):
        return f'{self.last_name} {self.first_name}'


class Job(models.Model):
    name = models.CharField(max_length=120)
    avg_wage = models.PositiveIntegerField(default=100)
    status = models.ForeignKey('Status', on_delete=models.PROTECT, related_name='jobs')

    def __str__(self):
        return self.name


class Status(models.Model):
    name = models.CharField(max_length=120)
    importance = models.IntegerField(default=1)

    def __str__(self):
        return self.name
