# Generated by Django 2.1.1 on 2018-09-25 10:55

import django.contrib.gis.db.models.fields
from django.db import migrations, models
import django.db.models.deletion
from django.contrib.postgres.operations import CreateExtension

class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        CreateExtension('postgis'),
        migrations.CreateModel(
            name='Objects',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=50)),
                ('description', models.CharField(max_length=200)),
                ('geom', django.contrib.gis.db.models.fields.PointField(srid=4326)),
            ],
        ),
        migrations.CreateModel(
            name='Types',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=50)),
                ('description', models.CharField(max_length=200)),
            ],
        ),
        migrations.AddField(
            model_name='objects',
            name='type',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='map.Types'),
        ),
    ]