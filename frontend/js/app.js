// API Base URL
const API_URL = 'http://localhost:5000/api';

// State Management
const state = {
    user: null,
    token: localStorage.getItem('token') || null,
    instructors: [],
    bookings: [],
};

// API Helper Functions
async function apiRequest(endpoint, options = {}) {
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (state.token) {
        headers.Authorization = `Bearer ${state.token}`;
    }

    try {
        const response = await fetch(`${API_URL}${endpoint}`, {
            ...options,
            headers,
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Request failed');
        }

        return data;
    } catch (error) {
        throw error;
    }
}

// Auth Functions
async function register(userData) {
    const data = await apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
    });
    
    state.token = data.token;
    state.user = data;
    localStorage.setItem('token', data.token);
    
    return data;
}

async function login(email, password) {
    const data = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
    });
    
    state.token = data.token;
    state.user = data;
    localStorage.setItem('token', data.token);
    
    return data;
}

function logout() {
    state.token = null;
    state.user = null;
    localStorage.removeItem('token');
    window.location.href = '/';
}

async function getCurrentUser() {
    if (!state.token) return null;
    
    try {
        const data = await apiRequest('/auth/profile');
        state.user = data;
        return data;
    } catch (error) {
        logout();
        return null;
    }
}

// Instructor Functions
async function getInstructors(filters = {}) {
    let endpoint = '/instructors';
    
    if (Object.keys(filters).length > 0) {
        const params = new URLSearchParams(filters);
        endpoint += `/search?${params.toString()}`;
    }
    
    const data = await apiRequest(endpoint);
    state.instructors = data.instructors || data;
    return state.instructors;
}

async function createInstructorProfile(profileData) {
    return await apiRequest('/instructors/profile', {
        method: 'POST',
        body: JSON.stringify(profileData),
    });
}

async function getInstructorProfile(userId) {
    return await apiRequest(`/instructors/profile/${userId}`);
}

// Booking Functions
async function createBooking(bookingData) {
    return await apiRequest('/bookings', {
        method: 'POST',
        body: JSON.stringify(bookingData),
    });
}

async function getMyBookings() {
    const data = await apiRequest('/bookings');
    state.bookings = data;
    return data;
}

async function updateBookingStatus(bookingId, status) {
    return await apiRequest(`/bookings/${bookingId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
    });
}

// Review Functions
async function createReview(reviewData) {
    return await apiRequest('/reviews', {
        method: 'POST',
        body: JSON.stringify(reviewData),
    });
}

async function getInstructorReviews(instructorId) {
    return await apiRequest(`/reviews/instructor/${instructorId}`);
}

// UI Helper Functions
function showLoading(containerId) {
    const container = document.getElementById(containerId);
    if (container) {
        container.innerHTML = `
            <div class="loading">
                <div class="spinner"></div>
                <p class="mt-2">Loading...</p>
            </div>
        `;
    }
}

function showError(containerId, message) {
    const container = document.getElementById(containerId);
    if (container) {
        container.innerHTML = `
            <div class="empty-state">
                <h3>Error</h3>
                <p class="mt-2">${message}</p>
            </div>
        `;
    }
}

function showEmptyState(containerId, message) {
    const container = document.getElementById(containerId);
    if (container) {
        container.innerHTML = `
            <div class="empty-state">
                <p>${message}</p>
            </div>
        `;
    }
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
}

function formatPrice(price) {
    return `$${price.toFixed(2)}`;
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 2rem;
        background: ${type === 'success' ? 'var(--success-color)' : 'var(--danger-color)'};
        color: white;
        border-radius: 5px;
        box-shadow: var(--shadow);
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Modal Functions
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
    }
}

// Initialize app
async function initApp() {
    if (state.token) {
        await getCurrentUser();
        updateNavigation();
    }
}

function updateNavigation() {
    const navAuth = document.getElementById('nav-auth');
    if (!navAuth) return;
    
    if (state.user) {
        navAuth.innerHTML = `
            <li><span>Hello, ${state.user.name}</span></li>
            ${state.user.role === 'instructor' ? '<li><a href="/dashboard.html">Dashboard</a></li>' : ''}
            ${state.user.role === 'learner' ? '<li><a href="/my-bookings.html">My Bookings</a></li>' : ''}
            <li><button class="btn btn-sm btn-secondary" onclick="logout()">Logout</button></li>
        `;
    } else {
        navAuth.innerHTML = `
            <li><a href="/login.html">Login</a></li>
            <li><button class="btn btn-sm btn-primary" onclick="window.location.href='/register.html'">Sign Up</button></li>
        `;
    }
}

// Export functions for use in other scripts
window.app = {
    state,
    register,
    login,
    logout,
    getCurrentUser,
    getInstructors,
    createInstructorProfile,
    getInstructorProfile,
    createBooking,
    getMyBookings,
    updateBookingStatus,
    createReview,
    getInstructorReviews,
    showLoading,
    showError,
    showEmptyState,
    formatDate,
    formatPrice,
    showNotification,
    openModal,
    closeModal,
    initApp,
    updateNavigation,
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initApp();
});
