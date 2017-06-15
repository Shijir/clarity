/*
 * Copyright (c) 2016 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Component } from "@angular/core";
import "../../clarity-icons/shapes/essential-shapes";

@Component({
    template: `
        <h2>Vertical Navigation</h2>
        <ul>
            <li><a [routerLink]="['./vertical-nav-basic']">Vertical Navigation - Basic</a></li>
            <li><a [routerLink]="['./vertical-nav-angular']">Vertical Navigation - Angular</a></li>
        </ul>
        <router-outlet></router-outlet>
    `
})
export class VerticalNavDemo {

}
