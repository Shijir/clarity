/*
 * Copyright (c) 2016 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
// import { Component, ViewChild } from "@angular/core";
import { 
    AfterContentInit, 
    Component, 
    Input,
    forwardRef,
    OnInit,
    ContentChild 
} from "@angular/core";

import { NewWizardStepitemTitle } from "./wizard-stepitem-title";
import { NewWizardPageTitle } from "./wizard-page-title";
import { WizardNavigationService } from "./providers/wizard-navigation"

let wizIndex = 0;

// TODO: remove "NEW" when finishing up

@Component({
    moduleId: module.id,
    selector: "clr-newwizard-page",
    templateUrl: "./wizard-page.html",
    providers: [ WizardNavigationService ]
})
export class NewWizardPage implements OnInit, AfterContentInit {
    public id: string;

    @ContentChild(forwardRef(() => NewWizardPageTitle)) public pageTitle: NewWizardPageTitle;
    @ContentChild(forwardRef(() => NewWizardStepitemTitle)) public navItemTitle: NewWizardStepitemTitle;

    /*
        users can pass in their own ids for wizard pages using clrPageId="whatever"
    */
    @Input("clrPageId") private userDefinedId: string;

    ngOnInit() {
        // if wizard ID exists (check via WizardNavigationService then use it in place of "clr_wizard_") <= TODO
        // otherwise generate... no, don't worry about that. id will be generated on wizard...
        this.id = this.userDefinedId ? this.userDefinedId : "clr_wizard_" + (wizIndex++);
        /* SPECME ^ */
        // console.log(this.id);
    }

    ngAfterContentInit() {
        console.debug(this.pageTitle);
        console.debug(this.navItemTitle);
    }
}
