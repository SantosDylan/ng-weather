import { NgClass, NgFor, NgIf, NgTemplateOutlet } from '@angular/common';
import { Component, ContentChildren, EventEmitter, Input, Output, QueryList } from '@angular/core';
import { TabComponent } from './tab.component';

@Component({
  selector: 'app-tabs',
  template: `
    <div class="tabs--wrapper">
      <div class="tab" (click)="selectedIndex = id" [ngClass]="{ 'tab--selected': id === selectedIndex }" *ngFor="let tab of tabs.toArray(); let id = index">
        <span>{{ tab.title }}</span>
        <span *ngIf="tab.closable" style="margin-left: 1rem" (click)="onTabClose(id)">&times;</span>
      </div>
    </div>
    <ng-container *ngFor="let tab of tabs.toArray(); let id = index">
      <ng-container *ngIf="id === selectedIndex">
        <div *ngTemplateOutlet="tab.template">{{ tab.template }}</div>
      </ng-container>
    </ng-container>
  `,
  standalone: true,
  imports: [NgFor, NgTemplateOutlet, NgIf, NgClass],
  styleUrls: ['./tab.component.scss'],
})
export class TabsComponent {
  @ContentChildren(TabComponent) tabs: QueryList<TabComponent>;

  @Input({ required: true }) selectedIndex: number;
  @Output() onClose = new EventEmitter<number>();

  onTabClose(id: number) {
    if (this.selectedIndex === id || this.tabs.toArray().length === 2) {
      this.selectedIndex = 0; // Select the first tab
    }
    this.onClose.emit(id)
  }
}
