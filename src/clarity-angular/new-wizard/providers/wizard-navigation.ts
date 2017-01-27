import {
    Injectable,
    TemplateRef
} from "@angular/core";
import { Subject, Observable } from "rxjs";
import { NewWizardPage } from "../wizard-page";

@Injectable()
export class WizardNavigationService {

// create Observables for currentPageUpdated and pageChanged
// maybe for when list of pages changes too?

    //  lets other components subscribe to when the current page changes
    private _currentChanged = new Subject<NewWizardPage>();
    public get currentPageChanged(): Observable<NewWizardPage> {
        return this._currentChanged.asObservable();
    };

    public currentPage: NewWizardPage;

    public get currentPageTitle(): TemplateRef<any> {
        return this.currentPage.title;
    }

    public setCurrentPage(page: NewWizardPage): void {
        this.currentPage = page;
        this._currentChanged.next(page);
    }

    private _moveNext = new Subject<NewWizardPage>();
    public get goNext(): Observable<NewWizardPage> {
        return this._moveNext.asObservable();
    }

    public goNextPage(): void {
        this._moveNext.next(this.currentPage);
    }
}