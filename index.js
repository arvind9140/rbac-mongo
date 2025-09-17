/**
 * RBAC MongoDB Package
 * Role-Based Access Control with MongoDB integration
 * 
 * Main export file - saare functions aur middleware ko export karta hai
 */

// Database connection
const { connectDB, isDBConnected, disconnectDB } = require('./lib/database');

// Models
const models = require('./models');

// Role Management
const {
    createRole,
    assignRole,
    findRoleByName,
    updateRolePermissions,
    getAllRoles
} = require('./lib/roleManager');

// Permission Checking
const {
    checkPermission,
    getUserPermissions,
    getUserRoleInfo,
    checkMultiplePermissions,
    hasAnyPermission,
    hasAllPermissions
} = require('./lib/permissionChecker');

// Access Key Management
const {
    generateAccessKey,
    authenticateWithAccessKey,
    getUserAccessKeys,
    deactivateAccessKey,
    deactivateAllUserKeys,
    generateRandomKey,
    isAccessKeyExpired
} = require('./lib/accessKeyManager');

// Middleware
const {
    authorize,
    authorizeRole,
    optionalAuthorize,
    checkUserPermission,
    checkUserRole
} = require('./middleware/authorize');

/**
 * Main RBAC class - optional wrapper for easier usage
 */
class RBAC {
    constructor() {
        this.isConnected = false;
    }

    /**
     * Database se connect karta hai
     * @param {string} uri - MongoDB connection URI
     * @param {Object} options - Connection options
     */
    async connect(uri, options = {}) {
        await connectDB(uri, options);
        this.isConnected = isDBConnected();
        return this.isConnected;
    }

    /**
     * Database se disconnect karta hai
     */
    async disconnect() {
        await disconnectDB();
        this.isConnected = false;
    }

    /**
     * Connection status check karta hai
     */
    isDBConnected() {
        return isDBConnected();
    }

    // Role management methods
    async createRole(name, permissions) {
        return createRole(name, permissions);
    }

    async assignRole(userId, roleId) {
        return assignRole(userId, roleId);
    }

    async findRoleByName(roleName) {
        return findRoleByName(roleName);
    }

    async getAllRoles() {
        return getAllRoles();
    }

    // Permission checking methods
    async checkPermission(userId, permission) {
        return checkPermission(userId, permission);
    }

    async getUserPermissions(userId) {
        return getUserPermissions(userId);
    }

    async getUserRoleInfo(userId) {
        return getUserRoleInfo(userId);
    }

    // Access key methods
    async generateAccessKey(userId, options = {}) {
        return generateAccessKey(userId, options);
    }

    async authenticateWithAccessKey(accessKey, secretKey) {
        return authenticateWithAccessKey(accessKey, secretKey);
    }

    async deactivateAccessKey(accessKey, userId = null) {
        return deactivateAccessKey(accessKey, userId);
    }

    // Middleware methods
    authorize(permission, options = {}) {
        return authorize(permission, options);
    }

    authorizeRole(role, options = {}) {
        return authorizeRole(role, options);
    }

    optionalAuthorize(permission) {
        return optionalAuthorize(permission);
    }
}

// Direct function exports (recommended usage)
module.exports = {
    // Main RBAC class
    RBAC,

    // Database functions
    connectDB,
    isDBConnected,
    disconnectDB,

    // Models
    models,
    User: models.User,
    Role: models.Role,
    AccessKey: models.AccessKey,

    // Role management functions
    createRole,
    assignRole,
    findRoleByName,
    updateRolePermissions,
    getAllRoles,

    // Permission checking functions
    checkPermission,
    getUserPermissions,
    getUserRoleInfo,
    checkMultiplePermissions,
    hasAnyPermission,
    hasAllPermissions,

    // Access key management functions
    generateAccessKey,
    authenticateWithAccessKey,
    getUserAccessKeys,
    deactivateAccessKey,
    deactivateAllUserKeys,
    generateRandomKey,
    isAccessKeyExpired,

    // Middleware functions
    authorize,
    authorizeRole,
    optionalAuthorize,
    checkUserPermission,
    checkUserRole
};

// Default export bhi provide karo
module.exports.default = module.exports;
