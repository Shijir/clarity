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
        <template [ngTemplateOutlet]="page.navTitle"></template>
    `,
    host: {
        "id": "dafuq",
        "[class.active]": "page.current"
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
        console.log("I am a stepNavItem. this is my page's id: ", this.page.id);

        // LEFTOFF: now i need to setup ids on the individual stepnavitems (see below aria stuff)
        // i can construct the stepnav from the existing page id
        // have to work backwards though because front part can be anything
        //
        // so i'm thinking pageId; "w-t-f-page-0"
        // so i'm thinking pageId.split("-"); ["w","t","f","page","0"]
        // then replacing "page" with "step"... ["w","t","f","step","0"].join("-");
        // "w-t-f-step-0" <= which is what we want
        // hop into this with debugger to make sure it works the way you want
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