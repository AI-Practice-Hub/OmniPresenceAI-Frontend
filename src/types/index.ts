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

export interface Run {
  id: string;
  user_id: string;
  name: string | null;
  script: string;
  audio_prompt_url: string;
  avatar_url: string | null;
  generated_audio_url: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  error: string | null;
}

export interface Token {
  access_token: string;
  token_type: string;
}
