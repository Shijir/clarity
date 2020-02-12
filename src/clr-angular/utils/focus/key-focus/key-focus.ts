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
  @Output('clrFocusChange') private focusChange: EventEmitter<void> = new EventEmitter<void>();
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
      return this.clrKeyFocusItems.toArray();
    }
  }

  private _current: number = 0;

  get current() {
    return this._current;
  }

  set current(value: number) {
    if (this._current !== value) {
      this.moveCurrentTo(value);
    }
  }

  get currentItem() {
    if (this._current >= this.focusableItems.length) {
      return null;
    }

    return this.focusableItems[this._current];
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
      this._current = position;
    }
  }

  resetTabFocus() {
    this.currentItem.tabIndex = -1;
    this._current = 0;
    this.currentItem.tabIndex = 0;
  }

  moveCurrentTo(position: number) {
    if (this.positionInRange(position)) {
      this.updateBeforeChangingCurrent();
      this._current = position;
      this.focusNewCurrent();
    }
  }

  private updateBeforeChangingCurrent() {
    // this method will give us a chance to update current item
    // before moving to a new current item
    this.currentItem.tabIndex = -1;
  }

  private focusNewCurrent() {
    this.currentItem.tabIndex = 0;
    this.currentItem.focus();
    this.focusChange.next();
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
    if (this.focusableItems && this.focusableItems.length) {
      this.focusableItems.forEach(i => (i.tabIndex = -1));
      this.currentItem.tabIndex = 0;
    }

    if (this.focusOnLoad) {
      this.currentItem.focus();
      this.focusChange.next();
    }
  }

  private listenForItemUpdates() {
    return this.clrKeyFocusItems.changes.subscribe(() => {
      this.focusableItems.forEach(item => (item.tabIndex = -1));
      this._current = 0;
      this.currentItem.tabIndex = 0;
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
