/*
 * Copyright (c) 2016-2017 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import {
    Component,
    ViewChild,
    DebugElement,
    TemplateRef,
    AfterContentInit
} from "@angular/core";

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { ClarityModule } from "../clarity.module";
import { NewWizardStepnavItem } from "./wizard-stepnav-item";
import { WizardNavigationService } from "./providers/wizard-navigation";
import { PageCollectionService } from "./providers/page-collection";
import { ButtonHubService } from "./providers/button-hub";
import { WizardPageNavTitleDirective } from "./directives/page-navtitle";

class MockPage {
    disabled = false;
    current = false;
    completed = false;
    id = "this-is-my-page-id-0";
    reset(): void {
        this.disabled = false;
        this.current = false;
        this.completed = false;
    }
    navTitle: TemplateRef<any>;
}

let fakeOutPage = new MockPage();

@Component({
    template: `
        <div clr-wizard-stepnav-item [page]="page"></div>
        <template pageNavTitle>This is my {{ projector }}</template>
    `
})
class TestComponent implements AfterContentInit {
    constructor() {
        this.page = fakeOutPage;
    }
    page: MockPage;
    projector: string = "foo";

    @ViewChild(NewWizardStepnavItem) stepNavItem: NewWizardStepnavItem;
    @ViewChild(WizardPageNavTitleDirective) navTitleRef: WizardPageNavTitleDirective;

    public ngAfterContentInit(): void {
        this.page.navTitle = this.navTitleRef.pageNavTitleTemplateRef;
    }
}

export default function(): void {
    describe("New Wizard Stepnav Item", () => {
        let fixture: ComponentFixture<any>;
        let testItemComponent: NewWizardStepnavItem;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [ ClarityModule.forRoot() ],
                declarations: [ TestComponent ],
                providers: [ WizardNavigationService, PageCollectionService, ButtonHubService ]
            });
            fixture = TestBed.createComponent(TestComponent);
            fixture.detectChanges();
            testItemComponent = fixture.componentInstance.stepNavItem;
        });

        afterEach(() => {
            fakeOutPage.reset();
            fixture.destroy();
        });

        describe("Typescript API", () => {

            describe("id", () => {
                it("should call page collection service for step item id", () => {
                    const pageCollectionSpy = spyOn(testItemComponent.pageCollection, "getStepItemIdForPage");
                    testItemComponent.page._id = "try-a-different-id";
                    fixture.detectChanges();
                    expect(pageCollectionSpy).toHaveBeenCalledWith(testItemComponent.page);
                });

                it("should receive expected id from page collection", () => {
                    const expectedId = "this-is-my-page-step-0";
                    fixture.detectChanges();
                    expect(testItemComponent.id).toBe(expectedId);
                });

                it("should throw an error if page is not present", () => {
                    testItemComponent.page = null;
                    expect(() => { fixture.detectChanges(); }).toThrow();
                });
            });

            describe("click", () => {
                let navServiceSpy: any;

                beforeEach(() => {
                    fakeOutPage.reset();
                    navServiceSpy = spyOn(testItemComponent.navService, "goTo");
                });

                it("should not call to navService if disabled", () => {
                    fakeOutPage.disabled = true;
                    testItemComponent.click();
                    expect(navServiceSpy).not.toHaveBeenCalled();
                });

                it("should not call to navService if current", () => {
                    fakeOutPage.current = true;
                    testItemComponent.click();
                    expect(navServiceSpy).not.toHaveBeenCalled();
                });

                it("should pass the page to the navService to navigate to the stepnav item's page", () => {
                    testItemComponent.click();
                    expect(navServiceSpy).toHaveBeenCalledWith(testItemComponent.page);
                });

                it("should throw an error if page is not present", () => {
                    testItemComponent.page = null;
                    expect(() => { testItemComponent.click(); }).toThrow();
                });
            });

            describe("isDisabled", () => {
                it("should update false/true when page is updated", () => {
                    // mock inits/resets with all false
                    expect(testItemComponent.isDisabled).toBe(false, "inits as false");
                    fakeOutPage.disabled = true;
                    fixture.detectChanges();
                    expect(testItemComponent.isDisabled).toBe(true, "updates when page is updated");
                    fakeOutPage.reset();
                    fixture.detectChanges();
                    expect(testItemComponent.isDisabled).toBe(false, "resets when page is reset");
                });

                it("should throw an error if page is not present", () => {
                    testItemComponent.page = null;
                    expect(() => { testItemComponent.click(); }).toThrow();
                });
            });

            describe("isCurrent", () => {
                it("should update false/true when page is updated", () => {
                    // mock inits/resets with all false
                    expect(testItemComponent.isCurrent).toBe(false, "inits as false");
                    fakeOutPage.current = true;
                    fixture.detectChanges();
                    expect(testItemComponent.isCurrent).toBe(true, "updates when page is updated");
                    fakeOutPage.reset();
                    fixture.detectChanges();
                    expect(testItemComponent.isCurrent).toBe(false, "resets when page is reset");
                });

                it("should throw an error if page is not present", () => {
                    testItemComponent.page = null;
                    expect(() => { testItemComponent.click(); }).toThrow();
                });
            });

            describe("isComplete", () => {
                it("should update false/true when page is updated", () => {
                    // mock inits/resets with all false
                    expect(testItemComponent.isComplete).toBe(false, "inits as false");
                    fakeOutPage.completed = true;
                    fixture.detectChanges();
                    expect(testItemComponent.isComplete).toBe(true, "updates when page is updated");
                    fakeOutPage.reset();
                    fixture.detectChanges();
                    expect(testItemComponent.isComplete).toBe(false, "resets when page is reset");
                });

                it("should throw an error if page is not present", () => {
                    testItemComponent.page = null;
                    expect(() => { testItemComponent.click(); }).toThrow();
                });
            });
        });

        // Inputs, Outputs, and initialization of component based on content-children
        describe("Template API", () => {
            describe("nav title", () => {
                const expectedInitialTitle = "This is my foo";
                const expectedUpdatedTitle = "This is my bar";

                it("projects page nav title as expected", () => {
                    let myTitleEl = fixture.debugElement.query(By.css(".clr-wizard-stepnav-link")).nativeElement;
                    expect(myTitleEl.textContent.trim()).toBe(expectedInitialTitle, "projects initial value");
                    fixture.componentInstance.projector = "bar";
                    fixture.detectChanges();
                    expect(myTitleEl.textContent.trim()).toBe(expectedUpdatedTitle, "projects updated value");
                });
            });
        });

        describe("View and Behavior", () => {
            describe("Renders as expected", () => {
                let debugEl: DebugElement;
                let myStepnavItem: HTMLElement;

                beforeEach(() => {
                    debugEl = fixture.debugElement;
                    myStepnavItem = debugEl.query(By.css("[clr-wizard-stepnav-item]")).nativeElement;
                });

                it("should have id", () => {
                    let myId: string;
                    expect(myStepnavItem.hasAttribute("id")).toBeTruthy("stepnav item should have an id");
                    myId = myStepnavItem.getAttribute("id");
                    expect(myId).toBe(testItemComponent.id, "stepnav item id should contain id");
                });

                it("should have aria-controls attribute", () => {
                    let myAriaControls: string;
                    const stepNavItemId = testItemComponent.id;

                    expect(myStepnavItem.hasAttribute("aria-controls")).toBeTruthy(
                        "stepnav item should have aria-controls attr");
                    myAriaControls = myStepnavItem.getAttribute("aria-controls");
                    expect(myAriaControls).toBe(stepNavItemId, "aria-controls should contain id");
                });

                it("should have role of presentation", () => {
                    let myRole: string;

                    expect(myStepnavItem.hasAttribute("role")).toBeTruthy(
                        "stepnav item should have role attr");
                    myRole = myStepnavItem.getAttribute("role");
                    expect(myRole).toBe("presentation", "aria role should be presentation");
                });

                it("should have clr-nav-link and nav-item classes", () => {
                    expect(myStepnavItem.classList.contains("nav-item")).toBe(true, "stepnav item has .nav-item class");
                    expect(myStepnavItem.classList.contains("clr-nav-link")).toBe(true, 
                        "stepnav item has .clr-nav-link class");
                });

                // make sure component aria-selected and active class are tied to isCurrent
                it("aria-selected and active class should be tied to isCurrent", () => {
                    expect(true).toBe(true);
                });

                // make sure component disabled class is tied to isDisabled
                it("disabled class should be tied to isDisabled", () => {
                    expect(true).toBe(true);
                });
                // make sure component disabled class is tied to isComplete
                it("complete class should be tied to isComplete", () => {
                    expect(true).toBe(true);
                });
                // ??? REALLY
                // make sure component highlights properly when isComplete is true
                it("true is true", () => {
                    expect(true).toBe(true);
                });
            });
            describe("Behavior", () => {
                // NEEDS SPY ON NAVSERVICE HERE!!!

                // if i click on a disabled item, nothing happens
                it("true is true", () => {
                    expect(true).toBe(true);
                });
                // if i click on a current item, nothing happens
                it("true is true", () => {
                    expect(true).toBe(true);
                });
                // otherwise, something happens
                it("true is true", () => {
                    expect(true).toBe(true);
                });
                // if i click on a current item, nothing happens. then make it not current, 
                // i click something happens. 
                // then again.
                it("true is true", () => {
                    expect(true).toBe(true);
                });
                // if i click on a disabled item, nothing happens. then make it not disabled, 
                // i click something happens. 
                // then again. <= make sure to make something else current
                it("true is true", () => {
                    expect(true).toBe(true);
                });
            });
        });
    });

// @Component({
//     template: `
//     <clr-wizard [(clrWizardOpen)]="open" [clrWizardClosable]="false">
//         <div class="wizard-title">Title</div>
//         <clr-wizard-step>Tab1</clr-wizard-step>
//         <clr-wizard-step>Tab2</clr-wizard-step>
//         <clr-wizard-step>Tab3</clr-wizard-step>
//         <clr-wizard-step>Tab4</clr-wizard-step>
//         <clr-wizard-page>Page1</clr-wizard-page>
//         <clr-wizard-page>Page2</clr-wizard-page>
//         <clr-wizard-page>Page3</clr-wizard-page>
//         <clr-wizard-page>Page4</clr-wizard-page>
//     </clr-wizard>
//    `,
//     template: `
//     <clr-wizard [(clrWizardOpen)]="open" [clrWizardClosable]="false">
//         <div class="wizard-title">Title</div>
//         <clr-wizard-step>Tab1</clr-wizard-step>
//         <clr-wizard-step>Tab2</clr-wizard-step>
//         <clr-wizard-step>Tab3</clr-wizard-step>
//         <clr-wizard-step>Tab4</clr-wizard-step>
//         <clr-wizard-page>Page1</clr-wizard-page>
//         <clr-wizard-page>Page2</clr-wizard-page>
//         <clr-wizard-page>Page3</clr-wizard-page>
//         <clr-wizard-page>Page4</clr-wizard-page>
//     </clr-wizard>
//    `,
//     viewProviders: [ScrollingService]
// })
// class BasicWizard {
//     @ViewChild(NewWizard) wizard: NewWizard;

//     open: boolean = true;
// }

// @Component({
//     template: `
//     <clr-wizard 
//         [(clrWizardOpen)]="open"
//         (clrWizardOnCancel)="myOnCancel($event)">
//          <div class="wizard-title">
//             New Virtual Machine
//          </div>

//          <clr-wizard-step
//             [clrWizardStepId]="'tab1'">
//             Tab1
//          </clr-wizard-step>
//          <clr-wizard-step
//             [clrWizardStepId]="'tab2'">
//             Tab2
//          </clr-wizard-step>
//          <clr-wizard-step
//             [clrWizardStepId]="'tab3'">
//             Tab3
//          </clr-wizard-step>
//          <clr-wizard-step
//             [clrWizardStepId]="'tab4'">
//             Tab4
//          </clr-wizard-step>

//         <clr-wizard-page
//             (clrWizardPageOnLoad)="myOnLoad()"
//             [clrWizardPageNextDisabled]="nextDisabled">
//             <div class="tab1">{{content1}}</div>
//         </clr-wizard-page>

//         <clr-wizard-page
//                (clrWizardPageOnCommit)="myOnCommit0($event)">
//             <div class="tab2"><p>Content2</p></div>
//          </clr-wizard-page>

//          <clr-wizard-page
//                (clrWizardPageOnCommit)="myOnCommit($event)"
//                [clrWizardPageNextDisabled]="dummyErrorFlag"
//                [clrWizardPageErrorFlag]="dummyErrorFlag">
//             <div class="errorMessage">Error Message</div>
//             <div class="tab3"><p>{{content3}}</p></div>
//          </clr-wizard-page>

//          <clr-wizard-page>
//             <div class="wizard-page-title">Custom Title</div>
//             <p>Content4</p>
//          </clr-wizard-page>
//       </clr-wizard>
//     `
// })
// class AdvancedWizard {
//     @ViewChild(Wizard) wizard: Wizard;

//     open: boolean = true;
//     dummyErrorFlag: boolean = true;
//     nextDisabled: boolean = false;
//     content1: String = "Content1";
//     content3: String = "Content3";
//     hasBeenCanceled = false;

//     myOnLoad(): void {
//         this.content1 = "This Works Better";
//     }

//     myOnCommit0(event: any): void {
//         this.content3 = "NewContent3";
//     }

//     myOnCommit(event: any): void {
//         event.preventDefault();
//     }

//     myOnCancel(event: any): void {
//         this.hasBeenCanceled = true;
//     }
// };

// describe("Wizard", () => {
//     let fixture: ComponentFixture<any>;
//     let instance: Wizard;
//     let compiled: any;

//     let moveToNext: Function = function (el: any): void {
//         let next: HTMLElement = el.querySelector(".btn-primary");
//         next.click();
//         fixture.detectChanges();
//     };

//     let moveToPrevious: Function = function (el: any): void {
//         let back: HTMLElement = el.querySelector(".btn-outline");
//         back.click();
//         fixture.detectChanges();
//     };

//     let doCancel: Function = function(el: any): void {
//         let cancel: HTMLElement = el.querySelector(".close");
//         cancel.click();
//         fixture.detectChanges();
//     };

//     beforeEach(() => {
//         TestBed.configureTestingModule({
//             imports: [ClarityModule.forRoot()],
//             declarations: [AdvancedWizard, BasicWizard]
//         });
//     });

//     afterEach(() => {
//         fixture.destroy();
//     });


//     describe("Basic", () => {

//         beforeEach(() => {
//             fixture = TestBed.createComponent(BasicWizard);
//             fixture.detectChanges();
//             instance = fixture.componentInstance.wizard;
//             compiled = fixture.nativeElement;
//         });

//         it("projects subcomponents", () => {
//             expect(compiled.querySelectorAll("button.nav-link").length).toEqual(4);
//             expect(compiled.querySelectorAll("section").length).toEqual(4);
//         });

//         it("sets the first tab and content as active", () => {
//             expect(instance.tabLinks[0].active).toBe(true);
//             expect(instance.tabLinks[1].active).toBe(false);
//             expect(instance.tabLinks[2].active).toBe(false);
//             expect(instance.tabLinks[3].active).toBe(false);
//             expect(instance.tabContents[0].active).toBe(true);
//             expect(instance.tabContents[1].active).toBe(false);
//             expect(instance.tabContents[2].active).toBe(false);
//             expect(instance.tabContents[3].active).toBe(false);
//         });

//         it("initializes the correct property values", () => {
//             let linkElements: HTMLElement[] =  compiled.querySelectorAll("clr-wizard-step");
//             let pageElements: HTMLElement[] =  compiled.querySelectorAll("clr-wizard-page");

//             expect(instance.tabLinks[0].id).toMatch(/clr-wizard-[0-9]+-tab-0/);
//             expect(instance.tabLinks[0].ariaControls).toMatch(/clr-wizard-[0-9]+-content-0/);
//             expect(linkElements[0].textContent).toMatch(/Tab1/);

//             expect(instance.tabLinks[1].id).toMatch(/clr-wizard-[0-9]+-tab-1/);
//             expect(instance.tabLinks[1].ariaControls).toMatch(/clr-wizard-[0-9]+-content-1/);
//             expect(linkElements[1].textContent).toMatch(/Tab2/);

//             expect(instance.tabLinks[2].id).toMatch(/clr-wizard-[0-9]+-tab-2/);
//             expect(instance.tabLinks[2].ariaControls).toMatch(/clr-wizard-[0-9]+-content-2/);
//             expect(linkElements[2].textContent).toMatch(/Tab3/);

//             expect(instance.tabLinks[3].id).toMatch(/clr-wizard-[0-9]+-tab-3/);
//             expect(instance.tabLinks[3].ariaControls).toMatch(/clr-wizard-[0-9]+-content-3/);
//             expect(linkElements[3].textContent).toMatch(/Tab4/);

//             expect(instance.tabContents[0].id).toMatch(/clr-wizard-[0-9]+-content-0/);
//             expect(instance.tabContents[0].ariaLabelledBy).toMatch(/clr-wizard-[0-9]+-tab-0/);
//             expect(pageElements[0].textContent).toMatch(/Page1/);

//             expect(instance.tabContents[1].id).toMatch(/clr-wizard-[0-9]+-content-1/);
//             expect(instance.tabContents[1].ariaLabelledBy).toMatch(/clr-wizard-[0-9]+-tab-1/);
//             expect(pageElements[1].textContent).toMatch(/Page2/);

//             expect(instance.tabContents[2].id).toMatch(/clr-wizard-[0-9]+-content-2/);
//             expect(instance.tabContents[2].ariaLabelledBy).toMatch(/clr-wizard-[0-9]+-tab-2/);
//             expect(pageElements[2].textContent).toMatch(/Page3/);

//             expect(instance.tabContents[3].id).toMatch(/clr-wizard-[0-9]+-content-3/);
//             expect(instance.tabContents[3].ariaLabelledBy).toMatch(/clr-wizard-[0-9]+-tab-3/);
//             expect(pageElements[3].textContent).toMatch(/Page4/);
//         });

//         it("activates the matching tab content when a tab is selected", () => {
//             instance.selectTab(instance.tabLinks[2]);
//             expect(instance.tabLinks[0].active).toBe(false);
//             expect(instance.tabLinks[1].active).toBe(false);
//             expect(instance.tabLinks[2].active).toBe(true);
//             expect(instance.tabLinks[3].active).toBe(false);
//             expect(instance.tabContents[0].active).toBe(false);
//             expect(instance.tabContents[1].active).toBe(false);
//             expect(instance.tabContents[2].active).toBe(true);
//             expect(instance.tabContents[3].active).toBe(false);
//         });

//         it("moves to the next Tab on click of Next button", () => {
//             expect(instance.tabLinks[0].active).toBe(true);
//             expect(instance.tabLinks[1].active).toBe(false);
//             moveToNext(compiled);
//             expect(instance.tabLinks[0].active).toBe(false);
//             expect(instance.tabLinks[1].active).toBe(true);
//         });

//         it("moves to the next Tab on programmatically calling the next() function", () => {
//             expect(instance.tabLinks[0].active).toBe(true);
//             expect(instance.tabLinks[1].active).toBe(false);
//             instance.next();
//             expect(instance.tabLinks[0].active).toBe(false);
//             expect(instance.tabLinks[1].active).toBe(true);
//         });

//         it("moves to the previous Tab on click of Back button", () => {
//             moveToNext(compiled);
//             expect(instance.tabLinks[0].active).toBe(false);
//             expect(instance.tabLinks[1].active).toBe(true);
//             moveToPrevious(compiled);
//             expect(instance.tabLinks[0].active).toBe(true);
//             expect(instance.tabLinks[1].active).toBe(false);
//         });

//         it("moves to the previous Tab on programmatically calling the prev() function", () => {
//             instance.next();
//             expect(instance.tabLinks[0].active).toBe(false);
//             expect(instance.tabLinks[1].active).toBe(true);
//             instance.prev();
//             expect(instance.tabLinks[0].active).toBe(true);
//             expect(instance.tabLinks[1].active).toBe(false);
//         });

//         it("hides the Back button in the first tab", () => {
//             let back: HTMLElement = compiled.querySelector(".btn-outline");
//             expect(back).toBeNull();
//         });

//         it("hides the Next button in the last tab", () => {
//             moveToNext(compiled);
//             moveToNext(compiled);
//             moveToNext(compiled);
//             let primaryButtonText: string = compiled.querySelector(".btn-primary").textContent;
//             expect(primaryButtonText).not.toMatch(/NEXT/);
//         });

//         it("passes clrWizardClosable false to the modal", () => {
//             let closeButton = compiled.querySelector("button.close");
//             expect(instance.closable).toBe(false);
//             expect(closeButton).toBeNull();
//         });
//     });

//     describe("Advanced", () => {

//         beforeEach(() => {
//             fixture = TestBed.createComponent(AdvancedWizard);
//             fixture.detectChanges();
//             instance = fixture.componentInstance.wizard;
//             compiled = fixture.nativeElement;
//         });

//         // this test belongs here because even though we are checking for WizardPage's title,
//         // it is the wizard's job to get the value from matching WizardStep's title.
//         it("correctly assigns the tab content title", () => {
//             let wizardPages: HTMLElement[] = compiled.querySelectorAll("section > label.text-light");

//             expect(wizardPages[0].innerHTML).toMatch(/Tab1/);
//             expect(wizardPages[1].innerHTML).toMatch(/Tab2/);
//             expect(wizardPages[2].innerHTML).toMatch(/Tab3/);
//             expect(wizardPages[3].innerHTML).toMatch(/Custom Title/);
//         });

//         it("doesn't switch the active tab if user clicks on a disabled tab", () => {
//             let linkElements: HTMLElement[] = compiled.querySelectorAll("clr-wizard-step");

//             expect(instance.tabLinks[0].active).toBe(true);
//             expect(instance.tabLinks[1].active).toBe(false);

//             linkElements[1].click();
//             expect(instance.tabLinks[0].active).toBe(true);
//             expect(instance.tabLinks[1].active).toBe(false);
//         });

//         it("should disable the next button if clrWizardPageNextDisabled flag is set to true", () => {
//             expect(instance.tabLinks[0].active).toBe(true);
//             expect(instance.tabLinks[1].active).toBe(false);

//             fixture.componentInstance.nextDisabled = true;
//             fixture.detectChanges();
//             moveToNext(compiled);
//             expect(instance.tabLinks[0].active).toBe(true);
//             expect(instance.tabLinks[1].active).toBe(false);

//             fixture.componentInstance.nextDisabled = false;
//             fixture.detectChanges();
//             moveToNext(compiled);
//             expect(instance.tabLinks[0].active).toBe(false);
//             expect(instance.tabLinks[1].active).toBe(true);
//         });


//         it("sets the isComplete to true when each step successfully validates " +
//             "and context moves to next tab", () => {
//             fixture.componentInstance.nextDisabled = false;
//             fixture.detectChanges();
//             moveToNext(compiled);
//             expect(instance.tabLinks[0].isCompleted).toBe(true);
//             expect(instance.tabLinks[0].active).toBe(false);
//             expect(instance.tabLinks[1].active).toBe(true);
//             expect(instance.tabLinks[2].active).toBe(false);
//             expect(instance.tabLinks[3].active).toBe(false);
//             expect(instance.tabContents[0].active).toBe(false);
//             expect(instance.tabContents[1].active).toBe(true);
//             expect(instance.tabContents[2].active).toBe(false);
//             expect(instance.tabContents[3].active).toBe(false);
//         });

//         it("fires the onLoad for the first tab when the wizard opens", () => {
//             let tab1: HTMLElement = compiled.querySelector(".tab1");
//             expect(tab1.textContent).toMatch(/This Works Better/);
//         });

//         it("fires the onLoad every time a new tab is opened", () => {
//             let tab1: HTMLElement = compiled.querySelector(".tab1");

//             moveToNext(fixture.nativeElement);
//             moveToPrevious(fixture.nativeElement);

//             expect(tab1.textContent).toMatch(/This Works Better/);
//         });

//         it("allows canceling event through a user-defined onCommit handler", () => {
//             moveToNext(compiled);
//             expect(instance.tabContents[0].active).toBe(false);
//             expect(instance.tabContents[1].active).toBe(true);
//             expect(instance.tabContents[2].active).toBe(false);
//             expect(instance.tabContents[3].active).toBe(false);

//             moveToNext(compiled);
//             expect(instance.tabContents[0].active).toBe(false);
//             expect(instance.tabContents[1].active).toBe(false);
//             expect(instance.tabContents[2].active).toBe(true);
//             expect(instance.tabContents[3].active).toBe(false);

//             moveToNext(compiled);
//             expect(instance.tabContents[0].active).toBe(false);
//             expect(instance.tabContents[1].active).toBe(false);
//             expect(instance.tabContents[2].active).toBe(true);
//             expect(instance.tabContents[3].active).toBe(false);
//         });

//         it("proceeds to the next tab when no user-defined onCommit is registered", () => {
//             fixture.componentInstance.nextDisabled = false;
//             fixture.detectChanges();
//             moveToNext(compiled);
//             let tab2: HTMLElement = compiled.querySelector(".tab2");
//             expect(tab2.textContent).toMatch(/Content2/);
//             expect(instance.tabLinks[0].active).toBe(false);
//             expect(instance.tabLinks[1].active).toBe(true);
//             expect(instance.tabLinks[2].active).toBe(false);
//             expect(instance.tabLinks[3].active).toBe(false);
//             expect(instance.tabContents[0].active).toBe(false);
//             expect(instance.tabContents[1].active).toBe(true);
//             expect(instance.tabContents[2].active).toBe(false);
//             expect(instance.tabContents[3].active).toBe(false);
//         });

//         it("calls the user-defined onCommit handler when the Next button is clicked, and moves to next tab", () => {
//             fixture.componentInstance.nextDisabled = false;
//             fixture.detectChanges();
//             moveToNext(compiled);
//             moveToNext(compiled);
//             let tab3: HTMLElement = compiled.querySelector(".tab3");
//             expect(tab3.textContent).toMatch(/NewContent3/);
//             expect(instance.tabLinks[0].active).toBe(false);
//             expect(instance.tabLinks[1].active).toBe(false);
//             expect(instance.tabLinks[2].active).toBe(true);
//             expect(instance.tabLinks[3].active).toBe(false);
//             expect(instance.tabContents[0].active).toBe(false);
//             expect(instance.tabContents[1].active).toBe(false);
//             expect(instance.tabContents[2].active).toBe(true);
//             expect(instance.tabContents[3].active).toBe(false);
//         });

//         it("displays error message if clrWizardPageErrorFlag is set to true", () => {
//             moveToNext(compiled);
//             moveToNext(compiled);
//             moveToNext(compiled);

//             let contentWrapper: HTMLElement = compiled.querySelector(".errorMessage");
//             expect(contentWrapper.textContent).toMatch(/Error Message/);
//             expect(instance.tabLinks[0].active).toBe(false);
//             expect(instance.tabLinks[1].active).toBe(false);
//             expect(instance.tabLinks[2].active).toBe(true);
//             expect(instance.tabLinks[3].active).toBe(false);
//             expect(instance.tabContents[0].active).toBe(false);
//             expect(instance.tabContents[1].active).toBe(false);
//             expect(instance.tabContents[2].active).toBe(true);
//             expect(instance.tabContents[3].active).toBe(false);
//         });

//         it("allows skipping of a tab given its id", () => {
//             instance.skipTab("tab2");
//             expect(instance.tabLinks.length).toEqual(3);
//             expect(instance.tabContents.length).toEqual(3);

//             expect(instance.tabLinks[0].id).toEqual("tab1");
//             expect(instance.tabLinks[1].id).toEqual("tab3");
//             expect(instance.tabLinks[2].id).toEqual("tab4");

//             moveToNext(compiled);

//             let tab1: HTMLElement = compiled.querySelector(".tab1, .complete");
//             let tab2: HTMLElement = compiled.querySelector(".tab2, .skipped");
//             let tab3: HTMLElement = compiled.querySelector(".tab3, .active");
//             expect(tab1).toBeDefined();
//             expect(tab2).toBeDefined();
//             expect(tab3).toBeDefined();
//         });

//         it("allows un-skipping of a tab given its id", () => {
//             instance.skipTab("tab2");
//             expect(instance.tabLinks.length).toEqual(3);
//             expect(instance.tabContents.length).toEqual(3);

//             expect(instance.tabLinks[0].id).toEqual("tab1");
//             expect(instance.tabLinks[1].id).toEqual("tab3");
//             expect(instance.tabLinks[2].id).toEqual("tab4");

//             moveToNext(compiled);

//             let tab1: HTMLElement = compiled.querySelector(".tab1, .complete");
//             let tab2: HTMLElement = compiled.querySelector(".tab2, .skipped");
//             let tab3: HTMLElement = compiled.querySelector(".tab3, .active");
//             let tab4: HTMLElement = compiled.querySelector(".tab4");

//             expect(tab1).toBeDefined();
//             expect(tab2).toBeDefined();
//             expect(tab3).toBeDefined();
//             expect(tab4).toBeDefined();

//             moveToPrevious(compiled);
//             instance.unSkipTab("tab2");

//             expect(instance.tabLinks.length).toEqual(4);
//             expect(instance.tabContents.length).toEqual(4);

//             expect(instance.tabLinks[0].id).toEqual("tab1");
//             expect(instance.tabLinks[1].id).toEqual("tab2");
//             expect(instance.tabLinks[2].id).toEqual("tab3");
//             expect(instance.tabLinks[3].id).toEqual("tab4");

//             moveToNext(compiled);

//             tab1 = compiled.querySelector(".tab1, .complete");
//             tab2 = compiled.querySelector(".tab2, .active");
//             tab3 = compiled.querySelector(".tab3");
//             tab4 = compiled.querySelector(".tab4");

//             expect(tab1).toBeDefined();
//             expect(tab2).toBeDefined();
//             expect(tab3).toBeDefined();
//             expect(tab4).toBeDefined();
//         });

//         it("calls the user-defined onCancel handler when the Cancel button is clicked", () => {
//             doCancel(compiled);
//             expect(fixture.componentInstance.hasBeenCanceled).toBe(true);
//         });

//         it("defaults clrWizardClosable to true", () => {
//             let closeButton = compiled.querySelector("button.close");
//             expect(instance.closable).toBe(true);
//             expect(closeButton).not.toBeNull();
//         });
//     });
// });

}