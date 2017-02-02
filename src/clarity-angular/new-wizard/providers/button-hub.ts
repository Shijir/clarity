import {
    Output,
    Injectable
} from "@angular/core";

import { 
    Subject, 
    Observable
} from "rxjs";

@Injectable()
export class ButtonHubService {
    // create Observables for when list of pages changes

    // TODO: CAPTURES BUTTON EVENTS AND DISTRIBUTES THEM TO WHERE THEY NEED TO GO
    // OFFERS A SINGLE POINT OF ENTRY, DIFFERENTIATED BY TYPE OF BUTTON
    // WITH MULTIPLE EXIT POINTS, DIRECTED BY TYPE OF BUTTON

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







    // inside of buttonClicked(): void {
    //     this._previousBtnClicked.next();
    // }




        // TODO: MOVE BTN CLICK EVENTS TO BUTTONHUB
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


}