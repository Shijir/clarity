/*
 * Copyright (c) 2016 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import {
    Directive,
    TemplateRef
} from "@angular/core";

@Directive({
    selector: "[pageButtons]"
})
export class WizardPageButtonsDirective {
    constructor(public pageButtonsTemplateRef: TemplateRef<any>) {
    }
}





// <template pageButtons>
//     <clr-wizard-button [type]="cancel">Cancel</clr-wizard-button>
//     <clr-wizard-button [type]="back">Previous</clr-wizard-button>
//     <clr-wizard-button [type]="next">Next</clr-wizard-button>
//     <clr-wizard-button [type]="finish">Finish</clr-wizard-button>
// </template>

