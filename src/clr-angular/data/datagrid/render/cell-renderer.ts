/*
 * Copyright (c) 2016-2018 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import {Directive, ElementRef, OnDestroy, Renderer2} from "@angular/core";
import {Subscription} from "rxjs/Subscription";

import {STRICT_WIDTH_CLASS} from "./constants";
import {DatagridRenderOrganizer} from "./render-organizer";
import {ColumnOrderManager} from "../providers/column-order-manager";

@Directive({selector: "clr-dg-cell"})
export class DatagridCellRenderer implements OnDestroy {
    private subscriptions: Subscription[] = [];

    constructor(private el: ElementRef, private renderer: Renderer2, private organizer: DatagridRenderOrganizer, private columnOrderManager: ColumnOrderManager) {
        this.subscriptions.push(organizer.clearWidths.subscribe(() => this.clearWidth()));
        this.subscriptions.push(columnOrderManager.positionOrdersUpdated.subscribe(() => this.setPositionOrder()));
    }

    public domOrder: number;

    public setPositionOrder() {
        if(typeof this.domOrder!== "undefined") {
            this.renderer.setStyle(this.el.nativeElement, "order", this.columnOrderManager.flexOrderOf(this.domOrder));
        }
    }


    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }

    private clearWidth() {
        this.renderer.removeClass(this.el.nativeElement, STRICT_WIDTH_CLASS);
        this.renderer.setStyle(this.el.nativeElement, "width", null);
    }

    public setWidth(strict: boolean, value: number) {
        if (strict) {
            this.renderer.addClass(this.el.nativeElement, STRICT_WIDTH_CLASS);
        } else {
            this.renderer.removeClass(this.el.nativeElement, STRICT_WIDTH_CLASS);
        }
        this.renderer.setStyle(this.el.nativeElement, "width", value + "px");
    }
}
