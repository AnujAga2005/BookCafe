// API Service for Backend Integration

const API_URL = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) || 'http://localhost:5001';

// Helper function for API calls
async function apiCall(endpoint: string, options: RequestInit = {}) {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'API request failed');
    }

    return data;
  } catch (error: any) {
    // Check if it's a network error (backend not reachable)
    if (error.message === 'Failed to fetch' || error.name === 'TypeError') {
      throw new Error(
        `Cannot connect to backend server at ${API_URL}. Please ensure the backend is running on port 5001.`
      );
    }
    throw error;
  }
}

export const api = {
  // ============ Auth Endpoints ============
  auth: {
    register: async (userData: {
      email: string;
      password: string;
      username: string;
      displayName: string;
    }) => {
      return apiCall('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      });
    },

    login: async (email: string, password: string) => {
      return apiCall('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
    },

    logout: async () => {
      return apiCall('/api/auth/logout', {
        method: 'POST',
      });
    },

    getMe: async () => {
      return apiCall('/api/auth/me');
    },

    checkStatus: async () => {
      return apiCall('/api/auth/status');
    },

    googleLogin: () => {
      window.location.href = `${API_URL}/api/auth/google`;
    },
  },

  // ============ User Endpoints ============
  users: {
    getProfile: async (username: string) => {
      return apiCall(`/api/users/${username}`);
    },

    updateProfile: async (updates: {
      displayName?: string;
      bio?: string;
      favoriteGenres?: string[];
      readingGoal?: number;
      avatar?: string;
    }) => {
      return apiCall('/api/users/profile', {
        method: 'PUT',
        body: JSON.stringify(updates),
      });
    },

    followUser: async (userId: string) => {
      return apiCall(`/api/users/${userId}/follow`, {
        method: 'POST',
      });
    },

    unfollowUser: async (userId: string) => {
      return apiCall(`/api/users/${userId}/unfollow`, {
        method: 'POST',
      });
    },

    addCurrentlyReading: async (book: {
      bookId: string;
      title: string;
      author: string;
      coverImage: string;
      pages?: number;
    }) => {
      return apiCall('/api/users/reading/current', {
        method: 'POST',
        body: JSON.stringify(book),
      });
    },

    updateProgress: async (bookId: string, progress: number) => {
      return apiCall(`/api/users/reading/current/${bookId}`, {
        method: 'PUT',
        body: JSON.stringify({ progress }),
      });
    },

    markAsRead: async (book: {
      bookId: string;
      title: string;
      author: string;
      coverImage: string;
      rating?: number;
      review?: string;
      pages?: number;
    }) => {
      return apiCall('/api/users/reading/finished', {
        method: 'POST',
        body: JSON.stringify(book),
      });
    },

    addToWishlist: async (book: {
      bookId: string;
      title: string;
      author: string;
      coverImage: string;
      pages?: number;
    }) => {
      return apiCall('/api/users/reading/wishlist', {
        method: 'POST',
        body: JSON.stringify(book),
      });
    },

    removeFromCurrentlyReading: async (bookId: string) => {
      return apiCall(`/api/users/reading/current/${bookId}`, {
        method: 'DELETE',
      });
    },

    removeFromFinished: async (bookId: string) => {
      return apiCall(`/api/users/reading/finished/${bookId}`, {
        method: 'DELETE',
      });
    },

    removeFromWishlist: async (bookId: string) => {
      return apiCall(`/api/users/reading/wishlist/${bookId}`, {
        method: 'DELETE',
      });
    },
  },

  // ============ User-specific Endpoints ============
  user: {
    updateStreak: async () => {
      return apiCall('/api/users/streak/update', {
        method: 'POST',
      });
    },

    calculateAvgRating: async () => {
      return apiCall('/api/users/rating/calculate', {
        method: 'POST',
      });
    },
  },

  // ============ Post Endpoints ============
  posts: {
    getFeed: async (page = 1, limit = 20) => {
      return apiCall(`/api/posts/feed?page=${page}&limit=${limit}`);
    },

    getExplore: async (page = 1, limit = 20, type?: string) => {
      const typeParam = type ? `&type=${type}` : '';
      return apiCall(`/api/posts/explore?page=${page}&limit=${limit}${typeParam}`);
    },

    getUserPosts: async (username: string) => {
      return apiCall(`/api/posts/user/${username}`);
    },

    createPost: async (postData: {
      content: string;
      type: 'review' | 'update' | 'recommendation' | 'discussion';
      book?: {
        bookId: string;
        title: string;
        author: string;
        coverImage: string;
      };
      rating?: number;
      progress?: {
        current: number;
        total: number;
      };
      club?: string;
      tags?: string[];
    }) => {
      return apiCall('/api/posts', {
        method: 'POST',
        body: JSON.stringify(postData),
      });
    },

    likePost: async (postId: string) => {
      return apiCall(`/api/posts/${postId}/like`, {
        method: 'POST',
      });
    },

    unlikePost: async (postId: string) => {
      return apiCall(`/api/posts/${postId}/unlike`, {
        method: 'POST',
      });
    },

    addComment: async (postId: string, content: string) => {
      return apiCall(`/api/posts/${postId}/comment`, {
        method: 'POST',
        body: JSON.stringify({ content }),
      });
    },

    deletePost: async (postId: string) => {
      return apiCall(`/api/posts/${postId}`, {
        method: 'DELETE',
      });
    },
  },

  // ============ Club Endpoints ============
  clubs: {
    getAll: async (category?: string, search?: string) => {
      const params = new URLSearchParams();
      if (category) params.append('category', category);
      if (search) params.append('search', search);
      const queryString = params.toString();
      return apiCall(`/api/clubs${queryString ? '?' + queryString : ''}`);
    },

    getById: async (clubId: string) => {
      return apiCall(`/api/clubs/${clubId}`);
    },

    create: async (clubData: {
      name: string;
      description: string;
      coverImage?: string;
      category?: string;
      schedule?: 'weekly' | 'bi-weekly' | 'monthly';
      isPrivate?: boolean;
      rules?: string[];
      tags?: string[];
    }) => {
      return apiCall('/api/clubs', {
        method: 'POST',
        body: JSON.stringify(clubData),
      });
    },

    join: async (clubId: string) => {
      return apiCall(`/api/clubs/${clubId}/join`, {
        method: 'POST',
      });
    },

    leave: async (clubId: string) => {
      return apiCall(`/api/clubs/${clubId}/leave`, {
        method: 'POST',
      });
    },

    update: async (clubId: string, updates: any) => {
      return apiCall(`/api/clubs/${clubId}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      });
    },

    delete: async (clubId: string) => {
      return apiCall(`/api/clubs/${clubId}`, {
        method: 'DELETE',
      });
    },
  },

  // ============ Book Endpoints ============
  books: {
    search: async (query: string, page = 1, limit = 20) => {
      return apiCall(`/api/books/search?query=${encodeURIComponent(query)}&page=${page}&limit=${limit}`);
    },

    getById: async (bookId: string) => {
      return apiCall(`/api/books/${bookId}`);
    },

    getTrending: async () => {
      return apiCall('/api/books/trending');
    },
  },
};