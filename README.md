Here’s a more **professional, polished, and concise** version of your **RBAC MongoDB package documentation**. I’ve kept the structure clean, consistent, and developer-friendly, while ensuring it looks like a standard open-source library README.

---

# RBAC MongoDB

A **Role-Based Access Control (RBAC)** library with **MongoDB integration** for Node.js applications. Includes built-in support for **Express.js** and **Next.js** middleware.

## ✨ Features

* 🔐 **Full RBAC System** – Users, Roles, and Permissions management
* 🗄️ **MongoDB Integration** – Powered by **Mongoose**
* 🔑 **Access Key Authentication** – Header-based API authentication
* 🛡️ **Express Middleware** – Ready-to-use authorization middleware
* 📊 **Permission Validation** – Flexible strategies (ALL / ANY)
* 🚀 **Simple Setup** – Quick integration with minimal boilerplate

---

## 📦 Installation

```bash
npm install rbac-mongodb
```

---

## ⚡ Quick Start

### 1. Connect Database

```javascript
const { connectDB } = require('rbac-mongodb');

await connectDB('mongodb://localhost:27017/your-database');
```

### 2. Create Roles

```javascript
const { createRole } = require('rbac-mongodb');

const adminRole = await createRole('admin', [
  'user.create',
  'user.read',
  'user.update',
  'user.delete',
  'role.manage'
]);

const userRole = await createRole('user', [
  'user.read',
  'profile.update'
]);
```

### 3. Assign Roles

```javascript
const { assignRole } = require('rbac-mongodb');

await assignRole(userId, adminRole._id);
```

### 4. Generate Access Keys

```javascript
const { generateAccessKey } = require('rbac-mongodb');

const keys = await generateAccessKey(userId);
console.log(keys.accessKey, keys.secretKey);
```

### 5. Use Middleware (Express)

```javascript
const express = require('express');
const { authorize } = require('rbac-mongodb');

const app = express();

// Single permission
app.get('/admin/users',
  authorize('user.read'),
  (req, res) => res.json({ users: [], currentUser: req.user })
);

// Multiple permissions (ALL required)
app.post('/admin/users',
  authorize(['user.create', 'user.manage']),
  (req, res) => res.json({ message: 'User created' })
);

// Multiple permissions (ANY required)
app.get('/dashboard',
  authorize(['user.read', 'admin.read'], { strategy: 'ANY' }),
  (req, res) => res.json({ message: 'Dashboard data' })
);
```

---

## 📚 API Reference

### Database

* **`connectDB(uri, options)`** → Connect to MongoDB
* **`isDBConnected()`** → Check connection status

### Role Management

* **`createRole(name, permissions)`** → Create new role
* **`assignRole(userId, roleId)`** → Assign role to user
* **`findRoleByName(roleName)`** → Fetch role by name
* **`getAllRoles()`** → List all roles

### Permissions

* **`checkPermission(userId, permission)`** → Check user permission
* **`getUserPermissions(userId)`** → List all permissions for user
* **`getUserRoleInfo(userId)`** → Get user role + permissions info

### Access Keys

* **`generateAccessKey(userId, options)`** → Generate access/secret keys
* **`authenticateWithAccessKey(accessKey, secretKey)`** → Authenticate user
* **`getUserAccessKeys(userId, activeOnly)`** → Get active/all keys
* **`deactivateAccessKey(accessKey, userId)`** → Deactivate access key

### Middleware

* **`authorize(permission, options)`** → Permission-based middleware
* **`authorizeRole(role, options)`** → Role-based middleware
* **`optionalAuthorize(permission)`** → Optional (silent) middleware

---

## 🗄️ Database Models

### User

```javascript
{
  _id: ObjectId,
  email: String (unique, required),
  passwordHash: String (required),
  roleId: ObjectId (ref: 'Role', required),
  createdAt: Date,
  updatedAt: Date
}
```

### Role

```javascript
{
  _id: ObjectId,
  name: String (unique, required),
  permissions: [String] (required),
  createdAt: Date,
  updatedAt: Date
}
```

### AccessKey

```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: 'User', required),
  accessKey: String (unique, required),
  secretKey: String (required),
  createdAt: Date,
  isActive: Boolean (default: true),
  updatedAt: Date
}
```

---

## 🔑 Authentication Headers

```javascript
// fetch example
fetch('/api/protected', {
  headers: {
    'x-access-key': 'AK_your_key',
    'x-secret-key': 'SK_your_key'
  }
});
```

```javascript
// axios example
axios.get('/api/protected', {
  headers: {
    'x-access-key': accessKey,
    'x-secret-key': secretKey
  }
});
```

---

## ❌ Error Responses

### `401 Unauthorized`

```json
{ "error": "Missing access key or secret key", "code": "MISSING_CREDENTIALS" }
```

```json
{ "error": "Invalid access key or secret key", "code": "INVALID_CREDENTIALS" }
```

### `403 Forbidden`

```json
{
  "error": "Required permission: user.delete",
  "code": "INSUFFICIENT_PERMISSIONS",
  "userPermissions": ["user.read", "user.update"]
}
```

---

## 🚀 Complete Example

```javascript
const express = require('express');
const bcrypt = require('bcryptjs');
const {
  connectDB, createRole, findRoleByName,
  assignRole, generateAccessKey, authorize, User
} = require('rbac-mongodb');

const app = express();
app.use(express.json());

async function initializeApp() {
  await connectDB('mongodb://localhost:27017/rbac-demo');
  await createRole('admin', ['user.create','user.read','user.update','user.delete']);
  await createRole('user', ['user.read']);
  console.log('RBAC initialized');
}

// Registration route
app.post('/register', async (req, res) => {
  const { email, password } = req.body;
  const passwordHash = await bcrypt.hash(password, 10);
  const userRole = await findRoleByName('user');
  const user = new User({ email, passwordHash, roleId: userRole._id });
  const savedUser = await user.save();
  const keys = await generateAccessKey(savedUser._id);
  res.json({ message: 'Registered successfully', ...keys });
});

// Protected route
app.get('/api/users', authorize('user.read'), async (req, res) => {
  const users = await User.find().populate('roleId');
  res.json({ users, currentUser: req.user });
});

initializeApp().then(() => app.listen(3000, () => console.log('Server running on 3000')));
```

---

## 📄 License

[MIT](./LICENSE)

---

## 💬 Support

For issues or feature requests, please open an [issue](https://github.com/your-repo/rbac-mongodb/issues) on GitHub.

---

