from django.contrib import admin

from .models import Room

@admin.register(Room)
class Room(admin.ModelAdmin):
    list_display = ('code', 'host', 'guest_can_pause', 'votes_to_skip', 'created_at')