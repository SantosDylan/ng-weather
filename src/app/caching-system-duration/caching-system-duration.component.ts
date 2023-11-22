import { KeyValuePipe, NgFor } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DURATION_DATA } from 'app/shared/utils/duration';
import { CachingSystemDurationService } from './caching-system-duration.service';

@Component({
  selector: 'app-caching-system-duration',
  template: `
    <div class="well" style="display: flex; flex-direction: column; gap: 1rem">
      <div>
        <h3>Select the caching system duration :</h3>
        <div>
          <span>Application get cached for: {{ cachingSystemDurationService.selectedCachingSystemDuration() }}(s) </span>
        </div>
        <span>Type duration :</span>
        <select [formControl]="cachingSystemDurationService.durationKey">
          <option *ngFor="let item of durationSelect | keyvalue" [selected]="cachingSystemDurationService.durationKey.value === item.key">
            {{ item.key }}
          </option>
        </select>
      </div>
      <div>
        <span>Multiplier :</span>
        <input [formControl]="cachingSystemDurationService.multiplier" min="1" type="number" />
      </div>
    </div>
  `,
  standalone: true,
  imports: [KeyValuePipe, NgFor, FormsModule, ReactiveFormsModule],
})
export class CachingSystemDurationComponent {
  public durationSelect = DURATION_DATA;
  public cachingSystemDurationService = inject(CachingSystemDurationService);
}
