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
import { AnimationOptions } from '@angular/animations';
import { ClrDragEvent } from '../../../utils/drag-and-drop/drag-event';
import { DomAdapter } from '../../../utils/dom-adapter/dom-adapter';

let nbColumnsGroup = 0;

type ReorderData = {
  column: BehaviorSubject<ColumnState>;
  newFlexOrder: number;
};

export enum ReorderAnimationState {
  SHIFT = 'REORDER_SHIFT_ANIMATION',
  DROP = 'REORDER_DROP_ANIMATION',
}

export type ReorderDragTransfer = {
  draggedColumnEl: HTMLElement;
  flexOrder: number;
};

export type ReorderAnimationStateData = {
  value: ReorderAnimationState;
  params?: AnimationOptions;
};

type ReorderAnimationData = { [newFlexOrder: number]: ReorderAnimationStateData };

@Injectable()
export class ColumnsReorderService {
  // the common group id that will be shared across
  // Datagrids all reorder draggable and droppables
  private _columnsGroupId: string;

  private _reorderAnimation: Subject<ReorderAnimationData> = new Subject<ReorderAnimationData>();

  get reorderAnimation(): Observable<ReorderAnimationData> {
    return this._reorderAnimation.asObservable();
  }

  get columnsGroupId() {
    return this._columnsGroupId;
  }

  constructor(private columnsService: ColumnsService, private domAdapter: DomAdapter) {
    this._columnsGroupId = 'dg-column-group-' + nbColumnsGroup++;
  }

  private reorderQueue: ReorderData[];

  private reorderAnimationData: ReorderAnimationData;

  private queueFlexOrderChangeRequest(oldFlexOrder: number, newFlexOrder: number) {
    const columnToBeUpdated: BehaviorSubject<ColumnState> = this.columnsService.ofFlexOrder(oldFlexOrder);
    if (columnToBeUpdated) {
      this.reorderQueue.push({ column: columnToBeUpdated, newFlexOrder });
    }
  }

  private queueAnimationRequest(newFlexOrder: number, animationData: any) {
    this.reorderAnimationData[newFlexOrder] = animationData;
  }

  private triggerReorder() {
    this.reorderQueue.forEach(reorderData =>
      this.columnsService.emitStateChange(reorderData.column, {
        changes: [DatagridColumnChanges.FLEX_ORDER],
        flexOrder: reorderData.newFlexOrder,
      })
    );
  }

  private reorder(draggedFrom: number, draggedTo: number): void {
    this.reorderQueue = [];
    this.reorderAnimationData = {};
    if (draggedTo > draggedFrom) {
      // Dragged to the right so each in-between columns should decrement their flex orders
      for (let i = draggedFrom + 1; i <= draggedTo; i++) {
        const newFlexOrder = i - 1;
        this.queueFlexOrderChangeRequest(i, newFlexOrder);
        this.queueAnimationRequest(newFlexOrder, { value: ReorderAnimationState.SHIFT });
      }
    } else if (draggedTo < draggedFrom) {
      // Dragged to the left so each in-between columns should decrement their flex orders
      for (let i = draggedFrom - 1; i >= draggedTo; i--) {
        const newFlexOrder = i + 1;
        this.queueFlexOrderChangeRequest(i, newFlexOrder);
        this.queueAnimationRequest(newFlexOrder, { value: ReorderAnimationState.SHIFT });
      }
    }
    this.queueFlexOrderChangeRequest(draggedFrom, draggedTo);
    this.queueAnimationRequest(draggedTo, { value: ReorderAnimationState.DROP });
    this.triggerReorder();
  }

  private animateReorder(droppedEvent: ClrDragEvent<ReorderDragTransfer>, droppedOnFlexOrder: number) {
    const draggedTo = droppedOnFlexOrder;
    const draggedFrom = droppedEvent.dragDataTransfer.flexOrder;
    const draggedColumnClientRect = this.domAdapter.clientRect(droppedEvent.dragDataTransfer.draggedColumnEl);

    const shiftDirection = draggedTo > draggedFrom ? 1 : -1;
    const shiftWidth = shiftDirection * draggedColumnClientRect.width;
    const ghostDropDeltaX = droppedEvent.ghostAnchorPosition.pageX - draggedColumnClientRect.left;
    const ghostDropDeltaY = droppedEvent.ghostAnchorPosition.pageY - draggedColumnClientRect.top;

    Object.keys(this.reorderAnimationData).forEach(newFlexOrder => {
      const animationDataOfFlexOrder = this.reorderAnimationData[newFlexOrder];
      if (animationDataOfFlexOrder.value === ReorderAnimationState.SHIFT) {
        animationDataOfFlexOrder.params = { translateX: `${shiftWidth}px` };
      } else if (animationDataOfFlexOrder.value === ReorderAnimationState.DROP) {
        animationDataOfFlexOrder.params = {
          translateX: `${ghostDropDeltaX}px`,
          translateY: `${ghostDropDeltaY}px`,
        };
      }
    });
    this._reorderAnimation.next(this.reorderAnimationData);
  }

  reorderRequested(droppedEvent: ClrDragEvent<ReorderDragTransfer>, droppedOnFlexOrder: number) {
    this.reorder(droppedEvent.dragDataTransfer.flexOrder, droppedOnFlexOrder);
    this.animateReorder(droppedEvent, droppedOnFlexOrder);
  }
}
