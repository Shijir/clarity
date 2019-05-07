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

  private currentLastVisible: BehaviorSubject<ColumnState>;
  private currentFirstVisible: BehaviorSubject<ColumnState>;

  emitStateChange(column: BehaviorSubject<ColumnState>, diff: ColumnStateDiff) {
    const current = column.value;
    column.next({ ...current, ...diff });

    const newFirstVisible = this.ofFlexOrder(this.flexOrderOfFirstVisible);

    if (newFirstVisible && newFirstVisible !== this.currentFirstVisible) {
      newFirstVisible.next({
        ...newFirstVisible.value,
        changes: [DatagridColumnChanges.FIRST_VISIBLE],
        firstVisible: true,
      });

      if (this.currentFirstVisible) {
        this.currentFirstVisible.next({
          ...this.currentFirstVisible.value,
          changes: [DatagridColumnChanges.FIRST_VISIBLE],
          firstVisible: false,
        });
      }

      this.currentFirstVisible = newFirstVisible;
    }

    const newLastVisible = this.ofFlexOrder(this.flexOrderOfLastVisible);

    if (newLastVisible && newLastVisible !== this.currentLastVisible) {
      newLastVisible.next({
        ...newLastVisible.value,
        changes: [DatagridColumnChanges.LAST_VISIBLE],
        lastVisible: true,
      });
      if (this.currentLastVisible) {
        this.currentLastVisible.next({
          ...this.currentLastVisible.value,
          changes: [DatagridColumnChanges.LAST_VISIBLE],
          lastVisible: false,
        });
      }
      this.currentLastVisible = newLastVisible;
    }
  }
}
