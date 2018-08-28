/*
 * Copyright (c) 2016-2018 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import {Directive, ElementRef, OnDestroy, Renderer2} from "@angular/core";
import {Subscription} from "rxjs/Subscription";

import {DomAdapter} from "../../../utils/dom-adapter/dom-adapter";

import {DatagridColumnResizer} from "./column-resizer";
import {STRICT_WIDTH_CLASS} from "./constants";
import {DatagridRenderOrganizer} from "./render-organizer";
import {ColumnOrder} from "../providers/column-order";
import {ColumnOrderManager} from "../providers/column-order-manager";

@Directive({selector: "clr-dg-column"})
export class DatagridHeaderRenderer implements OnDestroy {
    constructor(private el: ElementRef, private renderer: Renderer2, private organizer: DatagridRenderOrganizer,
                private domAdapter: DomAdapter, private columnResizer: DatagridColumnResizer, private columnOrderManager: ColumnOrderManager, private columnOrder: ColumnOrder) {
        this.subscriptions.push(organizer.clearWidths.subscribe(() => this.clearWidth()));
        this.subscriptions.push(organizer.detectStrictWidths.subscribe(() => this.detectStrictWidth()));
        this.subscriptions.push(columnOrderManager.positionOrdersUpdated.subscribe(() => this.setPositionOrder()));
    }

    private subscriptions: Subscription[] = [];

    /**
     * Indicates if the column has a strict width, so it doesn't shrink or expand based on the content.
     */

    public strictWidth: number;
    private widthSet: boolean = false;

    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }

    private clearWidth() {
        // remove the width only if we set it, and it is not changed by dragging.
        if (this.widthSet && !this.columnResizer.columnResizeBy) {
            this.renderer.setStyle(this.el.nativeElement, "width", null);
        }
    }

    private detectStrictWidth() {
        if (this.columnResizer.columnResizeBy) {
            this.strictWidth = this.columnResizer.columnRectWidth + this.columnResizer.columnResizeBy;
        } else {
            this.strictWidth = this.domAdapter.userDefinedWidth(this.el.nativeElement);
        }
    }

    get clientWidth():number {
        return this.domAdapter.clientRect(this.el.nativeElement).width;
    }

    public computeWidth(): number {
        let width: number = this.strictWidth;
        if (!width) {
            width = this.domAdapter.scrollWidth(this.el.nativeElement);
        }
        return width;
    }

    public setWidth(width: number) {
        if (this.strictWidth) {
            if (this.columnResizer.columnResizeBy) {
                this.renderer.setStyle(this.el.nativeElement, "width", width + "px");
                this.columnResizer.columnResizeBy = 0;
                this.widthSet = false;
            }
            this.renderer.addClass(this.el.nativeElement, STRICT_WIDTH_CLASS);
            // We don't actually set the width if there already is a user-defined one, we just add the class
            return;
        }
        this.renderer.removeClass(this.el.nativeElement, STRICT_WIDTH_CLASS);
        this.renderer.setStyle(this.el.nativeElement, "width", width + "px");
        this.widthSet = true;
    }

    public setDomOrder(domIndex: number) {
        // This method will be called by the main-renderer
        this.columnOrder.domOrder = domIndex;
    }

    public setPositionOrder() {
        if(typeof this.columnOrder.domOrder !== "undefined") {
            this.renderer.setStyle(this.el.nativeElement, "order", this.columnOrder.flexOrder);
        }
    }
}
