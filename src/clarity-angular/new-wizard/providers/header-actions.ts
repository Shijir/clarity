import {
    Injectable,
    QueryList
} from "@angular/core";

import { NewWizardHeaderAction } from "../wizard-header-action";
import { WizardNavigationService } from "./wizard-navigation";

@Injectable()
export class HeaderActionService {
    // this service communicates information about the presence/display of header actions
    // across the wizard

    constructor(public navService: WizardNavigationService) {
    }

    public wizardHeaderActions: QueryList<NewWizardHeaderAction>;

    public get wizardHasHeaderActions(): boolean {
        let wizardHdrActions = this.wizardHeaderActions;
        if (!wizardHdrActions) {
            return false;
        }
        return wizardHdrActions.toArray().length > 0;
    }

    public get currentPageHasHeaderActions(): boolean {
        return this.navService.currentPage.hasHeaderActions;
    }

    public get showWizardHeaderActions(): boolean {
        return !this.currentPageHasHeaderActions && this.wizardHasHeaderActions;
    }

    public get displayHeaderActionsWrapper(): boolean {
        return this.currentPageHasHeaderActions || this.wizardHasHeaderActions;
    }
}