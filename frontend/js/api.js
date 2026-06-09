// frontend/js/api.js
// API Client untuk komunikasi dengan backend

class FinGlassAPI {
  constructor() {
    // API URL - ganti sesuai environment
    this.apiUrl = this.getApiUrl();
    this.token = this.getToken();
  }

  // Get API URL berdasarkan environment
  getApiUrl() {
    // Development: http://localhost:3001
    // Production: https://your-domain.vercel.app
    if (window.location.hostname === 'localhost') {
      return 'http://localhost:3001/api';
    } else {
      // Production - ganti dengan domain Vercel Anda
      return `${window.location.protocol}//${window.location.host}/api`;
    }
  }

  // Get token dari localStorage
  getToken() {
    return localStorage.getItem('token');
  }

  // Set token ke localStorage
  setToken(token) {
    if (token) {
      localStorage.setItem('token', token);
      this.token = token;
    }
  }

  // Remove token
  removeToken() {
    localStorage.removeItem('token');
    this.token = null;
  }

  // Get user email dari localStorage
  getUserEmail() {
    return localStorage.getItem('userEmail');
  }

  // Set user email
  setUserEmail(email) {
    localStorage.setItem('userEmail', email);
  }

  // Fetch helper dengan authentication
  async fetch(endpoint, options = {}) {
    const url = `${this.apiUrl}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };

    // Add authorization header jika ada token
    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers
      });

      const data = await response.json();

      // Handle 401 Unauthorized
      if (response.status === 401) {
        this.removeToken();
        // Redirect ke login
        window.location.href = '/login.html';
        return null;
      }

      if (!response.ok) {
        throw new Error(data.error?.message || 'API Error');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // ========== AUTH ENDPOINTS ==========

  /**
   * Sign Up user baru
   */
  async signup(email, password, fullName = null) {
    return this.fetch('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({
        email,
        password,
        fullName
      })
    });
  }

  /**
   * Login user
   */
  async login(email, password) {
    const response = await this.fetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email,
        password
      })
    });

    if (response?.session?.accessToken) {
      this.setToken(response.session.accessToken);
      this.setUserEmail(email);
    }

    return response;
  }

  /**
   * Logout user
   */
  async logout() {
    this.removeToken();
    return this.fetch('/auth/logout', {
      method: 'POST'
    });
  }

  /**
   * Get current user info
   */
  async getCurrentUser() {
    return this.fetch('/auth/me');
  }

  // ========== TRANSACTION ENDPOINTS ==========

  /**
   * Get all transactions
   * @param {Object} params - { month: 'YYYY-MM', type: 'income|expense', limit: 50, offset: 0 }
   */
  async getTransactions(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.fetch(`/transactions${queryString ? '?' + queryString : ''}`);
  }

  /**
   * Get single transaction
   */
  async getTransaction(id) {
    return this.fetch(`/transactions/${id}`);
  }

  /**
   * Create transaction
   */
  async createTransaction(data) {
    return this.fetch('/transactions', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  /**
   * Update transaction
   */
  async updateTransaction(id, data) {
    return this.fetch(`/transactions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  /**
   * Delete transaction
   */
  async deleteTransaction(id) {
    return this.fetch(`/transactions/${id}`, {
      method: 'DELETE'
    });
  }

  // ========== CATEGORY ENDPOINTS ==========

  /**
   * Get all categories
   */
  async getCategories() {
    return this.fetch('/categories');
  }

  /**
   * Get single category
   */
  async getCategory(id) {
    return this.fetch(`/categories/${id}`);
  }

  /**
   * Create category
   */
  async createCategory(data) {
    return this.fetch('/categories', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  /**
   * Update category
   */
  async updateCategory(id, data) {
    return this.fetch(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  /**
   * Delete category
   */
  async deleteCategory(id) {
    return this.fetch(`/categories/${id}`, {
      method: 'DELETE'
    });
  }

  // ========== REPORT ENDPOINTS ==========

  /**
   * Get monthly summary
   */
  async getMonthlySummary(month) {
    return this.fetch(`/reports/summary?month=${month}`);
  }

  /**
   * Get transactions by category
   */
  async getByCategory(month) {
    return this.fetch(`/reports/by-category?month=${month}`);
  }

  /**
   * Get trends (last 6 months)
   */
  async getTrends() {
    return this.fetch('/reports/trends');
  }

  /**
   * Export to Excel
   */
  async exportToExcel(month) {
    const token = this.getToken();
    const url = `${this.apiUrl}/reports/export?month=${month}`;

    try {
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Export failed');
      }

      // Get filename dari response header
      const filename = `FinGlass_Report_${month}.xlsx`;

      // Convert response ke blob dan download
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(downloadUrl);
      document.body.removeChild(a);

      return { message: 'Export successful' };
    } catch (error) {
      console.error('Export error:', error);
      throw error;
    }
  }

  // ========== UTILITY FUNCTIONS ==========

  /**
   * Check jika user sudah login
   */
  isLoggedIn() {
    return !!this.token;
  }

  /**
   * Redirect ke login jika tidak login
   */
  requireLogin() {
    if (!this.isLoggedIn()) {
      window.location.href = '/login.html';
    }
  }

  /**
   * Format currency ke IDR
   */
  static formatCurrency(amount) {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  }

  /**
   * Format date
   */
  static formatDate(date) {
    return new Date(date).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  /**
   * Get current month in YYYY-MM format
   */
  static getCurrentMonth() {
    const date = new Date();
    return date.toISOString().split('T')[0].slice(0, 7);
  }
}

// Initialize global API instance
const api = new FinGlassAPI();

// Export untuk menggunakan di modul lain (jika perlu)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = FinGlassAPI;
}
