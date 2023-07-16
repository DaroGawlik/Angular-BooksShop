export interface PostUserDataModel {
  idToken: string;
}
export interface PostUpdateUserNameModel extends PostUserDataModel {
  displayName: string;
}
export interface PostUpdateUserPhotoModel extends PostUserDataModel {
  photoUrl: string;
}

export interface UserDataModel {
  localId: string;
  email: string;
  emailVerified: boolean;
  displayName: string;
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

export interface GatUpdateUserNameModel {
  displayName: string;
}

export interface ProviderUserInfo {
  providerId: string;
  federatedId: string;
}
