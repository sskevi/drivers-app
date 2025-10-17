# DriversApp Architecture

## System Overview

DriversApp is a two-sided marketplace platform connecting driving instructors with learners. The application follows a client-server architecture with RESTful API design and real-time messaging capabilities.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Layer                          │
├─────────────────────────────────────────────────────────────┤
│  Web Browser (HTML/CSS/JavaScript)                          │
│  ├── Home Page                                              │
│  ├── Authentication (Login/Register)                        │
│  ├── Instructor Search & Discovery                          │
│  ├── Instructor Dashboard                                   │
│  ├── Booking Management                                     │
│  └── Real-time Messaging (Socket.io Client)                │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTPS
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      Application Layer                       │
├─────────────────────────────────────────────────────────────┤
│  Node.js + Express.js Server                                │
│  ├── RESTful API Endpoints                                  │
│  ├── Authentication Middleware (JWT)                        │
│  ├── Authorization (Role-based)                             │
│  ├── WebSocket Server (Socket.io)                          │
│  └── Static File Serving                                    │
└─────────────────────────────────────────────────────────────┘
                            │
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
        ▼                   ▼                   ▼
┌──────────────┐  ┌──────────────────┐  ┌────────────┐
│   MongoDB    │  │  Stripe Payment  │  │  Socket.io │
│   Database   │  │     Gateway      │  │  Real-time │
│              │  │                  │  │  Messaging │
└──────────────┘  └──────────────────┘  └────────────┘
```

## Technology Stack

### Backend
- **Runtime**: Node.js (v14+)
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Real-time**: Socket.io
- **Payment**: Stripe API
- **Security**: bcrypt for password hashing

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with CSS Grid and Flexbox
- **Vanilla JavaScript** - ES6+ features
- **Fetch API** - HTTP requests

### External Services
- **Stripe**: Payment processing
- **MongoDB Atlas**: Cloud database (optional)

## Database Schema

### Collections

#### 1. Users
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (enum: 'learner', 'instructor'),
  phone: String,
  profileImage: String,
  createdAt: Date
}
```

#### 2. InstructorProfiles
```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: User),
  bio: String,
  experience: Number,
  credentials: [{
    title: String,
    issuedBy: String,
    dateIssued: Date,
    certificateUrl: String
  }],
  vehicleType: [String],
  languages: [String],
  serviceArea: {
    city: String,
    state: String,
    radius: Number,
    coordinates: { lat: Number, lng: Number }
  },
  pricing: {
    hourlyRate: Number,
    packageDeals: [{
      name: String,
      hours: Number,
      price: Number,
      description: String
    }]
  },
  availability: [{
    dayOfWeek: Number (0-6),
    startTime: String,
    endTime: String
  }],
  rating: {
    average: Number,
    count: Number
  },
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

#### 3. Bookings
```javascript
{
  _id: ObjectId,
  learner: ObjectId (ref: User),
  instructor: ObjectId (ref: User),
  instructorProfile: ObjectId (ref: InstructorProfile),
  date: Date,
  startTime: String,
  endTime: String,
  duration: Number,
  totalPrice: Number,
  status: String (enum: 'pending', 'confirmed', 'completed', 'cancelled'),
  paymentStatus: String (enum: 'pending', 'paid', 'refunded'),
  paymentIntentId: String,
  notes: String,
  pickupLocation: {
    address: String,
    coordinates: { lat: Number, lng: Number }
  },
  createdAt: Date,
  updatedAt: Date
}
```

#### 4. Reviews
```javascript
{
  _id: ObjectId,
  booking: ObjectId (ref: Booking),
  learner: ObjectId (ref: User),
  instructor: ObjectId (ref: User),
  instructorProfile: ObjectId (ref: InstructorProfile),
  rating: Number (1-5),
  comment: String,
  response: {
    text: String,
    createdAt: Date
  },
  createdAt: Date
}
```

#### 5. Conversations & Messages
```javascript
// Conversation
{
  _id: ObjectId,
  participants: [ObjectId (ref: User)],
  booking: ObjectId (ref: Booking),
  lastMessage: ObjectId (ref: Message),
  createdAt: Date,
  updatedAt: Date
}

// Message
{
  _id: ObjectId,
  conversation: ObjectId (ref: Conversation),
  sender: ObjectId (ref: User),
  content: String,
  isRead: Boolean,
  createdAt: Date
}
```

## API Architecture

### RESTful Endpoints

#### Authentication (`/api/auth`)
- `POST /register` - User registration
- `POST /login` - User authentication
- `GET /profile` - Get current user
- `PUT /profile` - Update user profile

#### Instructors (`/api/instructors`)
- `GET /` - List all instructors
- `GET /search` - Search with filters
- `GET /profile/:userId` - Get instructor profile
- `POST /profile` - Create instructor profile
- `PUT /profile` - Update instructor profile

#### Bookings (`/api/bookings`)
- `GET /` - Get user's bookings
- `POST /` - Create booking
- `GET /:id` - Get booking details
- `POST /:id/payment` - Create payment intent
- `PUT /:id/confirm-payment` - Confirm payment
- `PUT /:id/status` - Update status
- `DELETE /:id` - Cancel booking

#### Reviews (`/api/reviews`)
- `POST /` - Create review
- `GET /instructor/:id` - Get instructor reviews
- `GET /:id` - Get review details
- `PUT /:id/response` - Add instructor response

#### Messages (`/api/messages`)
- `POST /conversation` - Create/get conversation
- `GET /conversations` - List conversations
- `GET /conversation/:id` - Get messages
- `POST /` - Send message
- `PUT /:id/read` - Mark as read

## Security Architecture

### Authentication Flow
1. User submits credentials
2. Server validates and generates JWT
3. Token stored in localStorage
4. Token included in Authorization header
5. Server validates token on protected routes

### Authorization
- Role-based access control (RBAC)
- Learners can book and review
- Instructors can manage profiles and bookings
- Middleware checks user role

### Data Protection
- Passwords hashed with bcrypt (10 rounds)
- JWT tokens with expiration
- CORS configuration
- Input validation
- SQL injection prevention (Mongoose)
- XSS protection

## Real-time Architecture

### Socket.io Implementation
```javascript
Client                          Server
  │                               │
  ├─ connect ──────────────────>  │
  │                               │
  ├─ join-conversation ────────>  │
  │                               │
  ├─ send-message ─────────────>  │
  │                               │
  │  <─────────── new-message ───┤
  │                               │
  ├─ typing ────────────────────> │
  │                               │
  │  <─────────── user-typing ───┤
  │                               │
  ├─ disconnect ─────────────────>│
```

## Payment Flow

### Stripe Integration
1. User selects booking
2. Frontend requests payment intent
3. Backend creates Stripe PaymentIntent
4. Frontend displays Stripe payment form
5. User completes payment
6. Backend confirms payment
7. Booking status updated to 'confirmed'

## Data Flow Examples

### Booking Creation Flow
```
Learner → POST /api/bookings
         ↓
    Validate auth & role
         ↓
    Get instructor profile
         ↓
    Calculate total price
         ↓
    Create booking record
         ↓
    Return booking details
```

### Instructor Search Flow
```
User → GET /api/instructors/search?city=LA&rating=4
      ↓
  Build MongoDB query
      ↓
  Apply filters (city, rating, price)
      ↓
  Execute query with pagination
      ↓
  Populate user details
      ↓
  Return results
```

## Scalability Considerations

### Horizontal Scaling
- Stateless API design
- JWT tokens (no session storage)
- Load balancer ready
- Database connection pooling

### Performance Optimization
- Database indexing on frequently queried fields
- Pagination for large datasets
- Caching strategies (future)
- CDN for static assets (future)

### Future Enhancements
- Redis for session management
- Message queue (RabbitMQ/Bull)
- Microservices architecture
- Kubernetes deployment
- GraphQL API option

## Monitoring & Logging

### Application Monitoring
- Server health endpoint (`/api/health`)
- Error logging
- Request logging (future)
- Performance metrics (future)

### Database Monitoring
- MongoDB Atlas monitoring (cloud)
- Query performance analysis
- Index usage statistics

## Deployment Architecture

### Production Setup
```
Internet
   │
   ├─> Load Balancer (Optional)
   │
   ├─> Nginx (Reverse Proxy)
   │
   ├─> Node.js Application (PM2)
   │    ├─> Express Server
   │    └─> Socket.io Server
   │
   ├─> MongoDB (Local/Atlas)
   │
   └─> Stripe API (External)
```

### Development Setup
```
localhost:5000
   ├─> Express Server
   ├─> Socket.io Server
   ├─> Static File Server
   └─> MongoDB (localhost:27017)
```

## File Structure
```
drivers-app/
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── bookingController.js
│   │   ├── instructorController.js
│   │   ├── messageController.js
│   │   └── reviewController.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── User.js
│   │   ├── InstructorProfile.js
│   │   ├── Booking.js
│   │   ├── Review.js
│   │   └── Message.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── bookingRoutes.js
│   │   ├── instructorRoutes.js
│   │   ├── messageRoutes.js
│   │   └── reviewRoutes.js
│   └── utils/
│       └── generateToken.js
├── frontend/
│   ├── css/
│   │   └── styles.css
│   ├── js/
│   │   └── app.js
│   └── pages/
│       ├── home.html
│       ├── login.html
│       ├── register.html
│       ├── instructors.html
│       └── dashboard.html
├── public/
│   └── index.html
├── server.js
├── package.json
└── .env
```

## Error Handling

### API Error Responses
```javascript
{
  "message": "Error description",
  "status": 400,
  "errors": [] // Optional validation errors
}
```

### HTTP Status Codes
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Server Error

## Conclusion

This architecture provides a solid foundation for a scalable, maintainable two-sided marketplace. The modular design allows for easy feature additions and modifications while maintaining security and performance standards.
