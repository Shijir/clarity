/*
 * Copyright (c) 2016 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

// TODO: remove "NEW" when finishing up

import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {ClarityModule} from "../../clarity-angular";
import {FormsModule} from "@angular/forms";
import {ROUTING} from "./wizard.demo.routing";
import {NewWizardDemo} from "./wizard.demo";

@NgModule({
    imports: [
        CommonModule,
        ClarityModule,
        FormsModule,
        ROUTING
    ],
    declarations: [
        NewWizardDemo
    ],
    exports: [
        NewWizardDemo
    ]
})
export default class NewWizardDemoModule {
}