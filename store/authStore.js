import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isLoading: false,

  register: async (username, email, password) => {
    set({ isLoading: true });
    try {
      const response = await fetch(
        "https://feb8-2402-4000-2100-2e02-d0e4-3598-d05f-6d43.ngrok-free.app/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, email, password }),
        }
      );

      const data = await response.json();

      if (!response.ok)
        throw new Error(data.message || "Something went wrong!");

      await AsyncStorage.setItem("user", JSON.stringify(data.user));
      await AsyncStorage.setItem("token", data.token);

      set({ user: data.user, token: data.token, isLoading: false });

      return {
        success: true,
      };
    } catch (error) {
      set({ isLoading: false });
      return {
        success: false,
        message: error.message || "Something went wrong!",
      };
    }
  },

  checkAuth: async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const userJson = await AsyncStorage.getItem("user");
      const user = JSON.parse(userJson);

      set({ token, user });
    } catch (error) {
      console.log("AsyncStorage error: ", error);
    }
  },
  logout: async () => {
    try {
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("user");

      set({ token: null, user: null });
    } catch (error) {
      console.log("AsyncStorage error: ", error);
    }
  },
  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const response = await fetch(
        "https://feb8-2402-4000-2100-2e02-d0e4-3598-d05f-6d43.ngrok-free.app/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();

      if (!response.ok)
        throw new Error(data.message || "Something went wrong!");

      await AsyncStorage.setItem("user", JSON.stringify(data.user));
      await AsyncStorage.setItem("token", data.token);

      set({ user: data.user, token: data.token, isLoading: false });

      return {
        success: true,
      };
    } catch (error) {
      set({ isLoading: false });
      return {
        success: false,
        message: error.message || "Something went wrong!",
      };
    }
  },
}));
