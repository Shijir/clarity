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
import { NewWizardCustomTags } from "./wizard-custom-tags";

export * from "./wizard";
// export * from "./wizard-step";
export * from "./wizard-page";
export * from "./wizard-stepitem-title";
export * from "./wizard-page-title";
export * from "./wizard-custom-tags";

// TODO: remove "NEW" when finishing up

export const NEW_WIZARD_DIRECTIVES: any[] = [
    NewWizard,
    NewWizardCustomTags,
    NewWizardStepitemTitle,
    NewWizardPageTitle,
    // NewWizardStep,
    NewWizardPage
];
