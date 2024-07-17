import csv
from datetime import datetime
from django.core.management.base import BaseCommand
from backend.models import User, GovernmentID, Address, Application, Reviewer, Review

def parse_date(date_string):
    if not date_string:
        return None
    try:
        return datetime.strptime(date_string, '%d-%m-%y').date()
    except ValueError:
        try:
            return datetime.strptime(date_string, '%d-%m-%Y').date()
        except ValueError:
            return None

def parse_number(number_string):
    try:
        return int(float(number_string))
    except ValueError:
        return None

class Command(BaseCommand):
    help = 'Load data from CSV file'

    def add_arguments(self, parser):
        parser.add_argument('csv_file', type=str, help='Path to CSV file')

    def handle(self, *args, **options):
        csv_file = options['csv_file']
        with open(csv_file, mode='r', encoding='utf-8-sig') as file:
            reader = csv.DictReader(file)
            for row in reader:
                try:
                    # Create User
                    user = User.objects.create(
                        applicant_name=row['Applicant_Name'],
                        gender=row['Gender'],
                        ownership=row['Ownership']
                    )

                    # Create GovernmentID
                    GovernmentID.objects.create(
                        user=user,
                        govt_id_type=row['GovtID_Type'],
                        id_number=parse_number(row['ID_Number'])
                    )

                    # Create Address
                    Address.objects.create(
                        user=user,
                        district=row['District'],
                        state=row['State'],
                        pincode=parse_number(row['Pincode'])
                    )

                    # Parse dates
                    date_of_application = parse_date(row['Date_of_Application'])
                    date_of_approval = parse_date(row['Date_of_Approval'])
                    modified_date = parse_date(row['Modified_Date'])

                    # Create Application
                    application = Application.objects.create(
                        user=user,
                        category=row['Category'],
                        load_applied=parse_number(row['Load_Applied (in KV)']),
                        date_of_application=date_of_application,
                        date_of_approval=date_of_approval,
                        modified_date=modified_date,
                        status=row['Status']
                    )

                    # Create Reviewer
                    reviewer = Reviewer.objects.create(
                        reviewer_id=parse_number(row['Reviewer_ID']),
                        reviewer_name=row['Reviewer_Name']
                    )

                    # Create Review
                    Review.objects.create(
                        reviewer=reviewer,
                        application=application,
                        reviewer_comments=row['Reviewer_Comments']
                    )

                    self.stdout.write(self.style.SUCCESS(f"Successfully created user {user.applicant_name}"))
                
                except Exception as e:
                    self.stdout.write(self.style.ERROR(f"Failed to create user {row.get('Applicant_Name', 'Unknown')}: {str(e)}"))
                    continue

        self.stdout.write(self.style.SUCCESS('Data loaded successfully'))