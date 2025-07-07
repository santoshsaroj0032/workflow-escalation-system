# from django.contrib import admin
# from .models import User, Incident

# @admin.register(User)
# class UserAdmin(admin.ModelAdmin):
#     list_display = ('username', 'email', 'phone_number', 'city', 'country')
#     search_fields = ('username', 'email', 'phone_number')
#     list_filter = ('city', 'country')

# @admin.register(Incident)
# class IncidentAdmin(admin.ModelAdmin):
#     list_display = ('incident_id', 'reporter', 'incident_type', 'priority', 'status', 'reported_date')
#     search_fields = ('incident_id', 'details')
#     list_filter = ('incident_type', 'priority', 'status', 'reported_date')
#     readonly_fields = ('incident_id', 'reporter', 'reported_date')
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