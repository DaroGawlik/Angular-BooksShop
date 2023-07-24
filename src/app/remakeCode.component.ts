// private handleError = (errorRes: HttpErrorResponse) => {
//     let errorMessage = errorRes.error.error.message;
//     console.log(errorRes.error.error.message);
//     this.errorPublic.next(errorMessage);
//     return throwError(errorMessage);
//   };



//   public errorSubject = new BehaviorSubject<string>('').asObservable();
//   public errorPublic = this.errorSubject.asObservable();