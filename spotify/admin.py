from django.contrib import admin

from .models import *

@admin.register(SpotifyToken)
class SpotifyToken(admin.ModelAdmin):
    list_display = ('user', 'created_at', 'refresh_token', 'access_token', 'expires_in', 'token_type')

@admin.register(Vote)
class Vote(admin.ModelAdmin):
    list_display = ('user', 'created_at', 'song_id', 'room')