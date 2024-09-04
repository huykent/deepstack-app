#!/bin/bash

# Kiểm tra xem script có chạy với quyền root không
if [ "$EUID" -ne 0 ]; then
  echo -e "\e[31mVui lòng chạy script với quyền root (sudo)\e[0m"
  exit 1
fi

# Xác định hệ điều hành
OS=$(uname -s)
DISTRO=""

if [ -f /etc/os-release ]; then
  . /etc/os-release
  DISTRO=$ID
elif [ -f /etc/redhat-release ]; then
  DISTRO="rhel"
else
  echo -e "\e[31mKhông thể xác định hệ điều hành. Hỗ trợ Ubuntu/Debian và CentOS/RHEL.\e[0m"
  exit 1
fi

# Thay đổi thư mục làm việc
WORKDIR="/opt/deepstack-app"

# Hàm kiểm tra và cài đặt thư viện
install_if_missing() {
  PACKAGE=$1
  COMMAND=$2
  INSTALL_CMD=$3

  if ! command -v $COMMAND &> /dev/null; then
    echo -e "\e[33m$PACKAGE chưa được cài đặt. Đang cài đặt...\e[0m"
    eval $INSTALL_CMD
  else
    echo -e "\e[32m$PACKAGE đã được cài đặt.\e[0m"
  fi
}

# Cập nhật danh sách gói và cài đặt Docker và Docker Compose
case $DISTRO in
  ubuntu|debian)
    echo -e "\e[34mCập nhật danh sách gói...\e[0m"
    apt-get update

    # Cài đặt Node.js và npm
    install_if_missing "Node.js" "node" "curl -fsSL https://deb.nodesource.com/setup_16.x | bash - && apt-get install -y nodejs"
    
    # Cài đặt npm nếu cần thiết
    install_if_missing "npm" "npm" "apt-get install -y npm"

    # Kiểm tra và cài đặt Docker
    install_if_missing "Docker" "docker" "apt-get install -y docker.io"

    # Kiểm tra và cài đặt Docker Compose
    install_if_missing "Docker Compose" "docker-compose" "curl -L \"https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)\" -o /usr/local/bin/docker-compose && chmod +x /usr/local/bin/docker-compose"
    ;;
  
  centos|rhel)
    echo -e "\e[34mCập nhật danh sách gói...\e[0m"
    yum check-update

    # Cài đặt Node.js và npm
    install_if_missing "Node.js" "node" "curl -fsSL https://rpm.nodesource.com/setup_16.x | bash - && yum install -y nodejs"
    
    # Cài đặt npm nếu cần thiết
    install_if_missing "npm" "npm" "yum install -y npm"

    # Kiểm tra và cài đặt Docker
    install_if_missing "Docker" "docker" "yum install -y docker"

    # Kiểm tra và cài đặt Docker Compose
    install_if_missing "Docker Compose" "docker-compose" "curl -L \"https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)\" -o /usr/local/bin/docker-compose && chmod +x /usr/local/bin/docker-compose"
    ;;
  
  *)
    echo -e "\e[31mHệ điều hành không được hỗ trợ. Hỗ trợ Ubuntu/Debian và CentOS/RHEL.\e[0m"
    exit 1
    ;;
esac

# Khởi động dịch vụ Docker
echo -e "\e[34mKhởi động dịch vụ Docker...\e[0m"
systemctl start docker
systemctl enable docker

# Xóa các container Docker nếu đã tồn tại
echo -e "\e[34mXóa các container Docker cũ nếu tồn tại...\e[0m"
docker ps -a --format '{{.ID}}' | xargs -r docker stop
docker ps -a --format '{{.ID}}' | xargs -r docker rm

# Tạo thư mục làm việc nếu chưa tồn tại
mkdir -p $WORKDIR
cd $WORKDIR

# Clone repository chứa ứng dụng Node.js
if [ ! -d ".git" ]; then
  echo -e "\e[34mĐang clone repository từ GitHub...\e[0m"
  git clone https://github.com/huykent/deepstack-app.git .
else
  echo -e "\e[34mRepository đã tồn tại. Đang cập nhật...\e[0m"
  git pull
fi

# Cài đặt các phụ thuộc Node.js
echo -e "\e[34mĐang cài đặt các phụ thuộc Node.js...\e[0m"
npm install

# Khởi động các dịch vụ Docker
echo -e "\e[34mKhởi động các dịch vụ Docker...\e[0m"
docker-compose up -d

echo -e "\e[32mHoàn tất cài đặt và khởi động dịch vụ.\e[0m"
