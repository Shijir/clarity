/*
 * Copyright (c) 2016-2019 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ColumnsService } from './columns.service';
import { ColumnState } from '../interfaces/column-state.interface';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { DatagridColumnChanges } from '../enums/column-changes.enum';
import { Injectable } from '@angular/core';
import { ClrDragEvent } from '../../../utils/drag-and-drop/drag-event';
import { DomAdapter } from '../../../utils/dom-adapter/dom-adapter';
import { ReorderAnimationState } from '../enums/reorder-animation-state.enum';
import { ReorderAnimationModel } from '../interfaces/reorder-animation-data.interface';

let nbColumnsGroup = 0;

type ReorderQueueData = {
  column: BehaviorSubject<ColumnState>;
  newOrder: number;
};

export type ColumnReorderData = {
  draggedColumnEl: HTMLElement;
  order: number;
};

@Injectable()
export class ColumnsReorderService {
  // the common group id that will be shared across
  // Datagrids all reorder draggable and droppables
  private _columnsGroupId: string;

  private _reorderComplete: Subject<void> = new Subject<void>();
  private _reorderAnimation: Subject<ReorderAnimationModel> = new Subject<ReorderAnimationModel>();

  get reorderComplete(): Observable<void> {
    return this._reorderAnimation.asObservable();
  }

  get reorderAnimation(): Observable<ReorderAnimationModel> {
    return this._reorderAnimation.asObservable();
  }

  get columnsGroupId() {
    return this._columnsGroupId;
  }

  constructor(private columnsService: ColumnsService, private domAdapter: DomAdapter) {
    this._columnsGroupId = 'dg-column-group-' + nbColumnsGroup++;
  }

  private reorderQueue: ReorderQueueData[];

  private reorderAnimationModel: ReorderAnimationModel;

  private queueOrderChangeRequest(oldOrder: number, newOrder: number) {
    const columnToBeUpdated: BehaviorSubject<ColumnState> = this.columnsService.ofOrder(oldOrder);
    if (columnToBeUpdated) {
      this.reorderQueue.push({ column: columnToBeUpdated, newOrder });
    }
  }

  private queueAnimationRequest(newOrder: number, animationData: any) {
    this.reorderAnimationModel[newOrder] = animationData;
  }

  private triggerReorder() {
    this.reorderQueue.forEach(reorderData =>
      this.columnsService.emitStateChange(reorderData.column, {
        changes: [DatagridColumnChanges.FLEX_ORDER],
        order: reorderData.newOrder,
      })
    );
    this._reorderComplete.next();
  }

  private reorder(draggedFrom: number, draggedTo: number): void {
    this.reorderQueue = [];
    this.reorderAnimationModel = {};
    if (draggedTo > draggedFrom) {
      // Dragged to the right so each in-between columns should decrement their flex orders
      for (let i = draggedFrom + 1; i <= draggedTo; i++) {
        const newOrder = i - 1;
        this.queueOrderChangeRequest(i, newOrder);
        this.queueAnimationRequest(newOrder, { value: ReorderAnimationState.SHIFT });
      }
    } else if (draggedTo < draggedFrom) {
      // Dragged to the left so each in-between columns should decrement their flex orders
      for (let i = draggedFrom - 1; i >= draggedTo; i--) {
        const newOrder = i + 1;
        this.queueOrderChangeRequest(i, newOrder);
        this.queueAnimationRequest(newOrder, { value: ReorderAnimationState.SHIFT });
      }
    }
    this.queueOrderChangeRequest(draggedFrom, draggedTo);
    this.queueAnimationRequest(draggedTo, { value: ReorderAnimationState.DROP });
    this.triggerReorder();
  }

  private animateReorder(droppedEvent: ClrDragEvent<ColumnReorderData>, droppedOnOrder: number) {
    const draggedTo = droppedOnOrder;
    const draggedFrom = droppedEvent.dragDataTransfer.order;
    const draggedColumnClientRect = this.domAdapter.clientRect(droppedEvent.dragDataTransfer.draggedColumnEl);

    const shiftDirection = draggedTo > draggedFrom ? 1 : -1;
    const shiftWidth = shiftDirection * draggedColumnClientRect.width;
    const ghostDropDeltaX = droppedEvent.ghostAnchorPosition.pageX - draggedColumnClientRect.left;
    const ghostDropDeltaY = droppedEvent.ghostAnchorPosition.pageY - draggedColumnClientRect.top;

    Object.keys(this.reorderAnimationModel).forEach(newOrder => {
      const animationDataOfOrder = this.reorderAnimationModel[newOrder];
      if (animationDataOfOrder.value === ReorderAnimationState.SHIFT) {
        animationDataOfOrder.params = { translateX: `${shiftWidth}px` };
      } else if (animationDataOfOrder.value === ReorderAnimationState.DROP) {
        animationDataOfOrder.params = {
          translateX: `${ghostDropDeltaX}px`,
          translateY: `${ghostDropDeltaY}px`,
        };
      }
    });
    this._reorderAnimation.next(this.reorderAnimationModel);
  }

  reorderRequested(droppedEvent: ClrDragEvent<ColumnReorderData>, droppedOnOrder: number) {
    this.reorder(droppedEvent.dragDataTransfer.order, droppedOnOrder);
    this.animateReorder(droppedEvent, droppedOnOrder);
  }
}
