import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, setDoc, updateDoc, where } from 'firebase/firestore';
import { db } from '../lib/firebase';

// Smart environment detection for API URL
const getApiBaseUrl = () => {
  // Check if we have a custom API URL set
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // Auto-detect based on current environment
  const hostname = window.location.hostname;
  
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    // Local development - try to connect to local backend first
    return 'http://localhost:3001';
  } else if (hostname.includes('ltl-at')) {
    // Production environment - use production API
    return 'https://ltl-at-api.onrender.com';
  } else {
    // Fallback for other environments
    return 'https://ltl-at-api.onrender.com';
  }
};

const API_BASE_URL = getApiBaseUrl();

export const profileService = {
  // Test API connectivity
  async testConnection() {
    try {
      const response = await fetch(`${API_BASE_URL}/health`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error(`API not responding: ${response.status}`);
      }
      
      const result = await response.json();
      return result;
    } catch (error) {
      throw error;
    }
  },

  // Test CORS connection
  async testCors() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/test-cors`);
      const result = await response.json();
      return result;
    } catch (error) {
      throw error;
    }
  },

  // Check if user has completed onboarding
  async checkSetupStatus(userId) {
    try {
      if (!userId || typeof userId !== 'string') {
        return { setupCompleted: false };
      }

      const profileDoc = await getDoc(doc(db, 'profiles', userId));
      const setupCompleted = profileDoc.exists() ? profileDoc.data()?.setupCompleted || false : false;
      
      return { setupCompleted };
    } catch (error) {
      return { setupCompleted: false };
    }
  },

  // Get user profile
  async getProfile(userId) {
    try {
      if (!userId || typeof userId !== 'string') {
        return { profile: null };
      }

      const profileDoc = await getDoc(doc(db, 'profiles', userId));
      if (!profileDoc.exists()) {
        return { profile: null };
      }
      return { profile: profileDoc.data() };
    } catch (error) {
      return { profile: null };
    }
  },

  // Process documents to extract text
  async processDocuments(documents) {
    if (!documents || documents.length === 0) {
      return { 
        documentContext: '',
        processedFiles: 0,
        totalCharacters: 0
      };
    }

    try {
      const formData = new FormData();
      documents.forEach(file => {
        formData.append('documents', file);
      });

      const response = await fetch(`${API_BASE_URL}/api/process-documents`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to process documents: ${response.status} ${response.statusText}`);
      }
      
      const result = await response.json();
      return {
        documentContext: result.documentContext || '',
        processedFiles: result.processedFiles || documents.length,
        totalCharacters: result.totalCharacters || (result.documentContext || '').length,
        message: result.message || 'Documents processed successfully'
      };
    } catch (error) {
      throw new Error(`Failed to process documents: ${error.message}`);
    }
  },

  // Save profile data with document processing
  async saveProfile(profileData, documents = []) {
    try {
      if (!profileData.userId || typeof profileData.userId !== 'string') {
        throw new Error('Invalid or missing userId in profile data');
      }

      let documentContext = '';
      
      // Process documents if any
      if (documents && documents.length > 0) {
        const result = await this.processDocuments(documents);
        documentContext = result.documentContext || '';
      }

      // Prepare profile data for Firestore
      const profileWithContext = {
        ...profileData,
        documentContext,
        setupCompleted: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        subscription: profileData.subscription || 'free',
        automationStatus: 'active',
        emailSettings: {
          deliveryTime: '09:00',
          timezone: 'America/New_York',
          format: 'html'
        }
      };

      // Save to Firestore with retry logic
      let retryCount = 0;
      const maxRetries = 3;
      
      while (retryCount < maxRetries) {
        try {
          await setDoc(doc(db, 'profiles', profileData.userId), profileWithContext, { merge: true });
          break;
        } catch (firestoreError) {
          retryCount++;
          
          if (retryCount >= maxRetries) {
            throw new Error(`Failed to save to Firestore after ${maxRetries} attempts: ${firestoreError.message}`);
          }
          
          await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
        }
      }

      return { 
        message: 'Profile saved successfully',
        profile: profileWithContext
      };
    } catch (error) {
      throw new Error(`Failed to save profile: ${error.message}`);
    }
  },

  // Generate LinkedIn post
  async generatePost(userId, prompt, context = '') {
    try {
      if (!userId || typeof userId !== 'string') {
        throw new Error('Invalid userId provided');
      }

      // Get user profile from Firestore
      const profileDoc = await getDoc(doc(db, 'profiles', userId));
      
      if (!profileDoc.exists()) {
        throw new Error('Profile not found. Please complete onboarding first.');
      }

      const profileData = profileDoc.data();

      const response = await fetch(`${API_BASE_URL}/api/generate-post`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          prompt,
          context,
          profileData,
          documentContext: profileData.documentContext || ''
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to generate post: ${response.status} ${response.statusText} - ${errorText}`);
      }
      
      const result = await response.json();

      // Save generated post to Firestore
      const postData = {
        userId,
        content: result.post,
        prompt,
        context,
        createdAt: new Date(),
        status: 'draft',
        metadata: result.metadata,
        type: 'manual'
      };

      const postRef = await addDoc(collection(db, 'posts'), postData);

      return {
        ...result,
        postId: postRef.id
      };
    } catch (error) {
      throw error;
    }
  },

  // Enhanced test email with fallback for both local and production
  async sendTestEmail(userId, postContent, userEmail) {
    try {
      if (!userId || typeof userId !== 'string') {
        throw new Error('Invalid userId provided');
      }

      // First check if email service is available
      try {
        const healthResponse = await fetch(`${API_BASE_URL}/api/test-email-config`);
        const healthData = await healthResponse.json();
        
        if (!healthResponse.ok || !healthData.success) {
          // Always show fallback when email service is not configured
          return {
            success: false,
            message: 'Post generated successfully! Email service is not configured yet. Here\'s your content:',
            fallback: true,
            postContent
          };
        }
      } catch (healthError) {
        // If we can't even check health, assume email is not configured
        return {
          success: false,
          message: 'Post generated successfully! Email service is not available. Here\'s your content:',
          fallback: true,
          postContent
        };
      }

      // If health check passed, try to send email
      const response = await fetch(`${API_BASE_URL}/api/send-test-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          postContent,
          userEmail
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        
        // Handle email service not configured gracefully
        if (response.status === 500 && errorText.includes('Email service not configured')) {
          return {
            success: false,
            message: 'Post generated successfully! Email service is being configured. Here\'s your content:',
            fallback: true,
            postContent
          };
        }
        
        throw new Error(`Failed to send test email: ${response.status} ${response.statusText} - ${errorText}`);
      }
      
      const result = await response.json();
      return {
        success: true,
        ...result
      };
    } catch (error) {
      // Always provide fallback instead of failing
      return {
        success: false,
        message: 'Post generated successfully! Email delivery is temporarily unavailable. Here\'s your content:',
        fallback: true,
        postContent
      };
    }
  },

  async updateProfile(userId, updates) {
    try {
      if (!userId || typeof userId !== 'string') {
        throw new Error('Invalid userId provided');
      }

      const updateData = {
        ...updates,
        updatedAt: new Date()
      };

      await updateDoc(doc(db, 'profiles', userId), updateData);
      
      return { message: 'Profile updated successfully' };
    } catch (error) {
      throw error;
    }
  },

  async updateAutomationSettings(userId, settings) {
    try {
      if (!userId || typeof userId !== 'string') {
        throw new Error('Invalid userId provided');
      }

      const updateData = {
        automationStatus: settings.status,
        postFrequency: settings.frequency,
        emailSettings: settings.emailSettings,
        updatedAt: new Date()
      };

      await updateDoc(doc(db, 'profiles', userId), updateData);
      
      return { message: 'Automation settings updated successfully' };
    } catch (error) {
      throw error;
    }
  },

  async getPosts(userId) {
    try {
      if (!userId || typeof userId !== 'string') {
        throw new Error('Invalid userId provided');
      }
  
      const q = query(
        collection(db, 'posts'),
        where('userId', '==', userId)
      );
      
      const querySnapshot = await getDocs(q);
      const posts = [];
      
      querySnapshot.forEach((doc) => {
        posts.push({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate()
        });
      });

      // Sort in JavaScript as a temporary workaround if index is not created
      posts.sort((a, b) => {
        const dateA = a.createdAt || new Date(0);
        const dateB = b.createdAt || new Date(0);
        return dateB - dateA; // Sort descending
      });
  
      return { posts };
    } catch (error) {
      // If it's an index error, provide helpful message
      if (error.message?.includes('index')) {
        // Still try to return posts without ordering
        try {
          const simpleQuery = query(
            collection(db, 'posts'),
            where('userId', '==', userId)
          );
          const snapshot = await getDocs(simpleQuery);
          const posts = [];
          snapshot.forEach((doc) => {
            posts.push({
              id: doc.id,
              ...doc.data(),
              createdAt: doc.data().createdAt?.toDate()
            });
          });
          // Sort client-side
          posts.sort((a, b) => {
            const dateA = a.createdAt || new Date(0);
            const dateB = b.createdAt || new Date(0);
            return dateB - dateA;
          });
          return { posts };
        } catch (fallbackError) {
          return { posts: [] };
        }
      }
      
      return { posts: [] };
    }
  },

  async getSubscriptionInfo(userId) {
    try {
      if (!userId || typeof userId !== 'string') {
        throw new Error('Invalid userId provided');
      }
  
      const profileDoc = await getDoc(doc(db, 'profiles', userId));
      
      if (!profileDoc.exists()) {
        return { subscription: 'free', postsUsed: 0, postsLimit: 2 };
      }
  
      const profileData = profileDoc.data();
      const subscription = profileData.subscription || 'free';
      
      // Try to get posts count for current month
      let postsUsed = 0;
      
      try {
        const currentMonth = new Date();
        currentMonth.setDate(1);
        currentMonth.setHours(0, 0, 0, 0);
        
        // First try simple query without timestamp filter
        const allPostsQuery = query(
          collection(db, 'posts'),
          where('userId', '==', userId)
        );
        
        const allPostsSnapshot = await getDocs(allPostsQuery);
        
        // Filter by date in JavaScript
        postsUsed = 0;
        allPostsSnapshot.forEach((doc) => {
          const postData = doc.data();
          const createdAt = postData.createdAt?.toDate();
          if (createdAt && createdAt >= currentMonth) {
            postsUsed++;
          }
        });
        
      } catch (queryError) {
        // Default to 0 if query fails
        postsUsed = 0;
      }
      
      const limits = {
        free: 2,
        standard: 8,
        pro: 60
      };
      
      return {
        subscription,
        postsUsed,
        postsLimit: limits[subscription] || 2
      };
    } catch (error) {
      return { subscription: 'free', postsUsed: 0, postsLimit: 2 };
    }
  },

  async createPaymentIntent(userId, planId, amount) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/create-payment-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          currency: 'usd',
          planId,
          userId,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to create payment intent: ${response.status} ${response.statusText} - ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  async confirmPayment(paymentIntentId, userEmail, userName) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/confirm-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentIntentId,
          userEmail,
          userName,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to confirm payment: ${response.status} ${response.statusText} - ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  async upgradeSubscription(userId, newPlan) {
    try {
      if (!userId || typeof userId !== 'string') {
        throw new Error('Invalid userId provided');
      }

      const updateData = {
        subscription: newPlan,
        subscriptionDate: new Date(),
        updatedAt: new Date()
      };

      await updateDoc(doc(db, 'profiles', userId), updateData);
      
      return { message: 'Subscription updated successfully' };
    } catch (error) {
      throw error;
    }
  },

  async cancelSubscription(userId) {
    try {
      if (!userId || typeof userId !== 'string') {
        throw new Error('Invalid userId provided');
      }

      const updateData = {
        subscription: 'free',
        subscriptionCancelledAt: new Date(),
        updatedAt: new Date()
      };

      await updateDoc(doc(db, 'profiles', userId), updateData);
      
      return { message: 'Subscription cancelled successfully' };
    } catch (error) {
      throw error;
    }
  },

  async deleteAccount(userId) {
    try {
      if (!userId || typeof userId !== 'string') {
        throw new Error('Invalid userId provided');
      }
  
      // Step 1: Delete all user's posts
      const postsQuery = query(
        collection(db, 'posts'),
        where('userId', '==', userId)
      );
      
      const postsSnapshot = await getDocs(postsQuery);
      const deletePromises = [];
      
      postsSnapshot.forEach((doc) => {
        deletePromises.push(deleteDoc(doc.ref));
      });
      
      await Promise.all(deletePromises);
  
      // Step 2: Delete user profile
      await deleteDoc(doc(db, 'profiles', userId));
  
      // Step 3: Call backend to delete any server-side data (optional)
      try {
        const response = await fetch(`${API_BASE_URL}/api/delete-account`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId }),
        });
        
        if (!response.ok) {
          // Backend deletion failed, but Firestore data was deleted
        }
      } catch (backendError) {
        // Could not notify backend of deletion
      }
  
      return { 
        success: true,
        message: 'Account data deleted successfully' 
      };
    } catch (error) {
      throw new Error(`Failed to delete account data: ${error.message}`);
    }
  }
};