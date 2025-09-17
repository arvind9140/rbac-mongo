# Testing Guide for RBAC MongoDB Package

Is guide mein RBAC package ko test karne ke complete instructions hain.

## Prerequisites

### 1. MongoDB Setup
```bash
# MongoDB install karo (if not already installed)
# Windows
# Download from: https://www.mongodb.com/try/download/community

# macOS
brew install mongodb-community

# Ubuntu/Debian
sudo apt install mongodb

# MongoDB service start karo
# Windows: MongoDB Compass ya Service se start karo
# macOS/Linux:
brew services start mongodb-community
# ya
sudo systemctl start mongod
```

### 2. Node.js Dependencies
```bash
# Package dependencies install karo
npm install

# Development dependencies bhi install karo
npm install --dev
```

## Running Tests

### Quick Test (Recommended)
```bash
# Saare tests ek saath run karo
npm test

# Ya manual test script run karo
npm run test:manual
```

### Detailed Testing Options

#### 1. Unit Tests (Jest)
```bash
# Basic unit tests
npm test

# Watch mode (development ke liye)
npm run test:watch

# Coverage report ke saath
npm run test:coverage
```

#### 2. Manual Integration Test
```bash
# Complete integration test
npm run test:manual

# Specific function test
node test/manual-test.js specific createRole
node test/manual-test.js specific checkPermission
node test/manual-test.js specific generateAccessKey
node test/manual-test.js specific authenticate
```

#### 3. Custom Test Runner
```bash
# Complete test suite
node test/run-tests.js

# Unit tests only
node test/run-tests.js --unit-only

# Manual tests only  
node test/run-tests.js --manual-only

# With coverage
node test/run-tests.js --coverage

# Stop on first failure
node test/run-tests.js --stop-on-failure
```

## Test Structure

### Unit Tests (`test/*.test.js`)
- **database.test.js** - Database connection functions
- **roleManager.test.js** - Role creation and management
- **permissionChecker.test.js** - Permission validation
- **accessKeyManager.test.js** - Access key generation and auth
- **middleware.test.js** - Express middleware testing
- **integration.test.js** - End-to-end workflow testing

### Manual Tests (`test/manual-test.js`)
- Complete RBAC workflow verification
- Performance testing
- Real database operations
- Error scenario testing

## Testing Different Scenarios

### 1. Basic Functionality Test
```bash
npm run test:manual
```
Ye test karta hai:
- ✅ Database connection
- ✅ Role creation (admin, user, moderator)
- ✅ User creation with roles
- ✅ Access key generation
- ✅ Permission checking
- ✅ Authentication with access keys
- ✅ Role assignment
- ✅ Performance (1000 permission checks)

### 2. Express Middleware Test
```bash
npm test -- --testNamePattern="middleware"
```
Ye test karta hai:
- ✅ Header-based authentication
- ✅ Single permission authorization
- ✅ Multiple permission strategies (ALL/ANY)
- ✅ Role-based authorization
- ✅ Optional authorization
- ✅ Error handling

### 3. Database Operations Test
```bash
npm test -- --testNamePattern="database|roleManager|accessKeyManager"
```
Ye test karta hai:
- ✅ MongoDB connection/disconnection
- ✅ Role CRUD operations
- ✅ User role assignment
- ✅ Access key lifecycle
- ✅ Key deactivation

### 4. Permission System Test
```bash
npm test -- --testNamePattern="permissionChecker"
```
Ye test karta hai:
- ✅ Single permission checks
- ✅ Multiple permission checks
- ✅ User permission listing
- ✅ Role information retrieval
- ✅ Edge cases and error handling

## Expected Test Results

### Successful Test Output
```
🧪 Starting Manual RBAC Tests

==============================

1️⃣ Testing Database Connection...
✅ Database connected successfully

2️⃣ Testing Role Creation...
✅ Admin role created: admin
✅ User role created: user
✅ Moderator role created: moderator

3️⃣ Testing User Creation...
✅ Admin user created: admin@manual-test.com
✅ Normal user created: user@manual-test.com
✅ Moderator user created: moderator@manual-test.com

4️⃣ Testing Access Key Generation...
✅ Admin access keys generated
   Access Key: AK_1234567890abcdef...
   Secret Key: SK_1234567890abcdef...

5️⃣ Testing Permission Checking...
✅ Admin Permissions:
   user.create: ✅
   user.read: ✅
   user.delete: ✅
   role.manage: ✅
✅ User Permissions:
   user.create: ❌
   user.read: ✅
   user.delete: ❌
   profile.update: ✅

... (more test output)

🎉 All Manual Tests Completed Successfully!
```

### Jest Unit Test Output
```
 PASS  test/database.test.js
 PASS  test/roleManager.test.js
 PASS  test/permissionChecker.test.js
 PASS  test/accessKeyManager.test.js
 PASS  test/middleware.test.js
 PASS  test/integration.test.js

Test Suites: 6 passed, 6 total
Tests:       XX passed, XX total
Snapshots:   0 total
Time:        X.XXXs
```

## Troubleshooting

### Common Issues

#### 1. MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution:**
- MongoDB service start karo
- Connection string check karo
- Firewall settings verify karo

#### 2. Jest Timeout Error
```
Timeout - Async callback was not invoked within the 5000 ms timeout
```
**Solution:**
- MongoDB memory server start hone mein time lagta hai
- Jest timeout already 30s set hai
- Internet connection check karo

#### 3. Duplicate Key Error
```
MongoServerError: E11000 duplicate key error
```
**Solution:**
- Test database clear karo: `db.dropDatabase()`
- Ya test script restart karo (auto cleanup hoti hai)

#### 4. Permission Denied
```
MongoError: not authorized on test to execute command
```
**Solution:**
- MongoDB authentication check karo
- User permissions verify karo
- Connection string mein credentials add karo

### Debug Mode

#### Enable Verbose Logging
```bash
# Jest debug mode
DEBUG=* npm test

# Manual test with debug
DEBUG=rbac* npm run test:manual
```

#### Individual Test Files
```bash
# Specific test file run karo
npx jest test/roleManager.test.js

# Single test case
npx jest test/roleManager.test.js -t "should create a new role"

# Watch mode for development
npx jest test/roleManager.test.js --watch
```

## Performance Testing

### Benchmark Results (Expected)
- **Single permission check**: < 10ms
- **1000 permission checks**: < 5000ms (5s)
- **Access key generation**: < 100ms
- **Authentication**: < 50ms

### Load Testing
```bash
# Performance test manual run
node test/manual-test.js
# Check the "Performance Test" section output
```

## Test Data Cleanup

Tests automatically clean up after themselves, but manual cleanup:

```javascript
// MongoDB shell
use rbac-manual-test
db.dropDatabase()

use rbac-test  
db.dropDatabase()
```

## CI/CD Integration

### GitHub Actions Example
```yaml
name: Test RBAC Package
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    services:
      mongodb:
        image: mongo:4.4
        ports:
          - 27017:27017
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '16'
      - run: npm install
      - run: npm test
      - run: npm run test:coverage
```

### Docker Testing
```dockerfile
FROM node:16
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
CMD ["npm", "test"]
```

## Next Steps

After successful testing:

1. ✅ **Package Ready** - Aap package use kar sakte hain
2. 📦 **NPM Publish** - `npm publish` se package publish karo  
3. 📖 **Documentation** - README.md follow karo for usage
4. 🔧 **Integration** - Apne project mein integrate karo
5. 🚀 **Production** - Production environment mein deploy karo

Happy Testing! 🎉
