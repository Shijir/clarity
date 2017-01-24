/*
 * Copyright (c) 2016 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { NewWizard } from "./wizard";
// import { NewWizardStep } from "./wizard-step";
import { NewWizardPage } from "./wizard-page";
import { NewWizardStepitemTitle } from "./wizard-stepitem-title";
import { NewWizardPageTitle } from "./wizard-page-title";
import { NewWizardStepnav } from "./wizard-stepnav";
import { NewWizardStepnavItem } from "./wizard-stepnav-item";

//directives
import { NewWizardCustomTags } from "./wizard-custom-tags";
import { WizardPageTitleDirective } from "./directives/page-title";
import { WizardPageNavTitleDirective } from "./directives/page-navtitle";

export * from "./wizard";
// export * from "./wizard-step";
export * from "./wizard-page";
export * from "./wizard-stepitem-title";
export * from "./wizard-page-title";
export * from "./wizard-stepnav"
export * from "./wizard-stepnav-item"

// directives
export * from "./wizard-custom-tags";
export * from "./directives/page-title";
export * from "./directives/page-navtitle";

// TODO: remove "NEW" when finishing up

export const NEW_WIZARD_DIRECTIVES: any[] = [
    NewWizard,
    NewWizardStepitemTitle,
    NewWizardPageTitle,
    // NewWizardStep,
    NewWizardPage,
    NewWizardStepnav,
    NewWizardStepnavItem,
    NewWizardCustomTags,
    WizardPageTitleDirective,
    WizardPageNavTitleDirective
];
