from django.test import TestCase
from django.contrib.auth import get_user_model
from .models import Incident

class UserModelTests(TestCase):
    def test_create_user(self):
        User = get_user_model()
        user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123',
            phone_number='+1234567890',
            address='123 Test St',
            pincode='123456',
            city='Test City',
            country='Test Country'
        )
        self.assertEqual(user.email, 'test@example.com')
        self.assertTrue(user.check_password('testpass123'))
        self.assertEqual(user.city, 'Test City')

class IncidentModelTests(TestCase):
    def setUp(self):
        User = get_user_model()
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )

    def test_create_incident(self):
        incident = Incident.objects.create(
            reporter=self.user,
            incident_type='Enterprise',
            details='Test incident details',
            priority='High',
            status='Open'
        )
        self.assertTrue(incident.incident_id.startswith('RMG'))
        self.assertEqual(incident.reporter, self.user)
        self.assertEqual(incident.status, 'Open')