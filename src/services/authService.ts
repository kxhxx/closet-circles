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
  },
  
  async followUser(followerId: string, followingId: string) {
    // First check if already following
    const { data: existing } = await supabase
      .from('follows')
      .select('*')
      .eq('follower_id', followerId)
      .eq('following_id', followingId)
      .maybeSingle();
      
    if (existing) {
      // Already following, so unfollow
      await supabase
        .from('follows')
        .delete()
        .eq('follower_id', followerId)
        .eq('following_id', followingId);
        
      // Update follower count
      await supabase
        .rpc('decrement_followers_count', { user_id: followingId });
        
      // Update following count
      await supabase
        .rpc('decrement_following_count', { user_id: followerId });
        
      return { action: 'unfollowed' };
    } else {
      // Not following, so follow
      await supabase
        .from('follows')
        .insert([{ follower_id: followerId, following_id: followingId }]);
        
      // Update follower count
      await supabase
        .rpc('increment_followers_count', { user_id: followingId });
        
      // Update following count
      await supabase
        .rpc('increment_following_count', { user_id: followerId });
        
      return { action: 'followed' };
    }
  },

  async checkIfFollowing(followerId: string, followingId: string) {
    const { data } = await supabase
      .from('follows')
      .select('*')
      .eq('follower_id', followerId)
      .eq('following_id', followingId)
      .maybeSingle();
      
    return !!data;
  },

  async addToCart(userId: string, itemId: number) {
    // This is a simplified implementation
    // In a real app, you would have a cart table in your database
    const cartItem = { userId, itemId, quantity: 1 };
    // For now, store in localStorage as a simple solution
    const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
    // Check if item already exists in cart
    const existingItemIndex = cartItems.findIndex((item: any) => item.itemId === itemId);
    if (existingItemIndex >= 0) {
      cartItems[existingItemIndex].quantity += 1;
    } else {
      cartItems.push(cartItem);
    }
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    return cartItems;
  },

  async buyNow(itemId: number, buyerId: string, sellerId: string, amount: number) {
    // In reality, this would connect to a payment processor
    return await supabase
      .from('transactions')
      .insert([
        { item_id: itemId, buyer_id: buyerId, seller_id: sellerId, amount }
      ]);
  },

  async toggleLike(userId: string, itemId: number) {
    // Simplified implementation using localStorage
    const likedItems = JSON.parse(localStorage.getItem(`liked_${userId}`) || '[]');
    const isLiked = likedItems.includes(itemId);
    
    if (isLiked) {
      // Unlike
      const updatedLikes = likedItems.filter((id: number) => id !== itemId);
      localStorage.setItem(`liked_${userId}`, JSON.stringify(updatedLikes));
      return { action: 'unliked', isLiked: false };
    } else {
      // Like
      likedItems.push(itemId);
      localStorage.setItem(`liked_${userId}`, JSON.stringify(likedItems));
      return { action: 'liked', isLiked: true };
    }
  },

  checkIfLiked(userId: string, itemId: number) {
    const likedItems = JSON.parse(localStorage.getItem(`liked_${userId}`) || '[]');
    return likedItems.includes(itemId);
  }
};
