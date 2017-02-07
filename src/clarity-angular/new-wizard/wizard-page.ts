/*
 * Copyright (c) 2016 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {
    Component,
    Input,
    Output,
    EventEmitter,
    ContentChild,
    TemplateRef,
    OnInit,
    OnDestroy
} from "@angular/core";

import { WizardNavigationService } from "./providers/wizard-navigation";
import { PageCollectionService } from "./providers/page-collection";
import { ButtonHubService } from "./providers/button-hub";

import { WizardPageTitleDirective } from "./directives/page-title";
import { WizardPageNavTitleDirective } from "./directives/page-navtitle";
import { WizardPageButtonsDirective } from "./directives/page-buttons";

import { Subscription } from "rxjs/Subscription";

let wizardPageIndex = 0;

// TODO: remove "NEW" when finishing up

@Component({
    moduleId: module.id,
    selector: "clr-newwizard-page",
    template: "<ng-content></ng-content>",
    host: {
        "[id]" : "id",
        "role" : "tabpanel",
        "[attr.aria-hidden]" : "!current",
        "[attr.aria-labelledby]": "stepItemId",
        "[attr.data-hidden]": "!current",
        "[class.active]" : "current",
        "[class.clr-wizard-page]": "true"
    }
})
export class NewWizardPage implements OnInit, OnDestroy {

    constructor(private navService: WizardNavigationService,
                public pageCollection: PageCollectionService,
                public buttonService: ButtonHubService) {
    }

    @ContentChild(WizardPageTitleDirective) public pageTitle: WizardPageTitleDirective;
    @ContentChild(WizardPageNavTitleDirective) public pageNavTitle: WizardPageNavTitleDirective;
    @ContentChild(WizardPageButtonsDirective) private _buttons: WizardPageButtonsDirective;

    // Next button disabled
    @Input("clrWizardPageNextDisabled") public nextStepDisabled: boolean;

    // Previous button disabled
    @Input("clrWizardPagePagePreviousDisabled") public movePreviousDisabled: boolean = false;

    // Error Flag Raised
    @Input("clrWizardPageErrorFlag") public errorFlag: boolean;
    // todo... error event??

    @Input("clrWizardPageCustomCancel") public customCancel: any = false;

    // TODO: HIDDEN AND SKIPPED ARE THE SAME THING; GET RID OF THIS
    // TODO: MOVE TO PAGE COLLECTION SERVICE
    @Output("clrWizardPageHiddenChange") hiddenChanged = new EventEmitter<boolean>(false);

    @Output("clrWizardPageSkippedChange") skippedChange = new EventEmitter<boolean>(false);

    // EventEmitter which is emitted on open/close of the wizard.
    @Output("clrWizardPageNowCurrent") pageCurrentChanged: EventEmitter < any > =
        new EventEmitter<any>(false);

    // IDEALLY THIS IS A TWO WAY BINDING ON page.completed??? EUDES NOT SURE...
    // User can bind an event handler for onCommit of the main content
    @Output("clrWizardPageOnCommit") onCommit: EventEmitter < any > =
        new EventEmitter<any>(false);

    // User can bind an event handler for onLoad of the main content
    @Output("clrWizardPageOnLoad") onLoad: EventEmitter < any > = new EventEmitter(false);

    // Emitter for Next button state changes
    @Output("clrWizardPageNextDisabledChanged") nextDisabledChanged: EventEmitter < any > =
        new EventEmitter(false);

    // TODO: moving some of this work to button hub
    // Emitters button events
    @Output("clrWizardPageNext") nextButtonClicked: EventEmitter < any > =
        new EventEmitter(false);

    @Output("clrWizardPageCancel") cancelButtonClicked: EventEmitter < any > =
        new EventEmitter(false);

    @Output("clrWizardCustomCancelAction") customCancelClicked: EventEmitter < any > =
        new EventEmitter(false);

    @Output("clrWizardPageFinish") finishButtonClicked: EventEmitter < any > =
        new EventEmitter(false);

    @Output("clrWizardPagePrevious") previousButtonClicked: EventEmitter < any > =
        new EventEmitter(false);

    @Output("clrWizardPageDanger") dangerButtonClicked: EventEmitter < any > =
        new EventEmitter(false);

    @Output("clrWizardPagePrimary") primaryButtonClicked: EventEmitter < any > =
        new EventEmitter(false);

    @Output("clrWizardPageCustomButton") customButtonClicked: EventEmitter < any > =
        new EventEmitter(false);

    // @Input("clrWizardPagePreventDefault")
    // TOBREAK: this input was removed. use ngIf instead. note breaking change.

    // private doSkippedChange(value: boolean) {
    //     this._preventDefault = this._pageInactive = value;
    //     this.skippedChange.emit(value);
    // }

    private previousButtonSubscription: Subscription;

// TODO: UPDATE PAGE WITH EVENT THAT NOTES WHEN PAGE BECOMES AVAILABLE (ONLOAD - with using ngIf 
// may need to call a pageready event (onLoad) from the page collection service)
// skippedChange ^ or other event too... deprecate "skipped"

    // If our host has an ID attribute, we use this instead of our index.
    @Input("id")
    _id: string = (wizardPageIndex++).toString();

    public get id() {
        return `clr-wizard-page-${this._id}`;
        // SPECME
    }

    public get readyToComplete(): boolean {
        return !this.nextStepDisabled;
    }

// TODO!!! need an errored event for when ready to complete changes
// do we already have one?

    private _complete: boolean = false;
    public get completed(): boolean {
// ###LEFTOFF: completed needs to be tied to readyToComplete somehow
// so that we can track when changes to other pages invalidate them
// do we show errored? or do we just make invalid??
        return this._complete && this.readyToComplete;
        // SPECME
    }
    public set completed(value: boolean) {
        this._complete = value;
    }

    // asks navService if it is the currentPage
    public get current(): boolean {
        return this.navService.currentPage === this;
    }

    public get disabled(): boolean {
        return !this.enabled;
    }

    public get enabled(): boolean {
        return this.current || this.completed || this.previousCompleted;
        // SPECME
    }

    public get previousCompleted(): boolean {
        let previousPage = this.pageCollection.getPreviousPage(this);

        if (!previousPage) {
            return true;
        }
        // SPECME

        return previousPage.completed;
    }

    public get title(): TemplateRef < any > {
        return this.pageTitle.pageTitleTemplateRef;
    }

    /* SPECME - returns short nav title if specified; otherwise returns page title */
    public get navTitle(): TemplateRef < any > {
        if (this.pageNavTitle) {
            return this.pageNavTitle.pageNavTitleTemplateRef;
        }
        return this.pageTitle.pageTitleTemplateRef;
    }

    public get buttons(): TemplateRef < any > {
        return this._buttons.pageButtonsTemplateRef;
    }

    public get hasButtons(): boolean {
// TOFIX?: this is a very noisy check. uncomment to see it in action.
        // console.log("OHAYZ! I'm ", this.id, ". I'm in hasButtons! Do I have buttons? ", this._buttons);
        return !!this._buttons;
    }

    public makeCurrent(): void {
        this.navService.setCurrentPage(this);
        this.pageCurrentChanged.emit();
    }

    public ngOnInit(): void {
        if (!this.navService.currentPage) {
            this.makeCurrent();
        }
        // SPECME
    }

    public ngOnDestroy(): void {
        this.previousButtonSubscription.unsubscribe();
    }
}
