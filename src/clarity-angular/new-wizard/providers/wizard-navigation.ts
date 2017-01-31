import {
    Injectable,
    QueryList,
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

    public pages: QueryList<NewWizardPage>;

    public isOnFirstPage: boolean = true;

    public isOnLastPage: boolean = false;

    public currentPage: NewWizardPage;

    public get currentPageTitle(): TemplateRef<any> {
        return this.currentPage.title;
    }

    public setCurrentPage(page: NewWizardPage): void {
        page.completed = false;
        this.currentPage = page;
        this._currentChanged.next(page);
        // SPECME
    }

    private _moveNext = new Subject<NewWizardPage>();
    public get goNext(): Observable<NewWizardPage> {
        return this._moveNext.asObservable();
    }
    public goNextPage(buttonType: string): void {
        let page: NewWizardPage = this.currentPage;
        if ("danger" === buttonType) {
            page.dangerButtonClicked.emit(page);
        } else if ("finish" === buttonType) {
            page.finishButtonClicked.emit(page);
        } else {
            // goNextPage falls back to the "next" button
            page.nextButtonClicked.emit(page);
        }
        this._moveNext.next(page);
    }

    private _movePrevious = new Subject<NewWizardPage>();
    public get goPrevious(): Observable<NewWizardPage> {
        return this._movePrevious.asObservable();
    }
    public goPreviousPage(): void {
        let page: NewWizardPage = this.currentPage;
        page.previousButtonClicked.emit(page);
        this._movePrevious.next(page);
    }

    private _cancelWizard = new Subject<any>();
    public get notifyWizardCancel(): Observable<any> {
        return this._cancelWizard.asObservable();
    }
    public cancelWizard(): void {
        this.currentPage.cancelButtonClicked.emit();
        this._cancelWizard.next();
    }

    private _goTo = new Subject<NewWizardPage>();
    public get notifyGoTo(): Observable<NewWizardPage> {
        return this._goTo.asObservable();
    }
    public goToPage(pageToGoTo: NewWizardPage) {
        console.log("OHAI");
        this._goTo.next(pageToGoTo);

        // LEFTOFF: NEED WIZARD TO HANDLE CHECKING SURROUNDING PAGES, EARLY
        // RETURN IF PAGE CAN'T BE ACTIVATED, RESETTING PAGES LATER IN THE 
        // WIZARD...

        // NEED TO BE ABLE TO REUSE THIS FUNCION IN THE WIZARD FOR GRABBING
        // A PAGE BY REFERENCE OR ID...
    }
}