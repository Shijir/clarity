/*
 * Copyright (c) 2016-2019 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  ElementRef,
  EventEmitter,
  Injector,
  Input,
  Output,
  QueryList,
  Renderer2,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { combineLatest, Subscription } from 'rxjs';

import { Expand } from '../../utils/expand/providers/expand';
import { HostWrapper } from '../../utils/host-wrapping/host-wrapper';
import { LoadingListener } from '../../utils/loading/loading-listener';

import { ClrDatagridCell } from './datagrid-cell';
import { DatagridDisplayMode } from './enums/display-mode.enum';
import { DisplayModeService } from './providers/display-mode.service';
import { ExpandableRowsCount } from './providers/global-expandable-rows';
import { RowActionService } from './providers/row-action-service';
import { Selection } from './providers/selection';
import { WrappedRow } from './wrapped-row';
import { ClrCommonStrings } from '../../utils/i18n/common-strings.interface';
import { SelectionType } from './enums/selection-type';
import { ViewsReorderService } from './providers/views-reorder.service';

let nbRow: number = 0;

@Component({
  selector: 'clr-dg-row',
  templateUrl: './datagrid-row.html',
  host: {
    '[class.datagrid-row]': 'true',
    '[class.datagrid-selected]': 'selected',
    '[attr.aria-owns]': 'id',
    role: 'rowgroup',
  },
  providers: [Expand, { provide: LoadingListener, useExisting: Expand }],
})
export class ClrDatagridRow<T = any> implements AfterViewInit {
  public id: string;
  public radioId: string;
  public checkboxId: string;

  /* reference to the enum so that template can access */
  public SELECTION_TYPE = SelectionType;

  /**
   * Model of the row, to use for selection
   */
  @Input('clrDgItem') item: T;

  public replaced;

  constructor(
    public selection: Selection<T>,
    public rowActionService: RowActionService,
    public globalExpandable: ExpandableRowsCount,
    public expand: Expand,
    private displayMode: DisplayModeService,
    private vcr: ViewContainerRef,
    private renderer: Renderer2,
    private el: ElementRef,
    public commonStrings: ClrCommonStrings,
    private viewsReorderService: ViewsReorderService
  ) {
    nbRow++;
    this.id = 'clr-dg-row' + nbRow;
    this.radioId = 'clr-dg-row-rd' + nbRow;
    this.checkboxId = 'clr-dg-row-cb' + nbRow;

    this.subscriptions.push(
      combineLatest(this.expand.replace, this.expand.expandChange).subscribe(
        ([expandReplaceValue, expandChangeValue]) => {
          if (expandReplaceValue && expandChangeValue) {
            // replaced and expanding
            this.replaced = true;
            this.renderer.addClass(this.el.nativeElement, 'datagrid-row-replaced');
          } else {
            this.replaced = false;
            // Handles these cases: not replaced and collapsing & replaced and
            // collapsing and not replaced and expanding.
            this.renderer.removeClass(this.el.nativeElement, 'datagrid-row-replaced');
          }
        }
      )
    );
  }

  private _selected = false;
  /**
   * Indicates if the row is selected
   */
  public get selected() {
    if (this.selection.selectionType === SelectionType.None) {
      return this._selected;
    } else {
      return this.selection.isSelected(this.item);
    }
  }

  @Input('clrDgSelected')
  public set selected(value: boolean) {
    if (this.selection.selectionType === SelectionType.None) {
      this._selected = value;
    } else {
      this.selection.setSelected(this.item, value);
    }
  }

  @Output('clrDgSelectedChange') selectedChanged = new EventEmitter<boolean>(false);

  public toggle(selected = !this.selected) {
    if (selected !== this.selected) {
      this.selected = selected;
      this.selectedChanged.emit(selected);
    }
  }

  public get expanded() {
    return this.expand.expanded;
  }

  @Input('clrDgExpanded')
  public set expanded(value: boolean) {
    this.expand.expanded = value;
  }

  @Output('clrDgExpandedChange') expandedChange = new EventEmitter<boolean>(false);

  public toggleExpand() {
    if (this.expand.expandable) {
      this.expanded = !this.expanded;
      this.expandedChange.emit(this.expanded);
    }
  }

  /*****
   * property dgCells
   *
   * @description
   * A Query List of the ClrDatagrid cells in this row.
   *
   */
  @ContentChildren(ClrDatagridCell) dgCells: QueryList<ClrDatagridCell>;

  ngAfterViewInit() {
    this.subscriptions.push(
      this.displayMode.view.subscribe(viewChange => {
        // Listen for view changes and move cells around depending on the current displayType
        // remove cell views from display view
        for (let i = this._scrollableCells.length; i > 0; i--) {
          this._scrollableCells.detach();
        }
        // remove cell views from calculated view
        for (let i = this._calculatedCells.length; i > 0; i--) {
          this._calculatedCells.detach();
        }
        if (viewChange === DatagridDisplayMode.CALCULATE) {
          this.displayCells = false;
          this.insertCellViews(this._calculatedCells);
        } else {
          this.displayCells = true;
          this.insertCellViews(this._scrollableCells);
        }
      })
    );

    // A subscription that listens for view reordering
    this.subscriptions.push(
      this.viewsReorderService.reorderCompleted.subscribe(() => {
        for (let i = this._scrollableCells.length; i > 0; i--) {
          this._scrollableCells.detach();
        }
        this.insertCellViews(this._scrollableCells);
      })
    );
  }

  private subscriptions: Subscription[] = [];

  ngOnDestroy() {
    this.subscriptions.forEach((sub: Subscription) => sub.unsubscribe());
  }

  public displayCells = false;

  @ViewChild('stickyCells', { read: ViewContainerRef })
  _stickyCells: ViewContainerRef;
  @ViewChild('scrollableCells', { read: ViewContainerRef })
  _scrollableCells: ViewContainerRef;
  @ViewChild('calculatedCells', { read: ViewContainerRef })
  _calculatedCells: ViewContainerRef;

  private wrappedInjector: Injector;

  ngOnInit() {
    this.wrappedInjector = new HostWrapper(WrappedRow, this.vcr);
  }

  public get _view() {
    return this.wrappedInjector.get(WrappedRow, this.vcr).rowView;
  }

  private insertCellViews(containerRef: ViewContainerRef): void {
    // console.log(containerRef.injector.get(ChangeDetectorRef));
    containerRef.injector.get(ChangeDetectorRef).detectChanges();
    // insert column views in their new orders
    this.setCellsOrdered().forEach(cell => containerRef.insert(cell._view));
  }

  private setCellsOrdered(): ClrDatagridCell[] {
    return this.dgCells
      .map((cell, index) => {
        if (this.viewsReorderService.orderAt(index) > -1) {
          cell.order = this.viewsReorderService.orderAt(index);
        } else {
          cell.order = index;
        }
        return cell;
      })
      .sort((cell1, cell2) => cell1.order - cell2.order)
      .map((cell, index) => {
        cell.order = index;
        return cell;
      });
  }
}
