from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.core.validators import RegexValidator
from django.utils import timezone
import random
import string

class UserManager(BaseUserManager):
    """Define a model manager for User model with no username field."""

    use_in_migrations = True

    def _create_user(self, email, password, **extra_fields):
        """Create and save a User with the given email and password."""
        if not email:
            raise ValueError('The given email must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, email, password=None, **extra_fields):
        """Create and save a regular User with the given email and password."""
        extra_fields.setdefault('is_staff', False)
        extra_fields.setdefault('is_superuser', False)
        return self._create_user(email, password, **extra_fields)

    def create_superuser(self, email, password, **extra_fields):
        """Create and save a SuperUser with the given email and password."""
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self._create_user(email, password, **extra_fields)

class User(AbstractUser):
    # Remove username field (use email instead)
    username = None
    email = models.EmailField('email address', unique=True)
    
    phone_regex = RegexValidator(
        regex=r'^\+?1?\d{9,15}$',
        message="Phone number must be entered in the format: '+999999999'."
    )
    phone_number = models.CharField(validators=[phone_regex], max_length=17, blank=True)
    address = models.TextField(blank=True)
    pincode = models.CharField(max_length=10, blank=True)
    city = models.CharField(max_length=100, blank=True)
    country = models.CharField(max_length=100, blank=True)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []
    
    objects = UserManager()

    def __str__(self):
        return self.email

class Incident(models.Model):
    PRIORITY_CHOICES = [
        ('High', 'High'),
        ('Medium', 'Medium'),
        ('Low', 'Low'),
    ]
    
    STATUS_CHOICES = [
        ('Open', 'Open'),
        ('In Progress', 'In Progress'),
        ('Closed', 'Closed'),
    ]
    
    TYPE_CHOICES = [
        ('Enterprise', 'Enterprise'),
        ('Government', 'Government'),
    ]
    
    incident_id = models.CharField(max_length=20, unique=True, editable=False)
    reporter = models.ForeignKey(
        User, 
        on_delete=models.CASCADE, 
        related_name='incidents',
        verbose_name='Reporter'
    )
    incident_type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    details = models.TextField()
    reported_date = models.DateTimeField(default=timezone.now)
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='Medium')
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='Open')
    
    class Meta:
        ordering = ['-reported_date']
        verbose_name = 'Incident'
        verbose_name_plural = 'Incidents'

    def save(self, *args, **kwargs):
        if not self.incident_id:
            # Generate unique incident ID: RMG + 5 digits + current year
            while True:
                random_digits = ''.join(random.choices(string.digits, k=5))
                new_id = f"RMG{random_digits}{timezone.now().year}"
                if not Incident.objects.filter(incident_id=new_id).exists():
                    self.incident_id = new_id
                    break
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"{self.incident_id} - {self.get_status_display()}"
    
    def can_edit(self):
        return self.status != 'Closed'