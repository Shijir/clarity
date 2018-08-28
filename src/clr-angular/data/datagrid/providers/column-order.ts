/*
 * Copyright (c) 2016-2018 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */


import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {ColumnOrderManager, ColumnOrderModel} from "./column-order-manager";

@Injectable()
export class ColumnOrder {
    private _domOrder: number; //domIndex is the identity of the column
    private _dropKey: string;


    get dropKey() {
        return this._dropKey;
    }

    get dropKeyOfPrevious() {
        if (this.flexOrder - 1 > 0) {
            return this.columnOrderManager.orders[this.flexOrder - 1].dropKey;
        }
    }

    get acceptedDropKeys() {
        return this.columnOrderManager.orders.map(orderModel => orderModel.dropKey).filter(dropKey => dropKey !== this._dropKey && dropKey !== this.dropKeyOfPrevious);
    }

    get domOrder(): number {
        return this._domOrder;
    }

    set domOrder(value: number) {
        this._domOrder = value;
        this._dropKey = this.columnOrderManager.columnGroupId + "-" + value;
        this.columnOrderManager.orders.push({domOrder: this._domOrder, dropKey: this._dropKey});
    }

    get flexOrder() {
        return this.columnOrderManager.flexOrderOf(this.domOrder);
    }

    get isAtLast() {
        return this.columnOrderManager.orders.length === this.flexOrder + 1;
    }

    get isAtFirst() {
        return this.flexOrder === 0;
    }

    get columnOrderRendered(): Observable<number> {
        return this.columnOrderManager.positionOrdersRendered.asObservable();
    }

    constructor(private columnOrderManager: ColumnOrderManager) {
    }

    dropReceivedOnFirst(dropEvent: any) {
        const flexOrderDraggedFrom = dropEvent.dragDataTransfer.flexOrder;
        const columnModelDragged = this.columnOrderManager.orders[flexOrderDraggedFrom];
        this.shiftColumn(columnModelDragged, flexOrderDraggedFrom, 0, dropEvent);
    }

    dropReceived(dropEvent: any) {
        const flexOrderDraggedFrom = dropEvent.dragDataTransfer.flexOrder;

        let flexOrderDraggedTo: number;
        if (flexOrderDraggedFrom > this.flexOrder) {
            flexOrderDraggedTo = this.flexOrder + 1;
        } else {
            flexOrderDraggedTo = this.flexOrder;
        }
        const columnModelDragged = this.columnOrderManager.orders[flexOrderDraggedFrom];
        this.shiftColumn(columnModelDragged, flexOrderDraggedFrom, flexOrderDraggedTo, dropEvent);
    }

    private shiftColumn(columnModelDragged: ColumnOrderModel, from: number, to: number, dropEvent: any) {
        this.columnOrderManager.orders.splice(from, 1);
        this.columnOrderManager.orders.splice(to, 0, columnModelDragged);
        this.columnOrderManager.positionOrdersUpdated.next();
        this.columnOrderManager.positionOrdersRendered.next({orderModel: columnModelDragged, from, to, dropEvent});
    }
}
