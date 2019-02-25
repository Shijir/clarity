/*
 * Copyright (c) 2016-2019 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectorRef, Directive, Optional } from '@angular/core';
import { OompaLoompa } from '../../../utils/chocolate/oompa-loompa';
import { ColumnOrderModelService } from '../providers/column-order-model.service';
import { DatagridWillyWonka } from './datagrid-willy-wonka';

@Directive({ selector: 'clr-dg-column' })
export class ColumnSeparatorOompaLoompa extends OompaLoompa {
  private columnOrderModelService: ColumnOrderModelService;

  constructor(
    cdr: ChangeDetectorRef,
    @Optional() willyWonka: DatagridWillyWonka,
    columnOrderModelService: ColumnOrderModelService
  ) {
    if (!willyWonka) {
      throw new Error('clr-dg-row should only be used inside of a clr-datagrid');
    }
    super(cdr, willyWonka);
    this.columnOrderModelService = columnOrderModelService;
  }

  get flavor() {
    return this.columnOrderModelService.isLastVisible;
  }
}
