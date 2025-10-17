# Deployment Guide - DriversApp

This guide covers deploying the DriversApp to production environments.

## Prerequisites

- Node.js 14+ installed
- MongoDB instance (local or cloud like MongoDB Atlas)
- Stripe account for payment processing
- Domain name (optional)
- SSL certificate (for production)

## Environment Configuration

### Production Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
NODE_ENV=production
PORT=5000

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/drivers-app?retryWrites=true&w=majority

# Authentication
JWT_SECRET=your_very_secure_random_string_here_min_32_chars

# Stripe Payment
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_publishable_key

# Frontend URL (for CORS)
CLIENT_URL=https://yourdomain.com
```

## Deployment Options

### Option 1: Traditional VPS/Cloud Server (AWS, DigitalOcean, etc.)

#### 1. Server Setup

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install MongoDB (if hosting locally)
# See: https://docs.mongodb.com/manual/installation/

# Install PM2 for process management
sudo npm install -g pm2
```

#### 2. Application Deployment

```bash
# Clone repository
git clone https://github.com/sskevi/drivers-app.git
cd drivers-app

# Install dependencies
npm install --production

# Create .env file
nano .env
# Add your production environment variables

# Start application with PM2
pm2 start server.js --name drivers-app
pm2 save
pm2 startup
```

#### 3. Nginx Configuration

```bash
# Install Nginx
sudo apt install nginx

# Create Nginx configuration
sudo nano /etc/nginx/sites-available/drivers-app
```

Add the following configuration:

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/drivers-app /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### 4. SSL Certificate (Let's Encrypt)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal is set up automatically
sudo certbot renew --dry-run
```

### Option 2: Heroku

#### 1. Prepare Application

Create `Procfile` in root directory:
```
web: node server.js
```

#### 2. Deploy to Heroku

```bash
# Install Heroku CLI
# See: https://devcenter.heroku.com/articles/heroku-cli

# Login to Heroku
heroku login

# Create new app
heroku create your-app-name

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI=your_mongodb_uri
heroku config:set JWT_SECRET=your_jwt_secret
heroku config:set STRIPE_SECRET_KEY=your_stripe_key
heroku config:set STRIPE_PUBLISHABLE_KEY=your_stripe_pub_key

# Deploy
git push heroku main

# Open app
heroku open
```

### Option 3: Docker

#### 1. Create Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 5000

CMD ["node", "server.js"]
```

#### 2. Create docker-compose.yml

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=mongodb://mongo:27017/drivers-app
      - JWT_SECRET=${JWT_SECRET}
      - STRIPE_SECRET_KEY=${STRIPE_SECRET_KEY}
    depends_on:
      - mongo
    restart: unless-stopped

  mongo:
    image: mongo:6
    volumes:
      - mongo-data:/data/db
    restart: unless-stopped

volumes:
  mongo-data:
```

#### 3. Deploy with Docker

```bash
# Build and start
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

## MongoDB Atlas Setup (Cloud Database)

1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a new cluster (free tier available)
3. Configure network access (whitelist your IP or allow from anywhere)
4. Create database user with password
5. Get connection string and add to `.env`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/drivers-app
   ```

## Stripe Setup

1. Create account at https://stripe.com
2. Get API keys from Dashboard > Developers > API keys
3. For production, use live keys (pk_live_... and sk_live_...)
4. For testing, use test keys (pk_test_... and sk_test_...)
5. Configure webhooks for production (optional but recommended)

## Security Checklist

- [ ] Use strong JWT_SECRET (minimum 32 random characters)
- [ ] Enable HTTPS in production
- [ ] Use environment variables for sensitive data
- [ ] Enable CORS only for your domain
- [ ] Keep dependencies updated
- [ ] Enable rate limiting (add express-rate-limit)
- [ ] Set up proper error logging
- [ ] Configure MongoDB authentication
- [ ] Use Helmet.js for security headers
- [ ] Validate all inputs
- [ ] Implement CSRF protection

## Monitoring and Maintenance

### PM2 Monitoring

```bash
# View status
pm2 status

# View logs
pm2 logs drivers-app

# Restart application
pm2 restart drivers-app

# Monitor resources
pm2 monit
```

### MongoDB Backup

```bash
# Backup database
mongodump --uri="mongodb://localhost:27017/drivers-app" --out=/backup/$(date +%Y%m%d)

# Restore database
mongorestore --uri="mongodb://localhost:27017/drivers-app" /backup/20240101
```

### Application Updates

```bash
# Pull latest code
cd drivers-app
git pull origin main

# Install new dependencies
npm install --production

# Restart application
pm2 restart drivers-app
```

## Performance Optimization

1. **Enable Gzip Compression**
   ```javascript
   const compression = require('compression');
   app.use(compression());
   ```

2. **Add Caching Headers**
   ```javascript
   app.use(express.static('public', {
     maxAge: '1d'
   }));
   ```

3. **Database Indexing**
   - Add indexes to frequently queried fields
   - Use MongoDB Compass to analyze performance

4. **Use CDN for Static Assets**
   - Serve images, CSS, JS from CDN like Cloudflare

## Scaling

### Horizontal Scaling

1. **Load Balancer**: Use Nginx or cloud load balancer
2. **Multiple Instances**: Run multiple app instances
3. **Session Store**: Use Redis for session management
4. **Database**: Consider MongoDB replica sets

### Vertical Scaling

1. Increase server resources (CPU, RAM)
2. Optimize database queries
3. Enable database caching

## Troubleshooting

### Common Issues

1. **Connection Refused**
   - Check if MongoDB is running
   - Verify MONGODB_URI is correct
   - Check firewall settings

2. **CORS Errors**
   - Verify CLIENT_URL matches frontend domain
   - Check CORS configuration in server.js

3. **Authentication Failures**
   - Verify JWT_SECRET is set
   - Check token expiration
   - Ensure password hashing is working

### Logs

```bash
# PM2 logs
pm2 logs drivers-app --lines 100

# MongoDB logs
sudo tail -f /var/log/mongodb/mongod.log

# Nginx logs
sudo tail -f /var/log/nginx/error.log
```

## Support

For deployment issues, check:
- GitHub Issues: https://github.com/sskevi/drivers-app/issues
- Documentation: See README.md
- MongoDB Docs: https://docs.mongodb.com
- Stripe Docs: https://stripe.com/docs
