from django.contrib import admin
from backend.models import User, GovernmentID, Address, Application, Reviewer, Review

# Register your models here.
admin.site.register(User)
admin.site.register(GovernmentID)
admin.site.register(Address)
admin.site.register(Application)
admin.site.register(Reviewer)
admin.site.register(Review)