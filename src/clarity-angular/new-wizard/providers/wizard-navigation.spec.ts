/*
 * Copyright (c) 2016 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { WizardNavigationService } from "./wizard-navigation";
import { PageCollectionService } from "./page-collection";
import { ButtonHubService } from "./button-hub";
import { Component, QueryList, ViewChildren, Output, EventEmitter } from "@angular/core";
import { TestBed, ComponentFixture } from "@angular/core/testing";
import { ClarityModule } from "../../clarity.module";

let wizardPageIndex = 0;

@Component({
    selector: "clr-newwizard-page-mock",
    template: `<div>I am actually a mock wizard page</div>`
})
class NewWizardPageMock {

    _id: string = (wizardPageIndex++).toString();

    public get title() {
        return `clr-wizard-page-${this._id}-title`;
    }

    readyToComplete: boolean = true;
    completed: boolean = false;

    @Output("clrWizardPagePrimary") primaryButtonClicked: EventEmitter < any > =
        new EventEmitter(false);

    @Output("clrWizardPageOnCommit") onCommit: EventEmitter < any > =
        new EventEmitter<any>(false);

}

@Component({
    selector: "clr-newwizard-mock",
    template: `
            <clr-newwizard-page-mock></clr-newwizard-page-mock>
            <clr-newwizard-page-mock></clr-newwizard-page-mock>
            <clr-newwizard-page-mock></clr-newwizard-page-mock>
            <clr-newwizard-page-mock></clr-newwizard-page-mock>
            <clr-newwizard-page-mock></clr-newwizard-page-mock>
    `
})
class NewWizardMock {

    @ViewChildren(NewWizardPageMock) wizardPageChildren: QueryList<NewWizardPageMock>;

    @Output("clrWizardOnFinish") wizardFinished: EventEmitter<any> =
        new EventEmitter<any>(false);

}

fdescribe("Wizard Navigation Service", () => {

    let fixture: ComponentFixture<any>;
    let wizardNavigationService: any;
    let pageCollection: PageCollectionService;
    let buttonHub: ButtonHubService;

    beforeEach(() => {

        TestBed.configureTestingModule({
            imports: [ ClarityModule.forRoot() ],
            declarations: [ NewWizardMock, NewWizardPageMock ]
        });

        fixture = TestBed.createComponent(NewWizardMock);
        fixture.detectChanges();

        pageCollection = new PageCollectionService();
        pageCollection.pages = fixture.componentInstance.wizardPageChildren;

        buttonHub = new ButtonHubService();

        wizardNavigationService = new WizardNavigationService(pageCollection, buttonHub);

    });

    afterEach(() => {
        fixture.destroy();
        wizardPageIndex = 0;
    });

    it(".setCurrentPage() should set the current page and emit the event", () => {

        wizardNavigationService.currentPageChanged.subscribe((page: NewWizardPageMock) => {

            expect(page.title).toMatch(/clr-wizard-page-0-title/);

        });

        wizardNavigationService.setCurrentPage(pageCollection.firstPage);

        expect(wizardNavigationService.currentPageTitle).toMatch(/clr-wizard-page-0-title/);

    });

    it(".next() should call finish() and throw an error if the current page is the last page.", () => {

        let testPage = wizardNavigationService.pageCollection.lastPage;

        wizardNavigationService.setCurrentPage(testPage);

        spyOn(testPage.primaryButtonClicked, "emit");
        spyOn(testPage.onCommit, "emit");
        spyOn(fixture.componentInstance.wizardFinished, "emit");

        wizardNavigationService.wizardFinished.subscribe(() => {

            fixture.componentInstance.wizardFinished.emit();

        });

        expect(() => {

            wizardNavigationService.next();

        }).toThrowError("The wizard has no next page to go to.");

        expect(testPage.primaryButtonClicked.emit).toHaveBeenCalled();
        expect(testPage.onCommit.emit).toHaveBeenCalled();

        expect(testPage.completed).toBe(true);
        expect(fixture.componentInstance.wizardFinished.emit).toHaveBeenCalled();

    });

    it(".next() should set the current page to the next page.", () => {

        let testPage = wizardNavigationService.pageCollection.getPageByIndex(1);

        wizardNavigationService.setCurrentPage(testPage);

        wizardNavigationService.currentPageChanged.subscribe((page: NewWizardPageMock) => {

            expect(page.title).toMatch(/clr-wizard-page-2-title/);

        });

        wizardNavigationService.next();

        expect(wizardNavigationService.currentPageTitle).toMatch(/clr-wizard-page-2-title/);


    });

    it(".next() should return undefined if the next page is disabled", () => {

        let testPage = wizardNavigationService.pageCollection.getPageByIndex(2);

        testPage.readyToComplete = false;

        wizardNavigationService.setCurrentPage(testPage);

        expect(wizardNavigationService.next()).toBeUndefined();

    });

    it(".finish() should commit the current page and emit the event", () => {

        let testPage = wizardNavigationService.pageCollection.getPageByIndex(3);

        spyOn(testPage.primaryButtonClicked, "emit");
        spyOn(testPage.onCommit, "emit");
        spyOn(fixture.componentInstance.wizardFinished, "emit");

        wizardNavigationService.wizardFinished.subscribe(() => {

            fixture.componentInstance.wizardFinished.emit();

        });

        wizardNavigationService.setCurrentPage(testPage);

        wizardNavigationService.finish();

        expect(testPage.primaryButtonClicked.emit).toHaveBeenCalled();
        expect(testPage.onCommit.emit).toHaveBeenCalled();

        expect(testPage.completed).toBe(true);
        expect(fixture.componentInstance.wizardFinished.emit).toHaveBeenCalled();

    });

    it(".finish() should not commit the current page and emit events if next is disabled", () => {

        let testPage = wizardNavigationService.pageCollection.getPageByIndex(3);

        testPage.readyToComplete = false;

        spyOn(testPage.primaryButtonClicked, "emit");
        spyOn(testPage.onCommit, "emit");
        spyOn(fixture.componentInstance.wizardFinished, "emit");

        wizardNavigationService.wizardFinished.subscribe(() => {

            fixture.componentInstance.wizardFinished.emit();

        });

        wizardNavigationService.setCurrentPage(testPage);

        wizardNavigationService.finish();

        expect(testPage.primaryButtonClicked.emit).not.toHaveBeenCalled();
        expect(testPage.onCommit.emit).not.toHaveBeenCalled();

        expect(testPage.completed).toBe(false);
        expect(fixture.componentInstance.wizardFinished.emit).not.toHaveBeenCalled();

    });

    it(".previous() should return undefined if the current page is the first page", () => {

        let testPage = wizardNavigationService.pageCollection.getPageByIndex(0);

        wizardNavigationService.setCurrentPage(testPage);

        expect(wizardNavigationService.previous()).toBeUndefined();

    });

    it(".previous() should return undefined if the current page is the first page", () => {

        let testPage = wizardNavigationService.pageCollection.getPageByIndex(0);

        wizardNavigationService.setCurrentPage(testPage);

        expect(wizardNavigationService.previous()).toBeUndefined();

    });

    it(".previous() should set the current page to the previous page", () => {

        let testPage = wizardNavigationService.pageCollection.getPageByIndex(3);
        let previousPage = wizardNavigationService.pageCollection.getPageByIndex(2);

        wizardNavigationService.setCurrentPage(testPage);

        wizardNavigationService.previous();

        expect(wizardNavigationService.currentPage).toEqual(previousPage);

    });



});