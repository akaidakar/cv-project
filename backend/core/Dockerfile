# Use Python 3.9
FROM python:3.9-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set work directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    default-jdk \
    gcc \
    libpq-dev \
    python3-dev \
    curl \
    gnupg \
    && rm -rf /var/lib/apt/lists/*d

# Install Stripe CLI
RUN curl -s https://packages.stripe.dev/api/security/keypair/stripe-cli-gpg/public | gpg --dearmor | tee /usr/share/keyrings/stripe.gpg
RUN echo "deb [signed-by=/usr/share/keyrings/stripe.gpg] https://packages.stripe.dev/stripe-cli-debian-local stable main" | tee -a /etc/apt/sources.list.d/stripe.list
RUN apt-get update && apt-get install -y stripe

# Install Python dependencies
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt --verbose

# Copy project
COPY . /app/

# The CMD will be overridden by docker-compose.yml
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
