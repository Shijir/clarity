import {
    Injectable,
    TemplateRef
} from "@angular/core";
import { Subject, Observable } from "rxjs";
import { NewWizardPage } from "../wizard-page";
import { PageCollectionService } from "./page-collection";

@Injectable()
export class WizardNavigationService {

    constructor(public pageCollection: PageCollectionService) {
    }

// TODO: create Observables for currentPageUpdated and pageChanged

    //  lets other components subscribe to when the current page changes
    private _currentChanged = new Subject<NewWizardPage>();
    public get currentPageChanged(): Observable<NewWizardPage> {
        return this._currentChanged.asObservable();
    };

    // TODO: ANYTHING RELATED TO THE CURRENT PAGE GOES HERE
    // ANYTHING RELATED TO ALL PAGES BUT NOT NAVIGATION METHODS GOES HERE

    public currentPage: NewWizardPage;

    public get currentPageTitle(): TemplateRef<any> {
        return this.currentPage.title;
    }

    public get currentPageIsFirst(): boolean {
        return this.pageCollection.firstPage === this.currentPage;
    }

    public get currentPageIsLast(): boolean {
        return this.pageCollection.lastPage === this.currentPage;
    }

    public setCurrentPage(page: NewWizardPage): void {
        // TODO: SHOULD PAGE.COMPLETED BE TIED TO NAVIGATION??
        // page.completed = false;
        this.currentPage = page;
        this._currentChanged.next(page);
        // SPECME
    }

    private _movedToNextPage = new Subject<boolean>();
    public get movedToNextPage(): Observable<boolean> {
        return this._movedToNextPage.asObservable();
    }

    // next --
    //
    // When called, after successful validation, the wizard will move to the
    // next page.
    // This is a public function that can be used to programmatically advance
    // the user to the next page.
    public next(): void {
        // TODO: MOVE BTN CLICK EVENTS TO BUTTONHUB
        // let page: NewWizardPage = this.currentPage;
        // if ("danger" === buttonType) {
        //     page.dangerButtonClicked.emit(page);
        // } else if ("finish" === buttonType) {
        //     page.finishButtonClicked.emit(page);
        // } else {
        //     // goNextPage falls back to the "next" button
        //     page.nextButtonClicked.emit(page);
        // }

        let currentPage = this.currentPage;
        let nextPage: NewWizardPage;

        if (!currentPage.readyToComplete) {
            return;
        }

        // TODO: MOVE THIS LOGIC TO THE PAGE ITSELF
        currentPage.primaryButtonClicked.emit();
        currentPage.onCommit.emit(null);
        this.currentPage.completed = true;


        if (this.currentPageIsLast) {
            // TODO: FINISH ROUTINE GOES HERE
            // TODO: MOVE TO AN EVENT EMITTER... SO WIZARD CAN PERFORM THIS FUNCTION
            // this.wizardFinished.emit();
            // this.close();
        } else {
            nextPage = this.getPageAdjoiningToCurrent("next");
            // TOASK: DO WE WANT TO PROGRAMMATICALLY SET COMPLETED LIKE THIS??? I DON'T THINK SO...
            // nextPage.completed = false;
            if (nextPage) {
                // catch errant null or undefineds that creep in
                // SPECME
                this._movedToNextPage.next(true);
                this.setCurrentPage(nextPage);
            } else {
                // THROW ERROR HERE?! NEXT SHOULD NOT HAVE WORKED...
                return;
            }

        }
        // SPECME
    }

    // When called, the wizard will move to the prev page.
    // This is a public function that can be used to programmatically go back
    // to the previous step.
    private _movedToPreviousPage = new Subject<boolean>();
    public get movedToPreviousPage(): Observable<boolean> {
        return this._movedToPreviousPage.asObservable();
    }
    public previous(): void {
        // TODO: MOVE BTN CLICK EVENTS TO BUTTONHUB
        // let page: NewWizardPage = this.currentPage;
        // page.previousButtonClicked.emit(page);

        let previousPage: NewWizardPage;

        if (this.currentPageIsFirst) {
            return;
        }
        // SPECME

        previousPage = this.getPageAdjoiningToCurrent("previous");

        // TOASK: DO WE WANT TO PROGRAMMATICALLY SET COMPLETED LIKE THIS??? I DON'T THINK SO...
        // this.currentPage.completed = false;
        // previousPage.completed = false;

        if (previousPage) {
            this._movedToPreviousPage.next(true);
            this.setCurrentPage(previousPage);
        } else {
            // THROW ERROR HERE?! NEXT SHOULD NOT HAVE WORKED...
            return;
        }
    }

    private getPageAdjoiningToCurrent(previousOrNext: string = "next"): NewWizardPage {
        let currentPage = this.currentPage;
        let myPages = this.pageCollection;

        if ("previous" === previousOrNext) {
            return myPages.getPreviousPage(currentPage);
        }

        if ("next" === previousOrNext) {
            // we are looking for the next page
            return myPages.getNextPage(currentPage);
        }
        // SPECME

        // THROW ERROR??
        return null;
    }

    private _cancelWizard = new Subject<any>();
    public get notifyWizardCancel(): Observable<any> {
        return this._cancelWizard.asObservable();
    }
    public cancelWizard(): void {
        this.currentPage.cancelButtonClicked.emit();
        this._cancelWizard.next();
    }

    // TODO: MOVE TO NAVSERVICE
    // TODO: IS MARKING PAGES INCOMPLETE THE WAY TO GO? ASK YEN.
    // TODO: SERVICE IS DOING TWO JOBS
    //      1 - PAGESERVICE: COLLECTION OF PAGES WITH CODE TO ANALYZE LIST OF PAGES (FIRST, LAST, ETC)
    //      2 - NAVSERVICE: NAVIGATION FROM ONE PAGE TO ANOTHER

    public goTo(pageToGoToOrId: any) {
        let pageToGoTo: NewWizardPage;
        let currentPage: NewWizardPage;
        let myPages: PageCollectionService;
        let pagesToCheck: NewWizardPage[];
        let okayToMove: boolean = true;

        if (typeof pageToGoToOrId === "string") {
            // we have an ID so we need to look up our page
            pageToGoTo = myPages.getPageById(pageToGoToOrId);
        } else {
            pageToGoTo = pageToGoToOrId;
        }

        myPages = this.pageCollection;
        currentPage = this.currentPage;

        if (pageToGoTo === currentPage) {
            return;
        } else {
            pagesToCheck = myPages.getPageRangeFromPages(this.currentPage, pageToGoTo);
        }

        pagesToCheck.forEach((page: NewWizardPage) => {
            if (!okayToMove) {
                return;
            }
            if (!page.completed) {
                okayToMove = false;
            }
            // need to loop through once more and set completed to false for pages in between....
        });

        if (!okayToMove) {
            return;
        }

        // TOASK: do we want to programmatically set the completed states? I don't think so...
        // pagesToCheck.forEach((page: NewWizardPage) => page.completed = false);
        // this.currentPage.completed = false;
        // pageToGoTo.completed = false;

        this.setCurrentPage(pageToGoTo);
    }
}