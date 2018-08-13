/*
 * Copyright (c) 2016-2018 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */


import {Injectable} from "@angular/core";
import {DatagridRenderOrganizer} from "../render/render-organizer";

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

    constructor(private organizer: DatagridRenderOrganizer) {
    }


    receivedDropFrom(flexOrderDraggedFrom: number) {

        const flexOrderDraggedTo = this.flexOrder;
        const flexOrderDistance = flexOrderDraggedTo - flexOrderDraggedFrom;

        if (flexOrderDistance === 0) {
            return;
        }

        const domIndexDragged = this.organizer.orders[flexOrderDraggedFrom];

        if (flexOrderDistance > 0) {
            for (let i = flexOrderDraggedFrom; i < flexOrderDraggedTo; i++) {
                this.organizer.orders[i] = this.organizer.orders[i + 1];
            }

        } else if (flexOrderDistance < 0) {
            for (let i = flexOrderDraggedFrom; i > flexOrderDraggedTo; i--) {
                this.organizer.orders[i] = this.organizer.orders[i - 1];
            }
        }

        this.organizer.orders[flexOrderDraggedTo] = domIndexDragged;

        console.log(this.organizer.orders);

        this.organizer.positionOrders.next();
    }
}
