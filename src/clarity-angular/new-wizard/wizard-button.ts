/*
 * Copyright (c) 2016 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {
    Component,
    Input,
    Output,
    EventEmitter
} from "@angular/core";
import { NewWizardPage } from "./wizard-page";
import { WizardNavigationService } from "./providers/wizard-navigation";
import { ButtonHubService } from "./providers/button-hub";

// TODO: remove "NEW" when finishing up

@Component({
    moduleId: module.id,
    selector: "clr-wizard-button",
    template: `
        <button class="btn clr-wizard-btn"
            [class.btn-link]="isCancel"
            [class.clr-wizard-btn--tertiary]="isCancel"
            [class.btn-outline]="isPrevious"
            [class.clr-wizard-btn--secondary]="isPrevious"
            [class.btn-primary]="isPrimaryAction"
            [class.clr-wizard-btn--primary]="isPrimaryAction"
            [class.btn-success]="isFinish"
            [class.btn-danger]="isDanger"
            [class.disabled]="isDisabled"
            [attr.aria-hidden]="isHidden"
            (click)="doClick()">
            <ng-content></ng-content>
        </button>
    `,
    // IS HIDDEN <= class that does display:none [aria-hidden="true"]...?
    host: {
        "class": "clr-wizard-btn-wrapper"
    },
    styles: ['[aria-hidden="true"] { display: none; }']
})
export class NewWizardButton {
    @Input("type") private type: string = "";

    @Input("clrWizardButtonDisabled") private disabled: boolean = false;

    @Input("clrWizardButtonHidden") private hidden: boolean = false;

    // EventEmitter which is emitted when a next button is clicked.
    @Output("clrWizardButtonClicked") wasClicked: EventEmitter<boolean> =
        new EventEmitter<boolean>(false);

    constructor(private navService: WizardNavigationService, private buttonService: ButtonHubService) {
    }

    // TODO: BUILD OUT A BUTTON SERVICE WITH ONE EMITTER?
    // BUTTON SERVICE TELLS EVERYONE WHO NEEDS TO KNOW WHAT'S GOING ON
    // (MAYBE WANT TO DEPRECATE SOME EVENTS -- OR GET RID OF THEM)
    // EVENT EMITTED IS STRING THAT TELLS US WHAT BUTTON WAS CLICKED
    // USERS WILL HAVE A TWO-WAY BINDING ON CURRENTPAGE OF WIZARD

    private get page(): NewWizardPage {
        // buttons only ever care about the current page
        return this.navService.currentPage;
    }

    private get isCancel(): boolean {
        return this.type === "cancel";
    }

    private get isNext(): boolean {
        return this.type === "next";
    }

    private get isPrevious(): boolean {
        return this.type === "previous";
    }

    private get isFinish(): boolean {
        return this.type === "finish";
    }

    private get isDanger(): boolean {
        return this.type === "danger";
    }

    private get isPrimaryAction(): boolean {
        return this.isNext || this.isDanger || this.isFinish;
    }

    // TODO: MOVE BUTTON TYPES TO AN ENUM...
    private get isDisabled(): boolean {
        // dealing with negatives here. cognitively easier to think of it like this...
        let disabled = true;
        let page = this.page;
        let nav = this.navService;

        if (this.disabled) {
            return true;
        }
        // SPECME^ : allow an input to force disabled or not on a button

        if (this.isCancel) {
            return !disabled;
        }

        if (this.isPrevious && nav.currentPageIsFirst) {
            return disabled;
        }

        if (this.isDanger && !page.readyToComplete) {
            return disabled;
        }

        if (this.isNext && (nav.currentPageIsLast || !page.readyToComplete)) {
            return disabled;
        }

        if (this.isFinish && (!nav.currentPageIsLast || !page.readyToComplete)) {
            return disabled;
        }

        // SPECME ^: ALL THAT BIDNESS UPIN HERE

        return !disabled;
    }

    private get isHidden(): boolean {
        // dealing with negatives here. cognitively easier to think of it like this...
        let hidden = true;
        let nav = this.navService;

        if (this.hidden) {
            return true;
        }
        // SPECME^ : allow an input to force disabled or not on a button

        if (this.isCancel) {
            return !hidden;
        }

        if (this.isPrevious && nav.currentPageIsFirst) {
            return hidden;
        }

        if (this.isNext && nav.currentPageIsLast) {
            return hidden;
        }

        if (this.isFinish && !nav.currentPageIsLast) {
            return hidden;
        }

        // SPECME ^: ALL THAT BIDNESS UPIN HERE

        return !hidden;
    }

    doClick(): void {
        // TODO: call different routine based on type of button (cancel, previous, next, finish)
        // TODO: notify up that the type of button has been clicked
        let navService: WizardNavigationService = this.navService;

        if (this.isDisabled) {
            return;
        }

        this.wasClicked.emit();

        if (this.isCancel) {
            navService.cancelWizard();
        }

        if (this.isPrevious) {
            navService.previous();
        }

        if (this.isPrimaryAction) {
            navService.next();
        }

        // SPECME ^ ALL THIS STUFF UP IN HERE
        // TOASK ^ DO WE FIRE MULTIPLE EVENTS OR DO WE CARE???
    }
}
