# frontend/Dockerfile
FROM node:20-slim

WORKDIR /app

# Copy package files
COPY package*.json ./

# Tambahkan instalasi ajv secara eksplisit untuk memperbaiki modul yang hilang
RUN npm install --legacy-peer-deps && npm install ajv ajv-keywords --legacy-peer-deps

# Copy seluruh kode frontend
COPY . .

# Expose port
EXPOSE 3000

CMD ["npm", "start"]
