/*
 * Copyright (c) 2016 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Component } from "@angular/core";
import { VerticalNavCases } from "./vertical-nav-cases";

@Component({
    moduleId: module.id,
    selector: "clr-vertical-nav-basic",
    templateUrl: "./vertical-nav-basic.demo.html",
    styleUrls: ["./vertical-nav.demo.css"]
})
export class VerticalNavBasicDemo {

    cases: any[];
    collapsed: boolean = false;

    constructor(public verticalNavCases: VerticalNavCases) {
        this.cases = this.verticalNavCases.nonCollapsedMenus;
    }

    hasNestedChildren(items: any[]): boolean {
        for (let item of items) {
            if (item["children"]) {
                return true;
            }
        }
        return false;
    }


}
