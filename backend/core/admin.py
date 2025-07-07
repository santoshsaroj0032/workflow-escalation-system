 
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Incident

class CustomUserAdmin(UserAdmin):
    list_display = ('email', 'phone_number', 'city', 'country', 'is_staff')
    search_fields = ('email', 'phone_number')
    ordering = ('email',)
    
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal info', {'fields': ('first_name', 'last_name', 'phone_number', 'address', 'pincode', 'city', 'country')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )

admin.site.register(User, CustomUserAdmin)
admin.site.register(Incident)