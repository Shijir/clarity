/*
 * Copyright (c) 2016-2018 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ColumnOrderModelService } from './column-order-model.service';

let nbColumnGroup = 0;

@Injectable()
export class ColumnOrderCoordinatorService {
  // Here, the order of the items inside the array below should
  // match the order of the QueryList of headers.
  public orderModels: ColumnOrderModelService[] = [];

  private _columnGroupId: string;

  get columnGroupId() {
    return this._columnGroupId;
  }

  constructor() {
    this._columnGroupId = 'dg-column-group-' + nbColumnGroup++;
  }

  private ordersUpdate = new Subject<void>();

  public get ordersUpdated(): Observable<void> {
    return this.ordersUpdate.asObservable();
  }

  public broadcastOrdersUpdate(): void {
    this.ordersUpdate.next();
  }

  public orderModelOfFlexOrder(flexOrder: number): ColumnOrderModelService {
    return this.orderModels.filter(orderModel => orderModel.flexOrder === flexOrder)[0];
  }
}
