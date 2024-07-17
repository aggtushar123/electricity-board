from django.http import JsonResponse
from django.core.paginator import Paginator
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import User, Application
from .serializers import UserSerializer
import datetime
from django.db.models.functions import TruncMonth
from django.db.models import Count
import json
import logging

@api_view(['GET'])
def get_user_details_by_id(request, id):
    try:
        user = get_object_or_404(User, pk=id)
        serializer = UserSerializer(user)
        return Response({'data': serializer.data})
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
def get_user_list(request):
    try:
        page_size = int(request.GET.get('pSize', 10))
        page_number = int(request.GET.get('page', 1))
        users = User.objects.all().order_by('ID')

        if 'datemin' in request.GET and 'datemax' in request.GET:
            datemin = datetime.datetime.strptime(request.GET['datemin'], '%Y-%m-%d')
            datemax = datetime.datetime.strptime(request.GET['datemax'], '%Y-%m-%d')
            users = users.filter(application__date_of_application__range=[datemin, datemax])

        paginator = Paginator(users, page_size)
        page_obj = paginator.get_page(page_number)
        serializer = UserSerializer(page_obj, many=True)

        return Response({'data': serializer.data, 'totalCount': paginator.count, 'currentCount': len(page_obj)})
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PATCH'])
def edit_user_details(request, id):
    try:
        user = get_object_or_404(User, pk=id)
        serializer = UserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            updated_user = serializer.save()
            return Response({'msg': 'User data updated successfully', 'data': UserSerializer(updated_user).data })
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

logger = logging.getLogger(__name__)

@api_view(['POST'])
def get_dashboard_data(request):
    try:
        data = request.data
        logger.info(f"Received request data: {data}")
        
        start_month = data['startMonth']
        start_year = data['startYear']
        end_month = data['endMonth']
        end_year = data['endYear']
        status_value = data.get('status', 'Pending')

        # Calculate the first and last date
        start_date = datetime.date(start_year, start_month, 1)
        end_date = datetime.date(end_year, end_month + 1, 1) - datetime.timedelta(days=1)
        
        logger.info(f"Start date: {start_date}, End date: {end_date}")

        # Query the database
        queryset = Application.objects.filter(
            date_of_application__range=[start_date, end_date],
            status=status_value
        ).annotate(month=TruncMonth('date_of_application')).values('month').annotate(count=Count('id')).order_by('month')
        
        logger.info(f"Queryset: {queryset}")

        response_data = [{'month': entry['month'].strftime('%B'), 'count': entry['count']} for entry in queryset]
        
        logger.info(f"Response data: {response_data}")

        return Response({'label': status_value, 'data': response_data})
    except KeyError as e:
        logger.error(f"Missing required field: {str(e)}")
        return Response({'error': f'Missing required field: {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)
    except ValueError as e:
        logger.error(f"Invalid date format: {str(e)}")
        return Response({'error': f'Invalid date format: {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        logger.error(f"An error occurred: {str(e)}")
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)