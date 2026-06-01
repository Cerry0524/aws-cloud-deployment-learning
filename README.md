# AWS Docker Compose 30-Day Lab

一個給全端工程師的 30 天教學網站：從既有 `Docker Compose` 專案出發，逐步部署到 `Amazon Web Services`。

案例專案：`~/SideProject/TicketFactory/`

## Features

- `Teaching Mode / 教學模式`
- `Scenario Input / 情境輸入`
- `Interactive Mode / 互動模式`
- `Quiz Mode / 測驗模式`
- `Learning Progress / 學習歷程`
- `Admin Login / 後台登入`
- `Admin Dashboard / 數據儀表板`
- `Member Management / 會員管理`

## Local Development

```bash
npm install
npm run dev
```

Open:

```text
http://localhost:4321
```

## Docker Compose

```bash
docker compose up --build
```

The app uses port `4321` to avoid common conflicts with TicketFactory:

- `8080`
- `8443`
- `5432`
- `6379`
- `5173`
- `5174`
- `80`
- `443`

## Admin Demo Account

```text
email: admin@example.com
password: password123
```

## Build

```bash
npm run build
```

