/*
 * Copyright (c) 2016-2018 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import {Injectable} from "@angular/core";
import {Subject} from "rxjs/Subject";
import {ColumnOrder} from "./column-order";

let nbColumnGroup = 0;

@Injectable()
export class ColumnOrderManager {
    public orders: ColumnOrder[] = [];

    private _columnGroupId: string;

    get columnGroupId() {
        return this._columnGroupId;
    }

    constructor() {
        this._columnGroupId = "dg-column-group-" + nbColumnGroup++;
    }

    public positionOrdersUpdated = new Subject<any>();

    public positionOrdersRendered = new Subject<any>();

    public flexOrderOf(domOrder: number): number {
        const columnOrder = this.orders.filter(orderModel => orderModel.domOrder === domOrder);
        return this.orders.indexOf(columnOrder[0]);
    }
}
