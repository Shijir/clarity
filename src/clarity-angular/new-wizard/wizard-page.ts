/*
 * Copyright (c) 2016 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {
    AfterContentInit,
    Component,
    Input,
    Output,
    EventEmitter,
    ContentChild,
    TemplateRef
} from "@angular/core";

import { WizardNavigationService } from "./providers/wizard-navigation";
import { WizardPageTitleDirective } from "./directives/page-title";
import { WizardPageNavTitleDirective } from "./directives/page-navtitle";

// TODO: remove "NEW" when finishing up

@Component({
    moduleId: module.id,
    selector: "clr-newwizard-page",
    templateUrl: "./wizard-page.html"
})
export class NewWizardPage implements AfterContentInit {
    // EventEmitter which is emitted on open/close of the wizard.
    @Output("clrWizardPageNowCurrent") pageCurrentChanged: EventEmitter<any> =
        new EventEmitter<any>(false);

    @ContentChild(WizardPageTitleDirective) public pageTitle: WizardPageTitleDirective;
    @ContentChild(WizardPageNavTitleDirective) public pageNavTitle: WizardPageNavTitleDirective;

    constructor(private navService: WizardNavigationService) {
    }

    /*
        sets/unsets page to current and emits an event that should tell observers which page's current state 
        changed and also whether it was changed to true or false...
        TODO: does it do that?
    */
    get current() {
        return this.navService.currentPage === this;
    }

    get title(): TemplateRef<any> {
        return this.pageTitle.pageTitleTemplateRef;
    }

    /* SPECME - returns short nav title if specified; otherwise returns page title */
    get navTitle(): TemplateRef<any> {
        if (this.pageNavTitle) {
            return this.pageNavTitle.pageNavTitleTemplateRef;
        }
        return this.pageTitle.pageTitleTemplateRef;
    }

    private _hidden = false;
    /**
     * Indicates if the wizard page is hidden
     */
    public get hidden(): boolean {
        return this._hidden;
    }
    @Input("clrWizardPageHidden")
    public set hidden(value: boolean) {
        this._hidden = value;
    }

    @Output("clrWizardPageHiddenChange") hiddenChanged = new EventEmitter<boolean>(false);

    public hide() {
        if (!this.hidden) {
            this.hidden = true;
            this.hiddenChanged.emit(true);
        }
    }

    public show() {
        if (this.hidden) {
            this.hidden = false;
            this.hiddenChanged.emit(false);
        }
    }


    ngAfterContentInit(): void {
        let wiznav = this.navService;

        // TODO: create an add() fn on wiznav that adds the pages and sets up listeners
        wiznav.add(this);

        console.log("wizard-page - get current: ", this.title, " - isCurrent? ", this.current);
    }
}
