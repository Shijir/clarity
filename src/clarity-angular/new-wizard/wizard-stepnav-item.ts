/*
 * Copyright (c) 2016 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
// import { Component, ViewChild } from "@angular/core";
import {
    // Output,
    Input,
    Component,
    OnInit
    // AfterViewInit
} from "@angular/core";
import { NewWizardPage } from "./wizard-page";
import { WizardNavigationService } from "./providers/wizard-navigation";

// TODO: remove "NEW" when finishing up

@Component({
    moduleId: module.id,
    selector: "[clr-wizard-stepnav-item]",
    template: `
        <button type="button" class="btn btn-link nav-link" (click)="doClick()">
            <template [ngTemplateOutlet]="page.navTitle"></template>
        </button>
    `,
    host: {
        "[id]": "id",
        "[attr.aria-selected]": "page.current",
        "[attr.aria-controls]": "page.id",
        "role": "presentation",
        "[class.clr-nav-link]": "true",
        "[class.nav-item]": "true",
        "[class.active]": "page.current",
        "[class.disabled]": "page.disabled",
        "[class.complete]": "page.complete"
    }
})

export class NewWizardStepnavItem implements OnInit {
    constructor(private navService: WizardNavigationService) {
    }

    @Input("page") private page: NewWizardPage;

    private _id: string;
    public get id(): string {
        return this._id;
    }

    ngOnInit(): void {
        let pageId = this.page.id;
        // let pageId = "test-page-wizard-0-page-1";
        // SPECME
        let pageIdParts = pageId.split("-").reverse();
        pageIdParts[1] = "tab";
        this._id = pageIdParts.reverse().join("-");
    }

    doClick(): boolean {
        // this.tabs.selectTab(this);

        // SPECME: if we click on our own link, we don't want it to do anything
        if (this.page === this.navService.currentPage) {
            console.log("OHNOEZ!");
            return false;
        }

        // TODO: communicate to navService to update the page
        console.log("OHAI!");
        return false; // so that browser doesn't navigate to the href of the anchor tag
    }
}
