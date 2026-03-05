
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

Tạo một tệp `.env` ở thư mục ứng dụng (ví dụ: `app/.env`) và cấu hình các biến sau:

```env
DEEPSTACK_URL=http://localhost:15679
PASSWORD=yourpassword
```

### 3. Cài đặt các phụ thuộc

```bash
npm install
```

### 4. Khởi động server

```bash
npm start
```
Ứng dụng sẽ chạy tại `http://localhost:15678`.

### 5. Cài đặt Docker Compose (Tùy chọn)

Nếu bạn muốn chạy ứng dụng và DeepStack sử dụng Docker Compose, bạn có thể sử dụng tệp `docker-compose.yml` có sẵn. Để khởi động toàn bộ stack, hãy chạy:

```bash
docker-compose up -d
```

Điều này sẽ khởi động cả ứng dụng Node.js và server DeepStack AI.

### 6. Truy cập ứng dụng

Sau khi khởi động server, bạn có thể truy cập ứng dụng qua `http://localhost:15678`.

### 7. Bảo mật khi tải lên khuôn mặt

Để tải lên khuôn mặt mới vào hệ thống, bạn cần nhập đúng mật khẩu. Mật khẩu này được cấu hình trong tệp `.env` bằng biến `PASSWORD`.

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


Để tự động hóa quá trình cài đặt bao gồm việc clone repository và chạy script, bạn có thể viết một file shell script mới (ví dụ: `setup.sh`) để thực hiện các bước này. Dưới đây là cách bạn có thể tạo file `setup.sh`:

### Nội Dung của `setup.sh`

```bash
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
./install.sh
```



## Hướng Dẫn Cài Đặt

Để cài đặt và cấu hình dự án, bạn có thể sử dụng script tự động hóa `setup.sh`. Thực hiện các bước sau:

1. **Tải về và cấp quyền thực thi cho script cài đặt:**

   ```bash
   curl -O https://github.com/huykent/deepstack-app/raw/main/setup.sh
   chmod +x setup.sh
   ```

2. **Chạy script cài đặt:**

   ```bash
   ./setup.sh
   ```

Script này sẽ tự động clone repository, cấp quyền thực thi cho script cài đặt, và chạy nó để hoàn tất cài đặt và cấu hình.


## Tích hợp Home Assistant (Mới)

Ứng dụng đã được tối ưu hóa cấu trúc JSON trả về để dễ dàng tích hợp vào Home Assistant thông qua tiện ích `command_line` (hoặc REST sensor). Dưới đây là ví dụ cấu hình chi tiết, từ việc tạo cảm biến đến Tự động hóa (Automations).

### 1. Khai báo Command Line Sensors

Thêm dòng sau vào file `configuration.yaml` của Home Assistant để tạo các cảm biến lấy dữ liệu nhận diện:

```yaml
command_line:
  # Cảm biến Nhận diện khuôn mặt (Trả về Tên người - userid)
  - sensor:
      name: Kết quả nhận diện khuôn mặt
      unique_id: face_recognition_result
      # Đổi <IP_APP> thành địa chỉ IP máy tính đang chạy ứng dụng Node.js của bạn
      command: "curl -s -X POST -F 'image=@/config/www/camera_snapshot.jpg' http://<IP_APP>:15678/recognize-face"
      scan_interval: 86400 # Cập nhật theo yêu cầu, không phải cập nhật liên tục để giảm tải CPU
      value_template: "{{ value_json.userid | default('unknown') }}"
      json_attributes:
        - confidence
        - duration

  # Cảm biến Nhận diện biển số xe (Trả về Biển số)
  - sensor:
      name: Kết quả nhận diện biển số
      unique_id: license_plate_recognition_result
      command: "curl -s -X POST -F 'image=@/config/www/camera_snapshot.jpg' http://<IP_APP>:15678/recognize-license"
      scan_interval: 86400 
      value_template: "{{ value_json.license_plate | default('unknown') }}"
      json_attributes:
        - confidence
        - duration
```

*Lưu ý: Khởi động lại Home Assistant sau khi lưu `configuration.yaml` để các cảm biến này bắt đầu hoạt động.*

### 2. Tạo Script tự động chụp ảnh và cập nhật cảm biến

Để không phải "spam" DeepStack quét liên tục, bạn hãy viết một kịch bản (`script`) dùng để **chụp ảnh từ camera** -> **lưu đè lên file `/config/www/camera_snapshot.jpg`** -> **ép dòng lệnh trên của sensor cập nhật thủ công**.

Thêm vào `scripts.yaml` hoặc giao diện tạo Script:

```yaml
# scripts.yaml
scan_person_at_door:
  alias: "Quét khuôn mặt ở cửa"
  sequence:
    # Bước 1: Yêu cầu Camera chụp lại một bức ảnh và lưu vào thư mục www
    - service: camera.snapshot
      target:
        entity_id: camera.truoc_nha_camera # Thay thế bằng entity camera của bạn
      data:
        filename: /config/www/camera_snapshot.jpg
    
    # Bước 2: Chờ một chút để file lưu xong hoàn toàn
    - delay:
        milliseconds: 500

    # Bước 3: Ép ngắt cập nhật thông tin cảm biến (gửi file vừa lưu vào nodejs)
    - service: homeassistant.update_entity
      target:
        entity_id: sensor.ket_qua_nhan_dien_khuon_mat
```

### 3. Tự động hóa phát hiện và thông báo (Automations)

Bây giờ bạn có thể kích hoạt tiến trình này dưa trên một sự kiện cụ thể (như khi motion sensor kích hoạt, chuông cửa reo, cửa mở...) và gửi thông báo điện thoại:

```yaml
# automations.yaml
- alias: "Chuông cửa reo - Nhận diện khuôn mặt"
  trigger:
    - platform: state
      entity_id: binary_sensor.nut_nhan_chuong_cua
      to: "on"
  action:
    # 1. Chạy script để quét khuôn mặt ngay lập tức
    - service: script.scan_person_at_door
    
    # 2. Đợi 2 giây cho ứng dụng Face Recognition làm việc
    - delay:
        seconds: 2
        
    # 3. Gửi thông báo kèm ảnh theo tên người nhận diện được
    - service: notify.mobile_app_dien_thoai_cua_ban
      data:
        title: "Có khách ở cửa!"
        message: >
          {% if is_state('sensor.ket_qua_nhan_dien_khuon_mat', 'unknown') %}
            Phát hiện người lạ đang đứng trước cửa nhà!
          {% else %}
            Có {{ states('sensor.ket_qua_nhan_dien_khuon_mat') }} ở trước cửa với độ chính xác {{ state_attr('sensor.ket_qua_nhan_dien_khuon_mat', 'confidence') * 100 }}%.
          {% endif %}
        data:
          image: "/local/camera_snapshot.jpg"
```

## Giấy phép

Dự án này được cấp phép theo Giấy phép MIT.
