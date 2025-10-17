# Quick Start Guide

Get DriversApp up and running in 5 minutes!

## Prerequisites

- Node.js 14+ installed ([Download](https://nodejs.org/))
- MongoDB installed locally OR MongoDB Atlas account ([Sign up free](https://www.mongodb.com/cloud/atlas))
- Stripe account for payments ([Sign up](https://stripe.com/)) - optional for testing

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/sskevi/drivers-app.git
cd drivers-app
```

### 2. Run Setup Script (Recommended)

```bash
chmod +x setup.sh
./setup.sh
```

This will:
- Install all dependencies
- Create `.env` file
- Check your environment

### 3. Manual Setup (Alternative)

```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

### 4. Configure Environment

Edit `.env` file:

```env
# Required
PORT=5000
MONGODB_URI=mongodb://localhost:27017/drivers-app
JWT_SECRET=your_secret_key_min_32_characters

# Optional (for payment features)
STRIPE_SECRET_KEY=sk_test_your_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_key
```

**Quick MongoDB Options:**

**Option A: Local MongoDB**
```bash
# Start MongoDB
sudo systemctl start mongod
# or
mongod
```

**Option B: MongoDB Atlas (Cloud)**
1. Create free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Get connection string
3. Update `MONGODB_URI` in `.env`

### 5. Start the Server

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

### 6. Open the Application

Visit: **http://localhost:5000**

## First Steps

### As a Learner

1. Click **"Sign Up"**
2. Fill in your details
3. Select role: **"Learner"**
4. Click **"Find Instructors"** to browse
5. Use filters to search by location, price, rating
6. Click on an instructor to view profile
7. Book a lesson!

### As an Instructor

1. Click **"Become an Instructor"** or **"Sign Up"**
2. Fill in your details
3. Select role: **"Instructor"**
4. Go to **Dashboard**
5. Click **"Edit Profile"**
6. Set your:
   - Bio and experience
   - Hourly rate
   - Service area (city/state)
7. Save and start receiving bookings!

## Testing the API

### Using Postman

1. Import `postman_collection.json` into Postman
2. Set variables:
   - `baseUrl`: `http://localhost:5000/api`
3. Try the endpoints in order:
   - Register
   - Login
   - Create profile
   - Search instructors

### Using cURL

See `API_TESTING.md` for detailed examples.

Quick test:
```bash
# Health check
curl http://localhost:5000/api/health

# Register a learner
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "role": "learner",
    "phone": "+1234567890"
  }'
```

## Common Issues

### Port Already in Use

```bash
# Change PORT in .env file
PORT=3000
```

### MongoDB Connection Error

```bash
# Check if MongoDB is running
sudo systemctl status mongod

# Start MongoDB
sudo systemctl start mongod

# Or use MongoDB Atlas cloud database
```

### Module Not Found

```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

## Next Steps

1. **Read the Full Documentation**
   - `README.md` - Complete API reference
   - `ARCHITECTURE.md` - System design
   - `DEPLOYMENT.md` - Production setup

2. **Explore Features**
   - Create test accounts
   - Make bookings
   - Try the search filters
   - Test messaging (Socket.io)

3. **Development**
   - See `CONTRIBUTING.md` for guidelines
   - Add new features
   - Report bugs

## Development Workflow

```bash
# 1. Make changes to code
# 2. Server auto-reloads (with nodemon)
# 3. Test in browser
# 4. Commit changes

git add .
git commit -m "Your message"
git push
```

## Available Scripts

```bash
npm start          # Start production server
npm run dev        # Start development server with auto-reload
```

## Environment Modes

**Development** (default)
- Detailed error messages
- CORS enabled for all origins
- Auto-reload on code changes

**Production** (NODE_ENV=production)
- Error messages hidden
- CORS restricted to CLIENT_URL
- Optimized performance

## Getting Help

- 📖 Documentation: See `README.md`
- 🐛 Issues: [GitHub Issues](https://github.com/sskevi/drivers-app/issues)
- 💬 Questions: Open a discussion

## Sample Data

For testing, you can create sample data:

**Instructor Account:**
- Email: instructor@example.com
- Password: password123
- Role: Instructor

**Learner Account:**
- Email: learner@example.com
- Password: password123
- Role: Learner

## What's Next?

After setup, you might want to:

1. **Customize the UI**
   - Edit files in `frontend/`
   - Modify styles in `frontend/css/styles.css`

2. **Add Features**
   - Check `CONTRIBUTING.md` for ideas
   - Implement email notifications
   - Add more filters

3. **Deploy to Production**
   - Follow `DEPLOYMENT.md`
   - Set up on Heroku, AWS, or DigitalOcean

## Success! 🎉

You're all set! The marketplace is ready to connect driving instructors with learners.

---

**Need help?** Check the full documentation or open an issue on GitHub.
