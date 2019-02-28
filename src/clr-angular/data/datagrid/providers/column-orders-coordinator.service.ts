/*
 * Copyright (c) 2016-2018 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Injectable } from '@angular/core';
import { ColumnOrderModelService } from './column-order-model.service';
import { Observable, Subject } from 'rxjs';

let nbColumnGroup = 0;

/**
 * This service is responsible for:
 * 1. Sharing order model data across headers and cells
 * 2. Broadcasting order model update
 */

@Injectable()
export class ColumnOrdersCoordinatorService {
  // Here, the order of the items inside the array below should
  // match the order of the QueryList of headers.
  public orderModels: ColumnOrderModelService[] = [];

  // the common group id that will be shared across Datagrids all reorder draggable and droppables
  private _columnGroupId: string;

  private _orderChange = new Subject<ColumnOrderModelService>();

  get columnGroupId() {
    return this._columnGroupId;
  }

  public get orderChange(): Observable<ColumnOrderModelService> {
    return this._orderChange.asObservable();
  }

  constructor() {
    this._columnGroupId = 'dg-column-group-' + nbColumnGroup++;
  }

  public modelAtflexOrderOf(flexOrder: number): ColumnOrderModelService {
    return this.orderModels.filter(orderModel => orderModel.flexOrder === flexOrder)[0];
  }

  public reorder(from: number, to: number): void {
    const modelOfDraggableHeader: ColumnOrderModelService = this.modelAtflexOrderOf(from);
    const modelOfDroppableHeader: ColumnOrderModelService = this.modelAtflexOrderOf(to);
    // First, the column that has been dragged should get the flex order of the column it has been dropped on.
    modelOfDraggableHeader.flexOrder = to;
    if (to > from) {
      // Dragged to the right so each in-between columns should decrement their flex orders
      for (let i = from + 1; i < to; i++) {
        this.modelAtflexOrderOf(i).flexOrder = i - 1;
      }
      modelOfDroppableHeader.flexOrder = to - 1;
    } else if (to < from) {
      // Dragged to the left so each in-between columns should decrement their flex orders
      for (let i = from - 1; i > to; i--) {
        this.modelAtflexOrderOf(i).flexOrder = i + 1;
      }
      modelOfDroppableHeader.flexOrder = to + 1;
    }
    this._orderChange.next(modelOfDraggableHeader);
  }
}
