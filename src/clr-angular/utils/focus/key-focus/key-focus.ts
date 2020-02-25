/*
 * Copyright (c) 2016-2020 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, ContentChildren, EventEmitter, HostListener, Input, Output, QueryList } from '@angular/core';
import { KeyCodes } from '@clr/core/common';
import { Subscription } from 'rxjs';
import { ClrFocusDirection } from './enums/focus-direction.enum';
import { FocusableItem } from './interfaces';
import { ClrKeyFocusItem } from './key-focus-item';
import { getKeyCodes, preventArrowKeyScroll } from './util';

@Component({
  selector: '[clrKeyFocus]',
  template: '<ng-content></ng-content>',
})
export class ClrKeyFocus {
  @Input('clrDirection') direction = ClrFocusDirection.VERTICAL;
  @Input('clrFocusOnLoad') focusOnLoad = false;
  @Output('clrFocusChange') private focusChange: EventEmitter<number> = new EventEmitter<number>();
  @ContentChildren(ClrKeyFocusItem, { descendants: true })
  private clrKeyFocusItems: QueryList<ClrKeyFocusItem>;

  private _focusableItems: Array<FocusableItem>;
  @Input('clrKeyFocus')
  set focusableItems(elements: Array<FocusableItem>) {
    // We accept a list of focusable elements (HTMLElements or existing Directives) or auto query for clrKeyFocusItem
    // We accept a list reference in the cases where we cannot use ContentChildren to query
    // ContentChildren can be unavailable if content is projected outside the scope of the component (see tabs).
    if (elements && elements.length) {
      this._focusableItems = elements;
      this.initializeFocus();
    }
  }

  get focusableItems() {
    if (this._focusableItems) {
      return this._focusableItems;
    } else {
      return this.clrKeyFocusItems && this.clrKeyFocusItems.toArray();
    }
  }

  private _current: number = 0;

  get current() {
    return this._current;
  }

  set current(value: number) {
    // save the initial current position value even before registering items
    if (!this.focusableItems) {
      this._current = value;
      return;
    }

    if (this._current !== value && this.positionInRange(value)) {
      this._current = value;
      this.focusCurrent();
    }
  }

  get currentItem() {
    if (this._current >= this.focusableItems.length) {
      return null;
    }

    return this.focusableItems[this._current];
  }

  focusCurrent() {
    this.currentItem.focus();
    this.focusChange.next(this._current);
  }

  private subscriptions: Subscription[] = [];

  ngAfterContentInit() {
    this.subscriptions.push(this.listenForItemUpdates());
    this.initializeFocus();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  @HostListener('keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (this.prevKeyPressed(event) && this.currentFocusIsNotFirstItem()) {
      this.current--;
    } else if (this.nextKeyPressed(event) && this.currentFocusIsNotLastItem()) {
      this.current++;
    } else if (event.code === KeyCodes.Home) {
      this.current = 0;
    } else if (event.code === KeyCodes.End) {
      this.current = this.focusableItems.length - 1;
    }

    preventArrowKeyScroll(event);
  }

  @HostListener('click', ['$event'])
  setClickedItemCurrent(event: any) {
    let position: number;

    if (this.focusableItems[0].nativeElement) {
      position = this.focusableItems.map(item => item.nativeElement).indexOf(event.target);
    } else {
      position = this.focusableItems.indexOf(event.target);
    }

    if (position > -1) {
      this.current = position;
    }
  }

  private positionInRange(position: number) {
    return position >= 0 && position < this.focusableItems.length;
  }

  private currentFocusIsNotFirstItem() {
    return this._current - 1 >= 0;
  }

  private currentFocusIsNotLastItem() {
    return this._current + 1 < this.focusableItems.length;
  }

  private initializeFocus() {
    if (this.focusOnLoad) {
      this.focusCurrent();
    }
  }

  private listenForItemUpdates() {
    return this.clrKeyFocusItems.changes.subscribe(() => {
      this.initializeFocus();
    });
  }

  private nextKeyPressed(event: KeyboardEvent) {
    const keyCodes = getKeyCodes(event);

    switch (this.direction) {
      case ClrFocusDirection.VERTICAL:
        return event.key === keyCodes.ArrowDown;
      case ClrFocusDirection.HORIZONTAL:
        return event.key === keyCodes.ArrowRight;
      case ClrFocusDirection.BOTH:
        return event.key === keyCodes.ArrowDown || event.key === keyCodes.ArrowRight;
      default:
        return false;
    }
  }

  private prevKeyPressed(event: KeyboardEvent) {
    const keyCodes = getKeyCodes(event);

    switch (this.direction) {
      case ClrFocusDirection.VERTICAL:
        return event.key === keyCodes.ArrowUp;
      case ClrFocusDirection.HORIZONTAL:
        return event.key === keyCodes.ArrowLeft;
      case ClrFocusDirection.BOTH:
        return event.key === keyCodes.ArrowUp || event.key === keyCodes.ArrowLeft;
      default:
        return false;
    }
  }
}
