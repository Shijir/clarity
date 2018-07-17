/*
 * Copyright (c) 2016-2018 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Directive,
  ElementRef,
  HostListener,
  Inject,
  Injector,
  OnDestroy,
  PLATFORM_ID,
} from '@angular/core';

import { FocusTrapTracker } from './focus-trap-tracker.service';
import { Renderer2 } from '@angular/core';

@Directive({ selector: '[clrFocusTrap]' })
export class FocusTrapDirective implements AfterViewInit, OnDestroy {
  private previousActiveElement: any;
  private document: Document;

  constructor(
    private el: ElementRef,
    private injector: Injector,
    private focusTrapsTracker: FocusTrapTracker,
    @Inject(PLATFORM_ID) private platformId: Object,
    private renderer: Renderer2
  ) {
    this.document = this.injector.get(DOCUMENT);
    this.focusTrapsTracker.current = this;

    this.focusTrapBeltEl = this.el.nativeElement;

    this.focusReversalEl = this.renderer.createElement('span');
    this.renderer.setAttribute(this.focusReversalEl, 'tabindex', '0');
    this.renderer.addClass(this.focusReversalEl, 'off-screen');
  }

  private focusTrapBeltEl: any;
  private focusReversalEl: any;

  private previousFocusedEl: any;
  private currentFocusedEl: any;

  @HostListener('document:focusin', ['$event'])
  onFocusIn(event: any) {
    this.previousFocusedEl = this.currentFocusedEl;
    this.currentFocusedEl = event.target;

    if (this.focusTrapsTracker.current === this) {
      // should only work in the current active focus trapper
      if (this.focusTrapBeltEl.contains(this.currentFocusedEl)) {
        if (
          this.previousFocusedEl &&
          this.currentFocusedEl === this.focusReversalEl &&
          this.previousFocusedEl !== this.focusTrapBeltEl
        ) {
          // will shift focus to the trap belt element
          this.focusTrapBeltEl.focus();
        }
        if (
          this.previousFocusedEl &&
          this.currentFocusedEl === this.focusTrapBeltEl &&
          this.previousFocusedEl !== this.focusReversalEl
        ) {
          // will shift focus to the reversal element
          this.focusReversalEl.focus();
        }
      } else {
        this.focusTrapBeltEl.focus();
      }
    }
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.previousActiveElement = <HTMLElement>this.document.activeElement;
      this.focusTrapBeltEl.setAttribute('tabindex', '0');
    }
    this.renderer.appendChild(this.focusTrapBeltEl, this.focusReversalEl);
  }

  private setPreviousFocus(): void {
    if (this.previousActiveElement && this.previousActiveElement.focus) {
      this.previousActiveElement.focus();
    }
  }

  ngOnDestroy() {
    this.setPreviousFocus();
    this.focusTrapsTracker.activatePreviousTrapper();
  }
}
