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
import { ColumnOrdersCoordinatorService, OrderChangeData } from '../providers/column-orders-coordinator.service';

@Directive({ selector: 'clr-dg-row, clr-dg-row-detail' })
export class DatagridRowRenderer implements AfterContentInit, OnDestroy {
  constructor(
    private organizer: DatagridRenderOrganizer,
    private columnOrdersCoordinatorService: ColumnOrdersCoordinatorService
  ) {
    this.subscriptions.push(
      organizer.filterRenderSteps(DatagridRenderStep.ALIGN_COLUMNS).subscribe(() => this.setWidths())
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

  public setCellOrders(): void {
    // possible to link with individual column order model service
    if (this.columnOrdersCoordinatorService.orderModels.length === 0) {
      return;
    }
    // TODO: how about dynamic column
    this.cells.forEach((cell: DatagridCellRenderer, index: number) => {
      cell.setColumnModel(this.columnOrdersCoordinatorService.orderModels[index]);
    });
  }

  ngAfterContentInit() {
    this.cells.changes.subscribe(() => {
      this.setWidths();
      this.setCellOrders(); // necessary in case of async loading cell detail
    });
  }

  ngAfterViewInit() {
    this.setWidths();
    this.setCellOrders(); // necessary in case of async loading rows or loading rows in another page
  }
}
