/*
 * Copyright (c) 2016-2019 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import {
  AfterContentInit,
  AfterViewInit,
  Component,
  ContentChild,
  ContentChildren,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnDestroy,
  Output,
  QueryList,
  Renderer2,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { Subscription } from 'rxjs';

import { ClrDatagridColumn } from './datagrid-column';
import { ClrDatagridItems } from './datagrid-items';
import { ClrDatagridPlaceholder } from './datagrid-placeholder';
import { ClrDatagridRow } from './datagrid-row';
import { DatagridDisplayMode } from './enums/display-mode.enum';
import { ClrDatagridStateInterface } from './interfaces/state.interface';
import { DisplayModeService } from './providers/display-mode.service';
import { FiltersProvider } from './providers/filters';
import { ExpandableRowsCount } from './providers/global-expandable-rows';
import { Items } from './providers/items';
import { Page } from './providers/page';
import { RowActionService } from './providers/row-action-service';
import { Selection } from './providers/selection';
import { Sort } from './providers/sort';
import { StateDebouncer } from './providers/state-debouncer.provider';
import { StateProvider } from './providers/state.provider';
import { TableSizeService } from './providers/table-size.service';
import { DatagridRenderOrganizer } from './render/render-organizer';
import { ClrCommonStringsService } from '../../utils/i18n/common-strings.service';
import { SelectionType } from './enums/selection-type';
import { ColumnsService } from './providers/columns.service';
import { DetailService } from './providers/detail.service';
import { UNIQUE_ID, UNIQUE_ID_PROVIDER } from '../../utils/id-generator/id-generator.service';
import { ColumnReorderService } from './providers/column-reorder.service';
import { ViewManagerUtils } from './utils/view-manager-utils';
import { CALCULATE_MODE_CLASS } from './render/constants';

@Component({
  selector: 'clr-datagrid',
  templateUrl: './datagrid.html',
  providers: [
    Selection,
    Sort,
    FiltersProvider,
    Page,
    Items,
    DatagridRenderOrganizer,
    RowActionService,
    ExpandableRowsCount,
    StateDebouncer,
    DetailService,
    UNIQUE_ID_PROVIDER,
    StateProvider,
    TableSizeService,
    ColumnReorderService,
    ColumnsService,
    DisplayModeService,
  ],
  host: {
    '[class.datagrid-host]': 'true',
    '[class.datagrid-detail-open]': 'detailService.isOpen',
  },
})
export class ClrDatagrid<T = any> implements AfterContentInit, AfterViewInit, OnDestroy {
  constructor(
    private organizer: DatagridRenderOrganizer,
    public items: Items<T>,
    public expandableRows: ExpandableRowsCount,
    public selection: Selection<T>,
    public rowActionService: RowActionService,
    private stateProvider: StateProvider<T>,
    private displayMode: DisplayModeService,
    private renderer: Renderer2,
    public detailService: DetailService,
    @Inject(UNIQUE_ID) datagridId: string,
    private el: ElementRef,
    private page: Page,
    public commonStrings: ClrCommonStringsService,
    private columnReorderService: ColumnReorderService
  ) {
    this.detailService.id = datagridId;
  }

  /* reference to the enum so that template can access */
  public SELECTION_TYPE = SelectionType;

  /**
   * Freezes the datagrid while data is loading
   */
  public get loading(): boolean {
    return this.items.loading;
  }

  @Input('clrDgLoading')
  public set loading(value: boolean) {
    this.items.loading = value;
  }

  /**
   * Output emitted whenever the data needs to be refreshed, based on user action or external ones
   */
  @Output('clrDgRefresh') public refresh = new EventEmitter<ClrDatagridStateInterface<T>>(false);

  /**
   * Public method to re-trigger the computation of displayed items manually
   */
  public dataChanged() {
    this.items.refresh();
  }

  /**
   * We grab the smart iterator from projected content
   */
  @ContentChild(ClrDatagridItems, { static: false })
  public iterator: ClrDatagridItems<T>;

  /**
   * Array of all selected items
   */
  @Input('clrDgSelected')
  set selected(value: T[]) {
    if (value) {
      this.selection.selectionType = SelectionType.Multi;
    } else {
      this.selection.selectionType = SelectionType.None;
    }
    this.selection.updateCurrent(value, false);
  }

  @Output('clrDgSelectedChange') selectedChanged = new EventEmitter<T[]>(false);

  /**
   * Selected item in single-select mode
   */
  @Input('clrDgSingleSelected')
  set singleSelected(value: T) {
    this.selection.selectionType = SelectionType.Single;
    // the clrDgSingleSelected is updated in one of two cases:
    // 1. an explicit value is passed
    // 2. is being set to null or undefined, where previously it had a value
    if (value) {
      this.selection.currentSingle = value;
    } else if (this.selection.currentSingle) {
      this.selection.currentSingle = null;
    }
  }

  @Output('clrDgSingleSelectedChange') singleSelectedChanged = new EventEmitter<T>(false);

  @Input() clrDgSingleSelectionAriaLabel: string = this.commonStrings.keys.singleSelectionAriaLabel;
  @Input() clrDgSingleActionableAriaLabel: string = this.commonStrings.keys.singleActionableAriaLabel;
  @Input() clrDetailExpandableAriaLabel: string = this.commonStrings.keys.detailExpandableAriaLabel;

  @Input()
  set clrDgPreserveSelection(state: boolean) {
    this.selection.preserveSelection = state;
  }
  /**
   * @deprecated since 2.0, remove in 3.0
   *
   * Selection/Deselection on row click mode
   */
  @Input('clrDgRowSelection')
  set rowSelectionMode(value: boolean) {
    this.selection.rowSelectionMode = value;
  }

  /**
   * Indicates if all currently displayed items are selected
   */
  public get allSelected() {
    return this.selection.isAllSelected();
  }

  /**
   * Selects/deselects all currently displayed items
   * @param value
   */
  public set allSelected(value: boolean) {
    /**
     * This is a setter but we ignore the value.
     * It's strange, but it lets us have an indeterminate state where only
     * some of the items are selected.
     */
    this.selection.toggleAll();
  }

  /**
   * Custom placeholder detection
   */
  @ContentChild(ClrDatagridPlaceholder, { static: false })
  public placeholder: ClrDatagridPlaceholder<T>;

  /**
   * Hideable Column data source / detection.
   */
  @ContentChildren(ClrDatagridColumn) public columns: QueryList<ClrDatagridColumn<T>>;

  /**
   * When the datagrid is user-managed without the smart iterator, we get the items displayed
   * by querying the projected content. This is needed to keep track of the models currently
   * displayed, typically for selection.
   */

  @ContentChildren(ClrDatagridRow) rows: QueryList<ClrDatagridRow<T>>;
  @ViewChild('scrollableColumns', { static: false, read: ViewContainerRef })
  scrollableColumns: ViewContainerRef;

  @ViewChild('datagridTable', { static: false, read: ElementRef })
  datagridTable: ElementRef;

  ngAfterContentInit() {
    if (!this.items.smart) {
      this.items.all = this.rows.map((row: ClrDatagridRow<T>) => row.item);
    }
    this._subscriptions.push(this.displayRowViewsOnRowsChange());
  }

  /**
   * Our setup happens in the view of some of our components, so we wait for it to be done before starting
   */
  ngAfterViewInit() {
    // TODO: determine if we can get rid of provider wiring in view init so that subscriptions can be done earlier
    this.refresh.emit(this.stateProvider.state);
    this.columnReorderService.containerRef = this._projectedDisplayColumns;
    this._subscriptions.push(
      this.emitOnStateProviderChange(),
      this.emitOnSelectionChange(),
      this.focusDgTableOnPageChange(),
      this.resetViewsOnDisplayModeChange(),
      this.reorderOnRequest()
    );
  }

  private focusDgTableOnPageChange() {
    return this.page.change.subscribe(() => {
      this.datagridTable.nativeElement.focus();
    });
  }

  private emitOnStateProviderChange(): Subscription {
    return this.stateProvider.change.subscribe(state => this.refresh.emit(state));
  }

  private emitOnSelectionChange(): Subscription {
    return this.selection.change.subscribe(s => {
      if (this.selection.selectionType === SelectionType.Single) {
        this.singleSelectedChanged.emit(<T>s);
      } else if (this.selection.selectionType === SelectionType.Multi) {
        this.selectedChanged.emit(<T[]>s);
      }
    });
  }

  private displayRowViewsOnRowsChange(): Subscription {
    return this.rows.changes.subscribe(() => {
      if (!this.items.smart) {
        this.items.all = this.rows.map((row: ClrDatagridRow<T>) => row.item);
      }
      ViewManagerUtils.detachAllViews(this._displayedRows);
      ViewManagerUtils.insertAllViews(this._displayedRows, this.rows.toArray());
    });
  }

  private resetViewsOnDisplayModeChange(): Subscription {
    const viewContainers = [
      this._projectedDisplayColumns,
      this._projectedCalculationColumns,
      this._calculationRows,
      this._displayedRows,
    ];
    return this.displayMode.view.subscribe(viewChange => {
      viewContainers.forEach(viewContainer => ViewManagerUtils.detachAllViews(viewContainer));
      if (viewChange === DatagridDisplayMode.DISPLAY) {
        this.renderer.removeClass(this.el.nativeElement, CALCULATE_MODE_CLASS);
        this.displayViewsInMode(this._projectedDisplayColumns, this._displayedRows);
      } else {
        this.renderer.addClass(this.el.nativeElement, CALCULATE_MODE_CLASS);
        this.displayViewsInMode(this._projectedCalculationColumns, this._calculationRows);
      }
    });
  }

  private displayViewsInMode(columnsViewContainer: ViewContainerRef, rowsViewContainer: ViewContainerRef) {
    // insert column views prioritized by their orders
    ViewManagerUtils.insertAllViews(columnsViewContainer, this.assignRawOrders(), true);
    // update column orders before inserting row views
    this.columnReorderService.updateOrders(this.columns.map(column => column.order));
    // now insert rows
    ViewManagerUtils.insertAllViews(rowsViewContainer, this.rows.toArray());
  }

  private reorderOnRequest(): Subscription {
    return this.columnReorderService.reorderRequested.subscribe(reorderRequest => {
      const sourceView = this._projectedDisplayColumns.get(reorderRequest.sourceOrder);
      this._projectedDisplayColumns.move(sourceView, reorderRequest.targetOrder);
      // update order value of each columns
      this.columns.forEach(column => (column.order = this._projectedDisplayColumns.indexOf(column._view)));
      // persist updated column orders to the service so cells will have corresponding fallback order
      this.columnReorderService.updateOrders(this.columns.map(column => column.order), true);
    });
  }

  /**
   * Subscriptions to all the services and queries changes
   */
  private _subscriptions: Subscription[] = [];

  ngOnDestroy() {
    this._subscriptions.forEach((sub: Subscription) => sub.unsubscribe());
  }

  resize(): void {
    this.organizer.resize();
  }

  @ViewChild('projectedDisplayColumns', { static: true, read: ViewContainerRef })
  _projectedDisplayColumns: ViewContainerRef;
  @ViewChild('projectedCalculationColumns', { static: true, read: ViewContainerRef })
  _projectedCalculationColumns: ViewContainerRef;
  @ViewChild('displayedRows', { static: true, read: ViewContainerRef })
  _displayedRows: ViewContainerRef;
  @ViewChild('calculationRows', { static: true, read: ViewContainerRef })
  _calculationRows: ViewContainerRef;

  private assignRawOrders(): ClrDatagridColumn[] {
    return this.columns.map((column, index) => {
      // Once columns has its order assigned, we will use it from here on
      if (typeof column.order !== 'number') {
        if (typeof column.userDefinedOrder === 'number') {
          column.order = column.userDefinedOrder;
        } else {
          column.order = index;
        }
      }
      return column;
    });
  }
}
