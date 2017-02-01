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

// create Observables for currentPageUpdated and pageChanged
// maybe for when list of pages changes too?

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
        this._goTo.next(pageToGoTo);
    }



    // TODO: MOVE NEXT/PREVIOUS TO NAVSERVICE!!!

    // next --
    //
    // When called, after successful validation, the wizard will move to the
    // next page.
    // This is a public function that can be used to programmatically advance
    // the user to the next page.
    public next(): void {
        let currentPage = this.currentPage;
        let currentPageIndex: number;
        let nextPage: NewWizardPage;
        let myPages: NewWizardPage[];

        if (!currentPage.readyToComplete) {
            return;
        }

        currentPage.primaryButtonClicked.emit();
        currentPage.onCommit.emit(null);

        this.currentPage.completed = true;

        if (this.currentPageIsLast) {
            // TODO: MOVE TO AN EVENT EMITTER... SO WIZARD CAN PERFORM THIS FUNCTION
            // this.wizardFinished.emit();
            // this.close();
        } else {
            myPages = this.pageCollection.pagesAsArray;
            currentPageIndex = myPages.indexOf(currentPage);
            nextPage = myPages[currentPageIndex + 1];
            nextPage.completed = false;
            this.setCurrentPage(nextPage);
        }
        // SPECME
    }

    // When called, the wizard will move to the prev page.
    // This is a public function that can be used to programmatically go back
    // to the previous step.
    public previous(): void {
        let currentPage = this.currentPage;
        let currentPageIndex: number;
        let previousPage: NewWizardPage;
        let myPages: NewWizardPage[];

        // TOASK: SHOULD THIS HANDLE FINISH AND DELETE BUTTONS TOO???
        // I THINK SO...
        if (this.currentPageIsFirst) {
            return;
        }
        // SPECME

        myPages = this.pageCollection.pagesAsArray;
        currentPageIndex = myPages.indexOf(currentPage);
        previousPage = myPages[currentPageIndex - 1];

        this.currentPage.completed = false;
        previousPage.completed = false;
        this.setCurrentPage(previousPage);
    }

    // TODO: MOVE TO NAVSERVICE
    // TODO: IS MARKING PAGES INCOMPLETE THE WAY TO GO? ASK YEN.
    // TODO: SERVICE IS DOING TWO JOBS
    //      1 - PAGESERVICE: COLLECTION OF PAGES WITH CODE TO ANALYZE LIST OF PAGES (FIRST, LAST, ETC)
    //      2 - NAVSERVICE: NAVIGATION FROM ONE PAGE TO ANOTHER

    public moveToPage(pageToGoToOrId: any) {
        let pageToGoTo: NewWizardPage;
        let pageToGoToIndex: number;
        let currentPageIndex: number;
        let myPages: NewWizardPage[];
        let pagesToCheck: NewWizardPage[];
        let okayToMove: boolean = true;

        if (typeof pageToGoToOrId === "string") {
            // we have an ID so we need to look up our page
            pageToGoTo = this.lookupPageById(pageToGoToOrId);
        } else {
            pageToGoTo = pageToGoToOrId;
        }

        myPages = this.pageCollection.pagesAsArray;
        pageToGoToIndex = myPages.indexOf(pageToGoTo);
        currentPageIndex = myPages.indexOf(this.currentPage);

        if (pageToGoToIndex === currentPageIndex) {
            return;
        } else if (pageToGoToIndex < currentPageIndex) {
            pagesToCheck = this.pageCollection.pages.filter((page: NewWizardPage, index: number) => {
                return pageToGoToIndex < index && index < currentPageIndex;
            });
        } else {
            // currentPageIndex < pageToGoToIndex
            pagesToCheck = this.pageCollection.pages.filter((page: NewWizardPage, index: number) => {
                return currentPageIndex < index && index < pageToGoToIndex;
            });
        }

        // moving forward vs. backward?

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

        pagesToCheck.forEach((page: NewWizardPage) => page.completed = false);
        this.currentPage.completed = false;
        pageToGoTo.completed = false;

        this.setCurrentPage(pageToGoTo);
    }

    // TODO: MOVE TO PAGESERVICE
    public lookupPageById(id: string): NewWizardPage {
        let foundPages: NewWizardPage[] = this.pageCollection.pages.filter((page: NewWizardPage) => id === page.id);
        let foundPagesCount: number = foundPages.length || 0;

        if (foundPagesCount > 1) {
            // TOASK: TOO MANY FOUND PAGES!!! THROW ERROR?
            return null;
        } else if (foundPages.length < 1) {
            // TOASK: PAGE NOT FOUND... THROW ERROR? JUST IGNORE IT?
            return null;
        } else {
            return foundPages[0];
        }
    }
}