/*
 * Copyright (c) 2016-2018 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ColumnOrderModelService } from './column-order-model.service';

let nbColumnGroup = 0;

@Injectable()
export class ColumnOrderCoordinatorService {
  // Here, the order of the items inside the array below should
  // match the order of the QueryList of headers.
  public orders: ColumnOrderModelService[] = [];

  private _columnGroupId: string;

  get columnGroupId() {
    return this._columnGroupId;
  }

  constructor() {
    this._columnGroupId = 'dg-column-group-' + nbColumnGroup++;
  }

  public positionOrdersUpdated = new Subject<any>();

  public flexOrderOf(flexOrder: number): ColumnOrderModelService {
    return this.orders.filter(orderModel => orderModel.flexOrder === flexOrder)[0];
  }
}
