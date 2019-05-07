/*
 * Copyright (c) 2016-2019 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ColumnState, ColumnStateDiff } from '../interfaces/column-state.interface';
import { DatagridColumnChanges } from '../enums/column-changes.enum';

@Injectable()
export class ColumnsService {
  columns: BehaviorSubject<ColumnState>[] = [];

  get columnStates(): ColumnState[] {
    return this.columns.map(column => column.value);
  }

  get hasHideableColumns(): boolean {
    return this.columnStates.filter(state => state.hideable).length > 0;
  }

  get hasFlexibleColumns(): boolean {
    return this.columnStates.filter(state => !state.hidden && !state.strictWidth).length > 0;
  }

  get flexOrderOfLastVisible(): number {
    return Math.max(...this.columnStates.filter(state => !state.hidden).map(state => state.flexOrder));
  }

  get flexOrderOfFirstVisible(): number {
    return Math.min(...this.columnStates.filter(state => !state.hidden).map(state => state.flexOrder));
  }

  ofFlexOrder(flexOrder: number): BehaviorSubject<ColumnState> {
    return this.columns.filter(column => column.value.flexOrder === flexOrder)[0];
  }

  // Helper method to emit a change to a column only when there is an actual diff to process for that column
  emitStateChangeAt(columnIndex: number, diff: ColumnStateDiff) {
    if (!this.columns[columnIndex]) {
      return;
    }
    this.emitStateChange(this.columns[columnIndex], diff);
  }

  emitStateChange(column: BehaviorSubject<ColumnState>, diff: ColumnStateDiff) {
    const current = column.value;
    column.next({ ...current, ...diff });

    this.checkFirstVisible();
    this.checkLastVisible();
  }

  private currentLastVisible: BehaviorSubject<ColumnState>;
  private currentFirstVisible: BehaviorSubject<ColumnState>;

  private setComputedProp(
    column: BehaviorSubject<ColumnState>,
    computedProps: { firstVisible?: boolean; lastVisible?: boolean }
  ): void {
    if (typeof computedProps.firstVisible === 'boolean') {
      column.next({ ...column.value, changes: [DatagridColumnChanges.FIRST_VISIBLE], ...computedProps });
    }
    if (typeof computedProps.lastVisible === 'boolean') {
      column.next({ ...column.value, changes: [DatagridColumnChanges.LAST_VISIBLE], ...computedProps });
    }
  }

  private checkFirstVisible(): void {
    const column = this.ofFlexOrder(this.flexOrderOfFirstVisible);
    if (column && column.value.flexOrder === this.flexOrderOfFirstVisible && column !== this.currentFirstVisible) {
      this.setComputedProp(column, { firstVisible: true });
      if (this.currentFirstVisible) {
        this.setComputedProp(this.currentFirstVisible, { firstVisible: false });
      }
      this.currentFirstVisible = column;
    }
  }

  private checkLastVisible(): void {
    const column = this.ofFlexOrder(this.flexOrderOfLastVisible);
    if (column && column.value.flexOrder === this.flexOrderOfLastVisible && column !== this.currentLastVisible) {
      this.setComputedProp(column, { lastVisible: true });
      if (this.currentLastVisible) {
        this.setComputedProp(this.currentLastVisible, { lastVisible: false });
      }
      this.currentLastVisible = column;
    }
  }
}
