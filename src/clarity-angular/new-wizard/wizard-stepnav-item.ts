/*
 * Copyright (c) 2016-2017 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {
    Input,
    Component
} from "@angular/core";
import { NewWizardPage } from "./wizard-page";
import { WizardNavigationService } from "./providers/wizard-navigation";
import { PageCollectionService } from "./providers/page-collection";

// TODO: remove "NEW" when finishing up

@Component({
    moduleId: module.id,
    selector: "[clr-wizard-stepnav-item]",
    template: `
        <button type="button" class="btn btn-link clr-wizard-stepnav-link" (click)="click()">
            <template [ngTemplateOutlet]="page.navTitle"></template>
        </button>
    `,
    host: {
        "[id]": "id",
        "[attr.aria-selected]": "isCurrent",
        "[attr.aria-controls]": "id",
        "role": "presentation",
        "[class.clr-nav-link]": "true",
        "[class.nav-item]": "true",
        "[class.active]": "isCurrent",
        "[class.disabled]": "isDisabled",
        "[class.complete]": "isComplete"
    }
})

export class NewWizardStepnavItem {
    @Input("page") public page: NewWizardPage;

    constructor(public navService: WizardNavigationService, public pageCollection: PageCollectionService) {
    }

    public get id(): string {
        let myPage = this.page;

        if (!myPage) {
            throw new Error("Wizard stepnav item is not associated with a wizard page.");
        }
        return this.pageCollection.getStepItemIdForPage(this.page);
    }

    public get isDisabled(): boolean {
        return this.page.disabled;
    }

    public get isCurrent(): boolean {
        return this.page.current;
    }

    public get isComplete(): boolean {
        return this.page.completed;
    }

    click(): void {
        let myPage = this.page;

        if (!myPage) {
            throw new Error("Wizard stepnav item is not associated with a wizard page.");
        }

        if (this.isDisabled || this.isCurrent) {
            return;
        }

        // SPECME: if we click on our own stepnav or a disabled stepnav, we don't want to do anything
        this.navService.goTo(myPage);
    }

// TOBREAK: this.title has been removed because it is no longer needed

// TOBREAK: clrWizardStepId input has been removed. this.id still works to retrieve id of stepnav-item

// TOBREAK: this.onClick() has been changed to just this.click()
}
