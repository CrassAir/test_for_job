from django.urls import path, include
from rest_framework import routers
from . import views

router = routers.DefaultRouter()

router.register('citizens', views.CitizenViewSet)
router.register('job', views.JobViewSet)
router.register('status', views.StatusViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('check_authorization/', views.check_authorization, name="check_authorization"),
]
