/*
 * Copyright (c) 2016 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import {ModuleWithProviders} from "@angular/core/src/metadata/ng_module";
import {Routes, RouterModule} from "@angular/router";
import { VerticalNavDemo } from "./vertical-nav.demo";
import { VerticalNavBasicDemo } from "./vertical-nav-basic.demo";
import { VerticalNavAngularDemo } from "./vertical-nav-angular.demo";



const ROUTES: Routes = [
    {
        path: "",
        component: VerticalNavDemo,
        children: [
            { path: "", redirectTo: "vertical-nav-basic", pathMatch: "full" },
            { path: "vertical-nav-basic", component: VerticalNavBasicDemo },
            { path: "vertical-nav-angular", component: VerticalNavAngularDemo }
        ]
    }
];

export const ROUTING: ModuleWithProviders = RouterModule.forChild(ROUTES);
