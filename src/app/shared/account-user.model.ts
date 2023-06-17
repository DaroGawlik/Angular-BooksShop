export interface userName {
  idToken: string;
  displayName: string;
  returnSecureToken: boolean;
}

export interface userNameResponse {
  localId: string;
  email: string;
  displayName: string;
  passwordHash: string;
  // providerUserInfo:	List of JSON objects;
  idToken: string;
  refreshToken: string;
  expiresIn: string;
}
