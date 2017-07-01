/**
 * Copyright (c) 2016-2017 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Directive, Optional } from "@angular/core";
import { VerticalNavGroup } from "./vertical-nav-group";

@Directive({
    selector: "[clrVerticalNavLink]",
    host: {
        "class": "vertical-nav-item vertical-nav-link",
        "[class.icon-when-collapsed]": "hasIcon",
        "[class.direct]": "isDirectItem",
        "(click)": "clicked($event)"
    }
})
export class VerticalNavLink {

    isDirectItem: boolean = false;
    hasIcon: boolean = false;

    constructor(@Optional() private _parent: VerticalNavGroup) {
        if (!this._parent) {
            this.isDirectItem = true;
        }
    }

    clicked($event) {

        // Clicking on links, which are the children of the <nav>,
        // should not propagate to the <nav> and causing it to expand.
        // To expand <nav>, it should listen to the click events on itself, not one its children.

        $event.stopPropagation();
    }

}
