/*
 * Copyright (c) 2016-2020 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import {
  AfterContentInit,
  Component,
  ContentChildren,
  HostBinding,
  Inject,
  Input,
  OnDestroy,
  QueryList,
  ViewChild,
  ViewContainerRef,
  ElementRef,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { startWith } from 'rxjs/operators';
import { IfActiveService } from '../../utils/conditional/if-active.service';
import { ClrKeyFocus } from '../../utils/focus/key-focus/key-focus';
import { ClrCommonStringsService } from '../../utils/i18n/common-strings.service';
import { ClrPopoverToggleService } from '../../utils/popover/providers/popover-toggle.service';
import { TabsLayout } from './enums/tabs-layout.enum';
import { TabsService } from './providers/tabs.service';
import { ClrTab } from './tab';
import { ClrTabLink } from './tab-link.directive';
import { ClrTabOverflowContent } from './tab-overflow-content';
import { TABS_ID, TABS_ID_PROVIDER } from './tabs-id.provider';

@Component({
  selector: 'clr-tabs',
  template: `
        <ul class="nav" role="tablist" [attr.aria-owns]="tabIds" [clrKeyFocus]="tabLinkElements" clrDirection="both"
            (clrFocusChange)="checkFocusVisible()">
            <!--tab links-->
            <ng-container *ngFor="let link of tabLinkDirectives">
                <ng-container *ngIf="link.tabsId === tabsId && !link.inOverflow">
                    <li role="presentation" class="nav-item">
                        <ng-container [ngTemplateOutlet]="link.templateRefContainer.template"></ng-container>
                    </li>
                </ng-container>
            </ng-container>
            <ng-container *ngIf="tabsService.overflowTabs.length > 0">
                <div class="tabs-overflow bottom-right" role="presentation" 
                  [class.open]="toggleService.open" 
                  (keydown.esc)="toggleOverflow($event); focusDropdownToggle(dropdownToggleEl)">
                    <li role="application" class="nav-item">
                        <button #dropdownToggleEl class="btn btn-link nav-link dropdown-toggle" type="button" aria-hidden="true" tabIndex="-1"
                                [class.active]="activeTabInOverflow"
                                [class.open]="toggleService.open"
                                (click)="toggleOverflow($event)">
                            <clr-icon shape="ellipsis-horizontal"
                              [class.is-info]="toggleService.open"
                              [attr.title]="commonStrings.keys.more"></clr-icon>
                        </button>
                    </li>
                    <!--tab links in overflow menu-->
                    <clr-tab-overflow-content *ngIf="toggleService.open">
                        <ng-container *ngFor="let link of tabLinkDirectives">
                            <ng-container *ngIf="link.tabsId === tabsId && link.inOverflow"
                                          [ngTemplateOutlet]="link.templateRefContainer.template">
                            </ng-container>
                        </ng-container>
                    </clr-tab-overflow-content>
                </div>
            </ng-container>
        </ul>
        <ng-container #tabContentViewContainer></ng-container>
    `,
  providers: [IfActiveService, ClrPopoverToggleService, TabsService, TABS_ID_PROVIDER],
})
export class ClrTabs implements AfterContentInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  private get overflowPosition() {
    return this._tabLinkDirectives.filter(link => !link.inOverflow).length;
  }

  /* tslint:disable:no-unused-variable */
  @ViewChild('tabContentViewContainer', { static: true, read: ViewContainerRef })
  private set tabContentViewContainer(value: ViewContainerRef) {
    this.tabsService.tabContentViewContainer = value;
  }
  /* tslint:enable:no-unused-variable */

  @Input('clrLayout')
  set layout(layout: TabsLayout) {
    if (
      Object.keys(TabsLayout)
        .map(key => {
          return TabsLayout[key];
        })
        .indexOf(layout) >= 0
    ) {
      this.tabsService.layout = layout;
    }
  }
  get layout(): TabsLayout {
    return this.tabsService.layout;
  }

  @ContentChildren(ClrTab) private tabs: QueryList<ClrTab>;

  private _tabLinkDirectives: ClrTabLink[] = [];
  get tabLinkDirectives(): ClrTabLink[] {
    return this._tabLinkDirectives;
  }

  tabLinkElements: HTMLElement[] = [];

  @ViewChild(ClrKeyFocus, { static: true })
  keyFocus: ClrKeyFocus;

  constructor(
    public ifActiveService: IfActiveService,
    public toggleService: ClrPopoverToggleService,
    public tabsService: TabsService,
    @Inject(TABS_ID) public tabsId: number,
    public commonStrings: ClrCommonStringsService
  ) {}

  get activeTabInOverflow() {
    return this.tabsService.overflowTabs.indexOf(this.tabsService.activeTab) > -1;
  }

  get tabIds() {
    return this.tabsService.children.map(tab => tab.tabLink.tabLinkId).join(' ');
  }

  ngAfterContentInit() {
    this.subscriptions.push(this.listenForTabLinkChanges());

    if (typeof this.ifActiveService.current === 'undefined' && this.tabLinkDirectives[0]) {
      this.tabLinkDirectives[0].activate();
    }
  }

  skipFocusCheck = false;

  toggleOverflow(event: any) {
    this.skipFocusCheck = true;
    if (this.toggleService.open) {
      // The reason why we are moving the current back to the first in tab overflow before closing it
      // is that to prevent users from pressing their arrow keys many times to move
      // the focus to the tab links that are not in overflow.
      this.keyFocus.moveCurrentTo(this.overflowPosition);
    }
    this.toggleService.toggleWithEvent(event);
  }

  focusDropdownToggle(dropdownToggleEl: HTMLElement) {
    dropdownToggleEl.focus();
  }

  checkFocusVisible() {
    if (this.skipFocusCheck) {
      this.skipFocusCheck = false;
      return;
    }
    if (!this.toggleService.open && this.isCurrentInOverflow) {
      this.toggleService.open = true;
    } else if (this.toggleService.open && !this.isCurrentInOverflow) {
      this.toggleService.open = false;
    }
  }

  get isCurrentInOverflow() {
    return (
      this.tabLinkElements.indexOf(document.activeElement as HTMLElement) > -1 &&
      this.keyFocus.current >= this.overflowPosition
    );
  }

  @HostBinding('class.tabs-vertical')
  get isVertical() {
    return this.layout === TabsLayout.VERTICAL;
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => {
      sub.unsubscribe();
    });
  }

  private listenForTabLinkChanges() {
    return this.tabs.changes.pipe(startWith(this.tabs.map(tab => tab.tabLink))).subscribe(() => {
      this._tabLinkDirectives = this.tabs.map(tab => tab.tabLink);
      this.tabLinkElements = this._tabLinkDirectives.map(tab => tab.el.nativeElement);
    });
  }

  @ViewChild(ClrTabOverflowContent, { static: false })
  set overflowContent(value: ClrTabOverflowContent) {
    // only after view tab overflow content view is registered, we need to move the focus
    if (this.toggleService.open && value) {
      this.keyFocus.moveCurrentTo(this.overflowPosition);
    }
  }
}
