# Generated by Django 2.1.1 on 2018-09-24 14:20

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('pollsapi', '0002_auto_20180924_1718'),
    ]

    operations = [
        migrations.AddField(
            model_name='vote',
            name='choice',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, to='pollsapi.Choice'),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='vote',
            name='poll',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='pollsapi.Poll'),
        ),
    ]
