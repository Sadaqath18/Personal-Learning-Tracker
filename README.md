# 🌟 Personal Learning Tracker

A full-stack **Next.js** app to create, track, and manage learning goals with authentication, admin tools, and a modern UI.

---

<p align="center">
  <a href="https://github.com/Sadaqath18/personal-learning-tracker/stargazers"><img src="https://img.shields.io/github/stars/Sadaqath18/personal-learning-tracker?style=social" /></a>
  <a href="https://github.com/Sadaqath18/personal-learning-tracker/network/members"><img src="https://img.shields.io/github/forks/Sadaqath18/personal-learning-tracker?style=social" /></a>
  <a href="https://github.com/Sadaqath18/personal-learning-tracker/blob/main/LICENSE"><img src="https://img.shields.io/github/license/Sadaqath18/personal-learning-tracker?color=blue" /></a>
  <br />
  <a href="https://nextjs.org/"><img src="https://img.shields.io/badge/Next.js-15-black?logo=next.js" /></a>
  <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/TailwindCSS-4.0-06B6D4?logo=tailwindcss&logoColor=white" /></a>
  <a href="https://www.prisma.io/"><img src="https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma&logoColor=white" /></a>
  <a href="https://supabase.com/"><img src="https://img.shields.io/badge/Supabase-Postgres-3ECF8E?logo=supabase&logoColor=white" /></a>
  <a href="https://vercel.com/"><img src="https://img.shields.io/badge/Deployed%20on-Vercel-black?logo=vercel" /></a>
</p>

---

## 🌐 Live Demo

> 🔗 [View Deployed App on Vercel](personal-learning-tracker-2aj5muwt8.vercel.app)  
---

## 📸 Preview

<p align="center">
  <!-- Row 1 -->
  <img src="https://github.com/user-attachments/assets/6a88bbbc-e6b8-4e04-90ba-041eed001e1d" alt="App preview" width="80%">
</p>

<p align="center">
  <!-- Row 2 -->
  <img src="https://github.com/user-attachments/assets/679d64a6-c7b8-4cc6-9f68-f29f7bd3cbf5" alt="Login page" width="45%">
  <img src="https://github.com/user-attachments/assets/fb6138bc-0bce-41c1-99dc-38a99027826c" alt="Signup page" width="45%">
</p>

<p align="center">
  <!-- Row 3 -->
  <img src="https://github.com/user-attachments/assets/025c47cc-e106-42c4-9580-65cd6914d2d5" alt="My Profile page" width="45%">
  <img src="https://github.com/user-attachments/assets/94650b93-462f-4d22-bc63-024f4e1acdf3" alt="Goals page" width="45%">
</p>

<p align="center">
  <!-- Row 4 -->
  <img src="https://github.com/user-attachments/assets/7740ef4b-1b75-45bf-be3f-ad4dc6e04f81" alt="Admin Dashboard (1)" width="45%">
  <img src="https://github.com/user-attachments/assets/37c36bdd-5964-47bb-87e1-f6c13622afbe" alt="Admin Dashboard (2)" width="45%">
</p>


---

### 🚀 Tech Stack
- **Framework:** Next.js 15 (App Router)  
- **Styling:** Tailwind CSS v4  
- **Database:** Supabase Postgres + Prisma ORM  
- **Auth:** JWT (stored in localStorage)  
- **Animations:** Framer Motion  
- **Notifications:** react-hot-toast  
- **Deployment:** Vercel  

---

### ✨ Features
- User authentication (Signup, Login, Reset password)  
- Profile management (Edit name/password)  
- CRUD goals with status tracking  
- Admin dashboard (manage users & goals)  
- Responsive, animated UI with sidebar navigation  

---

### 🧱 Project Structure
```bash
├── src/
│   ├── app/
│   │   ├── login/
│   │   ├── signup/
│   │   ├── forgot-password/
│   │   ├── dashboard/
│   │   │   ├── goals/
│   │   │   ├── profile/
│   │   │   └── admin/
│   │   └── api/
│   │       ├── auth/
│   │       ├── goals/
│   │       └── admin/
│   ├── components/
│   └── lib/
│       └── prisma.js
```
---

### 🧑‍💻 Local Setup

Follow these steps to run the project locally 👇
<Details>

#### 1️⃣ Clone the Repository
```bash
git clone https://github.com/<your-username>/<your-repo-name>.git
cd <your-repo-name>
```

#### 2️⃣ Install Dependencies

```bash
pnpm install
```

#### 3️⃣ Configure Environment Variables

Create a `.env` file in your root directory:
```bash
DATABASE_URL="postgresql://postgres:<ENC_PASS>@db.<project-ref>.supabase.co:5432/postgres?sslmode=require"
JWT_SECRET="your-strong-secret"
APP_URL="http://localhost:3000"
```

#### 4️⃣ Setup Database (Prisma + Supabase)

```bash
npx prisma migrate dev -n init
npx prisma generate
```

#### 5️⃣ Run the Development Server
```bash
pnpm run dev
```
Visit: http://localhost:3000
</Details>

---

🧩 **API Endpoints**
<details>

| Endpoint          | Method        | Description                |
|-------------------|---------------|-----------------------------|
| `/api/auth/signup` | **POST**      | Register new user          |
| `/api/auth/login`  | **POST**      | Login user                 |
| `/api/auth/profile`| **GET**       | Get logged-in user         |
| `/api/goals`       | **GET / POST**| Fetch or create goals      |
| `/api/goals/[id]`  | **PUT / DELETE** | Update or delete goal    |
| `/api/admin/users` | **GET**       | View all users (admin only)|

</details>

---

## 🧠 Notes

- JWT stored in localStorage for demo simplicity
- Prisma singleton pattern ensures stable DB connections
- All API routes use Node.js runtime
- Avoid running Prisma migrations during Vercel builds

---

### 🤝 Contributing
Contributions are welcome!

If you'd like to improve this project:
```bash
# Fork the repo
git checkout -b feature/your-feature
git commit -m "feat: add your feature"
git push origin feature/your-feature
```
Then open a Pull Request 🚀

---

### 🪪 License

This project is licensed under the MIT License — free to use and modify.

---

<p align="center">⭐ Star this repository if you found it useful!</p>
