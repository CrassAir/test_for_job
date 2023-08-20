from django.contrib import admin
from .models import *


@admin.register(Citizen)
class CitizenAdmin(admin.ModelAdmin):
    list_display = ['name', 'status']


@admin.register(Job)
class JobAdmin(admin.ModelAdmin):
    list_display = ['name', 'status', 'avg_wage']


admin.site.register(Status)
