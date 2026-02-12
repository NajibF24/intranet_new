# backend/Dockerfile
FROM python:3.11-slim

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Upgrade pip terlebih dahulu
RUN pip install --upgrade pip

COPY requirements.txt .

# Jika emergentintegrations adalah library lokal, kita hapus dulu dari list
# agar tidak membuat build gagal, lalu install sisanya
RUN sed -i '/emergentintegrations/d' requirements.txt && \
    pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "server:app", "--host", "0.0.0.0", "--port", "8000"]
