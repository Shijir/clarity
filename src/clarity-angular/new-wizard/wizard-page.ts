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
    TemplateRef
} from "@angular/core";

import { WizardNavigationService } from "./providers/wizard-navigation";
import { WizardPageTitleDirective } from "./directives/page-title";
import { WizardPageNavTitleDirective } from "./directives/page-navtitle";
import { WizardPageButtonsDirective } from "./directives/page-buttons";

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
export class NewWizardPage {

    @ContentChild(WizardPageTitleDirective) public pageTitle: WizardPageTitleDirective;
    @ContentChild(WizardPageNavTitleDirective) public pageNavTitle: WizardPageNavTitleDirective;
    @ContentChild(WizardPageButtonsDirective) private _buttons: WizardPageButtonsDirective;

    // Next button disabled
    @Input("clrWizardPageNextDisabled") public nextStepDisabled: boolean;

    // Error Flag Raised
    @Input("clrWizardPageErrorFlag") public errorFlag: boolean;
    // todo... error event??

    // TODO: HIDDEN AND SKIPPED ARE THE SAME THING
    @Output("clrWizardPageHiddenChange") hiddenChanged = new EventEmitter<boolean>(false);

    @Output("clrWizardPageSkippedChange") skippedChange = new EventEmitter<boolean>(false);

    // EventEmitter which is emitted on open/close of the wizard.
    @Output("clrWizardPageNowCurrent") pageCurrentChanged: EventEmitter<any> =
        new EventEmitter<any>(false);

    // User can bind an event handler for onCommit of the main content
    @Output("clrWizardPageOnCommit") onCommit: EventEmitter<any> =
        new EventEmitter<any>(false);

    // User can bind an event handler for onLoad of the main content
    @Output("clrWizardPageOnLoad") onLoad: EventEmitter<any> = new EventEmitter(false);

    // Emitter for Next button state changes
    @Output("clrWizardPageNextDisabledChanged") nextDisabledChanged: EventEmitter<any> =
        new EventEmitter(false);

    // Emitters button events
    @Output("clrWizardPageNextButtonClicked") nextButtonClicked: EventEmitter<any> =
        new EventEmitter(false);

    @Output("clrWizardPageCancelButtonClicked") cancelButtonClicked: EventEmitter<any> =
        new EventEmitter(false);

    @Output("clrWizardPageFinishButtonClicked") finishButtonClicked: EventEmitter<any> =
        new EventEmitter(false);

    @Output("clrWizardPagePreviousButtonClicked") previousButtonClicked: EventEmitter<any> =
        new EventEmitter(false);

    @Output("clrWizardPageDangerButtonClicked") dangerButtonClicked: EventEmitter<any> =
        new EventEmitter(false);

    @Output("clrWizardPagePrimaryButtonClicked") primaryButtonClicked: EventEmitter<any> =
        new EventEmitter(false);

    @Output("clrWizardPageTerminalButtonClicked") terminalButtonClicked: EventEmitter<any> =
        new EventEmitter(false);


    constructor(private navService: WizardNavigationService) {
    }

    // @Input("clrWizardPagePreventDefault")
    // TOBREAK: this input was removed. use ngIf instead. note breaking change.

    // TODO: USER-DEFINED IDS ON PAGES!? SO SERVICE CAN SELECT THEM DIRECTLY
    // OR USE `#myId` REFERENCE <= SIMPLEST WAY TO DO IT <= GRABBING WIZARD THROUGH TEMPLATE VARIABLE

    // private doSkippedChange(value: boolean) {
    //     this._preventDefault = this._pageInactive = value;
    //     this.skippedChange.emit(value);
    // }

    // TODO: UPDATE PAGE WITH EVENT THAT NOTES WHEN PAGE BECOMES AVAILABLE
    // skippedChange ^ or other event too... deprecate "skipped"

    // If our host has an ID attribute, we use this instead of our index.
    @Input("id")
    _id: string = (wizardPageIndex++).toString();

    public get id() {
        return `clr-wizard-page-${this._id}`;
    }

    public get stepItemId(): string {
        let pageId = this.id;
        let pageIdParts = pageId.split("-").reverse();
        // SPECME^ (especially with userdefined page ids with dashes in them)
        pageIdParts[1] = "step";
        return pageIdParts.reverse().join("-");
    }

    public get readyToComplete(): boolean {
        return !this.nextStepDisabled;
    }

    private _complete: boolean = false;
    public get complete(): boolean {
        return this._complete;
    }
    // TOASK: DO WE NEED A SETTER HERE?

    // asks navService if it is the currentPage
    public get current(): boolean {
        return this.navService.currentPage === this;
    }

    public get disabled(): boolean {
        return !this.current && !this.complete;
    }

    public get title(): TemplateRef<any> {
        return this.pageTitle.pageTitleTemplateRef;
    }

    public get isFirst(): boolean {
        //TODO: have to look up in navService
        return true;
    }

    public get isLast(): boolean {
        //TODO: have to look up in navService
        return false;
    }

    /* SPECME - returns short nav title if specified; otherwise returns page title */
    public get navTitle(): TemplateRef<any> {
        if (this.pageNavTitle) {
            return this.pageNavTitle.pageNavTitleTemplateRef;
        }
        return this.pageTitle.pageTitleTemplateRef;
    }

    public get pageButtons(): TemplateRef<any> {
        return this._buttons.pageButtonsTemplateRef;
    }

    public makeCurrent(): void {
        this.navService.setCurrentPage(this);
        this.pageCurrentChanged.emit();
    }

    public ngOnInit(): void {
        if (!this.navService.currentPage) {
            this.makeCurrent();
        }
    }
}
