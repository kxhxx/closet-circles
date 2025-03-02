
import { supabase } from "@/integrations/supabase/client";
import { Profile } from "@/types/database";

export const authService = {
  async signIn(email: string, password: string) {
    return await supabase.auth.signInWithPassword({
      email,
      password,
    });
  },

  async signUp(email: string, password: string) {
    return await supabase.auth.signUp({
      email,
      password,
    });
  },

  async createProfile(userId: string, username: string) {
    return await supabase
      .from('profiles')
      .insert([
        {
          id: userId,
          username,
          user_id: userId,
          bio: null,
          profile_picture: null,
          followers_count: 0,
          following_count: 0,
          ratings_count: 0
        }
      ]);
  },

  async fetchUserProfile(userId: string) {
    return await supabase
      .from('profiles')
      .select('username')
      .eq('id', userId)
      .single();
  }
};
