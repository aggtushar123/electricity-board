Installation

1.	Install frontend dependencies:

npm install

2.	Install backend dependencies:

pip install -r requirements.txt

Running the Development Servers
1.	Set up a virtual environment

# Install virtualenv if you haven't already
pip install venv venv

# Activate the virtual environment (Windows)
venv\Scripts\activate

# Activate the virtual environment (macOS/Linux)
source venv/bin/activate
	
2.	Start the Django backend server:

python manage.py runserver

3.	Start the React frontend development server:

npm start

Open http://localhost:3000 to view the React app in the browser.


API Endpoints

User Details by ID
•	URL: /user/details/<int:id>/
•	Method: GET
•	Description: Retrieve user details by ID.
•	Parameters:
o	id: Integer, required. User ID.

User List
•	URL: /user/list/
•	Method: GET
•	Description: Retrieve a list of users.


Edit User Details
URL: /user/edit/<int:id>/
•	Method: PATCH
•	Description: Edit user details by ID.
•	Parameters:
o	id: Integer, required. User ID.
o	Request body with updated user data.

Dashboard Data
•	URL: /user/dashboard/
•	Method: POST
•	Description: Retrieve dashboard data.

