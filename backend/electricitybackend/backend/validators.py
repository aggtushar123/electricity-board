from django.core.exceptions import ValidationError

def validate_load_applied(value):
    if value > 200:
        raise ValidationError("Load applied should not exceed 200 KV.")
