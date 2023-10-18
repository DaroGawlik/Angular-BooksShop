export interface PostUserDataModel {
  userId: number;
}
export interface PostUpdateUserNameModel {
  userName: string;
}

export interface PostUpdateUserPhotoModel {
  photoUrl: string;
}

export interface UserDataModel {
  userId: number;
  email: string;
  emailVerified: boolean;
  userName: string;
  providerUserInfo: ProviderUserInfo[];
  photoUrl: string;
  passwordHash: string;
  passwordUpdatedAt: number;
  validSince: string;
  disabled: boolean;
  lastLoginAt: string;
  createdAt: string;
  customAuth: boolean;
}

export interface GetUpdateUserNameModel {
  userName: string;
}

export interface ProviderUserInfo {
  providerId: string;
  federatedId: string;
}
