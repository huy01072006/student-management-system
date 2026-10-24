const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Kiểm tra server
app.get('/', (req, res) => {
    res.json({
        message: 'Student Management API is running'
    });
});

// Lấy danh sách sinh viên
app.get('/api/students', (req, res) => {
    const sql = `
        SELECT
            students.id,
            students.student_code,
            students.full_name,
            students.date_of_birth,
            students.gender,
            students.email,
            classes.class_code,
            classes.class_name
        FROM students
        LEFT JOIN classes
            ON students.class_id = classes.id
        ORDER BY students.id ASC
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error(err);

            return res.status(500).json({
                message: 'Loi truy van database'
            });
        }

        res.json(results);
    });
});
// ===============================
// THÊM SINH VIÊN
// ===============================
app.post('/api/students', (req, res) => {
    const {
        student_code,
        full_name,
        date_of_birth,
        gender,
        email,
        class_id
    } = req.body;

    if (!student_code || !full_name) {
        return res.status(400).json({
            message: 'Ma sinh vien va ho ten khong duoc de trong'
        });
    }

    const sql = `
        INSERT INTO students
        (student_code, full_name, date_of_birth, gender, email, class_id)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            student_code,
            full_name,
            date_of_birth || null,
            gender || null,
            email || null,
            class_id || null
        ],
        (err, result) => {
            if (err) {
                console.error(err);

                return res.status(500).json({
                    message: 'Khong the them sinh vien'
                });
            }

            res.status(201).json({
                message: 'Them sinh vien thanh cong',
                id: result.insertId
            });
        }
    );
});


// ===============================
// SỬA SINH VIÊN
// ===============================
app.put('/api/students/:id', (req, res) => {
    const id = req.params.id;

    const {
        student_code,
        full_name,
        date_of_birth,
        gender,
        email,
        class_id
    } = req.body;

    const sql = `
        UPDATE students
        SET student_code = ?,
            full_name = ?,
            date_of_birth = ?,
            gender = ?,
            email = ?,
            class_id = ?
        WHERE id = ?
    `;

    db.query(
        sql,
        [
            student_code,
            full_name,
            date_of_birth || null,
            gender || null,
            email || null,
            class_id || null,
            id
        ],
        (err, result) => {
            if (err) {
                console.error(err);

                return res.status(500).json({
                    message: 'Khong the cap nhat sinh vien'
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: 'Khong tim thay sinh vien'
                });
            }

            res.json({
                message: 'Cap nhat sinh vien thanh cong'
            });
        }
    );
});


// ===============================
// XÓA SINH VIÊN
// ===============================
app.delete('/api/students/:id', (req, res) => {
    const id = req.params.id;

    db.query(
        'DELETE FROM students WHERE id = ?',
        [id],
        (err, result) => {
            if (err) {
                console.error(err);

                return res.status(500).json({
                    message: 'Khong the xoa sinh vien'
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: 'Khong tim thay sinh vien'
                });
            }

            res.json({
                message: 'Xoa sinh vien thanh cong'
            });
        }
    );
});
// ==================================
// API LẤY DANH SÁCH LỚP HỌC
// ==================================
app.get('/api/classes', (req, res) => {
    const sql = `
        SELECT id, class_code, class_name
        FROM classes
        ORDER BY id ASC
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error('Loi lay danh sach lop:', err);

            return res.status(500).json({
                message: 'Khong the lay danh sach lop hoc'
            });
        }

        res.json(results);
    });
});
// ==================================
// API THEM LOP HOC
// ==================================
app.post('/api/classes', (req, res) => {
    const { class_code, class_name } = req.body;

    if (
        typeof class_code !== 'string' ||
        typeof class_name !== 'string' ||
        !class_code.trim() ||
        !class_name.trim()
    ) {
        return res.status(400).json({
            message: 'Ma lop va ten lop khong duoc de trong'
        });
    }

    const code = class_code.trim();
    const name = class_name.trim();

    if (code.length > 20 || name.length > 100) {
        return res.status(400).json({
            message: 'Ma lop toi da 20 ky tu, ten lop toi da 100 ky tu'
        });
    }

    const sql = `
        INSERT INTO classes (class_code, class_name)
        VALUES (?, ?)
    `;

    db.query(sql, [code, name], (err, result) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({
                    message: 'Ma lop da ton tai'
                });
            }

            console.error('Loi them lop:', err);

            return res.status(500).json({
                message: 'Khong the them lop hoc'
            });
        }

        res.status(201).json({
            message: 'Them lop hoc thanh cong',
            id: result.insertId,
            class_code: code,
            class_name: name
        });
    });
});
// ==================================
// API SUA LOP HOC
// ==================================
app.put('/api/classes/:id', (req, res) => {
    const id = Number(req.params.id);
    const { class_code, class_name } = req.body;

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            message: 'ID lop hoc khong hop le'
        });
    }

    if (
        typeof class_code !== 'string' ||
        typeof class_name !== 'string' ||
        !class_code.trim() ||
        !class_name.trim()
    ) {
        return res.status(400).json({
            message: 'Ma lop va ten lop khong duoc de trong'
        });
    }

    const code = class_code.trim();
    const name = class_name.trim();

    if (code.length > 20 || name.length > 100) {
        return res.status(400).json({
            message: 'Ma lop toi da 20 ky tu, ten lop toi da 100 ky tu'
        });
    }

    const sql = `
        UPDATE classes
        SET class_code = ?, class_name = ?
        WHERE id = ?
    `;

    db.query(sql, [code, name, id], (err, result) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({
                    message: 'Ma lop da ton tai'
                });
            }

            console.error('Loi sua lop:', err);

            return res.status(500).json({
                message: 'Khong the cap nhat lop hoc'
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: 'Khong tim thay lop hoc'
            });
        }

        res.json({
            message: 'Cap nhat lop hoc thanh cong',
            id,
            class_code: code,
            class_name: name
        });
    });
});
// ==================================
// API XOA LOP HOC
// ==================================
app.delete('/api/classes/:id', (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            message: 'ID lop hoc khong hop le'
        });
    }

    // Kiem tra lop co sinh vien hay khong
    db.query(
        'SELECT COUNT(*) AS total FROM students WHERE class_id = ?',
        [id],
        (err, rows) => {
            if (err) {
                return res.status(500).json({
                    message: 'Loi kiem tra sinh vien'
                });
            }

            if (rows[0].total > 0) {
                return res.status(409).json({
                    message: 'Khong the xoa lop dang co sinh vien'
                });
            }

            // Xoa lop khi khong co sinh vien
            db.query(
                'DELETE FROM classes WHERE id = ?',
                [id],
                (deleteErr, result) => {
                    if (deleteErr) {
                        console.error(deleteErr);
                        return res.status(500).json({
                            message: 'Khong the xoa lop hoc'
                        });
                    }

                    if (result.affectedRows === 0) {
                        return res.status(404).json({
                            message: 'Khong tim thay lop hoc'
                        });
                    }

                    res.json({
                        message: 'Xoa lop hoc thanh cong',
                        id
                    });
                }
            );
        }
    );
});
// ==================================
// API XEM DANH SACH DIEM SINH VIEN
// ==================================
app.get('/api/grades', (req, res) => {
    const sql = `
        SELECT
            g.id,
            g.student_id,
            s.student_code,
            s.full_name,
            g.subject_name,
            g.score
        FROM grades g
        INNER JOIN students s ON g.student_id = s.id
        ORDER BY g.id ASC
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error('Loi lay danh sach diem:', err);

            return res.status(500).json({
                message: 'Khong the lay danh sach diem'
            });
        }

        res.json(results);
    });
});
// ==================================
// API THEM DIEM SINH VIEN
// ==================================
app.post('/api/grades', (req, res) => {
    const { student_id, subject_name, score } = req.body;

    const studentId = Number(student_id);
    const numericScore = Number(score);

    if (
        !Number.isInteger(studentId) ||
        studentId <= 0 ||
        typeof subject_name !== 'string' ||
        !subject_name.trim() ||
        subject_name.trim().length > 100 ||
        score === null ||
        score === undefined ||
        String(score).trim() === '' ||
        !Number.isFinite(numericScore) ||
        numericScore < 0 ||
        numericScore > 10 ||
        !Number.isInteger(numericScore * 100)
    ) {
        return res.status(400).json({
            message: 'Du lieu diem khong hop le'
        });
    }

    const sql = `
        INSERT INTO grades (student_id, subject_name, score)
        VALUES (?, ?, ?)
    `;

    db.query(
        sql,
        [studentId, subject_name.trim(), numericScore],
        (err, result) => {
            if (err) {
                console.error('Loi them diem:', err);

                if (err.code === 'ER_NO_REFERENCED_ROW_2') {
                    return res.status(400).json({
                        message: 'Sinh vien khong ton tai'
                    });
                }

                return res.status(500).json({
                    message: 'Khong the them diem'
                });
            }

            res.status(201).json({
                message: 'Them diem thanh cong',
                id: result.insertId
            });
        }
    );
});
// ==================================
// API SUA DIEM SINH VIEN
// ==================================
app.put('/api/grades/:id', (req, res) => {
    const id = Number(req.params.id);
    const { student_id, subject_name, score } = req.body;

    const studentId = Number(student_id);
    const numericScore = Number(score);

    if (
        !Number.isInteger(id) || id <= 0 ||
        !Number.isInteger(studentId) || studentId <= 0 ||
        typeof subject_name !== 'string' ||
        !subject_name.trim() ||
        subject_name.trim().length > 100 ||
        score === null || score === undefined ||
        String(score).trim() === '' ||
        !Number.isFinite(numericScore) ||
        numericScore < 0 || numericScore > 10 ||
        !Number.isInteger(Math.round(numericScore * 10000) / 100)
    ) {
        return res.status(400).json({
            message: 'Du lieu diem khong hop le'
        });
    }

    const sql = `
        UPDATE grades
        SET student_id = ?, subject_name = ?, score = ?
        WHERE id = ?
    `;

    db.query(
        sql,
        [studentId, subject_name.trim(), numericScore, id],
        (err, result) => {
            if (err) {
                console.error('Loi sua diem:', err);

                if (err.code === 'ER_NO_REFERENCED_ROW_2') {
                    return res.status(400).json({
                        message: 'Sinh vien khong ton tai'
                    });
                }

                return res.status(500).json({
                    message: 'Khong the sua diem'
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: 'Khong tim thay ban ghi diem'
                });
            }

            res.json({
                message: 'Cap nhat diem thanh cong'
            });
        }
    );
});

// API XOA DIEM SINH VIEN
app.delete('/api/grades/:id', (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            message: 'ID diem khong hop le'
        });
    }

    db.query(
        'DELETE FROM grades WHERE id = ?',
        [id],
        (err, result) => {
            if (err) {
                console.error('Loi xoa diem:', err);
                return res.status(500).json({
                    message: 'Khong the xoa diem'
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: 'Khong tim thay ban ghi diem'
                });
            }

            return res.json({
                message: 'Xoa diem thanh cong'
            });
        }
    );
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server dang chay tai port ${PORT}`);
});
