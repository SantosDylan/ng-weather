import { Component, Input, TemplateRef, ViewChild } from '@angular/core';
import { toBoolean } from 'app/shared/utils/to-boolean';

@Component({
  selector: 'app-tab',
  template: `
    <ng-template>
      <ng-content></ng-content>
    </ng-template>
  `,
  standalone: true,
})
export class TabComponent {
  @ViewChild(TemplateRef, { static: true }) template!: TemplateRef<void>;
  @Input({ required: true }) title: string;
  @Input({ transform: toBoolean }) closable: boolean;
}
