
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
