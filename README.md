
# DeepStack AI WebApp

Dự án này là một ứng dụng web sử dụng DeepStack AI cho nhận diện khuôn mặt, nhận diện biển số xe và nhận diện ký tự quang học (OCR). Ứng dụng cho phép tải lên khuôn mặt và yêu cầu truy cập bảo mật bằng mật khẩu.

## Tính năng

- **Nhận diện khuôn mặt**: Tải lên một bức ảnh để nhận diện khuôn mặt và so sánh với cơ sở dữ liệu khuôn mặt đã tải lên.
- **Nhận diện biển số xe**: Tải lên một bức ảnh của biển số xe để nhận diện.
- **Nhận diện OCR**: Tải lên một bức ảnh chứa văn bản để thực hiện nhận diện ký tự quang học (OCR).
- **Tải lên khuôn mặt bảo mật**: Chỉ có thể truy cập sau khi nhập đúng mật khẩu.

## Yêu cầu

Trước khi bắt đầu, hãy chắc chắn rằng bạn đã cài đặt các phần mềm sau:
- [Node.js](https://nodejs.org/en/) (phiên bản v12 hoặc mới hơn)
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

Ngoài ra, hãy đảm bảo rằng bạn đã khởi động server DeepStack AI. Bạn có thể chạy nó bằng Docker với lệnh sau:

```bash
docker run -e VISION-FACE=True -e VISION-CAR=True -e VISION-OCR=True -v localstorage:/datastore -p 5000:5000 deepquestai/deepstack
```

## Cài đặt

### 1. Clone repository

```bash
git clone https://github.com/huykent/deepstack-app.git
cd deepstack-app
```

### 2. Cấu hình biến môi trường

Tạo một tệp `.env` ở thư mục gốc của dự án và cấu hình các biến sau:

```env
DEEPSTACK_URL=http://localhost:5000
ADMIN_PASSWORD=yourpassword
```

### 3. Cài đặt các phụ thuộc

```bash
npm install
```

### 4. Khởi động server

```bash
npm start
```

Ứng dụng sẽ chạy tại `http://localhost:3000`.

### 5. Cài đặt Docker Compose (Tùy chọn)

Nếu bạn muốn chạy ứng dụng và DeepStack sử dụng Docker Compose, bạn có thể sử dụng tệp `docker-compose.yml` có sẵn. Để khởi động toàn bộ stack, hãy chạy:

```bash
docker-compose up -d
```

Điều này sẽ khởi động cả ứng dụng Node.js và server DeepStack AI.

### 6. Truy cập ứng dụng

Sau khi khởi động server, bạn có thể truy cập ứng dụng qua `http://localhost:3000`.

### 7. Bảo mật khi tải lên khuôn mặt

Để tải lên khuôn mặt mới vào hệ thống, bạn cần nhập đúng mật khẩu. Mật khẩu này được cấu hình trong tệp `.env` bằng biến `ADMIN_PASSWORD`.

### 8. Dừng ứng dụng

Nếu bạn đang sử dụng Docker Compose, bạn có thể dừng toàn bộ stack bằng cách:

```bash
docker-compose down
```

Nếu bạn đang chạy ứng dụng trực tiếp bằng Node.js, hãy dừng nó bằng `CTRL + C` trong terminal.

## Cấu trúc thư mục

- **public/**: Chứa các tệp tĩnh, bao gồm `index.html`.
- **uploads/**: Thư mục lưu trữ các hình ảnh đã tải lên.
- **index.js**: Tệp server Node.js chính.
- **faces.json**: Tệp JSON lưu trữ dữ liệu về các khuôn mặt đã tải lên.

## Giấy phép

Dự án này được cấp phép theo Giấy phép MIT.
