/*
 * Copyright (c) 2016 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { NewWizard } from "./wizard";
import { NewWizardPage } from "./wizard-page";
import { NewWizardStepnav } from "./wizard-stepnav";
import { NewWizardStepnavItem } from "./wizard-stepnav-item";
import { NewWizardButton } from "./wizard-button";
import { NewWizardHeaderAction } from "./wizard-header-action";

//directives
import { NewWizardCustomTags } from "./wizard-custom-tags";
import { WizardPageTitleDirective } from "./directives/page-title";
import { WizardPageNavTitleDirective } from "./directives/page-navtitle";
import { WizardPageButtonsDirective } from "./directives/page-buttons";
import { WizardPageHeaderActionsDirective } from "./directives/page-header-actions";

export * from "./wizard";
export * from "./wizard-page";
export * from "./wizard-stepnav"
export * from "./wizard-stepnav-item"
export * from "./wizard-button"
export * from "./wizard-header-action"

// directives
export * from "./wizard-custom-tags";
export * from "./directives/page-title";
export * from "./directives/page-navtitle";
export * from "./directives/page-buttons";
export * from "./directives/page-header-actions";

// TODO: remove "NEW" when finishing up

export const NEW_WIZARD_DIRECTIVES: any[] = [
    NewWizard,
    NewWizardPage,
    NewWizardStepnav,
    NewWizardStepnavItem,
    NewWizardButton,
    NewWizardHeaderAction,
    NewWizardCustomTags,
    WizardPageTitleDirective,
    WizardPageNavTitleDirective,
    WizardPageButtonsDirective,
    WizardPageHeaderActionsDirective
];
