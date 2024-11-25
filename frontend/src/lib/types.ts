export interface Profile {
  id: string;
  name: string;
  profile_photo: string;
  isConnected: boolean;
  mutual: string;
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