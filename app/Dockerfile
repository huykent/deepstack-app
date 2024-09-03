# Sử dụng image Node.js chính thức làm base image
FROM node:18

# Thiết lập thư mục làm việc
WORKDIR /usr/src/app

# Sao chép package.json và cài đặt dependencies
COPY package*.json ./
RUN npm install

# Sao chép tất cả các tệp vào thư mục làm việc
COPY . .

# Expose port để ứng dụng có thể được truy cập
EXPOSE 3000

# Chạy ứng dụng khi container khởi động
CMD ["npm", "start"]
