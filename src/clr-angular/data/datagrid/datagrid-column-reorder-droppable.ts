/*
 * Copyright (c) 2016-2018 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, Renderer2 } from '@angular/core';
import { TableSizeService } from './providers/table-size.service';
import { ColumnOrderModelService } from './providers/column-order-model.service';

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
    private tableSizeService: TableSizeService,
    private renderer: Renderer2,
    private columnOrderModel: ColumnOrderModelService
  ) {}

  public get columnOrderDropKey() {
    return this.columnOrderModel.dropKey;
  }

  setDropTolerance(event: any) {
    this.dropTolerance = 10;
  }

  updateOrder(event: any, dropLineEl: any): void {
    this.columnOrderModel.dropReceived(event);
    this.hideHighlight(dropLineEl);
  }

  showHighlight(dropLineEl: any) {
    this.renderer.setStyle(dropLineEl, 'height', `${this.tableSizeService.getColumnDragHeight()}`);
  }

  hideHighlight(dropLineEl: any) {
    this.renderer.setStyle(dropLineEl, 'height', `0px`);
  }
}
