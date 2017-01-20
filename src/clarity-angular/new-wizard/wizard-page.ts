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
    ContentChild,
    ContentChildren,
    ViewChild,
    ViewChildren,
    ElementRef,
    AfterViewInit,
    QueryList
} from "@angular/core";

import { NewWizardStepitemTitle } from "./wizard-stepitem-title";
import { NewWizardPageTitle } from "./wizard-page-title";
import { Pages } from "./providers/pages";

let wizIndex = 0;

// TODO: remove "NEW" when finishing up

@Component({
    moduleId: module.id,
    selector: "clr-newwizard-page",
    providers: [ Pages ],
    templateUrl: "./wizard-page.html"
})
export class NewWizardPage implements OnInit, AfterContentInit, AfterViewInit {
    public id: string;

    @ViewChild("pageTitle") private pageTitle: ElementRef;
    @ViewChild("stepTitle") private navItemTitle: ElementRef;
    @ContentChildren("wtf") private whatdafuq: QueryList<ElementRef>;

    constructor(private pages: Pages) {
    }

    /*
        users can pass in their own ids for wizard pages using clrPageId="whatever"
    */
    @Input("clrPageId") private userDefinedId: string;
    ngOnInit(): void {
        // if wizard ID exists (check via WizardNavigationService then use it in place of "clr_wizard_") <= TODO
        // otherwise generate... no, don't worry about that. id will be generated on wizard...
        this.id = this.userDefinedId ? this.userDefinedId : "clr_wizardpage_" + (wizIndex++);
        /* SPECME ^ */

        /* TODO: PULL IN WIZARD ID ^^^ AND APPEND WITH "_page_[num]". Or userDefinedId goes on the back...
        need to grab ID from parent Component
        */
        console.log("after init:", this.whatdafuq);
    }

    ngAfterContentInit(): void {
        // TODO: if you have a navItemTitle give that to the wizard navigator
        // if not, give it the page title
        // also pass page id? how important are ids here???

        //this.wizardNavigation.whut(???);
        console.log("after content init",this.whatdafuq);
    }

// LEFTOFF: stuck here with a very hard problem of trying to find my titles in child components
// may need to pass them up through. may need to just do something or whatever. it's pretty awful right now.

    ngAfterViewInit(): void {
        console.log("after view init",this.pageTitle);
        console.log("after view init",this.navItemTitle);
        if (this.pageTitle) {
            console.log("after view init",this.pageTitle.nativeElement);
        }
        if (this.navItemTitle) {
            console.log("after view init",this.navItemTitle.nativeElement);
        }

        this.whatdafuq.changes.subscribe(item => {
            if (this.whatdafuq.length) {
                console.log("after view init","what the fuck", this.whatdafuq.first.nativeElement);
            }
        });
    }
}
