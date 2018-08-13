/*
 * Copyright (c) 2016-2018 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */


import {Injectable} from "@angular/core";
import {DatagridRenderOrganizer} from "../render/render-organizer";

@Injectable()
export class ColumnOrder {
    readonly domIndex: number;

    constructor(private organizer: DatagridRenderOrganizer) {
    }

    private orderBeforeArrangement:number[];

    private flexOrderAt(domIndex: number): number {
        return this.orderBeforeArrangement[domIndex];
    }

    private domOrderOf(flexOrder: number): number {
        return this.orderBeforeArrangement.indexOf(flexOrder);
    }

    receivedDropFrom(indexDraggedFrom: number) {

        this.orderBeforeArrangement = this.organizer.orders.slice(); // copy unaltered array first

        const flexOrderDraggedTo = this.flexOrderAt(this.domIndex);
        const flexOrderDraggedFrom  = this.flexOrderAt(indexDraggedFrom);

        const flexOrderDistance = flexOrderDraggedTo - flexOrderDraggedFrom;
        // if the flex order distance is positive, that means user dragged a column in the right direction.
        // if it's negative, that means user dragged a column in the left direction.

        if (flexOrderDistance > 0) {
            for (let i = flexOrderDraggedFrom + 1; i <= flexOrderDraggedTo; i++) {
                const domIndex = this.domOrderOf(i);
                this.organizer.orders[domIndex] = this.orderBeforeArrangement[domIndex] - 1;
            }
        }else if(flexOrderDistance < 0) {
            for (let i = flexOrderDraggedFrom - 1; i >= flexOrderDraggedTo; i--) {
                const domIndex = this.domOrderOf(i);
                this.organizer.orders[domIndex] = this.orderBeforeArrangement[domIndex] + 1;
            }
        }

        this.organizer.orders[indexDraggedFrom] = flexOrderDraggedTo;

        this.organizer.positionOrders.next();
    }
}
