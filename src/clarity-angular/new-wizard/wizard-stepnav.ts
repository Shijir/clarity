/*
 * Copyright (c) 2016 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from "@angular/core";
import { PageCollectionService } from "./providers/page-collection";

// TODO: remove "NEW" when finishing up

@Component({
    moduleId: module.id,
    selector: "clr-wizard-stepnav",
    template: `
        <ol class="nav navList clr-wizard-stepnav-list" role="tablist">
            <li *ngFor="let page of pageService.pages" clr-wizard-stepnav-item [page]="page"></li>
        </ol>
    `,
    host: {
        "class": "clr-wizard-stepnav"
    }
})

// TODO: ITERATE ON PAGESERVICE INSTEAD OF WIZARD

export class NewWizardStepnav {
    constructor(private pageService: PageCollectionService) {
    }
}
