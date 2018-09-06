/*
 * Copyright (c) 2016-2018 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */


import {ElementRef, Injectable, Renderer2} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {ColumnOrderManager, ColumnOrderModel} from "./column-order-manager";
import {DomAdapter} from "../../../utils/dom-adapter/dom-adapter";

@Injectable()
export class ColumnOrder {
    private _domOrder: number; //domIndex is the identity of the column
    private _dropKey: string;

    get dropKey() {
        return this._dropKey;
    }

    readonly dropKeyAtFirst = this.columnOrderManager.columnGroupId + "--1";

    get dropKeyOfPrevious() {
        if (this.flexOrder - 1 >= 0) {
            return this.columnOrderManager.orders[this.flexOrder - 1].dropKey;
        }
    }

    get acceptedDropKeys() {
        const acceptedDropKeys = this.columnOrderManager.orders.map(orderModel => orderModel.dropKey).filter(dropKey => dropKey !== this._dropKey && dropKey !== this.dropKeyOfPrevious);
        if (this.flexOrder === 0) {
            return acceptedDropKeys;
        }

        acceptedDropKeys.push(this.dropKeyAtFirst);
        return acceptedDropKeys;
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

    constructor(private columnOrderManager: ColumnOrderManager, private domAdapter: DomAdapter, private renderer: Renderer2, private el: ElementRef) {

    }

    get width() {
        return this.domAdapter.clientRect(this.el.nativeElement).width;
    }

    get pageX() {
        return this.domAdapter.clientRect(this.el.nativeElement).left;
    }

    get pageY() {
        return this.domAdapter.clientRect(this.el.nativeElement).top;
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
