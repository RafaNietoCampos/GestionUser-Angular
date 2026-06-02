import { type HttpInterceptorFn } from '@angular/common/http'
import { inject } from '@angular/core'
import { COOKIES } from '@app/constants/cookies'
import { CookieService } from 'ngx-cookie-service'

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const cookieService = inject(CookieService);

  const token = cookieService.get(COOKIES.TOKEN);

  if (!token) {
    return next(req);
  }

  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });

  return next(authReq);
};
