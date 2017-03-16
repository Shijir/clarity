import {Component} from "@angular/core";
import {PageCollectionService} from "./page-collection";
import {NewWizard} from "../wizard";
import {TestContext} from "../helpers.spec";
import {WizardNavigationService} from "./wizard-navigation";

export default function(): void {

    describe("Page Collection Service", () => {

        let context: TestContext<NewWizard, PageCollectionTest>;
        let wizardNavigationService: WizardNavigationService;
        let pageCollectionService: PageCollectionService;


        beforeEach(function() {
            context = this.create(NewWizard, PageCollectionTest);
            wizardNavigationService = context.getClarityProvider(WizardNavigationService);
            pageCollectionService = context.getClarityProvider(PageCollectionService);
            context.detectChanges();
        });

        afterEach(function() {
            context.fixture.destroy();
        });

        it(".pagesAsArray should return the array of wizard pages", () => {

            expect(pageCollectionService.pagesAsArray).toEqual(context.clarityDirective.pages.toArray());
            //expect(pageCollectionWithNoPage.pagesAsArray).toEqual([]);

        });

        it(".pagesCount should return correct number of pages", () => {

            expect(pageCollectionService.pagesCount).toEqual(5);
            //expect(pageCollectionWithNoPage.pagesCount).toEqual(0);

        });

        it(".lastPage should return the last wizard page", () => {

            expect(pageCollectionService.lastPage.id).toEqual(context.clarityDirective.pages.last.id);
            //expect(pageCollectionWithNoPage.lastPage).toBeUndefined();

        });

        it(".firstPage should return the first wizard page", () => {

            expect(pageCollectionService.firstPage.id).toEqual(context.clarityDirective.pages.first.id);
            //expect(pageCollectionWithNoPage.firstPage).toBeUndefined();

        });


        it(".getPageById() should return the wizard page with a matching id", () => {

            /*checkResults() method is tested here as well*/
            let firstPageId = context.clarityDirective.pages.first.id;
            let firstPageIdNumber = firstPageId.match(/\d+/)[0];
            let lastPageId = context.clarityDirective.pages.last.id;
            let nonExistingPageId = "N0N-EX1ST1N-ID";

            expect(pageCollectionService.getPageById(firstPageId)).toEqual(pageCollectionService.firstPage);
            expect(pageCollectionService.getPageById(lastPageId)).toEqual(pageCollectionService.lastPage);

            expect(() => {
                pageCollectionService.getPageById(nonExistingPageId);
            }).toThrowError("No page can be found with the id " + nonExistingPageId + ".");

            // expect(() => {
            //     pageCollectionService.getPageById("clr-wizard-ne-page-0");
            // }).toThrowError("No page can be found with the id clr-wizard-ne-page-0.");

            //Manually setting this id to make multiple pages have the same id.
            pageCollectionService.getPageById(lastPageId)._id = firstPageIdNumber;

            expect(() => {
                pageCollectionService.getPageById(firstPageId);
            }).toThrowError("More than one page has the requested id " + firstPageId + ".");
        });

        it(".getPageByIndex() should return the index of the wizard page", () => {


            expect(pageCollectionService.getPageByIndex(0)).toEqual(pageCollectionService.firstPage);
            expect(pageCollectionService.getPageByIndex(4)).toEqual(pageCollectionService.lastPage);

            expect(() => {
                pageCollectionService.getPageByIndex(-20);
            }).toThrowError("Cannot retrieve page with index of -20.");

            expect(() => {
                pageCollectionService.getPageByIndex(10);
            }).toThrowError("Page index is greater than length of pages array.");


        });

        it(".getPageIndex() should return the index of a wizard page", () => {

            // expect(() => {
            //     pageCollectionWithNoPage.getPageIndex(pageCollectionService.firstPage);
            // }).toThrowError("Requested page cannot be found in collection of pages.");

            expect(pageCollectionService.getPageIndex(pageCollectionService.firstPage)).toBe(0);

        });

        it(".pageRange() should return the range of wizard pages", () => {

            expect(pageCollectionService.pageRange(0, 0)).toEqual([pageCollectionService.firstPage]);

            expect(pageCollectionService.pageRange(4, 4)).toEqual([pageCollectionService.lastPage]);

            expect(pageCollectionService.pageRange(1, 3)).toEqual(pageCollectionService.pagesAsArray.slice(1, 4));

            expect(pageCollectionService.pageRange(1, 3)).toEqual(pageCollectionService.pagesAsArray.slice(1, 4));

            expect(pageCollectionService.pageRange(3, 3)).toEqual(pageCollectionService.pagesAsArray.slice(3, 4));

            expect(pageCollectionService.pageRange(-1, 3)).toEqual([]);

            expect(pageCollectionService.pageRange(-3, -1)).toEqual([]);

            expect(pageCollectionService.pageRange(1, -3)).toEqual([]);

            expect(pageCollectionService.pageRange(null, 3)).toEqual([]);

            expect(pageCollectionService.pageRange(3, undefined)).toEqual([]);

            expect(pageCollectionService.pageRange(null, undefined)).toEqual([]);

            //expect(pageCollectionWithNoPage.pageRange(1, 3)).toEqual([]);

        });

        it(".getPageRangeFromPages() should return the range of wizard pages", () => {

            expect(pageCollectionService.getPageRangeFromPages(pageCollectionService.firstPage,
                pageCollectionService.lastPage))
                .toEqual(pageCollectionService.pageRange(0, 4));

            expect(pageCollectionService.getPageRangeFromPages(pageCollectionService.firstPage,
                pageCollectionService.firstPage))
                .toEqual(pageCollectionService.pageRange(0, 0));

            expect(pageCollectionService.getPageRangeFromPages(pageCollectionService.getPageByIndex(1),
                pageCollectionService.getPageByIndex(3)))
                .toEqual(pageCollectionService.pageRange(1, 3));

        });

        it(".getPreviousPage() should return the previous page of the current page", () => {

            expect(pageCollectionService.getPreviousPage(pageCollectionService.lastPage))
                .toEqual(pageCollectionService.getPageByIndex(3));

            expect(pageCollectionService.getPreviousPage(pageCollectionService.getPageByIndex(2)))
                .toEqual(pageCollectionService.getPageByIndex(1));

            expect(pageCollectionService.getPreviousPage(pageCollectionService.firstPage)).toBeNull();

            // expect(() => {
            //     pageCollectionWithNoPage.getPreviousPage(pageCollectionService.getPageByIndex(2));
            // }).toThrowError("Requested page cannot be found in collection of pages.");

        });

        it(".getNextPage() should return the next page of the current page", () => {

            expect(pageCollectionService.getNextPage(pageCollectionService.firstPage))
                .toEqual(pageCollectionService.getPageByIndex(1));

            expect(pageCollectionService.getNextPage(pageCollectionService.getPageByIndex(2)))
                .toEqual(pageCollectionService.getPageByIndex(3));

            expect(pageCollectionService.getNextPage(pageCollectionService.lastPage)).toBeNull();

            // expect(() => {
            //     pageCollectionWithNoPage.getNextPage(pageCollectionService.getPageByIndex(2));
            // }).toThrowError("Requested page cannot be found in collection of pages.");

        });

        it(".getStepItemIdForPage() should return the step id of the page", () => {

            let firstPageId = context.clarityDirective.pages.first.id;
            let lastPageId = context.clarityDirective.pages.last.id;

            let firstPageStepId = firstPageId.replace("page", "step");
            let lastPageStepId = lastPageId.replace("page", "step");

            expect(pageCollectionService.getStepItemIdForPage(pageCollectionService.firstPage))
                .toBe(firstPageStepId);
            expect(pageCollectionService.getStepItemIdForPage(pageCollectionService.lastPage))
                .toBe(lastPageStepId);


        });

        it(".commitPage() should set the page's completed property to true", () => {

            let secondPage = pageCollectionService.getPageByIndex(2);
            spyOn(secondPage.primaryButtonClicked, "emit");
            spyOn(secondPage.onCommit, "emit");

            pageCollectionService.commitPage(secondPage);

            expect(secondPage.primaryButtonClicked.emit).toHaveBeenCalled();
            expect(secondPage.onCommit.emit).toHaveBeenCalled();
            expect(secondPage.completed).toBe(true);
        });


        it(".reset() should set the completed properties back to false.", () => {

            pageCollectionService.firstPage.completed = true;
            pageCollectionService.lastPage.completed = true;

            pageCollectionService.reset();

            expect(pageCollectionService.firstPage.completed).toBe(false);
            expect(pageCollectionService.lastPage.completed).toBe(false);
        });

    });

}

@Component({
    template: `
            <clr-newwizard #wizard [(clrWizardOpen)]="open" [clrWizardSize]="'lg'">
                <clr-wizard-title>My Wizard Title</clr-wizard-title>
                <clr-wizard-button [type]="'cancel'">Cancel</clr-wizard-button>
                <clr-wizard-button [type]="'previous'">Back</clr-wizard-button>
                <clr-wizard-button [type]="'next'">Next</clr-wizard-button>
                <clr-wizard-button [type]="'finish'">Fait Accompli</clr-wizard-button>
                <clr-wizard-header-action (actionClicked)="headerActionClicked($event)">
                    <clr-icon shape="cloud" class="is-solid"></clr-icon>
                </clr-wizard-header-action>
                <clr-newwizard-page>
                    <template pageTitle>Longer Title for Page 1</template>
                    <p>Content for step 1</p>
                    <!-- CUSTOME HDR ACTIONS GO HERE -->
                    <template pageHeaderActions>
                        <clr-wizard-header-action (actionClicked)="headerActionClicked($event)" id="bell">
                            <clr-icon shape="bell" class="has-badge"></clr-icon>
                        </clr-wizard-header-action>
                        <clr-wizard-header-action (actionClicked)="headerActionClicked($event)" id="warning">
                            <clr-icon shape="warning"></clr-icon>
                        </clr-wizard-header-action>
                    </template>
                </clr-newwizard-page>
                <clr-newwizard-page>
                    <template pageTitle>Title for Page 2</template>
                    <p>Content for step 2</p>
                </clr-newwizard-page>
                <clr-newwizard-page>
                    <template pageTitle>Title for Page 3</template>
                    <p>Content for step 3</p>
                </clr-newwizard-page>
                <clr-newwizard-page>
                    <template pageTitle>Title for Page 4</template>
                    <p>Content for step 4</p>
                </clr-newwizard-page>
                <clr-newwizard-page>
                    <template pageTitle>Title for Page 5</template>
                    <p>Content for step 5</p>
                </clr-newwizard-page>
            </clr-newwizard>
    `
})
class PageCollectionTest {
    open: boolean = true;

    headerActionClicked = function() {
        console.log("header action clicked!");
    };

}

