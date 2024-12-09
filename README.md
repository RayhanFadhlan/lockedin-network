# MILESTONE 1 IF3110 2024/2025

## Web Application Description
LockedIn is a web-based platform designed to assist job seekers and companies in the recruitment process. Job seekers can search for job listings, apply for relevant positions, and track their application history. Companies can post job openings, manage incoming applications, and make decisions regarding applications. This application is designed with core functionalities to support an efficient and transparent recruitment system.

## Installation Instructions
1. Install requirements

   - Untuk windows and mac user

     - Download docker desktop [here](https://www.docker.com/products/docker-desktop/)

   - Untuk UNIX like user jalankan command di bawah

   ```sh
    sudo apt-get update
    sudo apt-get install docker-ce docker-ce-cli containerd.io docker-compose-plugin
   ```

2. Clone this repository:
```bash
git clone https://github.com/Labpro-21/if-3310-2024-2-k02-05.git
```

## How to run the server

1. Make .env file on root

2. Copy the .env.example file into .env file

3. Run the docker:
   ```bash
   docker compose build
   docker compose up
   ```
4. If this is your first time running this website, make a database migrations :
   ```bash
   docker exec -it backend npx prisma migrate dev
   ```


5. Seed data (optional)
   ```bash
   docker exec -it backend npm run seed
   ```

6. Open http://localhost:5173

7. To stop docker from running : 
   ```bash
   docker compose down
   ```

## API Documentation
Swagger: /docs

## Task Distribution
| Name | Student-ID | Client-side | Server-side |
|--------------------------|------------|-------------|-------------|
| Gregorius Moses Marevson | 13520052 | <ul> <li> Profile Page </ul> | <ul> <li> Profile Page </ul> |
| Ahmad Hasan Albana | 13522041 | <ul> <li> Halaman Detail Lowongan (Job Seeker) <li> Halaman Lamaran (Job Seeker) <li> Halaman Riwayat (Job Seeker) </ul> | <ul> <li> Halaman Detail Lowongan (Job Seeker) <li> Halaman Lamaran (Job Seeker) <li> Halaman Riwayat (Job Seeker) </ul> |
| Rayhan Fadhlan | 13522095 | <ul> <li> Halaman Login <li> Halaman Tambah Lowongan (Company) <li> Halaman Detail Lowongan (Company) <li> Halaman Detail Lamaran (Company) <li> Bonus 3 </ul> | <ul> <li> Halaman Login <li> Halaman Tambah Lowongan (Company) <li> Halaman Detail Lowongan (Company) <li> Halaman Detail Lamaran (Company) <li> Bonus 3 </ul> |
| William Glory Henderson | 13522113 | <ul> <li> Halaman Register <li> Halaman Home (Job Seeker) <li> Halaman Home (Company) <li> Halaman Edit Lowongan (Company) <li> Bonus 4 </ul> | <ul> <li> Halaman Register <li> Halaman Home (Job Seeker) <li> Halaman Home (Company) <li> Halaman Edit Lowongan (Company) <li> Bonus 4 </ul> |

## Features
| Feature | Implement |
| -----------------------------------------  | ------------------------- |
| Authentication dan Authorization | Done 
| Profil Pengguna | Done 
| Koneksi Antar Pengguna | Done 
| Feed | Done 
| Chat & Websocket | Done 
| Notifikasi | Done 
| Stress & Load Test | Done 
| Responsivitas | Done 
| Docker | Done
| Dokumentasi API | Done
| Halaman Login | Done
| Halaman Register | Done 
| Halaman Profil | Done 
| Halaman Feed | Done 
| Halaman Daftar Pengguna | Done 
| Halaman Permintaan Koneksi | Done 
| Halaman Daftar Koneksi | Done 
| Halaman Chat | Done 
| Bonus 1 UI/UX | Done
| Bonus 2 Caching | Done
| Bonus 3 Connection Recommendation | Done 
| Bonus 4 Typing Indicator | Done


HOW TO RUN (BETTER DEVELOPMENT JGN PAKE DOCKER): <br>
```
docker compose build
docker compose watch
```

sama kalau baru pertama kali jalanin run command
```
docker exec -it backend npx prisma migrate dev
docker exec -it backend npm run seed
```
Kalau mau pake localhost (gapake docker, caranya npm run dev di backend sama frontend), jangan lupa ganti .env di backend
