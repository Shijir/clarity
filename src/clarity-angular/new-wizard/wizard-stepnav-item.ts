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
        <button type="button" class="btn btn-link nav-link">
            <template [ngTemplateOutlet]="page.navTitle"></template>
        </button>
    `,
    host: {
        "[id]": "id",
        "[class.active]": "page.current",
        "[class.complete]": "page.complete",
        "[class.nav-item]": "true",
        "role": "presentation",
        "[attr.aria-selected]": "page.current",
        "[attr.aria-controls]": "page.id",
        "[class.clr-nav-link]": "true"
    }
})
export class NewWizardStepnavItem {
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
}


/*

<li _ngcontent-gsp-41="" aria-controls="clr-tabs-0-content-0" aria-selected="true" 
class="clr-nav-link complete" id="clr-tabs-0-tab-0" role="presentation">
    <button _ngcontent-gsp-41="" class="btn btn-link nav-link" type="button">
        Step 1
    </button>
</li>

*/