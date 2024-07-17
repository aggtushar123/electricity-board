from django.urls import path
from .views import get_user_details_by_id, get_user_list, edit_user_details, get_dashboard_data

urlpatterns = [
    path('details/<int:id>/', get_user_details_by_id, name='user-details'),
    path('list/', get_user_list, name='user-list'),
    path('edit/<int:id>/', edit_user_details, name='edit-user'),
    path('dashboard/', get_dashboard_data, name='dashboard-data'),
]
