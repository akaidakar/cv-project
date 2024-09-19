from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

# Register your models here.

from .forms import CustomUserCreationForm, CustomUserChangeForm
from .models import CustomUser


class CustomUserAdmin(UserAdmin):
    add_form = CustomUserCreationForm
    form = CustomUserChangeForm
    list_display = [
        "email",
        "username",
        "first_name",
        "last_name",
        "subscription",
    ]
    fieldsets = UserAdmin.fieldsets + ((None, {"fields": ("subscription",)}),)
    add_fieldsets = UserAdmin.add_fieldsets + ((None, {"fields": ("subscription",)}),)


admin.site.register(CustomUser, CustomUserAdmin)
