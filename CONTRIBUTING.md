# Contributing to DriversApp

Thank you for considering contributing to DriversApp! This document provides guidelines for contributing to the project.

## Getting Started

1. **Fork the Repository**
   - Fork the repo on GitHub
   - Clone your fork locally

2. **Set Up Development Environment**
   ```bash
   git clone https://github.com/YOUR_USERNAME/drivers-app.git
   cd drivers-app
   npm install
   cp .env.example .env
   # Edit .env with your local configuration
   ```

3. **Create a Branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

## Development Workflow

### Running Locally

1. **Start MongoDB** (if running locally)
   ```bash
   mongod
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Access the Application**
   - Frontend: http://localhost:5000
   - API: http://localhost:5000/api

### Code Style

- Use ES6+ JavaScript features
- Follow existing code formatting
- Use meaningful variable and function names
- Add comments for complex logic
- Keep functions small and focused

### Making Changes

1. **Write Clean Code**
   - Follow the existing code structure
   - Maintain consistency with the codebase
   - Use async/await for asynchronous operations

2. **Test Your Changes**
   - Test all affected endpoints
   - Verify frontend functionality
   - Check for console errors
   - Test edge cases

3. **Document Your Changes**
   - Update README.md if needed
   - Add comments to complex code
   - Update API documentation

## Commit Guidelines

### Commit Message Format

```
type(scope): subject

body (optional)
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```
feat(booking): add booking cancellation feature
fix(auth): resolve token expiration issue
docs(api): update endpoint documentation
```

## Pull Request Process

1. **Update Your Branch**
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Push to Your Fork**
   ```bash
   git push origin feature/your-feature-name
   ```

3. **Create Pull Request**
   - Go to GitHub and create a PR
   - Fill in the PR template
   - Link related issues
   - Add screenshots for UI changes

4. **PR Requirements**
   - Clear description of changes
   - No merge conflicts
   - Follows code style guidelines
   - All tests pass (if applicable)
   - Documentation updated

## Areas for Contribution

### High Priority
- Email notification system
- Advanced search filters
- Mobile responsiveness improvements
- Accessibility improvements
- Test coverage
- Performance optimization

### Features
- Google Maps integration
- Calendar synchronization
- Multi-language support
- Advanced analytics dashboard
- Video chat integration
- SMS notifications

### Bug Fixes
- Check GitHub Issues for reported bugs
- Fix any issues you encounter
- Improve error handling

### Documentation
- API documentation improvements
- Code examples
- Tutorial guides
- Deployment guides

## Code Review Process

1. Maintainers will review your PR
2. Address any feedback or requested changes
3. Once approved, your PR will be merged

## Testing

### Manual Testing
1. Test the feature you added/modified
2. Test related functionality
3. Test in different browsers
4. Check mobile responsiveness

### API Testing
- Use Postman collection provided
- Test all affected endpoints
- Verify error handling
- Check response formats

## Project Structure

```
drivers-app/
├── backend/
│   ├── config/         # Configuration files
│   ├── controllers/    # Request handlers
│   ├── middleware/     # Custom middleware
│   ├── models/         # Database models
│   ├── routes/         # API routes
│   └── utils/          # Utility functions
├── frontend/
│   ├── css/            # Stylesheets
│   ├── js/             # JavaScript files
│   ├── pages/          # HTML pages
│   └── components/     # Reusable components
├── public/             # Static files
└── server.js           # Main server file
```

## Adding New Features

### Backend (API Endpoint)

1. **Create Model** (if needed)
   ```javascript
   // backend/models/YourModel.js
   const mongoose = require('mongoose');
   
   const schema = new mongoose.Schema({
     // Define schema
   });
   
   module.exports = mongoose.model('YourModel', schema);
   ```

2. **Create Controller**
   ```javascript
   // backend/controllers/yourController.js
   const YourModel = require('../models/YourModel');
   
   const yourFunction = async (req, res) => {
     try {
       // Implementation
       res.json(data);
     } catch (error) {
       res.status(500).json({ message: error.message });
     }
   };
   
   module.exports = { yourFunction };
   ```

3. **Create Routes**
   ```javascript
   // backend/routes/yourRoutes.js
   const express = require('express');
   const router = express.Router();
   const { yourFunction } = require('../controllers/yourController');
   const { protect } = require('../middleware/auth');
   
   router.get('/', protect, yourFunction);
   
   module.exports = router;
   ```

4. **Register Routes**
   ```javascript
   // server.js
   const yourRoutes = require('./backend/routes/yourRoutes');
   app.use('/api/your-endpoint', yourRoutes);
   ```

### Frontend (Page/Feature)

1. **Create HTML Page**
   ```html
   <!-- frontend/pages/your-page.html -->
   <!DOCTYPE html>
   <html>
   <head>
     <link rel="stylesheet" href="/frontend/css/styles.css">
   </head>
   <body>
     <!-- Your content -->
     <script src="/frontend/js/app.js"></script>
     <script>
       // Your JavaScript
     </script>
   </body>
   </html>
   ```

2. **Add API Functions** (if needed)
   ```javascript
   // In frontend/js/app.js or separate file
   async function yourApiFunction() {
     return await apiRequest('/your-endpoint');
   }
   ```

## Reporting Issues

### Bug Reports
Include:
- Description of the bug
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots (if applicable)
- Environment (browser, OS, etc.)

### Feature Requests
Include:
- Clear description
- Use case
- Expected behavior
- Mock-ups (if applicable)

## Community

- Be respectful and inclusive
- Help others when possible
- Follow the code of conduct
- Ask questions if you're unsure

## License

By contributing, you agree that your contributions will be licensed under the ISC License.

## Questions?

Feel free to:
- Open an issue for questions
- Reach out to maintainers
- Join discussions in pull requests

Thank you for contributing to DriversApp! 🚗
