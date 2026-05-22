export interface User {
  id: string;
  email: string;
  full_name: string;
  created_at: string;
}

export interface Avatar {
  id: string;
  user_id: string;
  name: string;
  image_url: string;
  created_at: string;
}

export interface Audio {
  id: string;
  user_id: string;
  name: string;
  audio_url: string;
  created_at: string;
}

export interface Token {
  access_token: string;
  token_type: string;
}
