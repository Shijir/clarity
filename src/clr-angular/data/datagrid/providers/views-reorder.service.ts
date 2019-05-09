/*
 * Copyright (c) 2016-2019 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Injectable, OnDestroy, ViewContainerRef, ViewRef } from '@angular/core';

@Injectable()
export class ViewsReorderService {
  containerRef: ViewContainerRef;

  private reorderQueue: { view: ViewRef; newOrder: number }[];

  private queueOrderChange(oldOrder: number, newOrder: number) {
    const viewAtOldOrder = this.containerRef.get(oldOrder);
    if (viewAtOldOrder) {
      this.reorderQueue.push({ view: viewAtOldOrder, newOrder });
    }
  }

  private triggerReorder() {
    this.reorderQueue.forEach(orderChange => {
      this.containerRef.move(orderChange.view, orderChange.newOrder);
    });
  }

  private reorder(draggedFrom: number, draggedTo: number): void {
    this.reorderQueue = [];
    if (draggedTo > draggedFrom) {
      // Dragged to the right so each in-between columns should decrement their flex orders
      for (let i = draggedFrom + 1; i <= draggedTo; i++) {
        const newOrder = i - 1;
        this.queueOrderChange(i, newOrder);
      }
    } else if (draggedTo < draggedFrom) {
      // Dragged to the left so each in-between columns should decrement their flex orders
      for (let i = draggedFrom - 1; i >= draggedTo; i--) {
        const newOrder = i + 1;
        this.queueOrderChange(i, newOrder);
      }
    }
    this.queueOrderChange(draggedFrom, draggedTo);
    this.triggerReorder();
  }

  reorderViews(draggedView: ViewRef, targetView: ViewRef) {
    const draggedFrom = this.containerRef.indexOf(draggedView);
    const draggedTo = this.containerRef.indexOf(targetView);
    this.reorder(draggedFrom, draggedTo);
  }
}
