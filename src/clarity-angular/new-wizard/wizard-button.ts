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
            (click)="doClick()">
            <ng-content></ng-content>
        </button>
    `,
    host: {
        "class": "clr-wizard-btn-wrapper"
    }
})
export class NewWizardButton {
    constructor(private page: NewWizardPage) {
    }

    @Input("type") private type: string = "";

    // EventEmitter which is emitted when a next button is clicked.
    @Output("clrWizardButtonClicked") wasClicked: EventEmitter<NewWizardPage> =
        new EventEmitter<NewWizardPage>(false);

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

    private get isTerminal(): boolean {
        // terminal as in the last button you'll have to click along a path
        return this.type === "finish" || this.type === "danger";
    }

    private get isPrimaryAction(): boolean {
        return this.isNext || this.isTerminal;
    }

    private get isDisabled(): boolean {
        // dealing with negatives here. cognitively easier to think of it like this...
        let disabled = true;
        let page = this.page;

        // TODO: WE'RE JUST USING THIS HERE SO WE CAN SEE THE BUTTONS!
        if (2 > 1) {
            return !disabled;
        }

        if (this.isCancel) {
            return !disabled;
        }

        if (this.isPrevious && page.isFirst) {
            return disabled;
        }

        if (this.isNext && (page.isLast || !page.readyToComplete)) {
            return disabled;
        }

        if (this.isFinish && (!page.isLast || !page.readyToComplete)) {
            return disabled;
        }

        // SPECME ^: ALL THAT BIDNESS UPIN HERE

        return !disabled;
    }

    doClick(): void {
        // TODO: call different routine based on type of button (cancel, previous, next, finish)
        // TODO: notify up that the type of button has been clicked

        let page: NewWizardPage = this.page;

        if (this.isDisabled) {
            return;
        }

        this.wasClicked.emit(page);

        if (this.isCancel) {
            this.page.cancelButtonClicked.emit();
        }

        if (this.isPrevious) {
            this.page.previousButtonClicked.emit();
        }

        if (this.isNext) {
            this.page.nextButtonClicked.emit();
        }

        if (this.isDanger) {
            this.page.dangerButtonClicked.emit();
        }

        if (this.isFinish) {
            this.page.finishButtonClicked.emit();
        }

        if (this.isPrimaryAction) {
            this.page.primaryButtonClicked.emit();
        }

        if (this.isTerminal) {
            this.page.terminalButtonClicked.emit();
        }

        // SPECME ^ ALL THIS STUFF UP IN HERE
        // TOASK ^ DO WE FIRE MULTIPLE EVENTS OR DO WE CARE???
    }
}
