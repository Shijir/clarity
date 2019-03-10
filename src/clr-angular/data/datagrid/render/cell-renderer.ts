/*
 * Copyright (c) 2016-2018 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Directive, ElementRef, OnDestroy, Renderer2 } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

import { DatagridRenderStep } from '../enums/render-step.enum';

import { STRICT_WIDTH_CLASS } from './constants';
import { DatagridRenderOrganizer } from './render-organizer';
import { ColumnOrderModelService } from '../providers/column-order-model.service';
import { OrderChangeData } from '../providers/column-orders-coordinator.service';

@Directive({ selector: 'clr-dg-cell' })
export class DatagridCellRenderer implements OnDestroy {
  columnOrderModel: ColumnOrderModelService;

  constructor(private el: ElementRef, private renderer: Renderer2, organizer: DatagridRenderOrganizer) {
    this.subscriptions.push(
      organizer.filterRenderSteps(DatagridRenderStep.CLEAR_WIDTHS).subscribe(() => this.clearWidth())
    );
  }

  private subscriptions: Subscription[] = [];

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this._columnModelSubscription!.unsubscribe();
  }

  private clearWidth() {
    this.renderer.removeClass(this.el.nativeElement, STRICT_WIDTH_CLASS);
    this.renderer.setStyle(this.el.nativeElement, 'width', null);
  }

  public setWidth(strict: boolean, value: number) {
    if (strict) {
      this.renderer.addClass(this.el.nativeElement, STRICT_WIDTH_CLASS);
    } else {
      this.renderer.removeClass(this.el.nativeElement, STRICT_WIDTH_CLASS);
    }
    this.renderer.setStyle(this.el.nativeElement, 'width', value + 'px');
  }

  private _columnModel: ColumnOrderModelService;

  private _columnModelSubscription: Subscription;

  public setColumnModel(columnModel: ColumnOrderModelService) {
    this._columnModel = columnModel;
    // RowRenderer lets all CellRenderer to subscribe in through
    // Every time cell change occurs, we run cells' subscriptions again
    // So we need to guard against the same cell from subscribing to the same model change more than once
    // That's why I haven't push the subscription to array as it would hard to access it back
    // Saving it to the specific property is easier to access and unsubscribe.
    if (this._columnModelSubscription) {
      this._columnModelSubscription.unsubscribe();
    }
    this._columnModelSubscription = this._columnModel.orderChange.subscribe(() => {
      this.renderOrder(this._columnModel.flexOrder);
    });
  }

  public renderOrder(flexOrder: number) {
    this.renderer.setStyle(this.el.nativeElement, 'order', flexOrder);
  }
}
