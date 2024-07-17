from rest_framework import serializers
from .models import User, GovernmentID, Address, Application, Reviewer, Review

class GovernmentIDSerializer(serializers.ModelSerializer):
    class Meta:
        model = GovernmentID
        fields = '__all__'
        read_only_fields = ('govt_id_type', 'id_number')
        
class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = '__all__'

class ReviewerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reviewer
        fields = '__all__'

class ReviewSerializer(serializers.ModelSerializer):
    reviewer = ReviewerSerializer()
    
    class Meta:
        model = Review
        fields = '__all__'


class ApplicationSerializer(serializers.ModelSerializer):
    reviews = ReviewSerializer(many=True, read_only=True)
    class Meta:
        model = Application
        fields = '__all__'
        read_only_fields = ('date_of_application',)

    def validate_load_applied(self, value):
        if value > 200:
            raise serializers.ValidationError("Load applied should not exceed 200 KV.")
        return value


class UserSerializer(serializers.ModelSerializer):
    government_id = GovernmentIDSerializer()
    address = AddressSerializer()
    application = ApplicationSerializer()

    class Meta:
        model = User
        fields = '__all__'