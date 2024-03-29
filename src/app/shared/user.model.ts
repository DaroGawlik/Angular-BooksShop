export class User {
  constructor(
    public userId: number,
    private _token: string,
    private _refreshToken: string,
    private _tokenExpirationDate: Date
  ) {}

  get token() {
    if (!this._tokenExpirationDate || new Date() > this._tokenExpirationDate) {
      return null;
    }
    return this._token;
  }

  get refreshToken() {
    return this._refreshToken;
  }
}
