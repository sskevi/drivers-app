# Drivers App - Two-Sided Marketplace for Driving Instructors

A modern two-sided marketplace platform where driving instructors can list their services, and learners can discover, book, and review instructors. Built with the MERN stack (MongoDB, Express, React, Node.js).

## Features

### For Instructors
- **Profile Management**: Create and manage detailed profiles with credentials, experience, and vehicle types
- **Service Listing**: Set hourly rates and package deals
- **Availability Management**: Define weekly availability schedules
- **Booking Management**: View and manage lesson bookings
- **Review Responses**: Respond to learner reviews
- **Real-time Messaging**: Communicate with potential and current learners

### For Learners
- **Instructor Discovery**: Search and filter instructors by location, vehicle type, rating, and price
- **Comparison Tools**: Compare multiple instructors side-by-side
- **Booking System**: Book lessons with real-time availability checking
- **Secure Payments**: Stripe-powered payment processing
- **Review System**: Rate and review instructors after completed lessons
- **Messaging**: Chat with instructors before and after booking

## Technology Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Socket.io** for real-time messaging
- **Stripe** for payment processing

### API Features
- RESTful API design
- Role-based access control (Learner/Instructor)
- Secure password hashing with bcrypt
- Real-time WebSocket connections

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### Setup

1. Clone the repository:
```bash
git clone https://github.com/sskevi/drivers-app.git
cd drivers-app
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```bash
cp .env.example .env
```

4. Update the `.env` file with your configuration:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/drivers-app
JWT_SECRET=your_secure_jwt_secret_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

5. Start MongoDB (if running locally):
```bash
mongod
```

6. Start the development server:
```bash
npm run dev
```

The server will start on `http://localhost:5000`

## API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "learner",  // or "instructor"
  "phone": "+1234567890"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get User Profile
```http
GET /api/auth/profile
Authorization: Bearer {token}
```

#### Update User Profile
```http
PUT /api/auth/profile
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "John Updated",
  "phone": "+1234567890"
}
```

### Instructor Endpoints

#### Create/Update Instructor Profile
```http
POST /api/instructors/profile
Authorization: Bearer {token}
Content-Type: application/json

{
  "bio": "Experienced driving instructor",
  "experience": 5,
  "credentials": [
    {
      "title": "Certified Driving Instructor",
      "issuedBy": "DMV",
      "dateIssued": "2018-01-01"
    }
  ],
  "vehicleType": ["Manual", "Automatic"],
  "languages": ["English", "Spanish"],
  "serviceArea": {
    "city": "New York",
    "state": "NY",
    "radius": 25
  },
  "pricing": {
    "hourlyRate": 50,
    "packageDeals": [
      {
        "name": "5-Hour Package",
        "hours": 5,
        "price": 225,
        "description": "Save $25"
      }
    ]
  },
  "availability": [
    {
      "dayOfWeek": 1,
      "startTime": "09:00",
      "endTime": "17:00"
    }
  ]
}
```

#### Get All Instructors
```http
GET /api/instructors
```

#### Search Instructors
```http
GET /api/instructors/search?city=New%20York&vehicleType=Manual&minRating=4
```

#### Get Instructor Profile
```http
GET /api/instructors/profile/:userId
```

### Booking Endpoints

#### Create Booking
```http
POST /api/bookings
Authorization: Bearer {token}
Content-Type: application/json

{
  "instructorId": "instructor_user_id",
  "date": "2024-03-20",
  "startTime": "10:00",
  "endTime": "12:00",
  "duration": 2,
  "notes": "First lesson",
  "pickupLocation": {
    "address": "123 Main St, New York, NY"
  }
}
```

#### Get My Bookings
```http
GET /api/bookings
Authorization: Bearer {token}
```

#### Create Payment Intent
```http
POST /api/bookings/:id/payment
Authorization: Bearer {token}
```

#### Confirm Payment
```http
PUT /api/bookings/:id/confirm-payment
Authorization: Bearer {token}
```

#### Update Booking Status
```http
PUT /api/bookings/:id/status
Authorization: Bearer {token}
Content-Type: application/json

{
  "status": "completed"
}
```

### Review Endpoints

#### Create Review
```http
POST /api/reviews
Authorization: Bearer {token}
Content-Type: application/json

{
  "bookingId": "booking_id",
  "rating": 5,
  "comment": "Great instructor!"
}
```

#### Get Instructor Reviews
```http
GET /api/reviews/instructor/:instructorId
```

#### Add Review Response
```http
PUT /api/reviews/:id/response
Authorization: Bearer {token}
Content-Type: application/json

{
  "text": "Thank you for the feedback!"
}
```

### Messaging Endpoints

#### Get or Create Conversation
```http
POST /api/messages/conversation
Authorization: Bearer {token}
Content-Type: application/json

{
  "participantId": "user_id"
}
```

#### Get All Conversations
```http
GET /api/messages/conversations
Authorization: Bearer {token}
```

#### Get Messages in Conversation
```http
GET /api/messages/conversation/:conversationId
Authorization: Bearer {token}
```

#### Send Message
```http
POST /api/messages
Authorization: Bearer {token}
Content-Type: application/json

{
  "conversationId": "conversation_id",
  "content": "Hello, I'd like to book a lesson"
}
```

## Real-time Features

The application uses Socket.io for real-time messaging:

### Events

#### Client → Server
- `join-conversation`: Join a conversation room
- `send-message`: Send a message to a conversation
- `typing`: Notify others that user is typing

#### Server → Client
- `new-message`: Receive new message
- `user-typing`: Notification that another user is typing

## Database Models

### User
- Basic user information
- Role (learner/instructor)
- Authentication credentials

### InstructorProfile
- Detailed instructor information
- Credentials and qualifications
- Pricing and availability
- Service area
- Ratings

### Booking
- Lesson booking details
- Date and time
- Payment status
- Booking status

### Review
- Ratings and comments
- Instructor responses
- Links to booking

### Message/Conversation
- Real-time messaging
- Conversation threads
- Read status

## Security Features

- Password hashing with bcrypt
- JWT-based authentication
- Role-based access control
- Secure payment processing with Stripe
- Input validation
- CORS protection

## Development

### Running in Development Mode
```bash
npm run dev
```

### Running in Production Mode
```bash
npm start
```

## Future Enhancements

- [ ] Email notifications
- [ ] SMS reminders
- [ ] Google Maps integration for location services
- [ ] Calendar integration
- [ ] Advanced analytics for instructors
- [ ] Multi-language support
- [ ] Mobile app (React Native)
- [ ] Video chat integration
- [ ] Automated scheduling
- [ ] Referral system

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

ISC

## Support

For support, email support@drivers-app.com or create an issue in the GitHub repository.
