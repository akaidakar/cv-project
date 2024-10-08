from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import HttpResponse
from rest_framework.permissions import IsAuthenticated, AllowAny
import stripe
from users.models import CustomUser
import logging
import json

stripe.api_key = settings.STRIPE_SECRET_KEY

logger = logging.getLogger(__name__)


class CreateCheckoutSessionView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        logger.info(
            f"User {request.user.username} (ID: {request.user.id}) is attempting to create a checkout session"
        )
        logger.info(f"Authentication: {request.auth}")

        YOUR_DOMAIN = settings.FRONTEND_URL
        checkout_session = stripe.checkout.Session.create(
            payment_method_types=["card"],
            line_items=[
                {
                    "price_data": {
                        "currency": "usd",
                        "product_data": {"name": "Premium Subscription"},
                        "recurring": {"interval": "month"},
                        "unit_amount": 299,
                    },
                    "quantity": 1,
                },
            ],
            mode="subscription",
            success_url=YOUR_DOMAIN
            + "/subscription/success?session_id={CHECKOUT_SESSION_ID}",
            cancel_url=YOUR_DOMAIN + "/subscription/cancel/",
            client_reference_id=str(request.user.id),
        )
        return Response({"id": checkout_session.id})


from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator


@method_decorator(csrf_exempt, name="dispatch")
class StripeWebhookView(APIView):
    permission_classes = [AllowAny]  # Allow any request to access this view
    authentication_classes = []  # Disable authenticatioг for this view

    def post(self, request, format=None):
        payload = request.body
        sig_header = request.META["HTTP_STRIPE_SIGNATURE"]
        event = None

        logger.info(f"Received webhook: {json.loads(payload)}")

        try:
            event = stripe.Webhook.construct_event(
                payload, sig_header, settings.STRIPE_WEBHOOK_SECRET
            )
        except ValueError as e:
            logger.error(f"Invalid payload: {e}")
            return HttpResponse(status=400)
        except stripe.error.SignatureVerificationError as e:
            logger.error(f"Invalid signature: {e}")
            return HttpResponse(status=400)

        logger.info(f"Webhook event type: {event['type']}")

        if event["type"] == "checkout.session.completed":
            session = event["data"]["object"]
            logger.info(f"Checkout session completed: {json.dumps(session, indent=2)}")

            user_id = session.get("client_reference_id")
            logger.info(f"User ID from session: {user_id}")

            if user_id:
                try:
                    user = CustomUser.objects.get(id=user_id)
                    logger.info(f"Found user: {user.username} (ID: {user.id})")
                    logger.info(f"Current subscription: {user.subscription}")
                    new_subscription = user.upgrade_to_premium()
                    logger.info(f"Upgraded user to premium: {new_subscription}")

                    # Verify the change was saved
                    user.refresh_from_db()
                    logger.info(f"User subscription after refresh: {user.subscription}")
                except CustomUser.DoesNotExist:
                    logger.error(f"User with id {user_id} not found")
            else:
                logger.error("No client_reference_id found in the session")

        return HttpResponse(status=200)
