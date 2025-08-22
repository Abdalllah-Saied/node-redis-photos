# Redis Photo Cache API

A Node.js Express server that demonstrates Redis caching for photo data fetched from external APIs. This project shows how to implement efficient caching strategies to improve API performance and reduce external API calls.

## 🚀 Features

- **Express.js Server**: RESTful API endpoints for photo management
- **Redis Caching**: Intelligent caching with configurable expiration times
- **External API Integration**: Fetches data from JSONPlaceholder API
- **CORS Support**: Cross-origin request handling
- **Error Handling**: Comprehensive error handling and logging
- **Cache-First Strategy**: Checks Redis before making external API calls

## 🛠️ Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Redis** - In-memory data store for caching
- **Axios** - HTTP client for external API calls
- **CORS** - Cross-origin resource sharing middleware

## 📋 Prerequisites

Before running this project, make sure you have:

- **Node.js** (v14 or higher)
- **Redis** server running locally or remotely
- **npm** or **yarn** package manager

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Abdalllah-Saied/node-redis-photos.git
   cd node-redis-photos
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start Redis server**
   ```bash
   # On Ubuntu/Debian
   sudo systemctl start redis-server
   
   # On macOS with Homebrew
   brew services start redis
   
   # Or start manually
   redis-server
   ```

4. **Start the application**
   ```bash
   # Development mode with auto-restart
   npm run dev
   
   # Production mode
   npm start
   ```

## 🔧 Configuration

The server runs on **port 3000** by default. You can modify this in `server.js`.

**Redis Configuration:**
- Default connection: `localhost:6379`
- Cache expiration: 3600 seconds (1 hour)
- Modify `DEFAULT_EXPIRATION` in `server.js` to change cache duration

## 📡 API Endpoints

### 1. Get All Photos
```http
GET /photos
```

**Query Parameters:**
- `albumId` (optional): Filter photos by album ID

**Example:**
```bash
# Get all photos
curl http://localhost:3000/photos

# Get photos from specific album
curl "http://localhost:3000/photos?albumId=1"
```

**Response:**
```json
[
  {
    "albumId": 1,
    "id": 1,
    "title": "accusamus beatae ad facilis cum similique qui sunt",
    "url": "https://via.placeholder.com/600/92c952",
    "thumbnailUrl": "https://via.placeholder.com/150/92c952"
  }
]
```

### 2. Get Photo by ID
```http
GET /photos/:id
```

**Example:**
```bash
curl http://localhost:3000/photos/1
```

**Response:**
```json
{
  "albumId": 1,
  "id": 1,
  "title": "accusamus beatae ad facilis cum similique qui sunt",
  "url": "https://via.placeholder.com/600/92c952",
  "thumbnailUrl": "https://via.placeholder.com/150/92c952"
}
```

## 💾 Caching Strategy

The application implements a **cache-first strategy**:

1. **First Request**: Fetches data from external API and caches it in Redis
2. **Subsequent Requests**: Returns cached data from Redis (much faster)
3. **Cache Expiration**: Automatically refreshes data after expiration time
4. **Cache Keys**: 
   - All photos: `photos`
   - Individual photos: `photo:{id}`

## 🔍 Cache Monitoring

Check Redis cache status:

```bash
# Connect to Redis CLI
redis-cli

# List all keys
keys *

# Get cached photos data
get photos

# Check TTL (time to live)
ttl photos
```

## 📊 Performance Benefits

- **First Request**: ~200-500ms (external API call)
- **Cached Requests**: ~1-5ms (Redis lookup)
- **Bandwidth Savings**: Reduced external API calls
- **Scalability**: Handles multiple concurrent requests efficiently

## 🚨 Error Handling

The API includes comprehensive error handling:

- **API Failures**: Graceful fallback with error messages
- **Redis Connection Issues**: Logs errors without breaking the application
- **Invalid Requests**: Proper HTTP status codes and error responses
- **Timeout Protection**: 10-second timeout for external API calls

## 🧪 Testing

Test the API endpoints:

```bash
# Test server health
curl http://localhost:3000/test

# Test photo endpoints
curl http://localhost:3000/photos
curl http://localhost:3000/photos/1

# Test with query parameters
curl "http://localhost:3000/photos?albumId=1"
```

## 🔧 Development

### Auto-restart with Nodemon
```bash
npm run dev
```

### Manual restart
```bash
npm start
```

### View logs
```bash
# Check Redis connection
redis-cli ping

# Monitor Redis operations
redis-cli monitor
```

## 📁 Project Structure

```
node-redis-photos/
├── server.js          # Main server file
├── package.json       # Dependencies and scripts
├── .gitignore         # Git ignore rules
├── README.md          # This file
└── node_modules/      # Dependencies (not in git)
```

## 🌟 Key Features Explained

### Cache-First Strategy
```javascript
// Check cache first
const cachedData = await redisClient.get(key);
if (cachedData) {
  console.log("Cache HIT");
  return res.json(JSON.parse(cachedData));
}

// Fetch from API if cache miss
console.log("Cache MISS");
const { data } = await axios.get(apiUrl);
await redisClient.setEx(key, expiration, JSON.stringify(data));
```

### Redis Connection
```javascript
const redisClient = redis.createClient();
redisClient.connect().catch(console.error);

redisClient.on('connect', () => {
  console.log('Connected to Redis');
});
```

## 🚀 Deployment

### Environment Variables
```bash
# Redis connection
REDIS_URL=redis://localhost:6379
REDIS_HOST=localhost
REDIS_PORT=6379

# Server configuration
PORT=3000
NODE_ENV=production
```

### Production Considerations
- Use Redis cluster for high availability
- Implement connection pooling
- Add monitoring and logging
- Use environment variables for configuration
- Implement rate limiting
- Add authentication if needed

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- **JSONPlaceholder**: For providing the test photo API
- **Redis**: For the excellent in-memory data store
- **Express.js**: For the robust web framework
- **Node.js**: For the amazing runtime environment

**Happy Caching! 🚀**
