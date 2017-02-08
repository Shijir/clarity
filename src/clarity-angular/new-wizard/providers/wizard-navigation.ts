import {
    Injectable,
    OnDestroy,
    TemplateRef
} from "@angular/core";

import { Subject, Observable } from "rxjs";
import { Subscription } from "rxjs/Subscription";

import { NewWizardPage } from "../wizard-page";
import { PageCollectionService } from "./page-collection";
import { ButtonHubService } from "./button-hub";

@Injectable()
export class WizardNavigationService implements OnDestroy {

    public previousButtonSubscription: Subscription;
    public nextButtonSubscription: Subscription;
    public dangerButtonSubscription: Subscription;
    public finishButtonSubscription: Subscription;
    public customButtonSubscription: Subscription;
    public cancelButtonSubscription: Subscription;
    public pagesResetSubscription: Subscription;

    constructor(public pageCollection: PageCollectionService, public buttonService: ButtonHubService) {
        this.previousButtonSubscription = this.buttonService.previousBtnClicked.subscribe(() => {
            if (this.currentPageIsFirst || this.currentPage.movePreviousDisabled) {
                return;
            }
            this.previous();
            // SPECME
        });

        this.nextButtonSubscription = this.buttonService.nextBtnClicked.subscribe(() => {
            if (!this.currentPageIsLast && this.currentPage.readyToComplete) {
                this.next();
            }
            // SPECME
        });

        this.dangerButtonSubscription = this.buttonService.dangerBtnClicked.subscribe(() => {
            let currentPage: NewWizardPage = this.currentPage;

            if (!currentPage.readyToComplete) {
                return;
            }
            // SPECME

            // because we made it past the guard up there ^ we know the current page is ready
            if (this.currentPageIsLast) {
                this.finish();
            } else {
                this.next();
            }
            // SPECME
        });

        this.finishButtonSubscription = this.buttonService.finishBtnClicked.subscribe(() => {
            if (this.currentPage.readyToComplete) {
                this._wizardFinished.next();
            }
            // SPECME
        });

        this.customButtonSubscription = this.buttonService.customBtnClicked.subscribe((type: string) => {
            this.currentPage.customButtonClicked.emit(type);
        });

        this.cancelButtonSubscription = this.buttonService.cancelBtnClicked.subscribe(() => {
            if (this.currentPage.customCancel) {
                this.currentPage.customCancelClicked.emit();
            } else {
                this._cancelWizard.next();
            }
            // SPECME
        });

        this.pagesResetSubscription = this.pageCollection.pagesReset.subscribe(() => {
            this.setLastEnabledPageCurrent();
            this._wizardReset.next();
            // SPECME
        });
    }

    ngOnDestroy(): void {
        this.previousButtonSubscription.unsubscribe();
        this.nextButtonSubscription.unsubscribe();
        this.dangerButtonSubscription.unsubscribe();
        this.finishButtonSubscription.unsubscribe();
        this.customButtonSubscription.unsubscribe();
        this.cancelButtonSubscription.unsubscribe();
        this.pagesResetSubscription.unsubscribe();
    }

// TODO: create Observables for currentPageUpdated and pageChanged

    // lets other components subscribe to when the current page changes
    private _currentChanged = new Subject<NewWizardPage>();
    public get currentPageChanged(): Observable<NewWizardPage> {
        return this._currentChanged.asObservable();
    };

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
        this.currentPage = page;
        this._currentChanged.next(page);
        // SPECME
    }

    private _movedToNextPage = new Subject<boolean>();
    public get movedToNextPage(): Observable<boolean> {
        return this._movedToNextPage.asObservable();
    }

    private _wizardFinished = new Subject<boolean>();
    public get wizardFinished(): Observable<boolean> {
        return this._wizardFinished.asObservable();
    }

    private _wizardReset = new Subject<boolean>();
    public get wizardReset(): Observable<boolean> {
        return this._wizardReset.asObservable();
    }

    // next --
    //
    // When called, after successful validation, the wizard will move to the
    // next page.
    // This is a public function that can be used to programmatically advance
    // the user to the next page.
    public next(): void {
        let currentPage = this.currentPage;
        let nextPage: NewWizardPage;

        if (this.currentPageIsLast) {
            this.finish();
        }
        // SPECME

        if (!currentPage.readyToComplete) {
            return;
        }
        // SPECME

        this.pageCollection.commitPage(currentPage);
        nextPage = this.pageCollection.getNextPage(currentPage);

        // catch errant null or undefineds that creep in
        if (nextPage) {
            this._movedToNextPage.next(true);
            this.setCurrentPage(nextPage);
            // SPECME
        } else {
// THROW ERROR HERE?! NEXT SHOULD NOT HAVE WORKED...
            return;
        }
        // SPECME
    }

    public finish(): void {
        let currentPage = this.currentPage;

        if (!currentPage.readyToComplete) {
            return;
        }
        // SPECME

        this.pageCollection.commitPage(currentPage);
        this._wizardFinished.next();
    }

    // When called, the wizard will move to the prev page.
    // This is a public function that can be used to programmatically go back
    // to the previous step.
    private _movedToPreviousPage = new Subject<boolean>();
    public get movedToPreviousPage(): Observable<boolean> {
        return this._movedToPreviousPage.asObservable();
    }
    public previous(): void {
        let previousPage: NewWizardPage;

        if (this.currentPageIsFirst) {
            return;
        }
        // SPECME

        previousPage = this.pageCollection.getPreviousPage(this.currentPage);

        if (previousPage) {
            this._movedToPreviousPage.next(true);
            this.setCurrentPage(previousPage);
        } else {
// TODO: THROW ERROR HERE
            return;
        }
        // SPECME
    }

    private _cancelWizard = new Subject<any>();
    public get notifyWizardCancel(): Observable<any> {
        return this._cancelWizard.asObservable();
    }
    public cancel(): void {
        this.currentPage.cancelButtonClicked.emit();
        this._cancelWizard.next();
    }

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
        // SPECME

        myPages = this.pageCollection;
        currentPage = this.currentPage;

        if (pageToGoTo === currentPage) {
            return;
        } else {
            pagesToCheck = myPages.getPageRangeFromPages(this.currentPage, pageToGoTo);
        }
        // SPECME

        pagesToCheck.forEach((page: NewWizardPage) => {
            if (!okayToMove) {
                return;
            }
            if (!page.completed && !page.current) {
                okayToMove = false;
            }
            // SPECME
        });

        if (!okayToMove) {
            return;
        }
        // SPECME

        this.setCurrentPage(pageToGoTo);
    }

    public setLastEnabledPageCurrent(): void {
        let allPages: NewWizardPage[] = this.pageCollection.pagesAsArray;
        let lastCompletedPageIndex: number = null;

        allPages.forEach((page: NewWizardPage, index: number) => {
            if (page.completed) {
                lastCompletedPageIndex = index;
            }
        });

        if (lastCompletedPageIndex === null) {
            // always is at least the first item...
            lastCompletedPageIndex = 0;
        } else if ((lastCompletedPageIndex + 1) < allPages.length) {
            lastCompletedPageIndex = lastCompletedPageIndex + 1;
        }
        // SPECME

        this.setCurrentPage(allPages[lastCompletedPageIndex]);
    }
}