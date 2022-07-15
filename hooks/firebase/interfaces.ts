export interface UserDetails {
  id: string;
  auth_uid: string;
  first_name: string;
  last_name: string;
  description: string;
  username: string;
  profile_img: string;
  followers: string[];
  following: string[];
  tags: string[];
  country: string;
}
