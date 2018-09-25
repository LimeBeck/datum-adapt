from django.db import models
from django.contrib.gis.db import models


class Types(models.Model):
    name = models.CharField(max_length=50)
    description = models.CharField(max_length=200)

    def __str__(self):
        return self.name


class Objects(models.Model):
    name = models.CharField(max_length=50)
    description = models.CharField(max_length=200)
    geom = models.PointField()
    type = models.ForeignKey(Types, on_delete=models.CASCADE)
