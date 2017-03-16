import {Component} from "@angular/core";
import {NewWizard} from "../wizard";
import {TestContext} from "../helpers.spec";
import {ButtonHubService} from "./button-hub";
import {WizardNavigationService} from "./wizard-navigation";
import {PageCollectionService} from "./page-collection";

export default function(): void {

    describe("Button Hub Service", function() {

        let context: TestContext<NewWizard, ButtonHubTest>;
        let buttonHubService: ButtonHubService;
        let wizardNavigationService: WizardNavigationService;
        let pageCollectionService: PageCollectionService;

        beforeEach(function() {
            context = this.create(NewWizard, ButtonHubTest);
            buttonHubService = context.getClarityProvider(ButtonHubService);
            wizardNavigationService = context.getClarityProvider(WizardNavigationService);
            pageCollectionService = context.getClarityProvider(PageCollectionService);
            context.detectChanges();
        });

        it("buttonClicked('next') calls wizardNavigationService.next", function() {

            spyOn(wizardNavigationService, "next");
            buttonHubService.buttonClicked("next");
            expect(wizardNavigationService.next).toHaveBeenCalled();
        });

        it("buttonClicked('previous') calls wizardNavigationService.previous", function() {

            wizardNavigationService.setCurrentPage(pageCollectionService.lastPage);
            spyOn(wizardNavigationService, "previous");
            buttonHubService.buttonClicked("previous");
            expect(wizardNavigationService.previous).toHaveBeenCalled();
        });

        it("buttonClicked('danger') calls wizardNavigationService.next or wizardNavigationService.finish", function() {

            spyOn(wizardNavigationService, "next");
            buttonHubService.buttonClicked("danger");
            expect(wizardNavigationService.next).toHaveBeenCalled();

            spyOn(wizardNavigationService, "finish");
            wizardNavigationService.setCurrentPage(wizardNavigationService.pageCollection.lastPage);
            buttonHubService.buttonClicked("danger");
            expect(wizardNavigationService.finish).toHaveBeenCalled();
        });

        it(".cancel calls wizardNavigationService.cancel", function() {

            spyOn(wizardNavigationService, "cancel");
            buttonHubService.buttonClicked("cancel");
            expect(wizardNavigationService.cancel).toHaveBeenCalled();
        });

        it(".finish calls wizard.deactivateGhostPages, deactivateGhostPages.close and emit wizardFinished", function() {

            spyOn(context.clarityDirective.wizardFinished, "emit");
            spyOn(context.clarityDirective, "deactivateGhostPages");
            spyOn(context.clarityDirective, "close");
            buttonHubService.buttonClicked("finish");
            expect(context.clarityDirective.deactivateGhostPages).toHaveBeenCalled();
            expect(context.clarityDirective.wizardFinished.emit).toHaveBeenCalled();
            expect(context.clarityDirective.close).toHaveBeenCalled();
        });

        it(".custom calls wizardNavigationService.currentPage.customButtonClicked", function() {
            spyOn(wizardNavigationService.currentPage.customButtonClicked, "emit");
            buttonHubService.buttonClicked("custom");
            expect(wizardNavigationService.currentPage.customButtonClicked.emit).toHaveBeenCalled();
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
                    <template pageTitle>Title for Page 1</template>
                    <p>Content for step 1</p>
                </clr-newwizard-page>
                <clr-newwizard-page>
                    <template pageTitle>Title for Page 2</template>
                    <p>Content for step 2</p>
                </clr-newwizard-page>
                <clr-newwizard-page>
                    <template pageTitle>Title for Page 3</template>
                    <p>Content for step 3</p>
                </clr-newwizard-page>
            </clr-newwizard>
    `
})
class ButtonHubTest {
    open: boolean = true;
    headerActionClicked = function() {
        console.log("header action clicked!");
    };
}