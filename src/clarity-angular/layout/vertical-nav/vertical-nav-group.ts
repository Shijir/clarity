/**
 * Copyright (c) 2016-2017 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, AfterContentInit, QueryList, ContentChildren, OnDestroy } from "@angular/core";
import { VerticalNavState } from "./vertical-nav-state";
import { Expand } from "../../utils/expand/providers/expand";
import { style, animate, transition, state, trigger } from "@angular/animations";
import { IconCustomTag } from "../../icon/icon";
import { Subscription } from "rxjs";

const EXPANDED_STATE = "expanded";
const COLLAPSED_STATE = "collapsed";

@Component({
    selector: "clr-vertical-nav-group",
    templateUrl: "./vertical-nav-group.html",
    providers: [Expand],
    animations: [
        trigger("clrExpand", [
            state(EXPANDED_STATE, style({
                "height": "*",
                "overflow-y": "hidden"
            })),
            state(COLLAPSED_STATE, style({
                "height": 0,
                "overflow-y": "hidden"
            })),
            transition("expanded <=> collapsed", animate("0.2s ease-in-out"))
        ])
    ]
})
export class VerticalNavGroup implements AfterContentInit, OnDestroy {


    constructor(private _itemExpand: Expand, private _verticalNavState: VerticalNavState) {

        this.expandAnimationState = this._itemExpand.expanded ? EXPANDED_STATE : COLLAPSED_STATE;

        this._subscriptions.push(
            this._verticalNavState.collapsed.subscribe((verticalNavCollapsed: boolean) => {
                if (verticalNavCollapsed) {
                    this.expandAnimationState = COLLAPSED_STATE;
                    this._itemExpand.expanded = false;
                }
            }));
    }

    private _subscriptions: Subscription[] = [];

    /* Expansion */

    expandAnimationState: string;

    expandAnimationDone($event: any) {
        if ($event.fromState === EXPANDED_STATE && $event.toState === COLLAPSED_STATE) {
            this._itemExpand.expanded = false;
        }
    }

    toggleExpand(): void {
        if (!this._itemExpand.expanded) {
            // If a Vertical Nav Group toggle button is clicked while the Vertical Nav is in Collapsed state,
            // the Vertical Nav should be expanded first.
            this._verticalNavState.setCollapsed(false);
        }

        if (this._itemExpand.expanded) {
            this.expandAnimationState = COLLAPSED_STATE;
            // Once @clrExpand animation ended on the "collapsed" state,
            // the nested children should be removed by Expand.
        } else {
            this._itemExpand.expanded = true;
            this.expandAnimationState = EXPANDED_STATE;
        }
    }

    get caretDirection(): string {
        return (this._itemExpand.expanded) ? "down" : "right";
    }

    @ContentChildren(IconCustomTag) iconLabel: QueryList<IconCustomTag>;

    // We need to be aware of whether Vertical Nav Group has a icon or not
    // in order to know we should display its icon when it's in a Collapsed state.

    hasIconLabel: boolean = false;

    ngAfterContentInit() {

        this.hasIconLabel = this.iconLabel.length > 0;

        this._subscriptions.push(this.iconLabel.changes.subscribe(() => {
            this.hasIconLabel = this.iconLabel.length > 0;
        }));
    }

    ngOnDestroy() {
        this._subscriptions.forEach((sub: Subscription) => sub.unsubscribe());
    }

}
