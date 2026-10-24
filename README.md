# Student Management System

Hệ thống Quản lý Sinh viên triển khai bằng Docker Compose.

## Công nghệ

- Backend: Node.js
- Database: MySQL 8.0
- Quản trị database: phpMyAdmin
- Reverse Proxy: Nginx
- Monitoring: Prometheus và Grafana
- Logging: Loki và Promtail

## Chức năng

- Quản lý sinh viên
- Quản lý lớp học
- Quản lý điểm
- Thêm, xem, sửa, xóa dữ liệu

## Triển khai

Yêu cầu: Docker và Docker Compose.

1. Tạo file `.env` với các biến:
   - MYSQL_ROOT_PASSWORD
   - MYSQL_DATABASE
   - MYSQL_USER
   - MYSQL_PASSWORD
   - GRAFANA_ADMIN_PASSWORD

2. Khởi chạy:

   sudo docker-compose up -d

## Truy cập

| Dịch vụ | Cổng |
|---|---|
| Website (Nginx) | 8090 |
| phpMyAdmin | 8081 |
| Prometheus | 9091 |
| Grafana | 3002 |

## Monitoring

Grafana có dashboard Student Management Monitoring.

Dashboard hiện giám sát trạng thái và HTTP metrics của Prometheus.

## Logging

Promtail thu thập log Backend và gửi tới Loki.

Ví dụ truy vấn LogQL:

- `{job="student-backend"}`
- `{job="student-backend"} |= "MySQL"`
- `count_over_time({job="student-backend"}[1h])`

## Bảo mật

- Thông tin đăng nhập được đặt trong file `.env`, không đưa lên GitHub.
- Nginx làm reverse proxy.
- Các dịch vụ giao tiếp qua Docker network.

## Ghi chú

Dự án phục vụ mục đích học tập và thực hành triển khai DevOps.
