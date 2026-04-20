# WFH Attendance System - Dexa Group Technical Test

Sistem Manajemen Kehadiran (Presensi) berbasis web untuk memantau aktivitas karyawan yang bekerja secara remote (WFH). Framework yang digunakan adalah **NestJS** untuk Backend dan **React (Vite)** untuk Frontend.

## Fitur Utama
1. **Portal Administrator**: 
   - Dashboard statistik (Hadir, Terlambat, Absen).
   - Manajemen Database Personel (CRUD Karyawan).
   - Monitoring Log Presensi Real-Time.
   - Verifikasi Bukti Foto Absensi.
2. **Portal Karyawan**:
   - Sistem Clock-In & Clock-Out.
   - Verifikasi Wajah/Kehadiran via foto.
   - Riwayat Presensi Personal.
   - Validasi Jam Kerja (Telat > 08:00).

---

## Struktur Folder
- `/backend`: NestJS API dengan Database MySQL (TypeORM).
- `/frontend-admin`: Dashboard React khusus Administrator.
- `/frontend-employee`: Dashboard React khusus Karyawan.

---

## 🛠️ Persiapan Instalasi

### 1. Database (MySQL)
Buat database baru bernama `dexa_attendance` di MySQL Anda.

### 2. Backend
```bash
cd backend
npm install
```
Buat file `.env` di dalam folder `/backend`:
```env
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=
DB_NAME=dexa_attendance
JWT_SECRET=rahasia123
```
Jalankan server backend:
```bash
npm run start:dev
```
*Catatan: Sistem akan otomatis membuat akun admin pertama saat startup: **admin@dexa.com** / **admin123***.

### 3. Frontend Admin
```bash
cd frontend-admin
npm install
npm run dev
```
Aplikasi berjalan di: `http://localhost:5174`

### 4. Frontend Employee
```bash
cd frontend-employee
npm install
npm run dev
```
Aplikasi berjalan di: `http://localhost:5173`

---

## 🔐 Akun Login Bawaan
| Role | Email | Password |
|---|---|---|
| **Admin** | `admin@dexa.com` | `admin123` |
| **Karyawan** | *Gunakan data yang didaftarkan Admin* | *Password buatan Admin* |

---

