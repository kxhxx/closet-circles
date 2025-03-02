
// This file contains types for our database tables
// These will be used alongside the existing Supabase types

export interface Profile {
  id: string;
  user_id: string;
  username: string;
  bio: string | null;
  profile_picture: string | null;
  followers_count: number;
  following_count: number;
  ratings_count: number;
  created_at?: string;
  updated_at?: string;
}

export interface Item {
  id: number;
  user_id: string;
  title: string;
  description: string | null;
  price: number;
  category: string;
  image_url?: string;
  is_sold?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Message {
  id: number;
  sender_id: string;
  receiver_id: string;
  content: string;
  sent_at?: string;
}

export interface Transaction {
  id: number;
  item_id: number;
  buyer_id: string;
  seller_id: string;
  amount: number;
  transaction_date?: string;
}

export interface Follow {
  id: number;
  follower_id: string;
  following_id: string;
  created_at?: string;
}

// Type-safe Supabase table references
export type Tables = {
  profiles: Profile;
  items: Item;
  messages: Message;
  transactions: Transaction;
  follows: Follow;
};
