from rest_framework import serializers
from rest_framework_gis.serializers import GeoModelSerializer
from map.models import *


class TypesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Types
        fields = '__all__'


class ObjectsSerializer(GeoModelSerializer):
    #type= TypesSerializer()


    class Meta:
        model = Objects
        geo_field = 'geom'
        fields = ('id', 'type', 'name', 'description', 'geom')
