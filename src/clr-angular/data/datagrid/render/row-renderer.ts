/*
 * Copyright (c) 2016-2018 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { AfterContentInit, ContentChildren, Directive, OnDestroy, QueryList } from '@angular/core';
import { Subscription } from 'rxjs';

import { DatagridRenderStep } from '../enums/render-step.enum';

import { DatagridCellRenderer } from './cell-renderer';
import { DatagridRenderOrganizer } from './render-organizer';
import { ColumnOrderCoordinatorService } from '../providers/column-order-coordinator.service';

@Directive({ selector: 'clr-dg-row, clr-dg-row-detail' })
export class DatagridRowRenderer implements AfterContentInit, OnDestroy {
  constructor(
    private organizer: DatagridRenderOrganizer,
    private columnOrderCoordinatorService: ColumnOrderCoordinatorService
  ) {
    this.subscriptions.push(
      this.organizer.filterRenderSteps(DatagridRenderStep.ALIGN_COLUMNS).subscribe(() => this.setWidths()),
      this.columnOrderCoordinatorService.ordersUpdated.subscribe(() => this.renderCellOrders())
    );
  }

  private subscriptions: Subscription[] = [];
  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  @ContentChildren(DatagridCellRenderer) cells: QueryList<DatagridCellRenderer>;

  private setWidths() {
    if (this.organizer.widths.length !== this.cells.length) {
      return;
    }
    this.cells.forEach((cell, index) => {
      const width = this.organizer.widths[index];
      cell.setWidth(width.strict, width.px);
    });
  }

  private renderCellOrders(): void {
    // TODO: understand this below and add comment
    if (this.columnOrderCoordinatorService.orderModels.length !== this.cells.length) {
      return;
    }
    this.cells.forEach((cell, index) => {
      cell.renderFlexOrder(this.columnOrderCoordinatorService.orderModels[index].flexOrder);
    });
  }

  ngAfterContentInit() {
    this.cells.changes.subscribe(() => {
      this.setWidths();
      this.renderCellOrders();
    });
  }

  ngAfterViewInit() {
    this.setWidths();
  }
}
