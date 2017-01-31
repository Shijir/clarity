/*
 * Copyright (c) 2016 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import {
    Component,
    ContentChildren,
    Input,
    Output,
    EventEmitter,
    QueryList,
    SimpleChange,
    HostListener,
    OnInit
} from "@angular/core";
import { NewWizardPage } from "./wizard-page";
import { WizardNavigationService } from "./providers/wizard-navigation";

// TODO: remove "NEW" when finishing up

// TODO: Eventually we will have...
// • NewWizardService
// • NewWizard
    // • NewWizardTitle
    // • NewWizardStepNav
    // • NewWizardPage
        // • NewStepNavItem template reference? Or NewWizardStepNavItem?
        // • NewWizardButton
        // • NewWizardHeaderAction
        // • NewWizardPageContent

// import {Tabs} from "../tabs/tabs";
// import {WizardStep} from "./wizard-step";
// import {WizardPage} from "./wizard-page";

// TODO: probaby don't need this
import {ScrollingService} from "../main/scrolling-service";

@Component({
    selector: "clr-newwizard",
    viewProviders: [ScrollingService],
    providers: [ WizardNavigationService ],
    templateUrl: "./wizard.html",
    host: {
        "[id]": "id",
        "[class.clr-wizard]": "true",
        "[class.main-container]": "true", // <= ???
        "[class.wizard-md]": "size == 'md'",
        "[class.wizard-lg]": "size == 'lg'",
        "[class.wizard-xl]": "size == 'xl'" // <= 'xl'!!!
    }
})
export class NewWizard implements OnInit {

    @Input("clrWizardSize") size: string = "xl"; // xl is the default size

    // Variable that toggles open/close of the wizard component.
    @Input("clrWizardOpen") _open: boolean = false;

    // Variable that toggles open/close of the wizard component.
    @Input("clrWizardClosable") closable: boolean = true;

    // users can pass in their own ids for the wizard using clrWizardId="whatever"
    @Input("clrWizardId") public userDefinedId: string;

    // EventEmitter which is emitted on open/close of the wizard.
    @Output("clrWizardOpenChanged") _openChanged: EventEmitter<boolean> =
        new EventEmitter<boolean>(false);

    // User can bind his event handler for onCancel of the main content
    @Output("clrWizardOnCancel") onCancel: EventEmitter<any> =
        new EventEmitter<any>(false);

    // TODO: need a wizardCurrentPageChanged event... bubbling up from page to service to wizard
    @Output("clrWizardCurrentPageChanged") currentPageChanged: EventEmitter<any> =
        new EventEmitter<any>(false);

    @Output("clrWizardOnFinish") wizardFinished: EventEmitter<any> =
        new EventEmitter<any>(false);

    @ContentChildren(NewWizardPage) public pages: QueryList<NewWizardPage>;

    // TODO: REMOVE ScrollingService
    constructor(private _scrollingService: ScrollingService, public navService: WizardNavigationService) {
    }

    public ngOnInit(): void {
        this.navService.currentPageChanged.subscribe((page: NewWizardPage) => {
            if (this.pages) {
                // first time through it doesn't have pages to look up...
                this.setFirstLastPages();
            }
            // SPECME
            this.currentPageChanged.emit();
        });

        this.navService.goNext.subscribe(() => {
            this.next();
        });

        this.navService.goPrevious.subscribe(() => {
            this.previous();
        });

        this.navService.notifyWizardCancel.subscribe(() => {
            this.close();
        });
    }

    public ngOnContentInit() {
        this.setFirstLastPages();
    }

    private setFirstLastPages() {
        this.navService.isOnFirstPage = this.currentPage === this.first;
        this.navService.isOnLastPage = this.currentPage === this.last;
    }

    private _id: string;
    public get id(): string {
        return this._id;
    }

    // The current page
    public get currentPage(): NewWizardPage {
        return this.navService.currentPage;
    }

    // TODO: DO WE NEED THIS STILL???
    //Detect when _open is set to true and set no-scrolling to true
    public ngOnChanges(changes: {[propName: string]: SimpleChange}): void {
        // can get rid of ... 
        // if (changes && changes.hasOwnProperty("_open")) {
        //     if (changes["_open"].currentValue) {
        //         this._scrollingService.stopScrolling();
        //     } else {
        //         this._scrollingService.resumeScrolling();
        //     }
        // }
    }

    // TODO: MAKE SURE WIZARD HAS DELEGATES FOR REASONABLE MODAL FNS
    // This is a public function that can be used to programmatically open the
    // wizard.
    public open(): void {
        this._open = true;
        this._openChanged.emit(true);
    }

    // This is a public function that can be used to programmatically close the
    // wizard.
    public close(): void {
        this._open = false;
        this.onCancel.emit(null);
        this._openChanged.emit(false);
    }

    // Convenience function that can be used to programmatically toggle the
    // wizard.
    public toggle(value: boolean): void {
        if (value) {
            this.open();
        } else {
            this.close();
        }
    }

    // _close --
    //
    // This is a private function that is called on the click of the close / cancel
    // button and emits the onCancel event of the active tab.

    // any code that exists in modal we can get rid of... TODO: get rid of
    // listen to what modal is doing...
    @HostListener("body:keyup.escape")
    _close(event?: any): void {
        this.close();
    }







    // TODO: GET RID OF THIS ALTOGETHER AFTER YOU HANDLE FINISH WIZARD EVENT
    // _next --
    //
    // This is a private function that is called on the click of the next
    // button and emits the onCommit event of the active tab.
    _next(event?: any): void {
        // let totalSteps: number = this.tabLinks.length - 1;
        // let i: number = this.currentTabIndex;
        // let i: number = 0;
        // let page: WizardPage = this.tabContents[i];
        // let page: any = this.tabContents[i];
        // if (!page.nextDisabled) {
        //     page.onCommit.emit(null);

        //     if (!page.preventDefault) {
        //         // If no handler for finish button, then close wizard on click
        //         // of finish by default
        //         if (totalSteps === i) {
        //             this.close();
        //         } else {
        //             this.next();
        //         }
        //     }
        // }
    }

    public get first(): NewWizardPage {
        return this.pages.toArray()[0];
        // SPECME
    }

    public get last(): NewWizardPage {
        let pages = this.pages.toArray();
        let pageCount = pages.length;
        return pages[pageCount - 1];
        // SPECME
    }

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

        if (this.navService.isOnLastPage) {
            this.wizardFinished.emit();
            this.close();
        } else {
            myPages = this.pages.toArray();
            currentPageIndex = myPages.indexOf(currentPage);
            nextPage = myPages[currentPageIndex + 1];
            this.navService.setCurrentPage(nextPage);
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
        if (this.navService.isOnFirstPage) {
            return;
        }
        // SPECME

        myPages = this.pages.toArray();
        currentPageIndex = myPages.indexOf(currentPage);
        previousPage = myPages[currentPageIndex - 1];

        this.navService.setCurrentPage(previousPage);
    }

    // prev -- DEPRECATED
    // calls previous(); kept here to avoid breaking change where unnecessary
    public prev(): void {
        this.previous();
    }

    // TODO: NEED TO MOVE PAGE FIRST AND LAST TO HERE!!!
    // JUST A FUNC THAT RETURNS THE FIRST AND LAST PAGE SO OTHER FUNCS CAN TEST AGAINST IT
    // NO POINT IN DOING POSITION/INDEX CHECKS

    // TODO: CAN KEEP PAGE ONLOAD BUT IT SHOULD BE CALLED IN THE NAVSERVICE, NOT HERE
    // selectTab --
    //
    // Base class function overridden to call the onLoad event emitter
    // selectTab(wizardNav: WizardStep): void {
    selectTab(wizardNav: any): void {
        // super.selectTab(wizardNav);

        // let page: WizardPage = this.currentTabContent as WizardPage;
        // let page: any = {};
        // this.currentPage = page;
        // page.onLoad.emit(false);

        // // Toggles next and finish button
        // let totalSteps: number = this.tabLinks.length - 1;
        // // this.isLast = this.currentTabIndex === totalSteps;
        // // this.isFirst = this.currentTabIndex === 0;
        // this.isLast = 1 === totalSteps;
        // this.isFirst = 0 === 0;
    }

    // TODO: CAN KEEP THIS BUT THE NAVSERVICE DOES THE ACTUAL WORK
    // skipTab --
    //
    // Public function to skip a Tab given its uniqueId
    skipTab(tabId: string): void {
        this._setTabIsSkipped(tabId, true);
    }

    // TODO: CAN KEEP THIS BUT THE NAVSERVICE DOES THE ACTUAL WORK
    // unSkipTab --
    //
    // Public function to unSkip a tab given its uniqueId
    unSkipTab(tabId: string): void {
        this._setTabIsSkipped(tabId, false);
    }

    // TODO: GET RID OF THIS; IT LIVES IN THE NAVSERVICE
    _setTabIsSkipped(tabId: string, isSkipped: boolean): void {
        // this.wizardStepChildren.forEach((wizardStep: WizardStep, index: number) => {
        //     if (wizardStep.id === tabId) {
        //         wizardStep.isSkipped = isSkipped;
        //         // set the isSkipped property of the matching content if it exists
        //         if (index < this.wizardPageChildren.length) {
        //             let children: WizardPage[] = this.wizardPageChildren.toArray();
        //             children[index].isSkipped = isSkipped;
        //         }
        //     }
        // });
    }
}
