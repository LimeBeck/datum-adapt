from django.contrib import admin
from django.contrib.gis.admin import GeoModelAdmin, OSMGeoAdmin


from .models import Types, Objects


class ObjectsAdmin(OSMGeoAdmin):
    default_lon = 47.240078
    default_lat = 39.710713
    fields = ('name', 'description', 'type', 'geom')


# Register your models here.
admin.site.register(Types)
admin.site.register(Objects, ObjectsAdmin)
