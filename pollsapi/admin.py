from django.contrib import admin

from .models import Poll, Choice


class ChoiceInline(admin.TabularInline):
    model = Choice
    extra = 1


class PollsAdmin(admin.ModelAdmin):
    list_display = ('question', 'pub_date')
    fieldsets = [
        (None, {'fields': ['question']}),
        
    ]
    inlines = [ChoiceInline]
    list_filter = ['pub_date']
    search_fields = ['question']
    
# Register your models here.
admin.site.register(Poll, PollsAdmin)
admin.site.register(Choice)
