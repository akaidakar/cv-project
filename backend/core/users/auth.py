from django.contrib.auth import get_user_model
from django.contrib.auth.backends import ModelBackend
import logging

logger = logging.getLogger(__name__)


class CustomAuthBackend(ModelBackend):
    def authenticate(self, request, username=None, password=None, **kwargs):
        UserModel = get_user_model()
        logger.info(f"Login attempt for user: {username}")

        try:
            user = UserModel.objects.get(username=username)
        except UserModel.DoesNotExist:
            logger.warning(f"User not found: {username}")
            return None

        if user.check_password(password):
            logger.info(f"Successful login for user: {username}")
            return user
        else:
            logger.warning(f"Failed login attempt for user: {username}")
            return None
