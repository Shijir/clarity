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
    // forwardRef,
    OnInit,
    ContentChild,
    ContentChildren,
    ViewChild,
    // ViewChildren,
    ElementRef,
    AfterViewInit,
    QueryList,
    TemplateRef
} from "@angular/core";

import { NewWizardStepitemTitle } from "./wizard-stepitem-title";
import { NewWizardPageTitle } from "./wizard-page-title";
import { WizardNavigationService } from "./providers/wizard-navigation";
import { WizardPageTitleDirective } from "./directives/page-title";
import { WizardPageNavTitleDirective } from "./directives/page-navtitle";

let wizIndex = 0;

// TODO: remove "NEW" when finishing up

@Component({
    moduleId: module.id,
    selector: "clr-newwizard-page",
    templateUrl: "./wizard-page.html"
})
export class NewWizardPage implements OnInit, AfterContentInit, AfterViewInit {
    @ContentChild(WizardPageTitleDirective) public pageTitle: WizardPageTitleDirective;
    @ContentChild(WizardPageNavTitleDirective) public pageNavTitle: WizardPageNavTitleDirective;

    constructor(private navService: WizardNavigationService) {
    }

    current: boolean = false;

    ngOnInit(): void {
        // if wizard ID exists (check via WizardNavigationService then use it in place of "clr_wizard_") <= TODO
        // otherwise generate... no, don't worry about that. id will be generated on wizard...

        /* TODO: PULL IN WIZARD ID ^^^ AND APPEND WITH "_page_[num]". Or userDefinedId goes on the back...
            need to grab ID from parent Component
        */
        this.navService.count = this.navService.count + 1;
    }

    get title(): TemplateRef<any> {
        return this.pageTitle.pageTitleTemplateRef;
    }

    ngAfterContentInit(): void {
        // TODO: if you have a navItemTitle give that to the wizard navigator
        // if not, give it the page title
        // also pass page id? how important are ids here???

        //this.wizardNavigation.whut(???);
        let wiznav = this.navService;

        if(!wiznav.currentPage) {
            this.current = true;
            // emit updateCurrent event
            wiznav.currentPage = this;
        }

        wiznav.pages.push(this);

        // if (!wiznav.currentPageTitle) {
        //     wiznav.currentPageTitle = this.pageTitle.pageTitleTemplateRef;
        // }
    }

    ngAfterViewInit(): void {
    }
}
