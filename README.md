# Password Manager

A full-stack password manager built with Next.js, MongoDB, and NextAuth.js. Features team collaboration, secure credential storage, and comprehensive user management.

## 🚀 Features

### Core Features
- **Secure Password Storage** - Encrypted credential storage with MongoDB
- **Team Collaboration** - Invite team members, manage roles and permissions
- **User Authentication** - NextAuth.js with secure session management
- **Real-time Updates** - Live password entries and team management
- **Search & Filter** - Advanced filtering by tags, risks, and status
- **Dashboard Analytics** - Password health metrics and activity tracking

### Team Management
- **Role-based Access** - Owner, Admin, and Member roles
- **Invitation System** - Email-based team invitations with expiration
- **Member Management** - Add, remove, and manage team members
- **Organization Isolation** - Secure multi-tenant architecture

### Security Features
- **Password Hashing** - bcrypt for secure password storage
- **JWT Authentication** - Secure token-based authentication
- **Session Management** - NextAuth.js session handling
- **Input Validation** - Comprehensive input sanitization

## 🛠 Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, MongoDB with Mongoose
- **Authentication**: NextAuth.js with Credentials Provider
- **Database**: MongoDB (local or Atlas)
- **Styling**: Tailwind CSS with custom components
- **Icons**: Lucide React

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- MongoDB (local or MongoDB Atlas)

### Setup Steps

1. **Clone the repository**
```bash
git clone https://github.com/hashirwebx/password-manage.git
cd password-manager-with-nextjs
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
```

4. **Configure environment variables** in `.env`:
```env
# Database
MONGO_URI=mongodb://localhost:27017/password-manager
# Or use MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/password-manager

# Authentication
JWT_SECRET=your-super-secret-jwt-key-here
NEXTAUTH_SECRET=your-nextauth-secret-here
NEXTAUTH_URL=http://localhost:3000

# Email (for invitations)
EMAIL_FROM=noreply@yourdomain.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

5. **Start the development server**
```bash
npm run dev
```

6. **Open the application**
Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   ├── entries/       # Password entries CRUD
│   │   ├── invitations/   # Team invitations
│   │   └── team/          # Team management
│   ├── dashboard/         # Dashboard page
│   ├── login/            # Login page
│   ├── register/         # Registration page
│   ├── settings/         # Settings pages
│   ├── vault/            # Main vault page
│   └── invite/[token]/   # Invitation acceptance
├── components/            # Reusable React components
├── lib/                  # Utility functions and models
│   ├── authOptions.ts    # NextAuth configuration
│   ├── userModel.ts      # User schema
│   ├── entryModel.ts    # Entry schema
│   └── invitationModel.ts # Invitation schema
└── types/               # TypeScript type definitions
```

## 🔐 Authentication & Authorization

### User Roles
- **Owner**: Full access to all team features, can manage members
- **Admin**: Can manage team members and invitations
- **Member**: Can view and manage their own password entries

### Authentication Flow
1. Users register with email and password
2. Passwords are hashed using bcrypt
3. NextAuth.js manages sessions securely
4. JWT tokens for API authentication
5. Role-based access control for team features

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/callback/credentials` - Login (NextAuth)
- `GET /api/auth/session` - Get current session
- `GET /api/auth/me` - Get current user info

### Password Entries
- `GET /api/entries` - List all entries (with filters)
- `POST /api/entries` - Create new entry
- `GET /api/entries?id=<id>` - Get specific entry
- `PUT /api/entries?id=<id>` - Update entry
- `DELETE /api/entries?id=<id>` - Delete entry

### Team Management
- `GET /api/team/members?organizationId=<id>` - List team members
- `DELETE /api/team/members/<userId>` - Remove team member
- `GET /api/invitations?organizationId=<id>` - List invitations
- `POST /api/invitations` - Send invitation
- `POST /api/invitations/<token>` - Accept invitation
- `DELETE /api/invitations/<token>` - Revoke invitation

### System
- `GET /api/health` - Health check endpoint

## 🎯 Features in Detail

### Password Vault
- **Create Entries**: Add new passwords with title, URL, username, password, notes
- **Search & Filter**: Filter by tags, risk level, status
- **Quick Actions**: Copy password, visit URL, edit, delete
- **Security Indicators**: Risk assessment for weak passwords

### Team Collaboration
- **Invite Members**: Send email invitations with role assignment
- **Manage Permissions**: Owner/Admin/Member role hierarchy
- **Activity Tracking**: See who added/modified entries
- **Secure Sharing**: Team-based access control

### Dashboard
- **Overview Stats**: Total entries, recent activity, security health
- **Quick Access**: Frequently used entries
- **Team Overview**: Member count and invitation status

### Settings
- **Profile Management**: Update name and email
- **Team Settings**: Manage members and invitations
- **Security Settings**: Password policies and alerts

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Environment Variables
All environment variables are documented in the `.env.example` file. Make sure to:
- Use a strong `JWT_SECRET`
- Configure MongoDB connection
- Set up email for team invitations
- Define `NEXTAUTH_URL` for production

### Database Schema

#### User Model
```typescript
{
  email: string;
  passwordHash: string;
  name?: string;
  role: 'owner' | 'admin' | 'member';
  organizationId?: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
```

#### Entry Model
```typescript
{
  title: string;
  url?: string;
  username?: string;
  password: string;
  notes?: string;
  tags: string[];
  risk: 'low' | 'medium' | 'high';
  status: 'active' | 'archived';
  userId: ObjectId;
  organizationId: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
```

#### Invitation Model
```typescript
{
  email: string;
  role: 'admin' | 'member';
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  organizationId: ObjectId;
  invitedBy: ObjectId;
  invitedByEmail: string;
  token: string;
  expiresAt: Date;
  createdAt: Date;
}
```

## 🚀 Deployment

### Production Setup
1. Set production environment variables
2. Build the application: `npm run build`
3. Start production server: `npm run start`
4. Configure MongoDB for production
5. Set up email service for invitations

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For issues and questions:
1. Check the existing issues
2. Create a new issue with detailed information
3. Include environment details and error messages

---

**Built with ❤️ using Next.js, MongoDB, and NextAuth.js**
