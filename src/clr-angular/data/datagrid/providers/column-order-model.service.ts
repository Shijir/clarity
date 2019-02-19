/*
 * Copyright (c) 2016-2018 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Injectable } from '@angular/core';
import { ColumnOrdersCoordinatorService } from './column-orders-coordinator.service';
import { DatagridHideableColumnModel } from '../datagrid-hideable-column.model';
import { DomAdapter } from '../../../utils/dom-adapter/dom-adapter';

/**
 * This is a model service that's responsible for:
 * 1. Sharing the flex order data between datagrid-column and reorderabble-droppable
 * 2. Updating the flex order data and tells ColumnOrderCoordinatorService when it should broadcast
 * 3. Returning models at the previous and next flex orders
 */

@Injectable()
export class ColumnOrderModelService {
  constructor(private columnOrderCoordinatorService: ColumnOrdersCoordinatorService, private domAdapter: DomAdapter) {}

  public flexOrder: number;

  public headerEl: any;

  public hideableColumnModel: DatagridHideableColumnModel;

  get columnGroupId() {
    return this.columnOrderCoordinatorService.columnGroupId;
  }

  get isFirst(): boolean {
    return this.flexOrder === 0;
  }

  get isLast(): boolean {
    return this.flexOrder === this.columnOrderCoordinatorService.orderModels.length - 1;
  }

  get isHidden(): boolean {
    return this.hideableColumnModel && this.hideableColumnModel.hidden;
  }

  public dropReceived(dropEvent: any) {
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
        this.columnOrderCoordinatorService.modelAtflexOrderOf(i).flexOrder = i - 1;
      }

      dropEvent.dragDataTransfer.flexOrder = this.flexOrder;
      this.flexOrder = this.flexOrder - 1;
    } else if (to < from) {
      for (let i = from - 1; i > to; i--) {
        this.columnOrderCoordinatorService.modelAtflexOrderOf(i).flexOrder = i + 1;
      }

      dropEvent.dragDataTransfer.flexOrder = this.flexOrder;
      this.flexOrder = this.flexOrder + 1;
    }

    // headers and cells will listen to the following broadcast and render their flex orders correspondingly
    this.columnOrderCoordinatorService.broadcastOrderChange();
  }

  private findAdjacentVisibleModel(prev = false): ColumnOrderModelService {
    const filteredVisibleColumnModels = this.columnOrderCoordinatorService.orderModels
      .filter(model => !model.isHidden && (prev ? model.flexOrder < this.flexOrder : model.flexOrder > this.flexOrder))
      .sort(model => model.flexOrder);

    return prev ? filteredVisibleColumnModels[filteredVisibleColumnModels.length - 1] : filteredVisibleColumnModels[0];
  }

  get nextVisibleColumnModel(): ColumnOrderModelService {
    return this.findAdjacentVisibleModel(false);
  }

  get previousVisibleColumnModel(): ColumnOrderModelService {
    return this.findAdjacentVisibleModel(true);
  }

  private _headerWidth: number;

  set headerWidth(value: number) {
    this._headerWidth = value;
  }

  get headerWidth() {
    return this._headerWidth ? this._headerWidth : this.domAdapter.clientRect(this.headerEl).width;
  }

  get nextVisibleHeaderWidth(): number {
    return this.nextVisibleColumnModel ? this.nextVisibleColumnModel.headerWidth : 0;
  }

  get previousVisibleHeaderWidth(): number {
    return this.previousVisibleColumnModel ? this.previousVisibleColumnModel.headerWidth : 0;
  }

  // TODO: This service will be expanded in the next PR
}
