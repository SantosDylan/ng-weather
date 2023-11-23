import { APP_INITIALIZER, NgModule, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { routing } from './app.routing';
import { CachingSystemDurationComponent } from './caching-system-duration/caching-system-duration.component';
import { CachingSystemDurationService } from './caching-system-duration/caching-system-duration.service';
import { CurrentConditionsComponent } from './current-conditions/current-conditions.component';
import { ForecastsListComponent } from './forecasts-list/forecasts-list.component';
import { LocationService } from './location.service';
import { MainPageComponent } from './main-page/main-page.component';
import { CacheInterceptor } from './shared/cache.interceptor';
import { CacheService } from './shared/cache.service';
import { TabComponent } from './tabs/tab.component';
import { TabsComponent } from './tabs/tabs.component';
import { WeatherService } from './weather.service';
import { ZipcodeEntryComponent } from './zipcode-entry/zipcode-entry.component';

@NgModule({
  declarations: [AppComponent, ZipcodeEntryComponent, ForecastsListComponent, CurrentConditionsComponent, MainPageComponent],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule,
    routing,
    ServiceWorkerModule.register('/ng-weather/ngsw-worker.js', { enabled: environment.production }),
    TabsComponent,
    TabComponent,
    CachingSystemDurationComponent,
  ],
  providers: [
    CachingSystemDurationService,
    LocationService,
    WeatherService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CacheInterceptor,
      multi: true,
    },
    {
      provide: APP_INITIALIZER,
      multi: true,
      useFactory: () => {
        const cacheService = inject(CacheService);
        return () => cacheService.init();
      },
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
