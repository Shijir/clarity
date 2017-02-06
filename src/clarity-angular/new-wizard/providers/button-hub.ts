import {
    // Output,
    Injectable
} from "@angular/core";

import {
    Subject,
    Observable
} from "rxjs";

@Injectable()
export class ButtonHubService {
    // create Observables for when list of pages changes

    private _previousBtnClicked = new Subject<any>();
    public get previousBtnClicked(): Observable<any> {
        return this._previousBtnClicked.asObservable();
    }

    private _nextBtnClicked = new Subject<any>();
    public get nextBtnClicked(): Observable<any> {
        return this._nextBtnClicked.asObservable();
    }

    private _dangerBtnClicked = new Subject<any>();
    public get dangerBtnClicked(): Observable<any> {
        return this._dangerBtnClicked.asObservable();
    }

    private _cancelBtnClicked = new Subject<any>();
    public get cancelBtnClicked(): Observable<any> {
        return this._cancelBtnClicked.asObservable();
    }

    private _finishBtnClicked = new Subject<any>();
    public get finishBtnClicked(): Observable<any> {
        return this._finishBtnClicked.asObservable();
    }

    private _customBtnClicked = new Subject<any>();
    public get customBtnClicked(): Observable<any> {
        return this._customBtnClicked.asObservable();
    }

    public buttonClicked(buttonType: string): void {
        if ("previous" === buttonType) {
            this._previousBtnClicked.next();
        } else if ("next" === buttonType) {
            this._nextBtnClicked.next();
        } else if ("finish" === buttonType) {
            this._finishBtnClicked.next();
        } else if ("danger" === buttonType) {
            this._dangerBtnClicked.next();
        } else if ("cancel" === buttonType) {
            this._cancelBtnClicked.next();
        } else {
            this._customBtnClicked.next(buttonType);
        }

        // TOARCH:
        // Button is clicked and tells button ButtonHubService
        // ButtonHubService broadcasts what type of button was clicked

        // Sometimes (prev, next, danger) WizardNavService is listening and 
        // asks the page if it's ok to move then does the move and 
        // tells the wizard that it did the move

        // Sometimes the WizardNavService is listening (custom) and tells 
        // the page. the page does 
        // something to check or whatever and then oks the navigation

        // Sometimes WizardNav is listening(?) then tells wizard 
        // to do something but wizard checks if it can before it does
        // (finish, cancel)

        // TODO!!!!!!!!
        // NAVSERVICE NEEDS TO LISTEN TO BUTTONHUB 
        // TO DO THIS WORK? MAYBE NOT ALL OF IT...
        // WIZARD MIGHT DO IT INSTEAD...
        // if (this.isCancel) {
        //     navService.cancelWizard();
        // }

        // if (this.isPrevious) {
        //     navService.previous();
        // }

        // if (this.isPrimaryAction) {
        //     navService.next();
        // }

        // TODO: MOVE BTN CLICK EVENTS TO BUTTONHUB
        // MAKE PAGE LISTEN FOR CLICK EVENTS
        // let page: NewWizardPage = this.currentPage;
        // if ("danger" === buttonType) {
        //     page.dangerButtonClicked.emit(page);
        // } else if ("finish" === buttonType) {
        //     page.finishButtonClicked.emit(page);
        // } else {
        //     // goNextPage falls back to the "next" button
        //     page.nextButtonClicked.emit(page);
        // }

        // TODO: MOVE BTN CLICK EVENTS TO BUTTONHUB
        // let page: NewWizardPage = this.currentPage;
        // page.previousButtonClicked.emit(page);

        // !!! TODO: CANCEL OVERRIDE
        // MAKE INPUT ON WIZARD THAT FORCES A CHECK BEFORE ALLOWING A 
        // CANCEL. ALSO ADD AN INPUT TO THE WIZARD PAGE THAT DOES THE 
        // SAME THING. WIZARD WILL ASK IF CURRENT PAGE IS GOOD TO GO
        // THEN ASK ITSELF IF IT IS GOOD TO GO. THEN DO A CANCEL.
    }
}