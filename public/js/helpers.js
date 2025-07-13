const currentUser = window.currentUser;
    
// Cache cho kết quả kiểm tra quyền
const permissionCache = new Map();

function hasPermission(user, permission) {
    // Tạo key cho cache
    const cacheKey = `${user?.id}_${permission}`;
    
    // Kiểm tra cache và thời gian hết hạn
    if (permissionCache.has(cacheKey)) {
        const cached = permissionCache.get(cacheKey);
        const now = Date.now();
        if (cached.timestamp && now - cached.timestamp <= CACHE_EXPIRY_TIME) {
            return cached.result;
        }
        // Xóa cache đã hết hạn
        permissionCache.delete(cacheKey);
    }
    try {
        // Kiểm tra tham số đầu vào
        if (!permission || typeof permission !== 'string') {
            console.warn('hasPermission: Invalid permission parameter', permission);
            return false;
        }

        if (!user) {
            console.warn('hasPermission: User is not defined');
            return false;
        }

        if (!user.roles || !Array.isArray(user.roles)) {
            console.warn('hasPermission: User has no roles or roles is not an array', user);
            return false;
        }
        
        // Kiểm tra trong tất cả các vai trò của người dùng
        const result = user.roles.some(role => {
            if (!role || !Array.isArray(role.permissions)) {
                console.warn('hasPermission: Invalid role or permissions', role);
                return false;
            }

            return role.permissions.some(p => {
                if (!p || !p.name) {
                    console.warn('hasPermission: Invalid permission in role.permissions', p);
                    return false;
                }
                return p.name === permission;
            });
        });

        // Lưu kết quả và timestamp vào cache
        permissionCache.set(cacheKey, {
            result: result,
            timestamp: Date.now()
        });
        return result;
    } catch (error) {
        console.error('hasPermission: Error checking permission', {
            error,
            user: user?.id,
            permission,
            stack: error.stack
        });
        // Cache kết quả lỗi với thời gian ngắn hơn
        permissionCache.set(cacheKey, {
            result: false,
            timestamp: Date.now(),
            error: true
        });
        return false;
    }
}

// Xóa cache khi người dùng thay đổi
function clearPermissionCache(userId = null) {
    if (userId) {
        // Xóa cache cho user cụ thể
        for (const key of permissionCache.keys()) {
            if (key.startsWith(`${userId}_`)) {
                permissionCache.delete(key);
            }
        }
    } else {
        // Xóa toàn bộ cache
        permissionCache.clear();
    }
}

// Giới hạn kích thước cache để tránh memory leak
function limitCacheSize(maxSize = 1000) {
    if (permissionCache.size > maxSize) {
        const keys = Array.from(permissionCache.keys());
        const deleteCount = permissionCache.size - maxSize;
        keys.slice(0, deleteCount).forEach(key => permissionCache.delete(key));
    }
}
let dataTable;

// Kiểm tra và dọn dẹp cache định kỳ
const CACHE_CLEANUP_INTERVAL = 5 * 60 * 1000; // 5 phút
const MAX_CACHE_SIZE = 1000;
const CACHE_EXPIRY_TIME = 30 * 60 * 1000; // 30 phút

function cleanupCache() {
    const now = Date.now();
    for (const [key, value] of permissionCache.entries()) {
        if (!value.timestamp || now - value.timestamp > CACHE_EXPIRY_TIME) {
            permissionCache.delete(key);
        }
    }
    limitCacheSize(MAX_CACHE_SIZE);
}

// Thiết lập interval để dọn dẹp cache
setInterval(cleanupCache, CACHE_CLEANUP_INTERVAL);

document.addEventListener("DOMContentLoaded", function () {
    if (typeof initializeDataTable === 'function') {
        initializeDataTable();
    }
    // Dọn dẹp cache khi load trang
    cleanupCache();
});