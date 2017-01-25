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
    TemplateRef,
    OnInit
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
        "[attr.aria-labelledby]": "'ariaLabelledBy'",
        "[attr.data-hidden]": "!current",
        "[class.active]" : "current",
        "[class.clr-wizard-page]": "true"
    }
})
export class NewWizardPage implements OnInit, AfterContentInit {

    @ContentChild(WizardPageTitleDirective) public pageTitle: WizardPageTitleDirective;
    @ContentChild(WizardPageNavTitleDirective) public pageNavTitle: WizardPageNavTitleDirective;
    @ContentChild(WizardPageButtonsDirective) private _buttons: WizardPageButtonsDirective;

    // input variable, optional, to set if this tab is skipped
    @Input("clrWizardPagePreventDefault") preventDefault: boolean = false;

    // Next button disabled
    @Input("clrWizardPageNextDisabled") public nextStepDisabled: boolean;

    // Error Flag Raised
    @Input("clrWizardPageErrorFlag") public errorFlag: boolean;
    // todo... error event??

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

    constructor(private navService: WizardNavigationService) {
    }

    // input variable, optional, to set if this tab is skipped
    private _isSkipped: boolean = false;

    @Input("clrWizardPageIsSkipped")
    public get isSkipped(): boolean {
        return this._isSkipped;
    }

    public set isSkipped(value: boolean) {
        this._isSkipped = value;
        // TODO: call up to navService here?
    }

    private _id: string;
    public get id(): string {
        return this._id;
    }

    public get readyToComplete(): boolean {
        return !this.nextStepDisabled;
    }

    private _complete: boolean = false;
    public get complete(): boolean {
        return this._complete;
    }

    /*
        asks navService if it is the currentPage
    */
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

    public get buttons(): TemplateRef<any> {
        return this._buttons.pageButtonsTemplateRef;
    }

    /**
     * Indicates if this wizard page is hidden
     * QUESTION: WOULD THIS BE HANDLED BETTER BY *NGIF????
     */
    private _hidden = false;
    public get hidden(): boolean {
        return this._hidden;
    }
    @Input("clrWizardPageHidden")
    public set hidden(value: boolean) {
        this._hidden = value;
    }

    @Output("clrWizardPageHiddenChange") hiddenChanged = new EventEmitter<boolean>(false);
    public hide(): void {
        if (!this.hidden) {
            this.hidden = true;
            this.hiddenChanged.emit(true);
        }
    }

    public show(): void {
        if (this.hidden) {
            this.hidden = false;
            this.hiddenChanged.emit(false);
        }
    }

    public ngAfterContentInit(): void {
        this.navService.add(this);
        // SPECME^ check that all pages are loaded and the first !hidden one is current
    }

    public ngOnInit(): void {
        this._id = this.navService.id + "-page-" + wizardPageIndex;
        wizardPageIndex++;
        // SPECME -- make sure page ids are incremented as expected
    }
}
