import { addDoc, collection, doc, getDoc, getDocs, orderBy, query, setDoc, updateDoc, where } from 'firebase/firestore';
import { db } from '../lib/firebase';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const profileService = {
  // Check if user has completed onboarding
  async checkSetupStatus(userId) {
    try {
      if (!userId || typeof userId !== 'string') {
        console.error('Invalid userId provided:', userId);
        return { setupCompleted: false };
      }

      console.log('Checking setup status for userId:', userId);
      
      const profileDoc = await getDoc(doc(db, 'profiles', userId));
      const setupCompleted = profileDoc.exists() ? profileDoc.data()?.setupCompleted || false : false;
      
      console.log('Setup status result:', setupCompleted);
      return { setupCompleted };
    } catch (error) {
      console.error('Error checking setup status:', error);
      return { setupCompleted: false };
    }
  },

  // Get user profile
  async getProfile(userId) {
    try {
      if (!userId || typeof userId !== 'string') {
        console.error('Invalid userId provided:', userId);
        return { profile: null };
      }

      const profileDoc = await getDoc(doc(db, 'profiles', userId));
      if (!profileDoc.exists()) {
        return { profile: null };
      }
      return { profile: profileDoc.data() };
    } catch (error) {
      console.error('Error fetching profile:', error);
      return { profile: null };
    }
  },

  // Process documents to extract text
  async processDocuments(documents) {
    if (!documents || documents.length === 0) {
      return { documentContext: '' };
    }

    try {
      console.log('Processing documents:', documents.length);
      
      const formData = new FormData();
      documents.forEach(file => {
        console.log('Adding file to FormData:', file.name, file.type, file.size);
        formData.append('documents', file);
      });

      console.log('Sending request to:', `${API_BASE_URL}/api/process-documents`);
      
      const response = await fetch(`${API_BASE_URL}/api/process-documents`, {
        method: 'POST',
        body: formData,
      });

      console.log('Document processing response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Document processing failed:', errorText);
        throw new Error(`Failed to process documents: ${response.status} ${response.statusText}`);
      }
      
      const result = await response.json();
      console.log('Document processing result:', result);
      return result;
    } catch (error) {
      console.error('Error processing documents:', error);
      return { documentContext: '' };
    }
  },

  // Save profile data with document processing
  async saveProfile(profileData, documents = []) {
    try {
      if (!profileData.userId || typeof profileData.userId !== 'string') {
        throw new Error('Invalid or missing userId in profile data');
      }

      console.log('Starting profile save for userId:', profileData.userId);

      let documentContext = '';
      
      // Process documents if any
      if (documents && documents.length > 0) {
        console.log('Processing documents...');
        const result = await this.processDocuments(documents);
        documentContext = result.documentContext || '';
        console.log('Document processing complete, context length:', documentContext.length);
      }

      // Prepare profile data for Firestore
      const profileWithContext = {
        ...profileData,
        documentContext,
        setupCompleted: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        subscription: profileData.subscription || 'free', // Default to free plan
        automationStatus: 'active', // Default automation status
        emailSettings: {
          deliveryTime: '09:00',
          timezone: 'America/New_York',
          format: 'html'
        }
      };

      console.log('Saving to Firestore with data:', {
        userId: profileWithContext.userId,
        setupCompleted: profileWithContext.setupCompleted,
        hasDocumentContext: !!profileWithContext.documentContext,
        documentContextLength: profileWithContext.documentContext?.length || 0
      });

      // Save to Firestore with retry logic
      let retryCount = 0;
      const maxRetries = 3;
      
      while (retryCount < maxRetries) {
        try {
          await setDoc(doc(db, 'profiles', profileData.userId), profileWithContext, { merge: true });
          console.log('Profile saved successfully to Firestore');
          break;
        } catch (firestoreError) {
          retryCount++;
          console.error(`Firestore save attempt ${retryCount} failed:`, firestoreError);
          
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
      console.error('Error saving profile:', error);
      throw new Error(`Failed to save profile: ${error.message}`);
    }
  },

  // Update profile settings
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
      
      console.log('Profile updated successfully');
      return { message: 'Profile updated successfully' };
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  },

  // Update automation settings
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
      
      console.log('Automation settings updated successfully');
      return { message: 'Automation settings updated successfully' };
    } catch (error) {
      console.error('Error updating automation settings:', error);
      throw error;
    }
  },

  // Generate LinkedIn post
  async generatePost(userId, prompt, context = '') {
    try {
      if (!userId || typeof userId !== 'string') {
        throw new Error('Invalid userId provided');
      }

      console.log('Generating post for userId:', userId);

      // Get user profile from Firestore
      const profileDoc = await getDoc(doc(db, 'profiles', userId));
      
      if (!profileDoc.exists()) {
        throw new Error('Profile not found. Please complete onboarding first.');
      }

      const profileData = profileDoc.data();
      console.log('Found profile data for post generation');

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
        type: 'manual' // vs 'automated' for scheduled posts
      };

      const postRef = await addDoc(collection(db, 'posts'), postData);
      console.log('Post saved with ID:', postRef.id);

      return {
        ...result,
        postId: postRef.id
      };
    } catch (error) {
      console.error('Error generating post:', error);
      throw error;
    }
  },

  // Get user posts from Firestore
  async getPosts(userId) {
    try {
      if (!userId || typeof userId !== 'string') {
        throw new Error('Invalid userId provided');
      }

      const q = query(
        collection(db, 'posts'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
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

      return { posts };
    } catch (error) {
      console.error('Error fetching posts:', error);
      return { posts: [] };
    }
  },

  // Send test email with generated post
  async sendTestEmail(userId, postContent, userEmail) {
    try {
      if (!userId || typeof userId !== 'string') {
        throw new Error('Invalid userId provided');
      }

      const response = await fetch(`${API_BASE_URL}/api/send-test-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          postContent,
          userEmail // Pass the user's actual email
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to send test email: ${response.status} ${response.statusText} - ${errorText}`);
      }
      
      const result = await response.json();
      console.log('Test email sent successfully');
      return result;
    } catch (error) {
      console.error('Error sending test email:', error);
      throw error;
    }
  },

  // Get subscription info and upgrade options
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
      
      // Get posts count for current month
      const currentMonth = new Date();
      currentMonth.setDate(1);
      currentMonth.setHours(0, 0, 0, 0);
      
      const postsQuery = query(
        collection(db, 'posts'),
        where('userId', '==', userId),
        where('createdAt', '>=', currentMonth)
      );
      
      const postsSnapshot = await getDocs(postsQuery);
      const postsUsed = postsSnapshot.size;
      
      const limits = {
        free: 2,     // 1 delivery per month = 2 posts (1 short + 1 long)
        standard: 8, // 1 delivery per week = 8 posts per month
        pro: 60      // 1 delivery per day = 60 posts per month
      };
      
      return {
        subscription,
        postsUsed,
        postsLimit: limits[subscription] || 2
      };
    } catch (error) {
      console.error('Error getting subscription info:', error);
      return { subscription: 'free', postsUsed: 0, postsLimit: 2 };
    }
  },

  // Create payment intent
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
      console.error('Error creating payment intent:', error);
      throw error;
    }
  },

  // Confirm payment
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
      console.error('Error confirming payment:', error);
      throw error;
    }
  },

  // Upgrade subscription
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
      
      console.log('Subscription upgraded successfully to:', newPlan);
      return { message: 'Subscription upgraded successfully' };
    } catch (error) {
      console.error('Error upgrading subscription:', error);
      throw error;
    }
  }
};