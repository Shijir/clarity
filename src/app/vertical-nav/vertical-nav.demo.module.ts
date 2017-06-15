/*
 * Copyright (c) 2016 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {ClarityModule} from "../../clarity-angular/clarity.module";
import { ROUTING } from "./vertical-nav.demo.routing";
import { VerticalNavDemo } from "./vertical-nav.demo";
import { VerticalNavBasicDemo } from "./vertical-nav-basic.demo";
import { VerticalNavAngularDemo } from "./vertical-nav-angular.demo";
import { VerticalNavCases } from "./vertical-nav-cases";


@NgModule({
    imports: [
        CommonModule,
        ClarityModule,
        ROUTING
    ],
    declarations: [
        VerticalNavDemo,
        VerticalNavBasicDemo,
        VerticalNavAngularDemo
    ],
    exports: [
        VerticalNavDemo,
        VerticalNavBasicDemo,
        VerticalNavAngularDemo
    ],
    providers: [VerticalNavCases]
})
export default class VerticalNavDemoModule {
}
