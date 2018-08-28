/*
 * Copyright (c) 2016-2018 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */


import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {ColumnOrderManager} from "./column-order-manager";

@Injectable()
export class ColumnOrder {
    private _domIndex: number; //domIndex is the identity of the column

    get domIndex(): number {
        return this._domIndex;
    }

    set domIndex(value: number) {
        if (!this._domIndex) {
            this._domIndex = value;
        }
    }

    get flexOrder() {
        return this.columnOrderManager.orders.indexOf(this._domIndex);
    }

    get isAtLast() {
        return this.columnOrderManager.orders.length === this.flexOrder + 1;
    }

    get isAtFirst() {
        return this.flexOrder === 0;
    }

    get columnOrderChange(): Observable<number> {
        return this.columnOrderManager.positionOrdersUpdated.asObservable();
    }

    get columnOrderRendered(): Observable<number> {
        return this.columnOrderManager.positionOrdersRendered.asObservable();
    }

    constructor(private columnOrderManager: ColumnOrderManager) {
    }

    dropReceivedOnFirst(dropEvent: any) {
        const flexOrderDraggedFrom = dropEvent.dragDataTransfer.flexOrder;
        const domIndexDragged = this.columnOrderManager.orders[flexOrderDraggedFrom];
        this.shiftColumn(domIndexDragged, flexOrderDraggedFrom, 0, dropEvent);
    }

    dropReceived(dropEvent: any) {
        const flexOrderDraggedFrom = dropEvent.dragDataTransfer.flexOrder;

        let flexOrderDraggedTo: number;
        if (flexOrderDraggedFrom > this.flexOrder) {
            flexOrderDraggedTo = this.flexOrder + 1;
        } else {
            flexOrderDraggedTo = this.flexOrder;
        }
        const domIndexDragged = this.columnOrderManager.orders[flexOrderDraggedFrom];
        this.shiftColumn(domIndexDragged, flexOrderDraggedFrom, flexOrderDraggedTo, dropEvent);
    }

    private shiftColumn(domIndex: number, from: number, to: number, dropEvent: any) {
        this.columnOrderManager.orders.splice(from, 1);
        this.columnOrderManager.orders.splice(to, 0, domIndex);
        this.columnOrderManager.positionOrdersUpdated.next();
        this.columnOrderManager.positionOrdersRendered.next({domIndex, from, to, dropEvent});
    }
}
