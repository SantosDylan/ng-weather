import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CacheService } from './cache.service';

@Injectable()
export class CacheInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const cacheService = inject(CacheService);
    const cacheResponse = cacheService.get(req);
    
    return cacheResponse ? of(cacheResponse) : this.sendRequest(req, next, cacheService);
  }

  sendRequest(req: HttpRequest<unknown>, next: HttpHandler, cacheService: CacheService): Observable<HttpEvent<unknown>> {
    return next.handle(req).pipe(
      tap((stateEvent) => {
        if (stateEvent instanceof HttpResponse) {
          cacheService.put(req, stateEvent.clone());
        }
      })
    );
  }
}
