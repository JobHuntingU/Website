FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Build the vector DB at image build time (not on every container start) —
# the knowledge base docs are committed alongside this Dockerfile, so this
# is fully reproducible without needing a .env file at build time.
RUN python ingest.py

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
