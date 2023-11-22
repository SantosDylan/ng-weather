import { HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CachingSystemDurationService } from 'app/caching-system-duration/caching-system-duration.service';
import { EMPTY, of } from 'rxjs';
import { skip } from 'rxjs/operators';

const LOCAL_STORAGE_KEY = "___ng_weather_caching_system____"
type Cache = { response: HttpResponse<unknown>; expiration: number; responseDate: number }

@Injectable({ providedIn: 'root' })
export class CacheService {
  #cachingSystemDurationService = inject(CachingSystemDurationService);

  cache = new Map<string, Cache>();

  constructor() {
    this.#cachingSystemDurationService.durationMS$.pipe(takeUntilDestroyed(), skip(1)).subscribe((duration) => {
      for (const [key, value] of this.cache.entries()) {
        this.cache.set(key, { ...value, expiration: value.responseDate + duration });
      }
      this.updateLocalStorage(LOCAL_STORAGE_KEY, this.cache);
    });
  }

  init() {
    const ls = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!ls) {
      return of(EMPTY);
    }
    const cacheMap = JSON.parse(ls);
    if (!cacheMap) {
      return of(EMPTY);
    }

    this.cache = new Map(cacheMap);
    return of(this.cache);
  }

  get(req: HttpRequest<unknown>): HttpResponse<unknown> | undefined {
    const url = req.urlWithParams;
    const cached = this.cache.get(url);

    if (!cached || cached.expiration <= new Date().getTime()) {
      return undefined;
    }

    return new HttpResponse({ ...cached.response });
  }

  put(req: HttpRequest<unknown>, response: HttpResponse<unknown>): void {
    this.cache.set(req.url, {
      response,
      expiration: new Date().getTime() + this.#cachingSystemDurationService.durationMS(),
      responseDate: new Date().getTime(),
    });
    this.updateLocalStorage(LOCAL_STORAGE_KEY, this.cache)
  }

  private updateLocalStorage(key: string, cache: Map<string, Cache>) {
    localStorage.setItem(key, JSON.stringify(Array.from(cache.entries())));
  }
}
