/*
 * Copyright (c) 2016-2019 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Injectable, ViewContainerRef, ViewRef } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ColumnsService } from './columns.service';
import { DatagridColumnChanges } from '../enums/column-changes.enum';

let nbColumnsGroup = 0;

@Injectable()
export class ColumnReorderService {
  // the common group id that will be shared across
  // Datagrids all reorder draggable and droppables
  private _columnsGroupId: string;

  get columnsGroupId() {
    return this._columnsGroupId;
  }

  constructor(private columnsService: ColumnsService) {
    this._columnsGroupId = 'dg-column-group-' + nbColumnsGroup++;
  }

  containerRef: ViewContainerRef;

  // ClrDatagrid updates this array of order values after re-ordering happens.
  // Then, rows will change their cell position according to its order values in this array.
  // So when re-ordering happens, we broadcast through "reorderCompleted" subject to notify rows.
  private orders: number[];

  private reorderQueue: number[] = [];

  private _reorderRequested: Subject<number[]> = new Subject<number[]>();

  get reorderRequested(): Observable<number[]> {
    return this._reorderRequested.asObservable();
  }

  private _reorderCompleted: Subject<void> = new Subject<void>();

  get reorderCompleted(): Observable<void> {
    return this._reorderCompleted.asObservable();
  }

  private queueOrderChange(oldOrder: number, newOrder: number) {
    this.reorderQueue[oldOrder] = newOrder;
  }

  private broadcastReorderRequest() {
    const emptyReorderQueue =
      Object.keys(this.reorderQueue)
        .map(order => this.reorderQueue[order])
        .filter(newOrder => typeof newOrder === 'number').length === 0;

    if (!emptyReorderQueue) {
      this._reorderRequested.next(this.reorderQueue);
    }
  }

  public orderAt(index: number): number {
    if (this.orders && typeof this.orders[index] === 'number') {
      return this.orders[index];
    }
    return -1;
  }

  public updateOrders(orders: number[], afterReordering = false): void {
    if (orders) {
      // update with new orders
      this.orders = orders;

      // update the columns states with their new orders
      this.orders.forEach((order, index) => {
        this.columnsService.emitStateChangeAt(index, { changes: [DatagridColumnChanges.ORDER], order: order });
      });

      // notify whatever that needs to respond to reorder changes
      if (afterReordering) {
        this._reorderCompleted.next();
      }

      this.columnsService.requestFirstVisibleCheck();
      this.columnsService.requestLastVisibleCheck();
    }
  }

  private reorder(draggedFrom: number, draggedTo: number): void {
    this.reorderQueue = [];
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
    this.broadcastReorderRequest();
  }

  reorderViews(draggedView: ViewRef, targetView: ViewRef) {
    const draggedFrom = this.containerRef.indexOf(draggedView);
    const draggedTo = this.containerRef.indexOf(targetView);
    this.reorder(draggedFrom, draggedTo);
  }
}
