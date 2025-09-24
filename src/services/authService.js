const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3001/api";

export class AuthService {
  static instance = null;

  constructor() {}

  static getInstance() {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async createOrUpdateUser(firebaseUser) {
    try {
      const idToken = await firebaseUser.getIdToken();

      const response = await fetch(`${API_BASE_URL}/auth/user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          name: firebaseUser.displayName,
          avatar: firebaseUser.photoURL,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create/update user");
      }

      const userData = await response.json();
      return userData.user;
    } catch (error) {
      console.error("Error creating/updating user:", error);

      // Fallback: create local user object if API fails
      return {
        id: firebaseUser.uid,
        uid: firebaseUser.uid,
        name: firebaseUser.displayName || "User",
        email: firebaseUser.email || "",
        avatar:
          firebaseUser.photoURL ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(
            firebaseUser.displayName || "User"
          )}&background=6366f1&color=ffffff`,
        isAdmin: false,
        subscription: "free",
      };
    }
  }

  async getUserProfile(uid, idToken) {
    try {
      // FIX: Remove the duplicate /api from the path
      const response = await fetch(`${API_BASE_URL}/auth/user/${uid}`, {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });

      if (!response.ok) {
        // If 404, user doesn't exist yet - return null to trigger creation
        if (response.status === 404) {
          console.log("User profile not found, will create new one");
          return null;
        }
        throw new Error(`Failed to get user profile: ${response.status}`);
      }

      const userData = await response.json();
      return userData.user;
    } catch (error) {
      console.error("Error getting user profile:", error);
      return null;
    }
  }

  async deleteAccount(uid, idToken) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/user/${uid}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete account");
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      throw error;
    }
  }
}