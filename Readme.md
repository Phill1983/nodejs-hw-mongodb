<!-- #  Node.js Homework 5 — Авторизація + MongoDB

Це проєкт для GoIT — домашнє завдання №5 з Node.js:

- Підключено MongoDB через Mongoose
- Реалізовано реєстрацію, логін, рефреш токенів і логаут
- Є захист роутів контактів через JWT access token
- Деплой зроблено на Render

---

## Production URL

https://nodejs-hw-mongodb-ept4.onrender.com

---

## Доступні маршрути

### Auth

| Метод | Шлях             | Опис                    |
| ----- | ---------------- | ----------------------- |
| POST  | `/auth/register` | Реєстрація нового юзера |
| POST  | `/auth/login`    | Логін юзера             |
| POST  | `/auth/refresh`  | Оновлення access токена |
| POST  | `/auth/logout`   | Логаут                  |

###  Contacts (захищені)

| Метод  | Шлях            | Опис                        |
| ------ | --------------- | --------------------------- |
| GET    | `/contacts`     | Отримати всі контакти юзера |
| GET    | `/contacts/:id` | Отримати контакт за ID      |
| POST   | `/contacts`     | Створити новий контакт      |
| PUT    | `/contacts/:id` | Оновити контакт за ID       |
| DELETE | `/contacts/:id` | Видалити контакт за ID      |

---

## Перевірка

- Перевіряти через Postman
- Access token передавати у Header:
  Authorization: Bearer YOUR_ACCESS_TOKEN

- Refresh токен зберігається у Cookies

---

## 🛠 Як локально запустити

git clone https://github.com/Phill1983/nodejs-hw-mongodb.git
cd nodejs-hw-mongodb
npm install
npm run dev

Створи .env:
MONGODB_USER=your_user
MONGODB_PASSWORD=your_password
MONGODB_URL=your_cluster.mongodb.net
MONGODB_DB=contactsDB
PORT=3000
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
JWT_RESET_SECRET=your_refresh_secret

CLOUDINARY_NAME=ypur_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_secret
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_USER=your_brevo_user
SMTP_PASS=your_brevo_password
SMTP_FROM=your_email@gmail.com
APP_DOMAIN=http://localhost:3000
---

## Виконавець

Philip Maslo, GoIT 2025  -->
