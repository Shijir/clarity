/*
 * Copyright (c) 2016-2018 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Injectable } from '@angular/core';
import { ColumnOrderModelService } from './column-order-model.service';
import { Observable, Subject } from 'rxjs';

let nbColumnGroup = 0;

export type OrderChangeData = {
  draggedOrderRef: ColumnOrderModelService;
  from: number;
  to: number;
};

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

  get columnGroupId() {
    return this._columnGroupId;
  }

  private _modelsChange = new Subject<OrderChangeData>();

  public get modelsChange(): Observable<OrderChangeData> {
    return this._modelsChange.asObservable();
  }

  constructor() {
    this._columnGroupId = 'dg-column-group-' + nbColumnGroup++;
  }

  public modelAtflexOrderOf(flexOrder: number): ColumnOrderModelService {
    return this.orderModels.filter(orderModel => orderModel.flexOrder === flexOrder)[0];
  }

  public reorder(from: number, to: number): void {
    const draggedOrderModel: ColumnOrderModelService = this.modelAtflexOrderOf(from);
    if (to > from) {
      // Dragged to the right so each in-between columns should decrement their flex orders
      for (let i = from + 1; i <= to; i++) {
        this.modelAtflexOrderOf(i).flexOrder = i - 1;
      }
    } else if (to < from) {
      // Dragged to the left so each in-between columns should decrement their flex orders
      for (let i = from - 1; i >= to; i--) {
        this.modelAtflexOrderOf(i).flexOrder = i + 1;
      }
    }
    draggedOrderModel.flexOrder = to;
    this._modelsChange.next({ draggedOrderModel, from, to });
  }
}
