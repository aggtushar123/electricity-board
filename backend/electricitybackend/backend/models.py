from django.db import models
from django.core.exceptions import ValidationError

class User(models.Model):
    ID = models.BigAutoField(primary_key=True)
    applicant_name = models.CharField(max_length=255)
    gender = models.CharField(max_length=10, choices=[('Male', 'Male'), ('Female', 'Female'), ('Other', 'Other')])
    ownership = models.CharField(max_length=10, choices=[('JOINT', 'JOINT'), ('INDIVIDUAL', 'INDIVIDUAL')])

class GovernmentID(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='government_id')
    govt_id_type = models.CharField(max_length=10, choices=[('AADHAR', 'AADHAR'), ('PAN', 'PAN'), ('PASSPORT', 'PASSPORT'), ('VOTER_ID', 'VOTER_ID')], editable=False)
    id_number = models.BigIntegerField(blank=True, null=True, editable=False)

class Address(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='address')
    district = models.CharField(max_length=10, choices=[('East', 'East'), ('West', 'West'), ('North', 'North'), ('South', 'South'), ('Other', 'Other')])
    state = models.CharField(max_length=255, blank=True, null=True)
    pincode = models.IntegerField(blank=True, null=True)

class Application(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='application')
    category = models.CharField(max_length=15, choices=[('Commercial', 'Commercial'), ('Residential', 'Residential')])
    load_applied = models.IntegerField(blank=True, null=True)
    date_of_application = models.DateField(blank=True, null=True, editable=False)
    date_of_approval = models.DateField(blank=True, null=True)
    modified_date = models.DateField(blank=True, null=True)
    status = models.CharField(max_length=25, choices=[('Approved', 'Approved'), ('Pending', 'Pending'), ('Connection Released', 'Connection Released'), ('Rejected', 'Rejected')])

    def clean(self):
        if self.load_applied and self.load_applied > 200:
            raise ValidationError({'load_applied': 'Load applied should not exceed 200 KV.'})
    
    def save(self, *args, **kwargs):
        self.full_clean()  
        if not self.date_of_application:
            self.date_of_application = timezone.now().date()
        super(Application, self).save(*args, **kwargs)

class Reviewer(models.Model):
    reviewer_id = models.BigIntegerField(primary_key=True)
    reviewer_name = models.CharField(max_length=255)

class Review(models.Model):
    id = models.BigAutoField(primary_key=True)
    reviewer = models.ForeignKey(Reviewer, on_delete=models.CASCADE, related_name='reviews')
    application = models.ForeignKey(Application, on_delete=models.CASCADE, related_name='reviews')
    reviewer_comments = models.TextField(blank=True, null=True)