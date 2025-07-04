# 🐕 Fetch - Rescue Management System

Under construction

### Development

- **pnpm Workspaces** - Efficient monorepo management
- **tsx** - Fast TypeScript execution
- **Docker** - Containerized database
- **ESLint** - Code quality and consistency

## 📁 Project Structure

```
fetch/
├── apps/
│   ├── api/          # Fastify backend server
│   └── web/          # React frontend app
├── packages/
│   └── shared/       # Shared TypeScript types
├── docker-compose.yml
└── package.json
```

## 🛠️ Development Setup

### Prerequisites

- **Node.js 18+**
- **pnpm** - `npm install -g pnpm`
- **Docker Desktop** - For PostgreSQL database

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/fetch.git
   cd fetch
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Start PostgreSQL database**

   ```bash
   docker-compose up -d
   ```

4. **Set up database**

   ```bash
   cd apps/api
   cp .env.example .env  # Update with your database URL
   pnpm prisma migrate dev --name init
   pnpm prisma generate
   ```

5. **Build shared package**
   ```bash
   cd packages/shared
   pnpm run build
   ```

### Running the Application

**Start both frontend and backend:**

```bash
pnpm run dev
```

**Or start individually:**

```bash
# Backend only (http://localhost:3001)
pnpm run dev:api

# Frontend only (http://localhost:3000)
pnpm run dev:web
```

## 🌟 Key Features

### Dog Management

- Add new rescue dogs with details (name, breed, age, weight, description)
- Track dog status (Available, Pending, Adopted, Hold, Medical)
- Monitor placement (In Foster, Boarding, Foster-to-Adopt)
- Form validation and error handling

### Modern Architecture

- **Monorepo structure** - Organized codebase with shared types
- **Type-safe APIs** - Shared TypeScript interfaces between frontend/backend
- **Component architecture** - Reusable React components with SCSS modules
- **Database-first** - Prisma schema drives the entire data model

## 🔧 Available Scripts

```bash
# Development
pnpm run dev          # Start both apps
pnpm run dev:api      # Start backend only
pnpm run dev:web      # Start frontend only

# Building
pnpm run build        # Build all packages

# Database
pnpm run db:migrate   # Run database migrations
pnpm run db:studio    # Open Prisma Studio
```

## 📝 Environment Variables

### Backend (`apps/api/.env`)

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/fetch_db"
PETFINDER_API_KEY="your_key_here"
PETFINDER_SECRET="your_secret_here"
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🐾 About

Fetch is designed to help rescue organizations efficiently manage their dogs and adoption processes. Built with modern web technologies for performance, maintainability, and developer experience.
