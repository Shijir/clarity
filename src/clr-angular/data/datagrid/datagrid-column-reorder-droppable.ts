/*
 * Copyright (c) 2016-2018 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, ElementRef, Input, Renderer2, SkipSelf } from '@angular/core';
import { TableSizeService } from './providers/table-size.service';
import { ColumnOrderModelService } from './providers/column-order-model.service';
import { DomAdapter } from '../../utils/dom-adapter/dom-adapter';

export const enum ColumnHeaderSides {
  Left,
  Right,
}

@Component({
  selector: 'clr-dg-column-reorder-droppable',
  template: `
    <div class="datagrid-column-reorder-droppable" clrDroppable [clrGroup]="columnOrderDropKey"
         (clrDragStart)="setDropTolerance($event)"
         (clrDragEnter)="showHighlight(dropLine)"
         (clrDragLeave)="hideHighlight(dropLine)"
         (clrDrop)="updateOrder($event, dropLine)" [clrDropTolerance]="dropTolerance">
      <div class="datagrid-column-drop-line" #dropLine></div>
    </div>
  `,
})
export class ClrDatagridColumnReorderDroppable {
  dropTolerance: any;

  constructor(
    @SkipSelf() private headerElRef: ElementRef,
    private tableSizeService: TableSizeService,
    private columnOrderModel: ColumnOrderModelService,
    private renderer: Renderer2,
    private domAdapter: DomAdapter
  ) {}

  @Input('side') side: ColumnHeaderSides;

  public get columnOrderDropKey() {
    return this.columnOrderModel.dropKey;
  }

  setDropTolerance(event: any) {
    const draggedFrom: number = event.dragDataTransfer.flexOrder;

    if (draggedFrom < this.columnOrderModel.flexOrder) {
      if (this.side === ColumnHeaderSides.Right) {
        this.dropTolerance = { left: this.domAdapter.clientRect(this.headerElRef.nativeElement).width / 2 };
      } else if (this.side === ColumnHeaderSides.Left) {
        this.dropTolerance = -1;
      }
    } else if (draggedFrom > this.columnOrderModel.flexOrder) {
      if (this.side === ColumnHeaderSides.Left) {
        this.dropTolerance = { right: this.domAdapter.clientRect(this.headerElRef.nativeElement).width / 2 };
      } else if (this.side === ColumnHeaderSides.Right) {
        this.dropTolerance = -1;
      }
    } else {
      this.dropTolerance = -1;
    }
  }

  showHighlight(dropLineEl: any) {
    this.renderer.setStyle(dropLineEl, 'height', `${this.tableSizeService.getColumnDragHeight()}`);
  }

  hideHighlight(dropLineEl: any) {
    this.renderer.setStyle(dropLineEl, 'height', `0px`);
  }

  updateOrder(droppedColumnModel: ColumnOrderModelService, dropLineEl: any): void {
    this.columnOrderModel.dropReceived(droppedColumnModel);
    this.hideHighlight(dropLineEl);
  }
}
