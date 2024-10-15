# Use Python 3.12
FROM python:3.12-slim as builder

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set work directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    python3-dev \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy project files
COPY . .

# Make build.sh executable and run it
RUN chmod +x build.sh && ./build.sh

# Final stage
FROM python:3.12-slim

WORKDIR /app

# Copy necessary files from builder
COPY --from=builder /usr/local/lib/python3.12/site-packages /usr/local/lib/python3.12/site-packages
COPY --from=builder /usr/local/bin /usr/local/bin
COPY --from=builder /app /app

# Install runtime dependencies
RUN apt-get update && apt-get install -y \
    libpq5 \
    && rm -rf /var/lib/apt/lists/*

# Create a non-root user
RUN useradd -m myuser 
USER myuser

# Run migrations, rebuild search index, and start the server
CMD python manage.py migrate && \
    python manage.py search_index --rebuild -f && \
    gunicorn core.asgi:application -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:$PORT
