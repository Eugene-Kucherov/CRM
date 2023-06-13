export interface IUser {
  accessToken: string;
  refreshToken: string;
  user: IUserDetails;
}

export interface IUserDetails {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  photo: string;
  isActivated: boolean;
  [key: string]: number | string | boolean;
}

export interface IProfilePhoto {
  fileName: string;
  photoData: string;
};

export interface IEvent {
  userId: number;
  id: number;
  title: string;
  start: Date;
  end: Date;
  [key: string]: number | string | Date;
}

export interface IDeal {
  userId: number;
  id: number;
  stage: number;
  name: string;
  email: string;
  phone: string;
  company: string;
  website: string;
  notes: string;
  created_at: Date;
  updated_at: Date;
  [key: string]: number | string | Date;
}