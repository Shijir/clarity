/*
 * Copyright (c) 2016 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Component } from "@angular/core";
import { VerticalNavCases } from "./vertical-nav-cases";

@Component({
    moduleId: module.id,
    selector: "clr-vertical-nav-angular",
    templateUrl: "./vertical-nav-angular.demo.html",
    styleUrls: ["./vertical-nav.demo.css"]
})
export class VerticalNavAngularDemo {

    cases: any[];

    constructor(public verticalNavCases: VerticalNavCases) {
        this.cases = this.verticalNavCases.nonCollapsedMenus;
    }


}
