/*
 * Copyright (c) 2016 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
// import { Component, ViewChild } from "@angular/core";
import { Component } from "@angular/core";

// TODO: remove "NEW" when finishing up

@Component({
    moduleId: module.id,
    selector: "clr-newwizard-stepitem-title",
    template: "<ng-content></ng-content>",
    host: {
        "class": "clr-wizard-placeholder"
    }
})
export class NewWizardStepitemTitle {
}
