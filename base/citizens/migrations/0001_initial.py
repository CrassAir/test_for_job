# Generated by Django 3.2.5 on 2023-08-16 19:46

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Status',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=120)),
                ('importance', models.IntegerField(default=1)),
            ],
        ),
        migrations.CreateModel(
            name='Job',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=120)),
                ('avg_wage', models.PositiveIntegerField(default=100)),
                ('status', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='jobs', to='citizens.status')),
            ],
        ),
        migrations.CreateModel(
            name='Citizen',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('first_name', models.CharField(max_length=120)),
                ('last_name', models.CharField(max_length=120)),
                ('years', models.PositiveIntegerField(default=1)),
                ('wage', models.PositiveIntegerField(default=0)),
                ('job', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, to='citizens.job')),
                ('obey', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='subordinates', to='citizens.citizen')),
                ('status', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='citizens', to='citizens.status')),
            ],
        ),
    ]
