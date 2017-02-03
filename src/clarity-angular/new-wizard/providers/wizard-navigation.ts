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

    constructor(public pageCollection: PageCollectionService, public buttonService: ButtonHubService) {
        this.previousButtonSubscription = this.buttonService.previousBtnClicked.subscribe(() => {
            if (this.currentPageIsFirst || this.currentPage.movePreviousDisabled) {
                return;
            }
            this.previous();
        });

        this.nextButtonSubscription = this.buttonService.nextBtnClicked.subscribe(() => {
            if (!this.currentPageIsLast && this.currentPage.readyToComplete) {
                this.next();
            }
        });

        this.dangerButtonSubscription = this.buttonService.dangerBtnClicked.subscribe(() => {
            let currentPage: NewWizardPage = this.currentPage;
            if (currentPage.stopOnDanger) {
                console.log("wizard nav - i stopped the page because you told me to!");
                return;
            }

            if (!currentPage.readyToComplete) {
                console.log("wizard nav - you clicked this danger btn but i can't move...");
                return;
            }

            // because we made it past the guard up there ^ we know the current page is ready
            if (this.currentPageIsLast) {
                // TODO: WE NEED A FINISH ROUTINE
                // this.finish();
            } else {
                this.next();
            }

            // TODO:
            // ONDANGER... CHECK FOR A PAGE HAVING AN ACTION ON DANGER CLICK
            // NOTIFY WIZARD DANGER WAS CLICKED; WIZARD WILL FIGURE OUT IF IT
            // NEEDS TO DO A FINISH OR CALL BACK HERE FOR NEXT AFTER CHECKING
            // IF IT HAS ITS OWN ACTION ON DANGER CLICK

        });

        this.finishButtonSubscription = this.buttonService.finishBtnClicked.subscribe(() => {
            // CHECKS CURRENTPAGE TO SEE IF IT IS READY TO GO...
            if (this.currentPage.readyToComplete) {
                // NEED FINISH ROUTINE
                console.log("wizard nav - are we done yet?!");
            }

            // TODO: FINISH. GOES STRAIGHT TO THE WIZARD? OR GOES HERE, DOES 
            // BASIC CHECKS AND THEN EITHER CALLS A FINISH ERROR OR NOTIFIES
            // WIZARD TO CANCEL
        });

        this.customButtonSubscription = this.buttonService.customBtnClicked.subscribe(() => {
            // CHECKS CURRENTPAGE TO SEE IF IT IS READY TO GO...
            // if (this.currentPage.customButtonAction) {
                // NEED FINISH ROUTINE
                console.log("wizard nav - does my page do anything fancy when a custom button is clicked?");
            // }

            // TODO:
            // CUSTOME... CHECK IF CURRENTPAGE HAS A CUSTOMBUTTONCLICK ACTION
            // THEN NOTIFY WIZARD A CUSTOM BUTTON WAS CLICKED SO IT CAN DO ITS
            // OWN ACTION (SEND WIZARD BACK??? OR WHAT?)
        });

        this.cancelButtonSubscription = this.buttonService.cancelBtnClicked.subscribe(() => {
            // CHECKS CURRENTPAGE TO SEE IF IT IS READY TO GO...
            if (this.currentPage.okToCancel) {
                // NEED FINISH ROUTINE
            } else {
                console.log("wizard nav - i stopped before cancelling because you told me to");
            }

            // TODO: CANCEL. SHOULD CHECK IF PAGE HAS AN ONCANCEL CHECK FIRST.
            // THEN NOTIFY WIZARD... WHICH PERFORMS THE CANCEL
        });
    }

    ngOnDestroy(): void {
        this.previousButtonSubscription.unsubscribe();
        this.nextButtonSubscription.unsubscribe();
        this.dangerButtonSubscription.unsubscribe();
        this.finishButtonSubscription.unsubscribe();
        this.customButtonSubscription.unsubscribe();
        this.cancelButtonSubscription.unsubscribe();
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
        // TODO: SHOULD PAGE.COMPLETED BE TIED TO NAVIGATION??
        // LEFTOFF: PAGE.COMPLETED CAN OPTIONALLY BE TIED TO NAVIGATION
        // BY DEFAULT IT WILL NOT BE...
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

    private _checkForMoveToPrevious = new Subject<boolean>();
    public get checkForMoveToPrevious(): Observable<boolean> {
        return this._checkForMoveToPrevious.asObservable();
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