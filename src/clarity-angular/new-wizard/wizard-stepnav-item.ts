/*
 * Copyright (c) 2016 VMware, Inc. All Rights Reserved.
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
        <button type="button" class="btn btn-link nav-link" (click)="click()">
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
        if (this.isDisabled || this.isCurrent) {
            return;
        }
        // SPECME: if we click on our own stepnav or a disabled stepnav, we don't want to do anything
        this.navService.goTo(this.page);
    }
}
