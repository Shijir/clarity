/**
 * Copyright (c) 2016-2017 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, Input, AfterContentInit, ContentChildren, QueryList, OnDestroy } from "@angular/core";
import { VerticalNavState } from "./vertical-nav-state";
import { VerticalNavGroup } from "./vertical-nav-group";
import { Subscription } from "rxjs";

@Component({
    selector: "clr-vertical-nav",
    templateUrl: "./vertical-nav.html",
    providers: [VerticalNavState],
    host: {
        "class": "vertical-nav",
        "[class.collapsible]": "collapsible"
    }
})
export class VerticalNav implements AfterContentInit, OnDestroy {

    private _subscriptions: Subscription[] = [];

    collapsible: boolean = false;
    hasNestedChildren: boolean = false;

    private _collapsed: boolean = false;

    get collapsed(): boolean {
        return this._collapsed;
    }

    @Input("clrVerticalNavCollapsed") set collapsed(value: boolean) {
        if (!this.collapsible) {
            this.collapsible = true;
        }
        this._collapsed = value;
        this._verticalNavState.collapsed.next(value);
    }

    get angleDoubleDirection(): string {
        return (this.collapsed) ? "right" : "left";
    }

    constructor(private _verticalNavState: VerticalNavState) {
        this._subscriptions.push(this._verticalNavState.collapsed.subscribe((value) => {
            if (this._collapsed !== value) {
                this._collapsed = value;
            }
        }));
    }

    toggleByButton() {
        this.collapsed = !this.collapsed;
    }

    @ContentChildren(VerticalNavGroup) verticalNavItems: QueryList<VerticalNavGroup>;

    ngAfterContentInit() {
        this.hasNestedChildren = this.verticalNavItems.length > 0;

        this._subscriptions.push(this.verticalNavItems.changes.subscribe(() => {
            this.hasNestedChildren = this.verticalNavItems.length > 0;
        }));
    }

    ngOnDestroy() {
        this._subscriptions.forEach((sub: Subscription) => sub.unsubscribe());
    }
}
