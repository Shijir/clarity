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

// TODO: remove "NEW" when finishing up

let wizardHeaderActionIndex = 0;

@Component({
    moduleId: module.id,
    selector: "clr-wizard-header-action",
    template: `
        <button class="btn clr-wizard-header-action btn-link"
            [id]="id"
            [class.disabled]="disabled"
            (click)="click()">
            <ng-content></ng-content>
        </button>
    `,
    host: {
        "class": "clr-wizard-header-action-wrapper"
    }
})
export class NewWizardHeaderAction {
    // If our host has an ID attribute, we use this instead of our index.
    @Input("id")
    _id: string = (wizardHeaderActionIndex++).toString();

    public get id(): string {
        return `clr-wizard-header-action-${this._id}`;
        // SPECME
    }

    @Input("clrWizardHeaderActionDisabled") public disabled: boolean = false;

    @Output("actionClicked") headerActionClicked: EventEmitter <string> =
        new EventEmitter(false);

    click(): void {
        if (this.disabled) {
            return;
        }
        // SPECME

        // passing the header action id allows users to have one method that
        // routes to many different actions based on the type of header action
        // clicked. this is further aided by users being able to specify ids
        // for their header actions.
        this.headerActionClicked.emit(this.id);
    }
}
