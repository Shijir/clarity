/*
 * Copyright (c) 2016-2018 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */


import {Injectable} from "@angular/core";
import {DatagridRenderOrganizer} from "../render/render-organizer";

@Injectable()
export class ColumnOrder {
    domIndex: number;

    constructor(private organizer: DatagridRenderOrganizer) {}

    swapWith(flexOrderAt: number) {

        const currentFlexOrder = this.organizer.orders[this.domIndex];

        this.organizer.orders[this.domIndex] = this.organizer.orders[flexOrderAt];
        this.organizer.orders[flexOrderAt] = currentFlexOrder;

        console.log(this.organizer.orders);

        this.organizer.positionOrders.next();
    }
}
