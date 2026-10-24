CREATE DATABASE IF NOT EXISTS student_db;
USE student_db;

-- Bảng lớp
CREATE TABLE IF NOT EXISTS classes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    class_code VARCHAR(20) NOT NULL UNIQUE,
    class_name VARCHAR(100) NOT NULL
);

-- Bảng sinh viên
CREATE TABLE IF NOT EXISTS students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_code VARCHAR(20) NOT NULL UNIQUE,
    full_name VARCHAR(100) NOT NULL,
    date_of_birth DATE,
    gender VARCHAR(10),
    email VARCHAR(100),
    class_id INT,
    FOREIGN KEY (class_id)
        REFERENCES classes(id)
        ON DELETE SET NULL
);

-- Bảng điểm
CREATE TABLE IF NOT EXISTS grades (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    subject_name VARCHAR(100) NOT NULL,
    score DECIMAL(4,2),
    FOREIGN KEY (student_id)
        REFERENCES students(id)
        ON DELETE CASCADE
);

-- Dữ liệu lớp mẫu
INSERT INTO classes (class_code, class_name)
VALUES
('CNTT-K23', 'Cong nghe thong tin K23'),
('KHMT-K23', 'Khoa hoc may tinh K23');

-- Dữ liệu sinh viên mẫu
INSERT INTO students
(student_code, full_name, date_of_birth, gender, email, class_id)
VALUES
('SV001', 'Nguyen Van An', '2005-05-10', 'Nam', 'an@example.com', 1),
('SV002', 'Tran Minh Binh', '2005-08-20', 'Nam', 'binh@example.com', 1),
('SV003', 'Le Thu Ha', '2005-03-15', 'Nu', 'ha@example.com', 2);

-- Dữ liệu điểm mẫu
INSERT INTO grades (student_id, subject_name, score)
VALUES
(1, 'Lap trinh Java', 8.5),
(1, 'Co so du lieu', 7.5),
(2, 'Lap trinh Java', 9.0),
(3, 'Co so du lieu', 8.0);
