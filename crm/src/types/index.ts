export interface IUser {
  accessToken: string;
  refreshToken: string;
  user: IUserDetails;
}

export interface IUserDetails {
  id: string;
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
}

export interface IEvent {
  userId: string;
  id: string;
  title: string;
  start: Date;
  end: Date;
  [key: string]: number | string | Date;
}

export interface IDeal {
  userId: string;
  id: string;
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

export interface IMessage {
  id: string;
  sender: IUserDetails;
  recipient: IUserDetails;
  content: string;
  created_at: Date;
  is_deleted: boolean;
  is_read: boolean;
}

export interface IDialoguePartner {
  user: IUserDetails;
  username: string;
  photo: string;
}

export interface IDialogue {
  _id: string;
  dialoguePartners: Array<IDialoguePartner>;
  participants: Array<IUserDetails>;
  lastMessage: IMessage;
  unreadNumber: number;
}
