/*
 * Copyright (c) 2016-2018 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Injectable } from '@angular/core';
import { ColumnOrderCoordinatorService } from './column-order-coordinator.service';

@Injectable()
export class ColumnOrderModelService {
  constructor(private columnOrderCoordinatorService: ColumnOrderCoordinatorService) {}

  public flexOrder: number;

  get dropKey() {
    return this.columnOrderCoordinatorService.columnGroupId;
  }

  dropReceived(dropEvent: any) {
    // Each column header has a corresponding index in the array, orders.

    // 1.   replace the flexorder at the drag index with the one at the drop index

    // 2.   a.  if dragged from left to right,
    //          decrease flexorder of each column from the drag index plus one to the drop index
    //      b.  if dragged from right to left,
    //          increase flexorder of each column from the drag index minus one to the drop index

    // Drag from left to right:
    // At the start : ["fo0", "fo1", "fo2", "fo3", "fo4"]
    // At the end   : ["fo0", "fo3", "fo1", "fo2", "fo4"]

    // Drag from right to left:
    // At the start : ["fo0", "fo1", "fo2", "fo3", "fo4"]
    // At the end   : ["fo0", "fo2", "fo3", "fo1", "fo4"]

    const from = dropEvent.dragDataTransfer.flexOrder;
    const to = this.flexOrder;

    if (to > from) {
      for (let i = from + 1; i < to; i++) {
        this.columnOrderCoordinatorService.orderModelOfFlexOrder(i).flexOrder = i - 1;
      }

      dropEvent.dragDataTransfer.flexOrder = this.flexOrder;
      this.flexOrder = this.flexOrder - 1;
    } else if (to < from) {
      for (let i = from - 1; i > to; i--) {
        this.columnOrderCoordinatorService.orderModelOfFlexOrder(i).flexOrder = i + 1;
      }

      dropEvent.dragDataTransfer.flexOrder = this.flexOrder;
      this.flexOrder = this.flexOrder + 1;
    }

    this.columnOrderCoordinatorService.broadcastOrdersUpdate();
  }
}
