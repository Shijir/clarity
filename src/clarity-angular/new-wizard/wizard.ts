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

    // TODO: ???
    @ContentChildren(NewWizardPage) public pages: QueryList<NewWizardPage>;

    // TODO: REMOVE ScrollingService
    constructor(private _scrollingService: ScrollingService, public navService: WizardNavigationService) {
    }

    public ngOnInit(): void {
        this.navService.currentPageChanged.subscribe((page: NewWizardPage) => {
            this.currentPageChanged.emit();
        });

        this.navService.goNext.subscribe((currentPage: NewWizardPage) => {
            // TOFIX: THIS IS JUST TO TEST THE SUBSCRIPTION. RETHINK FOR FINAL...
            let myPages = this.pages.toArray();
            let currentIndex = myPages.indexOf(currentPage);
            console.log("I'm in wizard.ts - ngOnInit. I'm a subscription for going to the next page.",
            "Here's who I think the current page was: ", currentPage.id);
            console.log("what is my index?", currentIndex);
            let newIndex = currentIndex + 1;
            console.log("what is my new index?", newIndex);
            let newCurrent = myPages[newIndex];
            console.log("who is newCurrent?", newCurrent);
            this.navService.setCurrentPage(newCurrent);
            console.log("I'm in wizard.ts - ngOnInit. I'm a subscription for going to the next page.",
            "Here's who I think the current page is: ", newCurrent.id);
        });
    }

    private _id: string;
    public get id(): string {
        return this._id;
    }

    // The current page
    // currentPage: WizardPage = null;
    public get currentPage(): NewWizardPage {
        return this.navService.currentPage;
    }

    // TODO: DO WE NEED THIS STILL???
    //Detect when _open is set to true and set no-scrolling to true
    public ngOnChanges(changes: {[propName: string]: SimpleChange}): void {
        // can get rid of ... TODO: move to service
        if (changes && changes.hasOwnProperty("_open")) {
            if (changes["_open"].currentValue) {
                this._scrollingService.stopScrolling();
            } else {
                this._scrollingService.resumeScrolling();
            }
        }
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
        this._open = false;
        this.onCancel.emit(null);
        this._openChanged.emit(false);
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







    // TODO: GET RID OF THIS ALTOGETHER
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

    // TODO: CAN KEEP THIS BUT IT CALLS THE NAVSERVICE
    // next --
    //
    // When called, after successful validation, the wizard will move to the
    // next page.
    // This is a public function that can be used to programmatically advance
    // the user to the next page.
    next(): void {
        // let i: number = this.currentTabIndex;
        // let i: number = 0;
        // let totalSteps: number = this.tabLinks.length - 1;
        // // let page: WizardPage = this.tabContents[i];
        // let page: any = this.tabContents[i];

        // // Call the onCommit or the Validation function of that step, and if it
        // // returns true, continue to the next step.
        // if (i < totalSteps && !page.nextDisabled) {
        //     // let wizardStep: WizardStep = this.tabLinks[i];
        //     // let nextStep: WizardStep = this.tabLinks[i + 1];
        //     let wizardStep: any = this.tabLinks[i];
        //     let nextStep: any = this.tabLinks[i + 1];
        //     wizardStep.isCompleted = true;
        //     this.selectTab(nextStep);
        // }
    }

    // TODO: CAN KEEP THIS BUT IT CALLS THE NAVSERVICE
    // prev --
    //
    // When called, the wizard will move to the prev page.
    // This is a public function that can be used to programmatically go back
    // to the previous step.
    prev(): void {
        // let i: number = this.currentTabIndex;
        // let i: number = 0;

        // if (i > 0) {
        //     // let wizardStep: WizardStep = this.tabLinks[i];
        //     // let prevStep: WizardStep = this.tabLinks[i - 1];
        //     let wizardStep: any = this.tabLinks[i];
        //     let prevStep: any = this.tabLinks[i - 1];
        //     wizardStep.isCompleted = false;
        //     prevStep.isCompleted = false;
        //     this.selectTab(prevStep);
        // }
    }

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
