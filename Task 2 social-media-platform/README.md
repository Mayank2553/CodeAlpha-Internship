<<<<<<< HEAD
# CodeAlpha-Internship

## Task 2: Social Media Platform

A mini social media application built with Django and modern frontend technologies.

### Features
- User profiles with authentication
- Post creation and management
- Comment system
- Like system
- Follow/unfollow functionality

### Setup Instructions

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Run migrations:
```bash
python manage.py migrate
```

4. Start the development server:
```bash
python manage.py runserver
```

5. Create a superuser (optional):
```bash
python manage.py createsuperuser
```

The application will be available at http://127.0.0.1:8000/
