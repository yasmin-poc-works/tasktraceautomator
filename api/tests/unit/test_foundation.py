import pytest
from django.conf import settings


def test_django_settings_loaded():
    assert settings.INSTALLED_APPS is not None
    assert "rest_framework" in settings.INSTALLED_APPS
    assert "config.urls" == settings.ROOT_URLCONF


def test_jwt_settings():
    assert settings.SIMPLE_JWT["AUTH_HEADER_TYPES"] == ("Bearer",)
    assert settings.SIMPLE_JWT["ROTATE_REFRESH_TOKENS"] is True

