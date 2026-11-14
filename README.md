# 🚀 Dev Flow — Team Task & Daily Progress Management Platform

**Dev Flow** is a role-based task management and team collaboration platform designed to streamline project management, task assignment, daily progress tracking, and team communication.

The platform provides dedicated workflows for **Admins, Leaders, and Members**, ensuring secure access control and efficient collaboration across teams.

It also features real-time task communication and user presence tracking powered by **Socket.IO and Redis**, allowing team members to stay connected and updated.

---

## ✨ Key Features

### 👨‍💼 1. Admin Management

- Manage team members and user accounts.
- Oversee overall platform operations.
- Control user roles and permissions.
- Maintain centralized team management.

### 📋 2. Project Management

- Leaders can create and manage projects.
- Organize tasks under specific projects.
- Manage project-related activities efficiently.

### 🎯 3. Task Assignment & Management

- Leaders can create and assign tasks to team members.
- Manage task details and assignments.
- Track task progress and completion.
- Members can view and manage their assigned tasks.

### 📊 4. Daily Progress Tracking

- Members can update the daily progress of their assigned tasks.
- Leaders can monitor task progress and daily updates.
- Improve transparency and accountability within teams.

### 🔐 5. Role-Based Access Control (RBAC)

The platform supports three different roles with dedicated permissions and workflows.

| Role       | Responsibilities                                                        |
| ---------- | ----------------------------------------------------------------------- |
| **Admin**  | Manage users, roles, and overall system operations.                     |
| **Leader** | Create projects, assign tasks, and monitor team progress.               |
| **Member** | View assigned tasks, update task status, and communicate with the team. |

### 💬 6. Real-Time Task Chat

- Task-specific real-time messaging.
- Implemented using Socket.IO.
- Enables team members to communicate within the context of individual tasks.
- Reduces communication gaps during task execution.

### 🟢 7. Real-Time User Presence Tracking

- Tracks online and offline user status.
- Implemented using Socket.IO and Redis.
- Handles multiple user activity scenarios, including:
  - User login and logout.
  - Browser tab closure.
  - Network disconnection.
  - Laptop sleep and inactivity.
  - Connection interruption and reconnection.
- Keeps user presence information synchronized across the platform.

### 🔄 8. Task Status Management

- Members can update the status of assigned tasks.
- Leaders can monitor task status changes.
- Helps track task progress from assignment to completion.

### 📱 9. Responsive User Interface

- Built using shadcn/ui.
- Modern and clean user interface.
- Responsive layouts for different screen sizes.
- Role-specific dashboards and workflows.

---

## 🛠️ Tech Stack

| Technology     | Purpose                                              |
| -------------- | ---------------------------------------------------- |
| **Next.js**    | Full-stack React framework and server-side rendering |
| **TypeScript** | Type safety and maintainable code                    |
| **PostgreSQL** | Relational database management                       |
| **Socket.IO**  | Real-time communication and user presence            |
| **Redis**      | Real-time presence and state management              |
| **shadcn/ui**  | Reusable and customizable UI components              |

---

##  System Architecture

Dev Flow follows a role-based architecture with separate workflows for Admins, Leaders, and Members.

```text
                    ┌─────────────────────┐
                    │      Dev Flow       │
                    │    Next.js + SSR    │
                    └──────────┬──────────┘
                               │
              ┌────────────────┼────────────────┐
              │                │                │
        ┌─────▼─────┐    ┌─────▼─────┐    ┌─────▼─────┐
        │   Admin   │    │  Leader   │    │  Member   │
        └───────────┘    └───────────┘    └───────────┘
                               │
                    ┌──────────▼──────────┐
                    │   Application Logic │
                    │  Role-Based Access  │
                    └──────────┬──────────┘
                               │
               ┌──────────────┼──────────────┐
               │              │              │
         ┌─────▼─────┐  ┌─────▼─────┐  ┌────▼─────┐
         │ PostgreSQL│  │ Socket.IO│  │  Redis   │
         │  Database │  │ Real-Time│  │ Presence │
         └───────────┘  └───────────┘  └──────────┘
```

---

## ⚙️ Installation & Setup

Follow these steps to run the project locally.

### 1. Clone the Repository

```bash
git clone <YOUR_REPOSITORY_URL>
```

### 2. Navigate to the Project Directory

```bash
cd dev-flow
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

Create a `.env` file in the root directory and configure the required environment variables.
(take the refernce of `.env.sample` file)


### 5. Start the Development Server

```bash
npm run dev
```

If your Socket.IO server runs separately, start it using the corresponding script configured in your project.

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔄 Application Workflow

1. **Admin** manages users and assigns appropriate roles.
2. **Leader** creates projects and organizes project tasks.
3. **Leader** assigns tasks to team members.
4. **Member** views assigned tasks and updates task statuses.
5. **Member** submits daily progress updates.
6. **Leader** monitors task progress and team performance.
7. **Team Members** communicate through real-time task chat.
8. **System** tracks online/offline presence using Socket.IO and Redis.

---

## 💡 Key Technical Highlights

Through this project, I gained practical experience in:

- Implementing role-based authentication and authorization.
- Designing relational database structures using PostgreSQL.
- Building full-stack applications with Next.js and TypeScript.
- Implementing real-time communication using Socket.IO.
- Managing real-time user presence using Redis.
- Handling connection lifecycle events and user disconnections.
- Implementing task assignment and progress-tracking workflows.
- Building server-rendered applications.
- Developing reusable and responsive UI components.
- Managing real-time application state.

---

## 🚀 Future Enhancements

- [ ] Task deadline reminders and notifications.
- [ ] File attachments and document sharing.
- [ ] Advanced task filtering and searching.
- [ ] Project activity logs and audit trails.
- [ ] Team performance reports.
- [ ] Email and push notifications.

