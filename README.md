# MILESTONE 2 IF3110 2024/2025

## Web Application Description
LockedIn is a web-based platform designed as a social media that allows every user to connect each other. Every user can share information about their work history, skill, and post. They also can connect with other users and send private messages securely. Everytime a new post or chat come, they will receive a notification about it. This web is designed with core functionalities to support an efficient and transparent communication or connection for all users.

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

1. Copy .env.example to .env on ./frontend and ./backend

2. Run the docker:
   ```bash
   docker compose build
   docker compose up
   ```
3. If this is your first time running this website, make a database migrations :
   ```bash
   docker exec -it backend npx prisma migrate dev
   ```

4. Seed data (optional)
   ```bash
   docker exec -it backend npm run seed
   ```

5. Open http://localhost:5173

6. To stop docker from running : 
   ```bash
   docker compose down
   ```

## API Documentation
Swagger: http://localhost:3000/api/docs

## Task Distribution
| Name | Student-ID | Client-side | Server-side |
|--------------------------|------------|-------------|-------------|
| Gregorius Moses Marevson | 13520052 | <ul> <li> Halaman Register </ul> | <ul> <li> Halaman Register </ul> |
| Ahmad Hasan Albana | 13522041 | <ul> <li> Halaman Login  <li> Halaman Daftar Koneksi <ul> | <ul> <li> Halaman Login <li> Halaman Daftar Koneksi </ul> |
| Rayhan Fadhlan | 13522095 | <ul> <li> Halaman Feed <li> Halaman Permintaan Koneksi <li> Halaman Daftar Pengguna <li> Halaman Notifikasi </ul> | <ul> <li> Halaman Feed <li> Halaman Permintaan Koneksi <li> Halaman Daftar Pengguna <li> Halaman Notifikasi <li> Bonus 2 </ul> |
| William Glory Henderson | 13522113 | <ul> <li> Halaman Profil dan Edit Profil <li> Halaman Chat & Websocket <li> Bonus 3 <li> Bonus 4 </ul> | <ul> <li> Halaman Profil dan Edit Profil <li> Halaman Chat & Websocket <li> Bonus 3 <li> Bonus 4 </ul> |

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
| Bonus 2 Caching (Redis) | Done
| Bonus 3 Connection Recommendation | Done 
| Bonus 4 Typing Indicator | Done

## Load Test Result
![Hasil Tes](./assets/Load%20Test.png)