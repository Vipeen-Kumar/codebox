# codebox.tech | An Online IDE

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Styled Components](https://img.shields.io/badge/styled--components-DB7093?style=for-the-badge&logo=styled-components&logoColor=white)](https://styled-components.com/)
[![Gemini](https://img.shields.io/badge/Gemini-8E75B2?style=for-the-badge&logo=googlegemini&logoColor=white)](https://ai.google.dev/)

**codebox.tech** is a modern, high-performance web-based IDE designed for developers to write, run, and share code seamlessly. It features a VSCode-like interface with resizable panels, multi-language support, and an integrated AI assistant powered by Google's Gemini.

## Table of Contents
- [Project Overview](#project-overview)
- [Installation & Setup](#installation--setup)
  - [Prerequisites](#prerequisites)
  - [1. Clone the Repository](#1-clone-the-repository)
  - [2. Frontend Setup](#2-frontend-setup)
  - [3. Backend Setup](#3-backend-setup)
  - [Configuration Requirements](#configuration-requirements)
- [Usage Examples](#usage-examples)
- [API Documentation](#api-documentation)
- [Testing Procedures](#testing-procedures)
- [Deployment](#deployment)
- [Run with Docker (Recommended for quick start)](#run-with-docker-recommended-for-quick-start)
- [Changelog](#changelog)
- [Contribution Guidelines](#contribution-guidelines)
- [License](#license)
- [Contact & Support](#contact--support)

## 🚀 Project Overview

- **Dynamic Playground**: Create and organize code snippets in folders.
- **Multi-Language Support**: Run C++, Java, Python, and JavaScript.
- **AI Assistant**: Context-aware AI to help with debugging and code generation.
- **Resizable Interface**: Fully customizable workspace layout using `react-resizable-panels`.
- **Online Execution**: Powered by the Piston API for secure and fast code execution.

---

## 🛠️ Installation & Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (v16.x or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Gemini API Key](https://ai.google.dev/)

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/codebox.git
cd codebox
```

### 2. Frontend Setup
```bash
# Install dependencies
npm install

# Start the development server
npm start
```

### 3. Backend Setup
```bash
cd backend

# Install dependencies
npm install

# Create a .env file
touch .env
```

### Configuration Requirements
Add the following to your `backend/.env` file:
```env
PORT=5000
GEMINI_API_KEY=your_gemini_api_key_here
PISTON_API_URL=https://emkc.org/api/v2/piston
```

---

## 💻 Usage Examples

### Running Code
Select your preferred language from the dropdown, write your code, and click **Save and Run**.

```javascript
// Example: JavaScript
console.log("Hello from codebox.tech!");
```

### AI Chat Assistant
Ask the AI to generate code or explain logic.
> **User**: "Generate a Fibonacci sequence in C++"
> **AI**: "Here is the Fibonacci code in C++ using an iterative approach..."

---

## 📡 API Documentation

### 1. Code Execution
**Endpoint**: `POST /api/piston/execute`  
**Description**: Executes code using the Piston API.

**Request Body**:
```json
{
  "language": "python",
  "version": "3.10.0",
  "source_code": "print('Hello')",
  "stdin": ""
}
```

### 2. AI Chat
**Endpoint**: `POST /api/ai/chat`  
**Description**: Generates AI responses using Gemini.

**Request Body**:
```json
{
  "prompt": "Explain recursion",
  "history": []
}
```

---

## 🧪 Testing Procedures

To run the frontend test suite:
```bash
npm test
```
The project uses **Jest** and **React Testing Library** for component and logic verification.

---

## 🚢 Deployment

### Frontend
Build the production-ready assets:
```bash
npm run build
```
The `/build` folder can be hosted on platforms like Vercel, Netlify, or AWS S3.

### Backend
Deploy the Node.js server to Heroku, Render, or a VPS. Ensure environment variables are configured in the production environment.

---

## 🐳 Run with Docker (Recommended for quick start)

### Prerequisites
- Install [Docker Desktop](https://www.docker.com/products/docker-desktop/) (Windows/macOS) or Docker Engine (Linux).

### 1. Set required environment variables
Create a `.env` file next to `docker-compose.yml` (project root) or export them in your shell:
```env
GEMINI_API_KEY=your_gemini_api_key_here
# Optional: override Piston API URL
PISTON_API_URL=https://emkc.org/api/v2/piston
```

### 2. Build and run the stack
```bash
docker compose up --build
```
This starts:
- Frontend on http://localhost:3000
- Backend on http://localhost:5000

Live-reload is enabled via bind mounts. Edit code locally and the containers will refresh.

### 3. Stop the containers
```bash
docker compose down
```

### Optional handy commands
- Rebuild only one service:
  ```bash
  docker compose build frontend
  docker compose build backend
  ```
- View logs:
  ```bash
  docker compose logs -f frontend
  docker compose logs -f backend
  ```

### How it works
- [`docker-compose.yml`](file:///c:/Users/vipee/Desktop/study/project/codebox/docker-compose.yml) runs two services:
  - `backend` (Node/Express) on port 5000 using [backend/Dockerfile](file:///c:/Users/vipee/Desktop/study/project/codebox/backend/Dockerfile).
  - `frontend` (React) on port 3000 using the root [Dockerfile](file:///c:/Users/vipee/Desktop/study/project/codebox/Dockerfile).
- Ports are mapped so the browser can access both services on localhost.
- Environment variables are passed into the backend container.

---

## 📜 Changelog

### v1.1.0
- Added horizontally resizable panels (Code Editor, Consoles, AI Chat).
- Integrated Gemini AI assistant.
- Fixed output console clipping and layout issues.

### v1.0.0
- Initial release with Piston API integration.
- Folder and Playground management.

---

## 🤝 Contribution Guidelines

1. Fork the Project.
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`).
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the Branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---

## ⚖️ License
Distributed under the MIT License. See `LICENSE` for more information.

---

## 📞 Contact & Support
- **Author**: Vipeen Kumar
- **Email**: vipeenk023@gmail.com

---
*Created with ❤️ by the Vipeen Kumar.*
