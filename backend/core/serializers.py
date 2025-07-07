# from rest_framework import serializers
# from .models import User, Incident
# from django.contrib.auth import authenticate
# from rest_framework.authtoken.models import Token
# import requests

# class UserSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = User
#         fields = ['id', 'username', 'email', 'phone_number', 'address', 'pincode', 'city', 'country']
#         extra_kwargs = {'password': {'write_only': True}}

#     def create(self, validated_data):
#         user = User.objects.create_user(**validated_data)
#         return user

# class LoginSerializer(serializers.Serializer):
#     email = serializers.EmailField()
#     password = serializers.CharField()

#     def validate(self, data):
#         user = authenticate(username=data['email'], password=data['password'])
#         if not user:
#             raise serializers.ValidationError("Invalid credentials")
#         return user

# class ForgotPasswordSerializer(serializers.Serializer):
#     email = serializers.EmailField()

# class IncidentSerializer(serializers.ModelSerializer):
#     reporter_name = serializers.CharField(source='reporter.username', read_only=True)
#     can_edit = serializers.BooleanField(source='can_edit', read_only=True)

#     class Meta:
#         model = Incident
#         fields = ['incident_id', 'reporter', 'reporter_name', 'incident_type', 'details', 
#                  'reported_date', 'priority', 'status', 'can_edit']
#         read_only_fields = ['incident_id', 'reporter', 'reported_date']

#     def validate(self, data):
#         if self.instance and self.instance.status == 'Closed':
#             raise serializers.ValidationError("Closed incidents cannot be edited")
#         return data
from rest_framework import serializers
from .models import User, Incident
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
import requests

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'phone_number', 'address', 'pincode', 'city', 'country']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()

    def validate(self, data):
        try:
            user = User.objects.get(email=data['email'])
        except User.DoesNotExist:
            raise serializers.ValidationError("Invalid credentials")

        user = authenticate(username=user.username, password=data['password'])
        if not user:
            raise serializers.ValidationError("Invalid credentials")
        return user

class ForgotPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()

class IncidentSerializer(serializers.ModelSerializer):
    reporter_name = serializers.CharField(source='reporter.username', read_only=True)
    can_edit = serializers.BooleanField(source='can_edit', read_only=True)

    class Meta:
        model = Incident
        fields = ['incident_id', 'reporter', 'reporter_name', 'incident_type', 'details', 
                 'reported_date', 'priority', 'status', 'can_edit']
        read_only_fields = ['incident_id', 'reporter', 'reported_date']

    def validate(self, data):
        if self.instance and self.instance.status == 'Closed':
            raise serializers.ValidationError("Closed incidents cannot be edited")
        return data