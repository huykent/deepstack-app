#!/bin/bash

# Cập nhật và cài đặt Docker nếu chưa có
if ! [ -x "$(command -v docker)" ]; then
  echo "Docker chưa được cài đặt. Đang tiến hành cài đặt Docker..."
  sudo apt-get update
  sudo apt-get install -y docker.io
fi

# Cài đặt Docker Compose nếu chưa có
if ! [ -x "$(command -v docker-compose)" ]; then
  echo "Docker Compose chưa được cài đặt. Đang tiến hành cài đặt Docker Compose..."
  sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
  sudo chmod +x /usr/local/bin/docker-compose
fi

# Build và chạy Docker containers
echo "Đang build và chạy các container..."
docker-compose up --build -d

echo "Ứng dụng đã được cài đặt và chạy thành công!"
