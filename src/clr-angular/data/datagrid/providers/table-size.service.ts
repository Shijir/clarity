/*
 * Copyright (c) 2016-2018 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import {ElementRef, Injectable} from "@angular/core";
import {DomAdapter} from "../../../utils/dom-adapter/dom-adapter";

/**
 * @description
 * Internal datagrid service that holds a reference to the clr-dg-table element and exposes a method to get height.
 */
@Injectable()
export class TableSizeService {
    private tableEl: any;

    constructor(private domAdapter: DomAdapter) {}

    public set table(table: ElementRef) {
        this.tableEl = table.nativeElement;
    }

    // Used when resizing columns to show the column border being dragged.
    getColumnDragHeight(): string {
        return `${this.domAdapter.clientRect(this.tableEl).height}px`;
    }
}
