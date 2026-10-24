const API = '/api/students';

// ==============================
// LẤY DANH SÁCH SINH VIÊN
// ==============================

async function loadStudents() {
    try {
        const response = await fetch(API);

        students = await response.json();

        document.getElementById('studentCount').textContent =
            students.length;

        const table = document.getElementById('studentTable');

        table.innerHTML = '';

        students.forEach(student => {

            let birthday = '';

            if (student.date_of_birth) {
                birthday =
                    student.date_of_birth.substring(0, 10);
            }

            table.innerHTML += `
                <tr>

                    <td>
                        <strong>${student.student_code}</strong>
                    </td>

                    <td>${student.full_name}</td>

                    <td>${birthday}</td>

                    <td>${student.gender || ''}</td>

                    <td>${student.email || ''}</td>

                    <td>
                        ${student.class_code || ''}
                    </td>

                    <td>

                        <button
                            class="edit-btn"
                            onclick="editStudent(${student.id})"
                        >
                            Sửa
                        </button>

                        <button
                            class="delete-btn"
                            onclick="deleteStudent(${student.id})"
                        >
                            Xóa
                        </button>

                    </td>

                </tr>
            `;
        });

    } catch (error) {

        console.error(error);

        document.getElementById('studentTable').innerHTML = `
            <tr>
                <td colspan="7" class="loading">
                    Không thể kết nối tới server.
                </td>
            </tr>
        `;
    }
}


// ==============================
// MỞ FORM THÊM
// ==============================

function openAddForm() {

    document.getElementById('modalTitle').textContent =
        'Thêm sinh viên';

    document.getElementById('studentForm').reset();

    document.getElementById('studentId').value = '';

    document.getElementById('studentModal').style.display =
        'flex';
}


// ==============================
// ĐÓNG FORM
// ==============================

function closeModal() {

    document.getElementById('studentModal').style.display =
        'none';
}


// ==============================
// SỬA SINH VIÊN
// ==============================

function editStudent(id) {

    const student =
        students.find(item => item.id === id);

    if (!student) return;

    document.getElementById('modalTitle').textContent =
        'Cập nhật sinh viên';

    document.getElementById('studentId').value =
        student.id;

    document.getElementById('studentCode').value =
        student.student_code;

    document.getElementById('fullName').value =
        student.full_name;

    document.getElementById('dateOfBirth').value =
        student.date_of_birth
            ? student.date_of_birth.substring(0, 10)
            : '';

    document.getElementById('gender').value =
        student.gender || 'Nam';

    document.getElementById('email').value =
        student.email || '';

    document.getElementById('classId').value =
        student.class_code === 'KHMT-K23'
            ? 2
            : 1;

    document.getElementById('studentModal').style.display =
        'flex';
}


// ==============================
// LƯU SINH VIÊN
// ==============================

document
    .getElementById('studentForm')
    .addEventListener('submit', async function(event) {

        event.preventDefault();

        const id =
            document.getElementById('studentId').value;

        const data = {

            student_code:
                document.getElementById('studentCode').value,

            full_name:
                document.getElementById('fullName').value,

            date_of_birth:
                document.getElementById('dateOfBirth').value,

            gender:
                document.getElementById('gender').value,

            email:
                document.getElementById('email').value,

            class_id:
                Number(
                    document.getElementById('classId').value
                )
        };

        try {

            let response;

            if (id) {

                response = await fetch(`${API}/${id}`, {
                    method: 'PUT',

                    headers: {
                        'Content-Type': 'application/json'
                    },

                    body: JSON.stringify(data)
                });

            } else {

                response = await fetch(API, {
                    method: 'POST',

                    headers: {
                        'Content-Type': 'application/json'
                    },

                    body: JSON.stringify(data)
                });
            }

            const result = await response.json();

            if (!response.ok) {
                alert(result.message || 'Có lỗi xảy ra');
                return;
            }

            alert(result.message);

            closeModal();

            loadStudents();

        } catch (error) {

            console.error(error);

            alert('Không thể kết nối tới server.');
        }
    });


// ==============================
// XÓA SINH VIÊN
// ==============================

async function deleteStudent(id) {

    const confirmDelete =
        confirm('Bạn có chắc muốn xóa sinh viên này?');

    if (!confirmDelete) return;

    try {

        const response =
            await fetch(`${API}/${id}`, {
                method: 'DELETE'
            });

        const result =
            await response.json();

        if (!response.ok) {
            alert(result.message || 'Không thể xóa');
            return;
        }

        alert(result.message);

        loadStudents();

    } catch (error) {

        console.error(error);

        alert('Không thể kết nối tới server.');
    }
}


loadStudents();
async function showClasses() {
    document.getElementById("heroSection").style.display = "none";
    document.getElementById("statsSection").style.display = "none";
    document.getElementById("studentsSection").style.display = "none";
    document.getElementById("classesSection").style.display = "block";
    document.getElementById("gradesSection").style.display = "none";
    const section = document.getElementById("classesSection");
    const table = document.getElementById("classesTable");

    section.style.display = "block";
    table.innerHTML = '<tr><td colspan="3">Đang tải dữ liệu...</td></tr>';

    try {
        const response = await fetch("/api/classes");

        if (!response.ok) {
            throw new Error("HTTP " + response.status);
        }

        const classes = await response.json();

        table.innerHTML = "";

        classes.forEach(cls => {
            const row = document.createElement("tr");

            [cls.id, cls.class_code, cls.class_name].forEach(value => {
    const cell = document.createElement("td");
    cell.textContent = value ?? "";
    row.appendChild(cell);
});

// Cot thao tac
const actionCell = document.createElement("td");

const editButton = document.createElement("button");
editButton.textContent = "Sửa";
editButton.className = "edit-btn";

editButton.onclick = () => {
    openEditClassForm(cls);
};

actionCell.appendChild(editButton);
// Nut xoa lop hoc
const deleteButton = document.createElement("button");
deleteButton.textContent = "Xóa";
deleteButton.className = "delete-btn";

deleteButton.onclick = async () => {
    if (!confirm("Bạn có chắc muốn xóa lớp " + cls.class_code + "?")) {
        return;
    }

    try {
        const response = await fetch(
            "/api/classes/" + encodeURIComponent(cls.id),
            { method: "DELETE" }
        );

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Không thể xóa lớp học");
        }

        alert("Xóa lớp học thành công!");
        await showClasses();

    } catch (error) {
        alert("Lỗi: " + error.message);
    }
};

actionCell.appendChild(deleteButton);
row.appendChild(actionCell);

table.appendChild(row);
        });

        if (classes.length === 0) {
            table.innerHTML =
                '<tr><td colspan="3">Chưa có lớp học</td></tr>';
        }
    } catch (error) {
        console.error(error);
        table.innerHTML =
            '<tr><td colspan="3">Không tải được danh sách lớp học</td></tr>';
    }
}
function showDashboard() {
    document.getElementById("heroSection").style.display = "";
    document.getElementById("statsSection").style.display = "";
    document.getElementById("studentsSection").style.display = "";
    document.getElementById("classesSection").style.display = "none";
    document.getElementById("gradesSection").style.display = "none";

    window.scrollTo(0, 0);
}
// ==================================
// MO FORM THEM LOP HOC
// ==================================
// ==================================
// MO FORM SUA LOP HOC
// ==================================
function openEditClassForm(cls) {
    document.getElementById("editingClassId").value = cls.id;
    document.getElementById("classCode").value = cls.class_code;
    document.getElementById("className").value = cls.class_name;

    document.getElementById("classModalTitle").textContent =
        "Sửa thông tin lớp học";

    document.getElementById("classSubmitBtn").textContent =
        "Cập nhật lớp học";

    document.getElementById("classModal").style.display = "flex";
}
function openAddClassForm() {
    document.getElementById("classForm").reset();

    document.getElementById("editingClassId").value = "";

    document.getElementById("classModalTitle").textContent =
        "Thêm lớp học";

    document.getElementById("classSubmitBtn").textContent =
        "Lưu lớp học";

    document.getElementById("classModal").style.display = "flex";
}

// ==================================
// DONG FORM THEM LOP HOC
// ==================================
function closeClassForm() {
    document.getElementById("classModal").style.display = "none";
}

// ==================================
// LUU LOP HOC VAO MYSQL
// ==================================
// ==================================
// THEM / SUA LOP HOC
// ==================================
async function saveClass(event) {
    event.preventDefault();

    const class_code = document.getElementById("classCode").value.trim();
    const class_name = document.getElementById("className").value.trim();

    const editingId = document.getElementById("editingClassId").value;
    const isEditing = editingId !== "";

    if (!class_code || !class_name) {
        alert("Vui lòng nhập đầy đủ mã lớp và tên lớp.");
        return;
    }

    const submitButton = document.getElementById("classSubmitBtn");
    submitButton.disabled = true;

    try {
        const url = isEditing
            ? "/api/classes/" + encodeURIComponent(editingId)
            : "/api/classes";

        const response = await fetch(url, {
            method: isEditing ? "PUT" : "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ class_code, class_name })
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Không thể lưu lớp học");
        }

        alert(
            isEditing
                ? "Cập nhật lớp học thành công!"
                : "Thêm lớp học thành công!"
        );

        closeClassForm();
        await showClasses();

    } catch (error) {
        alert("Lỗi: " + error.message);
    } finally {
        submitButton.disabled = false;
    }
}

// ==================================
// HIEN THI DANH SACH DIEM SINH VIEN
// ==================================
async function showGrades() {
    document.getElementById("heroSection").style.display = "none";
    document.getElementById("statsSection").style.display = "none";
    document.getElementById("studentsSection").style.display = "none";
    document.getElementById("classesSection").style.display = "none";
    document.getElementById("gradesSection").style.display = "block";

    const table = document.getElementById("gradesTable");
    table.innerHTML = '<tr><td colspan="6">Đang tải dữ liệu...</td></tr>';

    try {
        const response = await fetch("/api/grades");

        if (!response.ok) {
            throw new Error("HTTP " + response.status);
        }

        const grades = await response.json();
        table.innerHTML = "";

        if (grades.length === 0) {
            table.innerHTML = '<tr><td colspan="6">Chưa có dữ liệu điểm</td></tr>';
            return;
        }

        grades.forEach(grade => {
            const row = document.createElement("tr");

            [
                grade.id,
                grade.student_code,
                grade.full_name,
                grade.subject_name,
                grade.score
            ].forEach(value => {
                const cell = document.createElement("td");
                cell.textContent = value ?? "";
                row.appendChild(cell);
            });

            const actionCell = document.createElement("td");

            const editButton = document.createElement("button");
            editButton.textContent = "Sửa";
            editButton.type = "button";
            editButton.onclick = () => openEditGradeForm(grade);

            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Xóa";
            deleteButton.type = "button";
            deleteButton.onclick = () => deleteGrade(grade.id);

            actionCell.appendChild(editButton);
            actionCell.appendChild(document.createTextNode(" "));
            actionCell.appendChild(deleteButton);
            row.appendChild(actionCell);

            table.appendChild(row);
        });

    } catch (error) {
        console.error("Lỗi tải danh sách điểm:", error);
        table.innerHTML =
            '<tr><td colspan="6">Không thể tải danh sách điểm</td></tr>';
    }
}

// MO FORM THEM DIEM
let editingGradeId = null;

async function openAddGradeForm() {
    editingGradeId = null;
    document.getElementById("gradeModalTitle").textContent = "Thêm điểm sinh viên";
    const modal = document.getElementById("gradeModal");
    const select = document.getElementById("gradeStudent");

    document.getElementById("gradeForm").reset();
    select.innerHTML = '<option value="">Đang tải sinh viên...</option>';
    modal.style.display = "flex";

    try {
        const response = await fetch("/api/students");

        if (!response.ok) {
            throw new Error("HTTP " + response.status);
        }

        const students = await response.json();

        select.innerHTML = '<option value="">-- Chọn sinh viên --</option>';

        students.forEach(student => {
            const option = document.createElement("option");
            option.value = student.id;
            option.textContent =
                student.student_code + " - " + student.full_name;
            select.appendChild(option);
        });
    } catch (error) {
        console.error("Lỗi tải sinh viên:", error);
        select.innerHTML = '<option value="">Không tải được sinh viên</option>';
        alert("Không thể tải danh sách sinh viên");
    }
}


// MO FORM SUA DIEM
async function openEditGradeForm(grade) {
    editingGradeId = grade.id;
    document.getElementById("gradeModalTitle").textContent = "Sửa điểm sinh viên";
    await openAddGradeForm();
    editingGradeId = grade.id;

    document.getElementById("gradeStudent").value = String(grade.student_id);
    document.getElementById("gradeSubject").value = grade.subject_name;
    document.getElementById("gradeScore").value = grade.score;
}

// DONG FORM THEM DIEM
function closeGradeForm() {
    document.getElementById("gradeModal").style.display = "none";
}

// LUU DIEM SINH VIEN
async function saveGrade(event) {
    event.preventDefault();

    const student_id = Number(document.getElementById("gradeStudent").value);
    const subject_name = document.getElementById("gradeSubject").value.trim();
    const score = Number(document.getElementById("gradeScore").value);

    if (!student_id || !subject_name || !Number.isFinite(score) ||
        score < 0 || score > 10) {
        alert("Vui lòng nhập thông tin hợp lệ, điểm từ 0 đến 10");
        return;
    }

    const submitButton = document.querySelector("#gradeForm button[type='submit']");
    submitButton.disabled = true;

    try {
        const isEditing = editingGradeId !== null;
        const url = isEditing
            ? "/api/grades/" + editingGradeId
            : "/api/grades";

        const response = await fetch(url, {
            method: isEditing ? "PUT" : "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                student_id,
                subject_name,
                score
            })
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Không thể thêm điểm");
        }

        closeGradeForm();
        await showGrades();
        alert(isEditing ? "Sửa điểm thành công!" : "Thêm điểm sinh viên thành công!");

    } catch (error) {
        alert("Lỗi: " + error.message);
    } finally {
        submitButton.disabled = false;
    }
}


// XOA DIEM SINH VIEN
async function deleteGrade(id) {
    if (!confirm("Bạn có chắc chắn muốn xóa điểm này?")) {
        return;
    }

    try {
        const response = await fetch("/api/grades/" + id, {
            method: "DELETE"
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Không thể xóa điểm");
        }

        await showGrades();
        alert("Xóa điểm thành công!");
    } catch (error) {
        alert("Lỗi: " + error.message);
    }
}
