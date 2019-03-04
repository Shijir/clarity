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
  draggedFrom: number;
  draggedTo: number;
  draggedModelRef: ColumnOrderModelService;
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

  public broadcastModelsChange(orderChangeData?: OrderChangeData) {
    this._modelsChange.next(orderChangeData);
  }

  constructor() {
    this._columnGroupId = 'dg-column-group-' + nbColumnGroup++;
  }

  public modelAtflexOrderOf(flexOrder: number): ColumnOrderModelService {
    return this.orderModels.filter(orderModel => orderModel.flexOrder === flexOrder)[0];
  }

  public reorder(draggedFrom: number, draggedTo: number): void {
    const draggedModelRef: ColumnOrderModelService = this.modelAtflexOrderOf(draggedFrom);
    if (draggedTo > draggedFrom) {
      // Dragged to the right so each in-between columns should decrement their flex orders
      for (let i = draggedFrom + 1; i <= draggedTo; i++) {
        this.modelAtflexOrderOf(i).flexOrder = i - 1;
      }
    } else if (draggedTo < draggedFrom) {
      // Dragged to the left so each in-between columns should decrement their flex orders
      for (let i = draggedFrom - 1; i >= draggedTo; i--) {
        this.modelAtflexOrderOf(i).flexOrder = i + 1;
      }
    }
    draggedModelRef.flexOrder = draggedTo;
    this.broadcastModelsChange({ draggedFrom, draggedTo, draggedModelRef });
  }
}
