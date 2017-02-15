import { ButtonHubService } from "./button-hub";


describe("Button Hub Provider", () => {

    let buttonHubService = new ButtonHubService();
    let isPreviousBtnClicked: boolean;
    let isNextBtnClicked: boolean;
    let isCancelBtnClicked: boolean;
    let isDangerBtnClicked: boolean;
    let isFinishBtnClicked: boolean;
    let isCustomBtnClicked: boolean;

    let resetButtonStates = () => {
        isPreviousBtnClicked = false;
        isNextBtnClicked = false;
        isCancelBtnClicked = false;
        isDangerBtnClicked = false;
        isFinishBtnClicked = false;
        isCustomBtnClicked = false;
    };

    describe("Previous Button", () => {

        beforeEach((done) => {

            resetButtonStates();

            buttonHubService.previousBtnClicked.subscribe(() => {
                isPreviousBtnClicked = true;
                done();
            });

            buttonHubService.buttonClicked("previous");
        });

        it("should call the PreviousBtnClicked handler", () => {

            expect(isPreviousBtnClicked).toBe(true);

        });

    });

    describe("Next Button", () => {

        beforeEach((done) => {

            resetButtonStates();

            buttonHubService.nextBtnClicked.subscribe(() => {
                isNextBtnClicked = true;
                done();
            });

            buttonHubService.buttonClicked("next");
        });

        it("should call the NextBtnClicked handler", () => {

            expect(isNextBtnClicked).toBe(true);

        });

    });

    describe("Danger Button", () => {

        beforeEach((done) => {

            resetButtonStates();

            buttonHubService.dangerBtnClicked.subscribe(() => {
                isDangerBtnClicked = true;
                done();
            });

            buttonHubService.buttonClicked("danger");
        });

        it("should call the DangerBtnClicked handler", () => {

            expect(isDangerBtnClicked).toBe(true);

        });

    });

    describe("Cancel Button", () => {

        beforeEach((done) => {

            resetButtonStates();

            buttonHubService.cancelBtnClicked.subscribe(() => {
                isCancelBtnClicked = true;
                done();
            });

            buttonHubService.buttonClicked("cancel");
        });

        it("should call the CancelBtnClicked handler", () => {

            expect(isCancelBtnClicked).toBe(true);

        });

    });

    describe("Finish Button", () => {

        beforeEach((done) => {

            resetButtonStates();

            buttonHubService.finishBtnClicked.subscribe(() => {
                isFinishBtnClicked = true;
                done();
            });

            buttonHubService.buttonClicked("finish");
        });

        it("should call the FinishBtnClicked handler", () => {

            expect(isFinishBtnClicked).toBe(true);

        });

    });

    describe("Custom Button", () => {

        beforeEach((done) => {

            resetButtonStates();

            buttonHubService.customBtnClicked.subscribe(() => {
                isCustomBtnClicked = true;
                done();
            });

            buttonHubService.buttonClicked("random");
        });

        it("should call the CustomBtnClicked handler", () => {

            expect(isCustomBtnClicked).toBe(true);

        });

    });

});