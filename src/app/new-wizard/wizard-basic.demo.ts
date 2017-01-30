/*
 * Copyright (c) 2016 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import {Component, ViewChild} from "@angular/core";
import {NewWizard} from "../../clarity-angular/new-wizard/wizard";
import {CodeHighlight} from "../../clarity-angular/code/code-highlight";

// TODO: remove "NEW" when finishing up

@Component({
    moduleId: module.id,
    selector: "clr-new-wizard-basic",
    templateUrl: "./wizard-basic.demo.html"
})
export class NewWizardBasicDemo {
    @ViewChild("wizardmd") wizardMedium: NewWizard;
    @ViewChild("wizardlg") wizardLarge: NewWizard;
    @ViewChild("wizardxlg") wizardDefault: NewWizard;
    @ViewChild(CodeHighlight) codeHighlight: CodeHighlight;

    code: string = `
import {Component, ViewChild} from "@angular/core";
import {Wizard} from "clarity-angular";

@Component({
    ...
})
export class WizardSimple {
    @ViewChild("wizard") wizard: Wizard;
    open: boolean = false; // you can open the wizard by setting this variable to true

    // you can also open the wizard programmatically here by calling wizard.open()

}
    `;

    html: string = `
<clr-wizard #wizard [(clrWizardOpen)]="open" [clrWizardSize]="'lg'">
    <div class="wizard-title">Wizard Title</div>

    <clr-wizard-step>Step 1</clr-wizard-step>
    <clr-wizard-step>Step 2</clr-wizard-step>
    <clr-wizard-step>Step 3</clr-wizard-step>

    <clr-wizard-page>Content for step 1</clr-wizard-page>
    <clr-wizard-page>Content for step 2</clr-wizard-page>
    <clr-wizard-page>Content for step 3</clr-wizard-page>
</clr-wizard>
`;

    public showStepThree: boolean = false;

    public handlePrimaryClick(page: any): void {
        console.log("I am a button in the demo. The blue primary button was clicked!");
    }

    public handleFinishClick(page: any): void {
        console.log("I am a page in the demo. The finish button was clicked!");
    }

    public highVoltage() {
        console.log("Danger... Danger... High voltage!");
    }

    public doTestHere(): boolean {
        return true;
    }

    public handlePageChange(): void {
        console.log("I changed my current page.");
    }
}
