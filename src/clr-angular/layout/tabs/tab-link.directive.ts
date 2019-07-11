/*
 * Copyright (c) 2016-2019 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import {
  ComponentFactoryResolver,
  Directive,
  ElementRef,
  HostBinding,
  HostListener,
  Inject,
  Input,
  ViewContainerRef,
} from '@angular/core';

import { IF_ACTIVE_ID, IfActiveService } from '../../utils/conditional/if-active.service';
import { TemplateRefContainer } from '../../utils/template-ref/template-ref-container';
import { TabsService } from './providers/tabs.service';

import { AriaService } from './providers/aria.service';
import { TABS_ID } from './tabs-id.provider';
import { TabsLayout } from './enums/tabs-layout.enum';
import { TabsFocusManagerService } from './providers/tabs-focus-manager.service';
import { Subscription } from 'rxjs/index';
import { IfOpenService } from '../../utils/conditional/if-open.service';

let nbTabLinkComponents: number = 0;

@Directive({
  selector: '[clrTabLink]',
  host: {
    '[attr.aria-hidden]': 'false',
    '[class.btn]': 'true',
    '[attr.tabindex]': 'isTabbable',
    role: 'tab',
    type: 'button',
  },
})
export class ClrTabLink {
  private _inOverflow: boolean;

  @Input('clrTabLinkInOverflow')
  set inOverflow(inOverflow) {
    this._inOverflow = inOverflow;
  }

  get inOverflow(): boolean {
    return this._inOverflow && this.tabsService.layout !== TabsLayout.VERTICAL;
  }

  @HostBinding('class.btn-link')
  @HostBinding('class.nav-link')
  get addLinkClasses() {
    return !this.inOverflow;
  }

  templateRefContainer: TemplateRefContainer;

  constructor(
    public ifActiveService: IfActiveService,
    @Inject(IF_ACTIVE_ID) private id: number,
    private ariaService: AriaService,
    private el: ElementRef,
    private cfr: ComponentFactoryResolver,
    private viewContainerRef: ViewContainerRef,
    private tabsService: TabsService,
    @Inject(TABS_ID) public tabsId: number,
    private tabsFocusManager: TabsFocusManagerService,
    private ifOpenService: IfOpenService
  ) {
    if (!this.tabLinkId) {
      this.tabLinkId = 'clr-tab-link-' + nbTabLinkComponents++;
    }

    // Tab links can be rendered in one of two places: in the main area or inside the overflow dropdown menu.
    // Here, we create a container so that its template can be used to create embeddedView on the fly.
    // See TabsService's renderView() method and how it's used in Tabs class for an example.
    const factory = this.cfr.resolveComponentFactory(TemplateRefContainer);
    this.templateRefContainer = this.viewContainerRef.createComponent(factory, 1, undefined, [
      [this.el.nativeElement],
    ]).instance;
  }

  private shouldFocusOnArrowKey: boolean = false;

  get isTabbable() {
    return this.active || this.shouldFocusOnArrowKey ? 0 : -1;
  }

  @HostBinding('attr.aria-controls')
  get ariaControls(): string {
    return this.ariaService.ariaControls;
  }

  get tabLinkId(): string {
    return this.ariaService.ariaLabelledBy;
  }

  @HostBinding('id')
  @Input('id')
  set tabLinkId(id: string) {
    this.ariaService.ariaLabelledBy = id;
  }

  @HostListener('click')
  activate() {
    this.ifActiveService.current = this.id;
  }

  @HostBinding('class.active')
  @HostBinding('attr.aria-selected')
  get active() {
    return this.ifActiveService.current === this.id;
  }

  private subscriptions: Subscription[] = [];

  @HostListener('keydown.arrowdown', ['$event'])
  @HostListener('keydown.arrowright', ['$event'])
  focusNextTabLink(event: KeyboardEvent) {
    if (this.tabsService.layout !== TabsLayout.VERTICAL && event.key === 'ArrowDown') {
      return;
    }
    this.tabsFocusManager.focusSiblingTabLink(this.tabLinkId, 1);
  }

  @HostListener('keydown.arrowup', ['$event'])
  @HostListener('keydown.arrowleft', ['$event'])
  focusPrevTabLink(event: KeyboardEvent) {
    if (this.tabsService.layout !== TabsLayout.VERTICAL && event.key === 'ArrowUp') {
      return;
    }
    this.tabsFocusManager.focusSiblingTabLink(this.tabLinkId, -1);
  }

  ngOnInit() {
    this.subscriptions.push(
      this.tabsFocusManager.focusMoveRequested.subscribe(tabLinkId => {
        if (tabLinkId === this.tabLinkId) {
          if (this.inOverflow && !this.ifOpenService.open) {
            this.ifOpenService.open = true;
          }
          this.shouldFocusOnArrowKey = true;
          if (typeof this.el.nativeElement.focus === 'function') {
            this.el.nativeElement.focus();
          }
        } else {
          this.shouldFocusOnArrowKey = false;
        }
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
