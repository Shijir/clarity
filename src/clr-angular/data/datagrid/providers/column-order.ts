/*
 * Copyright (c) 2016-2018 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */


import {Injectable} from "@angular/core";
import {DatagridRenderOrganizer} from "../render/render-organizer";
import {Observable} from "rxjs/Observable";

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
        return this.organizer.orders.indexOf(this._domIndex);
    }

    get isAtLast() {
        return this.organizer.orders.length === this.flexOrder + 1;
    }

    get isAtFirst() {
        return this.flexOrder === 0;
    }

    get columnOrderChange(): Observable<number> {
        return this.organizer.positionOrders.asObservable();
    }

    constructor(private organizer: DatagridRenderOrganizer) {
    }

    receivedDropFrom(dropEvent: any) {
        const flexOrderDraggedFrom = dropEvent.dragDataTransfer.flexOrder;

        let flexOrderDraggedTo: number;
        if (flexOrderDraggedFrom > this.flexOrder) {
            flexOrderDraggedTo = this.flexOrder + 1;
        } else {
            flexOrderDraggedTo = this.flexOrder;
        }
        const domIndexDragged = this.organizer.orders[flexOrderDraggedFrom];
        this.shiftColumn(domIndexDragged, flexOrderDraggedFrom, flexOrderDraggedTo, dropEvent);
    }

    private shiftColumn(domIndex: number, from: number, to: number, dropEvent: any) {
        this.organizer.orders.splice(from, 1);
        this.organizer.orders.splice(to, 0, domIndex);
        this.organizer.positionOrders.next({domIndex, from, to, dropEvent});
    }
}
