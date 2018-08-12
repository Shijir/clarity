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

    orderBeforeArrangement:number[];

    visualOrder(domIndex: number) {
        return this.orderBeforeArrangement[domIndex];
    }

    swapWith(indexDraggedFrom: number) {

        this.orderBeforeArrangement = this.organizer.orders.slice(); // copy unaltered array first

        if (this.visualOrder(this.domIndex) - this.visualOrder(indexDraggedFrom) > 0) {

            for (let i = this.visualOrder(indexDraggedFrom) + 1; i <= this.visualOrder(this.domIndex); i++) {
                const domIndex = this.orderBeforeArrangement.indexOf(i);
                this.organizer.orders[domIndex] = this.orderBeforeArrangement[domIndex] - 1;
                console.log(i);
            }

            this.organizer.orders[indexDraggedFrom] = this.visualOrder(this.domIndex);

        }

        //console.log(this.organizer.orders);

        this.organizer.positionOrders.next();
    }
}
