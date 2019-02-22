/*
 * Copyright (c) 2016-2018 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Injectable } from '@angular/core';
import { ColumnOrdersCoordinatorService } from './column-orders-coordinator.service';
import { DatagridHideableColumnModel } from '../datagrid-hideable-column.model';
import { DomAdapter } from '../../../utils/dom-adapter/dom-adapter';
import { DragEventInterface } from '../../../utils/drag-and-drop/interfaces/drag-event.interface';

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

  get isLastVisible(): boolean {
    // the last visible header wouldn't have next visible column, and it should be visible itself.
    return !this.nextVisibleColumnModel && !this.isHidden;
  }

  public dropReceived(dropEvent: DragEventInterface<ColumnOrderModelService>) {
    const droppedColumnOrderModel: ColumnOrderModelService = dropEvent.dragDataTransfer;
    const from = droppedColumnOrderModel.flexOrder;
    const to = this.flexOrder;

    droppedColumnOrderModel.flexOrder = this.flexOrder;

    if (to > from) {
      // Dragged to the right so each in-between columns should decrement their flex orders
      for (let i = from + 1; i < to; i++) {
        this.columnOrderCoordinatorService.modelAtflexOrderOf(i).flexOrder = i - 1;
      }
      this.flexOrder = this.flexOrder - 1;
    } else if (to < from) {
      // Dragged to the left so each in-between columns should decrement their flex orders
      for (let i = from - 1; i > to; i--) {
        this.columnOrderCoordinatorService.modelAtflexOrderOf(i).flexOrder = i + 1;
      }
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
