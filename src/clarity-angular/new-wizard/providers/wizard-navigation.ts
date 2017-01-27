import {
    Injectable,
    TemplateRef
} from "@angular/core";
// import {Subject, Observable} from "rxjs";
import {NewWizardPage} from "../wizard-page";

@Injectable()
export class WizardNavigationService {

// create Observables for currentPageUpdated and pageChanged
// maybe for when list of pages changes too?

    public currentPage: NewWizardPage;

    public get currentPageTitle(): TemplateRef<any> {
        return this.currentPage.title;
    }

    public setCurrentPage(page: NewWizardPage): void {
        this.currentPage = page;
        // this.wizard.
        // TODO: GET RID OF THIS
        // this.currentPageUpdated.emit(this);
    }
}