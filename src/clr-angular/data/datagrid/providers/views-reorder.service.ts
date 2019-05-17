/*
 * Copyright (c) 2016-2019 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Injectable, ViewContainerRef, ViewRef } from '@angular/core';
import { Observable, Subject } from 'rxjs/index';

export type OrderChangeData = { [order: number]: number };

@Injectable()
export class ViewsReorderService {
  constructor() {}

  containerRef: ViewContainerRef;

  private reorderQueue: OrderChangeData = {};

  private _computedOrders: Subject<OrderChangeData> = new Subject<OrderChangeData>();

  get computedOrders(): Observable<OrderChangeData> {
    return this._computedOrders.asObservable();
  }

  queueOrderChange(oldOrder: number, newOrder: number) {
    this.reorderQueue[oldOrder] = newOrder;
  }

  resetReorderQueue() {
    this.reorderQueue = {};
  }

  broadcastOrderChanges() {
    const emptyReorderQueue =
      Object.keys(this.reorderQueue)
        .map(order => this.reorderQueue[order])
        .filter(newOrder => newOrder).length === 0;

    if (!emptyReorderQueue) {
      this._computedOrders.next(this.reorderQueue);
    }
  }

  private reorder(draggedFrom: number, draggedTo: number): void {
    this.resetReorderQueue();
    if (draggedTo > draggedFrom) {
      // Dragged to the right so each in-between columns should decrement their flex orders
      for (let i = draggedFrom + 1; i <= draggedTo; i++) {
        const newOrder = i - 1;
        this.queueOrderChange(i, newOrder);
      }
    } else if (draggedTo < draggedFrom) {
      // Dragged to the left so each in-between columns should decrement their flex orders
      for (let i = draggedFrom - 1; i >= draggedTo; i--) {
        const newOrder = i + 1;
        this.queueOrderChange(i, newOrder);
      }
    }
    this.queueOrderChange(draggedFrom, draggedTo);
    this.broadcastOrderChanges();
  }

  reorderViews(draggedView: ViewRef, targetView: ViewRef) {
    const draggedFrom = this.containerRef.indexOf(draggedView);
    const draggedTo = this.containerRef.indexOf(targetView);
    this.reorder(draggedFrom, draggedTo);
  }
}
