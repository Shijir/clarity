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
    HostListener,
    OnInit,
    OnDestroy,
    AfterViewInit
} from "@angular/core";
import { Subscription } from "rxjs/Subscription";
import { NewWizardPage } from "./wizard-page";

// providers
import { WizardNavigationService } from "./providers/wizard-navigation";
import { PageCollectionService } from "./providers/page-collection";
import { ButtonHubService } from "./providers/button-hub";

// TODO: remove "NEW" when finishing up

@Component({
    selector: "clr-newwizard",
    providers: [ WizardNavigationService, PageCollectionService, ButtonHubService ],
    templateUrl: "./wizard.html",
    host: {
        "[id]": "id",
        "[class.clr-wizard]": "true",
        "[class.main-container]": "true", // <= ???
        "[class.wizard-md]": "size == 'md'",
        "[class.wizard-lg]": "size == 'lg'",
        "[class.wizard-xl]": "size == 'xl'"
    }
})
export class NewWizard implements OnInit, OnDestroy, AfterViewInit {

    constructor(public navService: WizardNavigationService,
                public pageCollection: PageCollectionService,
                public buttonService: ButtonHubService) {

        this.goNextSubscription = this.navService.movedToNextPage.subscribe(() => {
            console.log("I, wizard, went to the next page!");
        });

        this.goPreviousSubscription = this.navService.movedToPreviousPage.subscribe(() => {
            console.log("I, wizard, went to the previous page!");
        });

        this.cancelSubscription = this.navService.notifyWizardCancel.subscribe(() => {
            this.close();
        });
    }

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

    // TOLERN: use this convention for two-way binding
    // @Input("xxx") x: boolean
    // @Output("xxxChange") change: EventEmitter<boolean>();
    // [(xxx)]
    //
    // THESE ARE EQUIVALENT
    // [(xxx)]="myModel"
    // [xxx]="myModel" (xxxChange)="myModel = $event"

    // TODO: need a wizardCurrentPageChanged event... bubbling up from page to service to wizard
    @Output("clrWizardCurrentPageChanged") currentPageChanged: EventEmitter<any> =
        new EventEmitter<any>(false);

    @Output("clrWizardOnFinish") wizardFinished: EventEmitter<any> =
        new EventEmitter<any>(false);

    @ContentChildren(NewWizardPage) public pages: QueryList<NewWizardPage>;

    public ngOnInit(): void {
        this.currentPageSubscription = this.navService.currentPageChanged.subscribe((page: NewWizardPage) => {
            this.currentPageChanged.emit();
        });
    }

    private goNextSubscription: Subscription;
    private goPreviousSubscription: Subscription;
    private cancelSubscription: Subscription;
    private goToSubscription: Subscription;
    private currentPageSubscription: Subscription;

    ngOnDestroy() {
        this.goNextSubscription.unsubscribe();
        this.goPreviousSubscription.unsubscribe();
        this.cancelSubscription.unsubscribe();
        this.goToSubscription.unsubscribe();
        this.currentPageSubscription.unsubscribe();
    }

    public ngAfterViewInit() {
        this.pageCollection.pages = this.pages;
    }

    private _id: string;
    public get id(): string {
        return this._id;
    }

    // The current page
    public get currentPage(): NewWizardPage {
        return this.navService.currentPage;
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

    public goTo(pageId: string) {
        // TODO: get funky with it
        return;
    }

    // TODO: CAN KEEP PAGE ONLOAD BUT IT SHOULD BE CALLED ON THE PAGE, NOT HERE
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

    // TODO: REPLACED BY NGIF -- NOTE BREAKING CHANGE
    // skipTab --
    //
    // Public function to skip a Tab given its uniqueId
    // skipTab(tabId: string): void {
    //     this._setTabIsSkipped(tabId, true);
    // }

    // TODO: REPLACED BY NGIF -- NOTE BREAKING CHANGE
    // unSkipTab --
    //
    // Public function to unSkip a tab given its uniqueId
    // unSkipTab(tabId: string): void {
    //     this._setTabIsSkipped(tabId, false);
    // }
}
