from django.shortcuts import render
from rest_framework import viewsets
from map.models import *
from map.serializers import *
from django.template import loader
from django.http import HttpResponse


def index(request):
    return render(request, "map/index.html")


def map_view(request):
    return render(request, "map/map.html")


# Create your views here.
class TypesViewSet(viewsets.ModelViewSet):
    queryset = Types.objects.all()
    serializer_class = TypesSerializer


class ObjectsViewSet(viewsets.ModelViewSet):
    queryset = Objects.objects.all()
    serializer_class = ObjectsSerializer
