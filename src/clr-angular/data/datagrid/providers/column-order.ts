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
    flexOrder: number;

    constructor(private organizer: DatagridRenderOrganizer) {}

    swapWith(indexDraggedFrom: number) {
        const indexDraggedTo: number = this.domIndex;

        if(indexDraggedTo>indexDraggedFrom) {
            console.log("forward move");
        }else{
            console.log("backward move");
        }

        //this.organizer.positionOrders.next();
    }
}
