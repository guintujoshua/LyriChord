import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Do not attach token when calling login.
  if (req.url.toLowerCase().includes('/user/login')) {
    return next(req);
  }

  if (typeof localStorage === 'undefined') {
    return next(req);
  }

  const rawToken = localStorage.getItem('auth_token');
  if (!rawToken) {
    return next(req);
  }

  const token = rawToken.startsWith('Bearer ') ? rawToken : `Bearer ${rawToken}`;

  return next(
    req.clone({
      setHeaders: {
        Authorization: token,
      },
    }),
  );
};
