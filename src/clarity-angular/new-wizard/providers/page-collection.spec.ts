import { ComponentFixture, TestBed } from "@angular/core/testing";
import { Component, QueryList, ViewChildren, Output, EventEmitter } from "@angular/core";
import { ClarityModule } from "../../clarity.module";
import { PageCollectionService } from "./page-collection";

let wizardPageIndex = 0;
let nonExistingWizardPageIndex = 0;

@Component({
    selector: "clr-newwizard-ne-page-mock",
    template: `<div>I am actually a non-existing mock wizard page</div>`
})
class NewWizardNonExistingPageMock {
    _id: string = (nonExistingWizardPageIndex++).toString();

    public get id() {
        return `clr-wizard-ne-page-${this._id}`;
    }
}

@Component({
    selector: "clr-newwizard-page-mock",
    template: `<div>I am actually a mock wizard page</div>`
})
class NewWizardPageMock {
    _id: string = (wizardPageIndex++).toString();

    public get id() {
        return `clr-wizard-page-${this._id}`;
    }

    @Output("clrWizardPagePrimary") primaryButtonClicked: EventEmitter < any > =
        new EventEmitter(false);

    @Output("clrWizardPageOnCommit") onCommit: EventEmitter < any > =
        new EventEmitter<any>(false);

    private _complete: boolean = false;

    public get completed(): boolean {
        return this._complete;

    }

    public set completed(value: boolean) {
        this._complete = value;
    }


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
class TestComponent {

    @ViewChildren(NewWizardPageMock) wizardPageChildren: QueryList<NewWizardPageMock>;

    @ViewChildren(NewWizardNonExistingPageMock) nonExistingWizardPageChildren: QueryList<NewWizardNonExistingPageMock>;

}

describe("Page Collection Service", () => {

    let fixture: ComponentFixture<any>;

    let pageCollection: PageCollectionService;

    let pageCollectionWithNoPage: PageCollectionService;


    beforeEach(() => {

        TestBed.configureTestingModule({
            imports: [ ClarityModule.forRoot() ],
            declarations: [ TestComponent, NewWizardPageMock ]
        });

        fixture = TestBed.createComponent(TestComponent);
        fixture.detectChanges();

        pageCollection = new PageCollectionService();
        pageCollection.pages = fixture.componentInstance.wizardPageChildren;

        pageCollectionWithNoPage = new PageCollectionService();
        pageCollectionWithNoPage.pages = fixture.componentInstance.nonExistingWizardPageChildren;

    });

    afterEach(() => {
        fixture.destroy();
        wizardPageIndex = 0;
        nonExistingWizardPageIndex = 0;
    });

    it(".pagesAsArray should return the array of wizard pages", () => {

        expect(pageCollection.pagesAsArray).toEqual(fixture.componentInstance.wizardPageChildren.toArray());
        expect(pageCollectionWithNoPage.pagesAsArray).toEqual([]);

    });

    it(".pagesCount should return correct number of pages", () => {

        expect(pageCollection.pagesCount).toEqual(5);
        expect(pageCollectionWithNoPage.pagesCount).toEqual(0);

    });

    it(".lastPage should return the last wizard page", () => {

        expect(pageCollection.lastPage.id).toEqual("clr-wizard-page-4");
        expect(pageCollectionWithNoPage.lastPage).toBeUndefined();

    });

    it(".firstPage should return the first wizard page", () => {

        expect(pageCollection.firstPage.id).toEqual("clr-wizard-page-0");
        expect(pageCollectionWithNoPage.firstPage).toBeUndefined();

    });


    it(".getPageById() should return the wizard page with a matching id", () => {

        /*checkResults() method is tested here as well*/

        expect(pageCollection.getPageById("clr-wizard-page-0")).toEqual(pageCollection.firstPage);
        expect(pageCollection.getPageById("clr-wizard-page-4")).toEqual(pageCollection.lastPage);

        expect(() => {
            pageCollection.getPageById("clr-wizard-page-10");
        }).toThrowError("No page can be found with the id clr-wizard-page-10.");

        expect(() => {
            pageCollection.getPageById("clr-wizard-ne-page-0");
        }).toThrowError("No page can be found with the id clr-wizard-ne-page-0.");


        //Manually setting this id to make multiple pages have the same id.
        pageCollection.getPageByIndex(4)._id = "3";

        expect(() => {
            pageCollection.getPageById("clr-wizard-page-3");
        }).toThrowError("More than one page has the requested id clr-wizard-page-3.");


    });

    it(".getPageByIndex() should return the index of the wizard page", () => {


        expect(pageCollection.getPageByIndex(0)).toEqual(pageCollection.firstPage);
        expect(pageCollection.getPageByIndex(4)).toEqual(pageCollection.lastPage);

        expect(() => {
            pageCollection.getPageByIndex(-20);
        }).toThrowError("Cannot retrieve page with index of -20.");

        expect(() => {
            pageCollection.getPageByIndex(10);
        }).toThrowError("Page index is greater than length of pages array.");


    });

    it(".getPageIndex() should return the index of a wizard page", () => {

        expect(() => {
            pageCollectionWithNoPage.getPageIndex(pageCollection.firstPage);
        }).toThrowError("Requested page cannot be found in collection of pages.");

        expect(pageCollection.getPageIndex(pageCollection.firstPage)).toBe(0);

    });

    it(".pageRange() should return the range of wizard pages", () => {

        expect(pageCollection.pageRange(0, 0)).toEqual([ pageCollection.firstPage ]);

        expect(pageCollection.pageRange(4, 4)).toEqual([ pageCollection.lastPage ]);

        expect(pageCollection.pageRange(1, 3)).toEqual(pageCollection.pagesAsArray.slice(1, 4));

        expect(pageCollection.pageRange(1, 3)).toEqual(pageCollection.pagesAsArray.slice(1, 4));

        expect(pageCollection.pageRange(3, 3)).toEqual(pageCollection.pagesAsArray.slice(3, 4));

        expect(pageCollection.pageRange(-1, 3)).toEqual([]);

        expect(pageCollection.pageRange(-3, -1)).toEqual([]);

        expect(pageCollection.pageRange(1, -3)).toEqual([]);

        expect(pageCollection.pageRange(null, 3)).toEqual([]);

        expect(pageCollection.pageRange(3, undefined)).toEqual([]);

        expect(pageCollection.pageRange(null, undefined)).toEqual([]);

        expect(pageCollectionWithNoPage.pageRange(1, 3)).toEqual([]);

    });

    it(".getPageRangeFromPages() should return the range of wizard pages", () => {

        expect(pageCollection.getPageRangeFromPages(pageCollection.firstPage, pageCollection.lastPage))
            .toEqual(pageCollection.pageRange(0, 4));

        expect(pageCollection.getPageRangeFromPages(pageCollection.firstPage, pageCollection.firstPage))
            .toEqual(pageCollection.pageRange(0, 0));

        expect(pageCollection.getPageRangeFromPages(pageCollection.getPageByIndex(1), pageCollection.getPageByIndex(3)))
            .toEqual(pageCollection.pageRange(1, 3));

    });

    it(".getPreviousPage() should return the previous page of the current page", () => {

        expect(pageCollection.getPreviousPage(pageCollection.lastPage)).toEqual(pageCollection.getPageByIndex(3));

        expect(pageCollection.getPreviousPage(pageCollection.getPageByIndex(2)))
            .toEqual(pageCollection.getPageByIndex(1));

        expect(pageCollection.getPreviousPage(pageCollection.firstPage)).toBeNull();

        expect(() => {
            pageCollectionWithNoPage.getPreviousPage(pageCollection.getPageByIndex(2));
        }).toThrowError("Requested page cannot be found in collection of pages.");

    });

    it(".getNextPage() should return the next page of the current page", () => {

        expect(pageCollection.getNextPage(pageCollection.firstPage)).toEqual(pageCollection.getPageByIndex(1));

        expect(pageCollection.getNextPage(pageCollection.getPageByIndex(2)))
            .toEqual(pageCollection.getPageByIndex(3));

        expect(pageCollection.getNextPage(pageCollection.lastPage)).toBeNull();

        expect(() => {
            pageCollectionWithNoPage.getNextPage(pageCollection.getPageByIndex(2));
        }).toThrowError("Requested page cannot be found in collection of pages.");

    });

    it(".getStepItemIdForPage() should return the next page of the current page", () => {

        expect(pageCollection.getStepItemIdForPage(pageCollection.firstPage)).toBe("clr-wizard-step-0");
        expect(pageCollection.getStepItemIdForPage(pageCollection.getPageByIndex(3))).toBe("clr-wizard-step-3");
        expect(pageCollection.getStepItemIdForPage(pageCollection.lastPage)).toBe("clr-wizard-step-4");

        //setting a custom id
        pageCollection.getPageByIndex(4)._id = "custom-id-4";

        expect(pageCollectionWithNoPage.getStepItemIdForPage(pageCollection.getPageByIndex(4)))
            .toBe("clr-wizard-page-custom-step-4");

    });

    it(".commitPage() should set the page's completed property to true", () => {

        let secondPage = pageCollection.getPageByIndex(2);
        spyOn(secondPage.primaryButtonClicked, "emit");
        spyOn(secondPage.onCommit, "emit");

        pageCollection.commitPage(secondPage);

        expect(secondPage.primaryButtonClicked.emit).toHaveBeenCalled();
        expect(secondPage.onCommit.emit).toHaveBeenCalled();
        expect(secondPage.completed).toBe(true);
    });


    it(".reset() should set the completed properties back to false.", () => {

        pageCollection.firstPage.completed = true;
        pageCollection.lastPage.completed = true;

        pageCollection.reset();

        expect(pageCollection.firstPage.completed).toBe(false);
        expect(pageCollection.lastPage.completed).toBe(false);
    });

});