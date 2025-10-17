# API Testing Guide

This guide provides example requests for testing the Drivers App API using cURL or any HTTP client.

## Environment Variables
```bash
export API_URL="http://localhost:5000/api"
export TOKEN="your_jwt_token_here"
```

## Authentication

### 1. Register as Learner
```bash
curl -X POST $API_URL/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Learner",
    "email": "jane@example.com",
    "password": "password123",
    "role": "learner",
    "phone": "+1234567890"
  }'
```

### 2. Register as Instructor
```bash
curl -X POST $API_URL/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Instructor",
    "email": "john@example.com",
    "password": "password123",
    "role": "instructor",
    "phone": "+0987654321"
  }'
```

### 3. Login
```bash
curl -X POST $API_URL/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

Save the token from the response and use it in subsequent requests.

### 4. Get Profile
```bash
curl -X GET $API_URL/auth/profile \
  -H "Authorization: Bearer $TOKEN"
```

## Instructor Profiles

### 1. Create Instructor Profile
```bash
curl -X POST $API_URL/instructors/profile \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "bio": "Experienced driving instructor with 10+ years of teaching",
    "experience": 10,
    "credentials": [
      {
        "title": "Certified Driving Instructor",
        "issuedBy": "State DMV",
        "dateIssued": "2014-05-15"
      }
    ],
    "vehicleType": ["Manual", "Automatic"],
    "languages": ["English", "Spanish"],
    "serviceArea": {
      "city": "Los Angeles",
      "state": "CA",
      "radius": 30
    },
    "pricing": {
      "hourlyRate": 60,
      "packageDeals": [
        {
          "name": "10-Hour Package",
          "hours": 10,
          "price": 550,
          "description": "Save $50 with this package"
        }
      ]
    },
    "availability": [
      {
        "dayOfWeek": 1,
        "startTime": "08:00",
        "endTime": "18:00"
      },
      {
        "dayOfWeek": 3,
        "startTime": "08:00",
        "endTime": "18:00"
      },
      {
        "dayOfWeek": 5,
        "startTime": "08:00",
        "endTime": "18:00"
      }
    ]
  }'
```

### 2. Get All Instructors
```bash
curl -X GET $API_URL/instructors
```

### 3. Search Instructors
```bash
curl -X GET "$API_URL/instructors/search?city=Los%20Angeles&vehicleType=Manual&minRating=4&maxPrice=70"
```

## Bookings

### 1. Create Booking (as Learner)
```bash
curl -X POST $API_URL/bookings \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "instructorId": "instructor_user_id",
    "date": "2024-03-25T00:00:00.000Z",
    "startTime": "10:00",
    "endTime": "12:00",
    "duration": 2,
    "notes": "First time learning to drive",
    "pickupLocation": {
      "address": "123 Main Street, Los Angeles, CA"
    }
  }'
```

### 2. Get My Bookings
```bash
curl -X GET $API_URL/bookings \
  -H "Authorization: Bearer $TOKEN"
```

### 3. Create Payment Intent
```bash
curl -X POST $API_URL/bookings/{booking_id}/payment \
  -H "Authorization: Bearer $TOKEN"
```

### 4. Confirm Payment
```bash
curl -X PUT $API_URL/bookings/{booking_id}/confirm-payment \
  -H "Authorization: Bearer $TOKEN"
```

### 5. Update Booking Status
```bash
curl -X PUT $API_URL/bookings/{booking_id}/status \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "completed"
  }'
```

## Reviews

### 1. Create Review (after completed booking)
```bash
curl -X POST $API_URL/reviews \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "bookingId": "booking_id",
    "rating": 5,
    "comment": "Excellent instructor! Very patient and knowledgeable."
  }'
```

### 2. Get Instructor Reviews
```bash
curl -X GET $API_URL/reviews/instructor/{instructor_id}
```

### 3. Add Instructor Response to Review
```bash
curl -X PUT $API_URL/reviews/{review_id}/response \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Thank you for your kind words! It was a pleasure teaching you."
  }'
```

## Messaging

### 1. Create or Get Conversation
```bash
curl -X POST $API_URL/messages/conversation \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "participantId": "other_user_id"
  }'
```

### 2. Send Message
```bash
curl -X POST $API_URL/messages \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "conversationId": "conversation_id",
    "content": "Hi, I would like to schedule a lesson for next week."
  }'
```

### 3. Get All Conversations
```bash
curl -X GET $API_URL/messages/conversations \
  -H "Authorization: Bearer $TOKEN"
```

### 4. Get Messages in Conversation
```bash
curl -X GET $API_URL/messages/conversation/{conversation_id} \
  -H "Authorization: Bearer $TOKEN"
```

## Testing Workflow

### Complete User Journey

1. **Register users**:
   - Register a learner account
   - Register an instructor account

2. **Setup instructor**:
   - Login as instructor
   - Create instructor profile with pricing and availability

3. **Find instructor**:
   - Login as learner
   - Search for instructors
   - View instructor profiles and reviews

4. **Book a lesson**:
   - Create a booking
   - Create payment intent
   - Process payment (using Stripe test card)
   - Confirm payment

5. **Complete lesson**:
   - Instructor updates booking status to "completed"

6. **Leave review**:
   - Learner creates a review with rating
   - Instructor responds to the review

7. **Messaging**:
   - Create conversation between learner and instructor
   - Exchange messages

## Stripe Test Cards

For testing payments, use these test card numbers:
- **Success**: 4242 4242 4242 4242
- **Decline**: 4000 0000 0000 0002
- **Requires Authentication**: 4000 0025 0000 3155

Use any future expiry date and any 3-digit CVC.
