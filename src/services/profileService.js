import { addDoc, collection, doc, getDoc, getDocs, orderBy, query, setDoc, where } from 'firebase/firestore';
import { db } from '../lib/firebase'; // Your existing Firebase config

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const profileService = {
  // Check if user has completed onboarding
  async checkSetupStatus(userId) {
    try {
      const profileDoc = await getDoc(doc(db, 'profiles', userId));
      const setupCompleted = profileDoc.exists() ? profileDoc.data()?.setupCompleted || false : false;
      return { setupCompleted };
    } catch (error) {
      console.error('Error checking setup status:', error);
      throw error;
    }
  },

  // Get user profile
  async getProfile(userId) {
    try {
      const profileDoc = await getDoc(doc(db, 'profiles', userId));
      if (!profileDoc.exists()) {
        return { profile: null };
      }
      return { profile: profileDoc.data() };
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }
  },

  // Process documents to extract text
  async processDocuments(documents) {
    if (!documents || documents.length === 0) {
      return { documentContext: '' };
    }

    try {
      const formData = new FormData();
      documents.forEach(file => {
        formData.append('documents', file);
      });

      const response = await fetch(`${API_BASE_URL}/api/process-documents`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to process documents');
      return await response.json();
    } catch (error) {
      console.error('Error processing documents:', error);
      throw error;
    }
  },

  // Save profile data with document processing
  async saveProfile(profileData, documents = []) {
    try {
      let documentContext = '';
      
      // Process documents if any
      if (documents && documents.length > 0) {
        const result = await this.processDocuments(documents);
        documentContext = result.documentContext;
      }

      // Save to Firestore
      const profileWithContext = {
        ...profileData,
        documentContext,
        setupCompleted: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await setDoc(doc(db, 'profiles', profileData.userId), profileWithContext, { merge: true });

      return { 
        message: 'Profile saved successfully',
        profile: profileWithContext
      };
    } catch (error) {
      console.error('Error saving profile:', error);
      throw error;
    }
  },

  // Generate LinkedIn post
  async generatePost(userId, prompt, context = '') {
    try {
      // Get user profile from Firestore
      const profileDoc = await getDoc(doc(db, 'profiles', userId));
      
      if (!profileDoc.exists()) {
        throw new Error('Profile not found');
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

      if (!response.ok) throw new Error('Failed to generate post');
      const result = await response.json();

      // Save generated post to Firestore
      const postData = {
        userId,
        content: result.post,
        prompt,
        context,
        createdAt: new Date(),
        status: 'draft',
        metadata: result.metadata
      };

      const postRef = await addDoc(collection(db, 'posts'), postData);

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
          createdAt: doc.data().createdAt?.toDate() // Convert Firestore timestamp
        });
      });

      return { posts };
    } catch (error) {
      console.error('Error fetching posts:', error);
      throw error;
    }
  }
};