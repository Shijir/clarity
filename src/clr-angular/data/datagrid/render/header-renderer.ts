/*
 * Copyright (c) 2016-2019 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Directive, ElementRef, EventEmitter, Inject, OnDestroy, Output, Renderer2 } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';

import { DomAdapter } from '../../../utils/dom-adapter/dom-adapter';
import { DatagridRenderStep } from '../enums/render-step.enum';
import { ColumnResizerService } from '../providers/column-resizer.service';
import { FIRST_VISIBLE_CLASS, HIDDEN_COLUMN_CLASS, LAST_VISIBLE_CLASS, STRICT_WIDTH_CLASS } from './constants';
import { DatagridRenderOrganizer } from './render-organizer';
import { ColumnState } from '../interfaces/column-state.interface';
import { DatagridColumnChanges } from '../enums/column-changes.enum';
import { COLUMN_STATE, COLUMN_STATE_PROVIDER } from '../providers/column-state.provider';
import { ColumnsService } from '../providers/columns.service';

@Directive({ selector: 'clr-dg-column', providers: [ColumnResizerService, COLUMN_STATE_PROVIDER] })
export class DatagridHeaderRenderer implements OnDestroy {
  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private organizer: DatagridRenderOrganizer,
    private domAdapter: DomAdapter,
    private columnResizerService: ColumnResizerService,
    private columnsService: ColumnsService,
    @Inject(COLUMN_STATE) private columnState: BehaviorSubject<ColumnState>
  ) {
    this.subscriptions.push(
      this.organizer.filterRenderSteps(DatagridRenderStep.CLEAR_WIDTHS).subscribe(() => this.clearWidth())
    );

    this.subscriptions.push(columnState.subscribe(state => this.stateChanges(state)));
  }

  @Output('clrDgColumnResize') resizeEmitter: EventEmitter<number> = new EventEmitter();

  /**
   * Indicates if the column has a strict width, so it doesn't shrink or expand based on the content.
   */
  private widthSet: boolean = false;
  private autoSet: boolean = false;

  private subscriptions: Subscription[] = [];

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private stateChanges(state: ColumnState) {
    if (state.changes && state.changes.length) {
      state.changes.forEach(change => {
        switch (change) {
          case DatagridColumnChanges.WIDTH:
            this.setWidth(state);
            break;
          case DatagridColumnChanges.HIDDEN:
            this.setHidden(state);
            break;
          case DatagridColumnChanges.FLEX_ORDER:
            this.setFlexOrder(state);
            break;
          case DatagridColumnChanges.FIRST_VISIBLE:
            this.setFirstVisible(state);
            break;
          case DatagridColumnChanges.LAST_VISIBLE:
            this.setLastVisible(state);
            break;
          default:
            break;
        }
      });
    }
  }

  private clearWidth() {
    // remove the width only if we set it, and it is not changed by dragging.
    if (this.widthSet && !this.columnResizerService.resizedBy) {
      this.renderer.setStyle(this.el.nativeElement, 'width', null);
    }
    if (this.autoSet) {
      this.renderer.removeClass(this.el.nativeElement, STRICT_WIDTH_CLASS);
    }
  }

  private detectStrictWidth(): number {
    if (this.columnResizerService.resizedBy) {
      return this.columnResizerService.widthAfterResize;
    } else if (this.autoSet) {
      return 0;
    } else {
      return this.domAdapter.userDefinedWidth(this.el.nativeElement);
    }
  }

  private computeWidth(strictWidth: number): number {
    let width: number = strictWidth;
    if (!width) {
      width = this.domAdapter.scrollWidth(this.el.nativeElement);
    }
    return width;
  }

  public getColumnWidthState(): Partial<ColumnState> {
    const strictWidth = this.detectStrictWidth();
    const isLastVisible = this.columnsService.flexOrderOfLastVisible === this.columnState.value.flexOrder;
    return {
      width: this.computeWidth(strictWidth),
      strictWidth: isLastVisible ? 0 : strictWidth,
    };
  }

  public assignFlexOrder(flexorder: number) {
    // we will use the dom order as position order if no flex order is defined...
    const computedOrder = this.domAdapter.computedFlexOrderOf(this.el.nativeElement);
    this.columnsService.emitStateChange(this.columnState, {
      changes: [DatagridColumnChanges.FLEX_ORDER],
      flexOrder: computedOrder === Number(computedOrder) ? computedOrder : flexorder,
    });
  }

  public setColumnState(index: number) {
    this.columnsService.columns[index] = this.columnState;
  }

  private setLastVisibleFree() {
    // If there is no flexible columns,
    // make the last visible column flexible.
    if (!this.columnsService.hasFlexibleColumns) {
      const flexOrderOfLastVisible = this.columnsService.flexOrderOfLastVisible;
      const columnOfLastVisible = this.columnsService.ofFlexOrder(flexOrderOfLastVisible);
      this.columnsService.emitStateChange(columnOfLastVisible, {
        changes: [DatagridColumnChanges.WIDTH],
        strictWidth: 0,
      });
    }
  }

  private setWidth(state: ColumnState) {
    if (state.strictWidth) {
      if (this.columnResizerService.resizedBy) {
        this.resizeEmitter.emit(state.width);
        this.renderer.setStyle(this.el.nativeElement, 'width', state.width + 'px');
        this.widthSet = false;
      }
      // Don't set width if there is a user-defined one. Just add the strict width class.
      this.renderer.addClass(this.el.nativeElement, STRICT_WIDTH_CLASS);
      this.autoSet = false;
    } else {
      this.renderer.removeClass(this.el.nativeElement, STRICT_WIDTH_CLASS);
      this.renderer.setStyle(this.el.nativeElement, 'width', state.width + 'px');
      this.widthSet = true;
      this.autoSet = true;
    }
  }

  private setHidden(state: ColumnState) {
    if (state.hidden) {
      this.renderer.addClass(this.el.nativeElement, HIDDEN_COLUMN_CLASS);
      this.setLastVisibleFree();
    } else {
      this.renderer.removeClass(this.el.nativeElement, HIDDEN_COLUMN_CLASS);
    }
  }

  private setFlexOrder(state: ColumnState) {
    // flex order must be an integer
    if (typeof state.flexOrder === 'number') {
      this.renderer.setStyle(this.el.nativeElement, 'order', state.flexOrder);
    }
  }

  private setFirstVisible(state: ColumnState) {
    if (state.firstVisible === true) {
      this.renderer.addClass(this.el.nativeElement, FIRST_VISIBLE_CLASS);
    } else if (state.firstVisible === false) {
      this.renderer.removeClass(this.el.nativeElement, FIRST_VISIBLE_CLASS);
    }
  }

  private setLastVisible(state: ColumnState) {
    if (state.lastVisible === true) {
      this.renderer.addClass(this.el.nativeElement, LAST_VISIBLE_CLASS);
    } else if (state.lastVisible === false) {
      this.renderer.removeClass(this.el.nativeElement, LAST_VISIBLE_CLASS);
    }
  }
}
