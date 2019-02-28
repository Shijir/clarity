/*
 * Copyright (c) 2016-2018 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { isPlatformBrowser } from '@angular/common';
import {
  AfterContentInit,
  AfterViewChecked,
  AfterViewInit,
  ContentChildren,
  Directive,
  ElementRef,
  OnDestroy,
  PLATFORM_ID,
  QueryList,
  Renderer2,
} from '@angular/core';
import { Subscription } from 'rxjs';

import { ClrDatagridColumn } from '../datagrid-column';
import { DatagridRenderStep } from '../enums/render-step.enum';
import { Items } from '../providers/items';
import { Page } from '../providers/page';
import { TableSizeService } from '../providers/table-size.service';

import { DomAdapter } from '../../../utils/dom-adapter/dom-adapter';
import { DatagridHeaderRenderer } from './header-renderer';
import { NoopDomAdapter } from './noop-dom-adapter';
import { DatagridRenderOrganizer } from './render-organizer';
import { ColumnOrdersCoordinatorService, OrderChangeData } from '../providers/column-orders-coordinator.service';
import { ColumnOrderModelService } from '../providers/column-order-model.service';

// Fixes build error
// @dynamic (https://github.com/angular/angular/issues/19698#issuecomment-338340211)
export const domAdapterFactory = (platformId: Object) => {
  if (isPlatformBrowser(platformId)) {
    return new DomAdapter();
  } else {
    return new NoopDomAdapter();
  }
};

// Fixes build error
// @dynamic (https://github.com/angular/angular/issues/19698#issuecomment-338340211)
@Directive({
  selector: 'clr-datagrid',
  providers: [{ provide: DomAdapter, useFactory: domAdapterFactory, deps: [PLATFORM_ID] }],
})
export class DatagridMainRenderer<T = any> implements AfterContentInit, AfterViewInit, AfterViewChecked, OnDestroy {
  constructor(
    private organizer: DatagridRenderOrganizer,
    private items: Items,
    private page: Page,
    private domAdapter: DomAdapter,
    private el: ElementRef,
    private renderer: Renderer2,
    private tableSizeService: TableSizeService,
    private columnOrdersCoordinatorService: ColumnOrdersCoordinatorService
  ) {
    this.subscriptions.push(
      this.organizer
        .filterRenderSteps(DatagridRenderStep.COMPUTE_COLUMN_WIDTHS)
        .subscribe(() => this.computeHeadersWidth())
    );

    this.subscriptions.push(
      this.page.sizeChange.subscribe(() => {
        if (this._heightSet) {
          this.resetDatagridHeight();
        }
      })
    );
    this.subscriptions.push(this.items.change.subscribe(() => (this.shouldStabilizeColumns = true)));

    this.subscriptions.push(
      columnOrdersCoordinatorService.orderChange.subscribe((orderChangeData: OrderChangeData) =>
        this.renderHeaderOrders(orderChangeData)
      )
    );
  }

  @ContentChildren(DatagridHeaderRenderer) public headers: QueryList<DatagridHeaderRenderer>;
  @ContentChildren(ClrDatagridColumn) public columns: QueryList<ClrDatagridColumn>;

  ngAfterContentInit() {
    this.subscriptions.push(
      this.headers.changes.subscribe(() => {
        // TODO: only re-stabilize if a column was added or removed. Reordering is fine.
        this.columnsSizesStable = false;
        this.stabilizeColumns();
      })
    );

    // set initial order of the header
    this.setHeaderOrders();
  }

  // Initialize and set Table width for horizontal scrolling here.
  ngAfterViewInit() {
    this.tableSizeService.table = this.el;
  }

  ngAfterViewChecked() {
    if (this.shouldStabilizeColumns) {
      this.stabilizeColumns();
    }
    if (this.shouldComputeHeight()) {
      setTimeout(() => {
        this.computeDatagridHeight();
      });
    }
  }

  private _heightSet: boolean = false;

  private shouldComputeHeight(): boolean {
    if (!this._heightSet && this.page.size > 0) {
      if (this.items.displayed.length === this.page.size) {
        return true;
      }
    }
    return false;
  }

  /**
   * Computes the height of the datagrid.
   *
   * NOTE: We had to choose to set the height instead of the min-height because
   * IE 11 requires the height on the parent for the children flex grow/shrink properties to work.
   * When we used min-height, 1 1 auto doesn't used to work in IE11 :-(
   * But this doesn't affect the fix. It works in both fixed & variable height datagrids.
   *
   * Refer: http://stackoverflow.com/questions/24396205/flex-grow-not-working-in-internet-explorer-11-0
   */
  private computeDatagridHeight() {
    // IE doesn't return correct value for getComputedStyle(element).getPropertyValue("height")
    const value: number = this.domAdapter.clientRect(this.el.nativeElement).height;
    this.renderer.setStyle(this.el.nativeElement, 'height', value + 'px');
    this._heightSet = true;
  }

  private resetDatagridHeight() {
    this.renderer.setStyle(this.el.nativeElement, 'height', '');
    this._heightSet = false;
  }

  private subscriptions: Subscription[] = [];

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  /**
   * Makes each header compute its width.
   */
  private computeHeadersWidth() {
    const hasFlexibleWidths = this.headers.filter(header => !header.strictWidth).length > 0;
    this.headers.forEach((header, index) => {
      // if there is no header with a flexible width, make the last visible header's width flexible.
      if (!hasFlexibleWidths && header.orderModel.isLastVisible) {
        header.strictWidth = 0;
      }
      this.organizer.widths[index] = { px: header.computeWidth(), strict: !!header.strictWidth };
    });

    this.headers.forEach((header, index) => header.setWidth(this.organizer.widths[index].px));
  }

  /**
   * Indicates if we want to re-compute columns width. This should only happen:
   * 1) When headers change, with columns being added or removed
   * 2) When rows are lazily loaded for the first time
   */
  private columnsSizesStable = false;

  private shouldStabilizeColumns = true;

  /**
   * Triggers a whole re-rendring cycle to set column sizes, if needed.
   */
  private stabilizeColumns() {
    this.shouldStabilizeColumns = false;
    if (this.columnsSizesStable) {
      // Nothing to do.
      return;
    }
    // Resize when the rows are loaded.
    if (this.items.displayed.length > 0) {
      this.organizer.resize();
      this.columnsSizesStable = true;
    }
  }

  private setHeaderOrders(): void {
    this.headers.forEach((header, index) => {
      // set initial flex order
      header.setFlexOrder(index);
    });

    // set orders array with headers ColumnOrder
    this.columnOrdersCoordinatorService.orderModels = this.headers.map(header => {
      return header.orderModel;
    });
  }

  private renderHeaderOrders(orderChangeData: OrderChangeData): void {
    this.headers.forEach((header: DatagridHeaderRenderer, index: number) => {
      header.renderOrder(this.columnOrdersCoordinatorService.orderModels[index].flexOrder);
    });
    this.columns.forEach((column: ClrDatagridColumn) => {
      column.animateReorderShift(
        orderChangeData.draggedOrderModel.headerWidth,
        orderChangeData.from,
        orderChangeData.to
      );
    });
  }
}
