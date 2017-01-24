import {
    EventEmitter,
    Injectable,
    TemplateRef,
    Output
} from "@angular/core";
// import {Subject, Observable} from "rxjs";
import {NewWizardPage} from "../wizard-page";

@Injectable()
export class WizardNavigationService {
    @Output("clrWiznavCurrentPageUpdated") currentPageUpdated: EventEmitter<any> =
        new EventEmitter<any>(false);

    @Output("clrWiznavPageAdded") pageAdded: EventEmitter<any> =
        new EventEmitter<any>(false);

    public pages: NewWizardPage[] = [];

    public currentPage: NewWizardPage;

    get currentPageTitle(): TemplateRef<any> {
        return this.currentPage.title;
    }

    public add(page: NewWizardPage): void {
        this.pages.push(page);
        this.pageAdded.emit(this);

        if (!this.currentPage && !page.hidden) {
            this.updateCurrent(page);
        }
    }

    public updateCurrent(page: NewWizardPage) {
        this.currentPage = page;
        this.currentPageUpdated.emit(this);
    }

    // selectable: boolean = false;

    // Boolean not necessary. Just emitting any value will indicate that a change has occurred
    // private _change: Subject<boolean> = new Subject<boolean>();

    // public get change(): Observable<boolean> {
    //     return this._change.asObservable();
    // };

    // notify(): void {
    //     this._change.next(true);
    // }

    // verifyTreeSelection(selection: TreeSelection): void {
    //     if (!selection.hasOwnProperty("selected")) {
    //         throw "clrTreeSelection should have the selected property";
    //     }

    //     //Check if the "children" property exists and is of type array
    //     if (selection.hasOwnProperty("children")) {
    //         if (Object.prototype.toString.call(selection.children) !== "[object Array]") {
    //             throw "clrTreeSelection should be of type array, received typeof"; //TODO
    //         }
    //         selection.children.forEach(child => this.verifyTreeSelection(child));
    //     }
    // }
}