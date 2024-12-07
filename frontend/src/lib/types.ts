export interface Profile {
  id: string;
  name: string;
  profile_photo: string;
  isConnected: boolean;
  mutual: string;
  relation_to: string;
}

export interface Invitation {
  id: string;
  name: string;
  profile_photo: string;
  created_at: string;
  mutual: string;
}

export interface Connection {
  id: string;
  name: string;
  profile_photo: string;
  mutual: string;
  isConnected: boolean;
}
export interface Post {
  id: number;
  created_at: string;
  updated_at: string;
  content: string;
  user_id: number;
}

export type Feed = Post & { user: { name: string; profile_photo: string } };