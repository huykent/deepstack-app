#!/bin/bash

# Xóa các tệp tin hoặc thư mục cũ
rm -rf deepstack-app

# Clone repository từ GitHub
git clone https://github.com/huykent/deepstack-app.git

# Chuyển đến thư mục của repository
cd deepstack-app

# Cấp quyền thực thi cho script cài đặt
chmod +x install.sh

# Chạy script cài đặt
sudo ./install.sh