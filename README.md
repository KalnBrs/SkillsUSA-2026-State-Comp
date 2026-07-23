# SkillsUSA 2026 State Competition

This repository contains all projects submitted for the **SkillsUSA 2026 State Competition** in the Web & Application Development category. Each project is self-contained in its own directory with its own README and setup instructions.

---

## 📁 Projects

### 1. [Fibonacci Generator](./Fibonacci)

A command-line tool that generates Fibonacci sequences, written in **Node.js**.

**Highlights:**
- Specify how many Fibonacci numbers to generate with `-c <count>`
- Output options: one-line, numbered positions, or last-value-only
- Lightweight — no external runtime dependencies

**Quick Start:**
```bash
cd Fibonacci
node index.js -c 10
```

➡️ See the [Fibonacci README](./Fibonacci/README.md) for full usage and examples.

---

### 2. [Register App](./register-app)

A **Next.js** (TypeScript) registration application backed by **Prisma** and a database. Features a full-stack form-based registration flow.

**Highlights:**
- Built with Next.js 15 App Router
- Prisma ORM for database access
- Tailwind CSS for styling
- Environment variable configuration via `.env`

**Quick Start:**
```bash
cd register-app
cp .env.example .env   # fill in your database URL
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

➡️ See the [Register App README](./register-app/README.md) for full setup details.

---

### 3. [Weather App](./weather)

A **Next.js** (TypeScript) weather dashboard that displays current weather data. Uses **shadcn/ui** components for a polished UI.

**Highlights:**
- Built with Next.js 15 App Router
- shadcn/ui component library
- Tailwind CSS for styling
- Weather data fetched via API

**Quick Start:**
```bash
cd weather
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

➡️ See the [Weather App README](./weather/README.md) for full setup details.

---

## 🛠️ Tech Stack

| Technology | Usage |
|---|---|
| TypeScript | Primary language for Next.js projects |
| JavaScript | Fibonacci CLI tool |
| Next.js 15 | Full-stack React framework |
| Prisma | ORM / database access (Register App) |
| shadcn/ui | UI components (Weather App) |
| Tailwind CSS | Styling |
| Node.js | Runtime for all projects |

---

## 📋 Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- [npm](https://www.npmjs.com/) or another package manager (yarn, pnpm, bun)
- A database connection string (for the Register App only)

---

## 👤 Author

**KalnBrs** — SkillsUSA 2026 State Competition Contestant

---

*Created for the SkillsUSA 2026 State Competition.*
