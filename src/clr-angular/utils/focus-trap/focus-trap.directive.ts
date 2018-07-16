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
  private lastFocusedChildEl: any;
  private isShiftTabRegistered: boolean = false;

  @HostListener('document:keydown.shift.tab')
  onShiftTab() {
    if (!this.isShiftTabRegistered) {
      this.isShiftTabRegistered = true;
    }
  }

  @HostListener('document:focusin', ['$event'])
  onFocusIn(event: any) {
    if (this.focusTrapsTracker.current === this) {
      if (event.target && this.focusTrapBeltEl.contains(event.target)) {
        if (event.target && event.target !== this.focusTrapBeltEl && event.target !== this.focusReversalEl) {
          this.lastFocusedChildEl = event.target;
        }
        // this will happen when the focus is already within the trap belt
        if (this.isShiftTabRegistered && event.target === this.focusTrapBeltEl) {
          this.focusReversalEl.focus();
        } else if (!this.isShiftTabRegistered && event.target === this.focusReversalEl) {
          this.focusTrapBeltEl.focus();
        }
      } else {
        if (this.isShiftTabRegistered) {
          this.lastFocusedChildEl ? this.lastFocusedChildEl.focus() : this.focusReversalEl.focus();
        } else {
          this.lastFocusedChildEl ? this.lastFocusedChildEl.focus() : this.focusTrapBeltEl.focus();
        }
      }
    }

    // This should be reset to its original value on each focusin event.
    this.isShiftTabRegistered = false;
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
