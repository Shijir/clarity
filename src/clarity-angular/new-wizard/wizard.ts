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
    OnInit,
    OnDestroy,
    AfterViewInit
} from "@angular/core";
import { Subscription } from "rxjs/Subscription";
import { NewWizardPage } from "./wizard-page";
import { NewWizardHeaderAction } from "./wizard-header-action";

// providers
import { WizardNavigationService } from "./providers/wizard-navigation";
import { PageCollectionService } from "./providers/page-collection";
import { ButtonHubService } from "./providers/button-hub";
import { HeaderActionService } from "./providers/header-actions";

// TODO: remove "NEW" when finishing up

@Component({
    selector: "clr-newwizard",
    providers: [ WizardNavigationService, PageCollectionService, ButtonHubService, HeaderActionService ],
    templateUrl: "./wizard.html",
    host: {
        "[class.clr-new-wizard]": "true",
        "[class.wizard-md]": "size == 'md'",
        "[class.wizard-lg]": "size == 'lg'",
        "[class.wizard-xl]": "size == 'xl'",
        "[class.lastPage]": "navService.currentPageIsLast",
        "[class.clr-wizard--ghosted]": "showGhostPages"
    }
})
export class NewWizard implements OnInit, OnDestroy, AfterViewInit {

// TODO: COMMENT ON ALL LEGACY INPUT/OUTPUTS TO KNOW WHICH ONES WE KEEP B/C OF LEGACY

    constructor(public navService: WizardNavigationService,
                public pageCollection: PageCollectionService,
                public buttonService: ButtonHubService,
                public headerActionService: HeaderActionService) {

        this.goNextSubscription = this.navService.movedToNextPage.subscribe(() => {
            this.onMoveNext.emit();
        });

        this.goPreviousSubscription = this.navService.movedToPreviousPage.subscribe(() => {
            this.onMovePrevious.emit();
        });

        this.cancelSubscription = this.navService.notifyWizardCancel.subscribe(() => {
            let currentPage = this.navService.currentPage;

            currentPage.pageOnCancel.emit();
            this.onCancel.emit();

            if (!this.stopCancel && !currentPage.stopCancel) {
                this.close();
            }
            // SPECME
        });

        this.wizardFinishedSubscription = this.navService.wizardFinished.subscribe(() => {
            this.deactivateGhostPages();
            this.wizardFinished.emit();
            this.close();
        });
    }

    @Input("clrWizardSize") size: string = "xl"; // xl is the default size

    // can activate showing or hiding the ghost page effect
    // defaults to false
    @Input("clrWizardShowGhostPages") showGhostPages: boolean = false;

    // Variable that toggles open/close of the wizard component.
    @Input("clrWizardClosable") closable: boolean = true;

    // Variable that toggles open/close of the wizard component.
    @Input("clrWizardOpen") _open: boolean = false;

// TODOCUMENT: HERE IS HOW THE TWO-WAY BINDING HAPPENS...
// <clr-wizard [(clrWizardOpen)]="something"...?
// <clr-wizard [clrWizardOpen]="something" (clrWizardOpenChange)="doSomehtign($event)" ...?

// TOBREAK: THIS WAS CHANGED FROM "OPENCHANGED" TO "OPENCHANGE"
    // EventEmitter which is emitted on open/close of the wizard.
    @Output("clrWizardOpenChange") _openChanged: EventEmitter<boolean> =
        new EventEmitter<boolean>(false);

    // User can bind his event handler for onCancel of the main content
    @Output("clrWizardOnCancel") onCancel: EventEmitter<any> =
        new EventEmitter<any>(false);

// done
    @Output("clrWizardOnFinish") wizardFinished: EventEmitter<any> =
        new EventEmitter<any>(false);

    @ContentChildren(NewWizardPage) public pages: QueryList<NewWizardPage>;
    @ContentChildren(NewWizardHeaderAction) public headerActions: QueryList<NewWizardHeaderAction>;

// done
    @Output("clrWizardCurrentPageChanged") currentPageChanged: EventEmitter<any> =
        new EventEmitter<any>(false);

    @Output("clrWizardOnNext") onMoveNext: EventEmitter<any> =
        new EventEmitter<any>(false);

    @Output("clrWizardOnPrevious") onMovePrevious: EventEmitter<any> =
        new EventEmitter<any>(false);

    @Input("clrWizardPreventDefaultCancel") stopCancel: boolean = false;

    @Input("clrWizardPreventModalAnimation") _stopModalAnimations: boolean = false;
    public get stopModalAnimations(): string {
        if (this._stopModalAnimations) {
            return "true";
        }
        return "false";
    }

    public ngOnInit(): void {
        let navService = this.navService;

        this.currentPageSubscription = navService.currentPageChanged.subscribe((page: NewWizardPage) => {
            this.setGhostPages();
            this.currentPageChanged.emit();
        });
    }

    private goNextSubscription: Subscription;
    private goPreviousSubscription: Subscription;
    private cancelSubscription: Subscription;
    private goToSubscription: Subscription;
    private currentPageSubscription: Subscription;
    private wizardFinishedSubscription: Subscription;
    private wizardResetSubscription: Subscription;

    ngOnDestroy() {
        this.goNextSubscription.unsubscribe();
        this.goPreviousSubscription.unsubscribe();
        this.cancelSubscription.unsubscribe();
        this.goToSubscription.unsubscribe();
        this.currentPageSubscription.unsubscribe();
        this.wizardFinishedSubscription.unsubscribe();
        this.wizardResetSubscription.unsubscribe();
    }

    public ngAfterViewInit() {
        this.pageCollection.pages = this.pages;
        this.navService.wizardHasAltCancel = this.stopCancel;
        this.headerActionService.wizardHeaderActions = this.headerActions;
        if (this.showGhostPages) {
            this.navService.hideWizardGhostPages = false;
            this.deactivateGhostPages();
        }
        // SPECME
    }

    // The current page
    public get currentPage(): NewWizardPage {
        return this.navService.currentPage;
    }

// TODO: MAKE SURE WIZARD HAS DELEGATES FOR REASONABLE MODAL FNS
    // This is a public function that can be used to programmatically open the
    // wizard.
    public open(): void {
        let navService = this.navService;

        this._open = true;
        if (!this.currentPage) {
            navService.setFirstPageCurrent();
        }
        // SPECME

        this.setGhostPages();
        this._openChanged.emit(true);
    }

    // This is a public function that can be used to programmatically close the
    // wizard.
    public close(): void {
        this._open = false;
        this.deactivateGhostPages();
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

    // prev -- DEPRECATED
    // calls previous(); kept here to avoid breaking change where unnecessary
    public prev(): void {
        this.navService.previous();
    }

    // the following are convenience functions that are carried over from an older
    // implementation of the wizard. They have been preserved so as not to create
    // a breaking change.
    public previous(): void {
        this.navService.previous();
    }

    public next(): void {
        this.navService.next();
    }

    public cancel(): void {
        this.navService.cancel();
    }

    public goTo(pageId: string): void {
        if (!pageId) {
            return;
        }

        this.navService.goTo(pageId);
    }

    public reset() {
        this.pageCollection.reset();
        this.navService.setFirstPageCurrent();
    }

    public get ghostPageState(): string {
        return this.navService.wizardGhostPageState;
    }

    public deactivateGhostPages(): void {
        this.setGhostPages("deactivate");
    }

// TODO: USE ENUMS/CONSTANTS INSTEAD OF STRINGS ACROSS COMPONENTS!

    public setGhostPages(deactivateOrNot: string = ""): void {
        let navService = this.navService;

        if (this.showGhostPages) {
            if (deactivateOrNot === "deactivate") {
                navService.wizardGhostPageState = "inactive";
            } else if (navService.currentPageIsLast) {
                navService.wizardGhostPageState = "lastGhost";
            } else if (navService.currentPageIsNextToLast) {
                navService.wizardGhostPageState = "penultimateGhost";
            } else {
                navService.wizardGhostPageState = "ready";
            }
        }
        // SPECME
    }

// TOREMOVE: NOTE REMOVAL. SHOULDN'T BE A BREAKING CHANGE
    // this is a straggler from the old tabs dependency which accepted a stepnav
    // item and made its corresponding page the current page.
    // selectTab --
    //
    // Base class function overridden to call the onLoad event emitter
    // selectTab(wizardNav: WizardStep): void {
    // selectTab(wizardNav: any): void {
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
    // }

// TOREMOVE: REPLACED BY NGIF -- NOTE BREAKING CHANGE
    // skipTab --
    //
    // Public function to skip a Tab given its uniqueId
    // skipTab(tabId: string): void {
    //     this._setTabIsSkipped(tabId, true);
    // }

// TOREMOVE: REPLACED BY NGIF -- NOTE BREAKING CHANGE
    // unSkipTab --
    //
    // Public function to unSkip a tab given its uniqueId
    // unSkipTab(tabId: string): void {
    //     this._setTabIsSkipped(tabId, false);
    // }
}
