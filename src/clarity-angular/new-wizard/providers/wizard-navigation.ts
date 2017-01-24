import {
    Injectable,
    TemplateRef
} from "@angular/core";
// import {Subject, Observable} from "rxjs";
import {NewWizardPage} from "../wizard-page";

@Injectable()
export class WizardNavigationService {
    // constructor() {}

    // TODIE: nope, it ain't going to work like that...
    public pages: NewWizardPage[] = [];

    public count: number = 0;

    public currentPage: NewWizardPage;

    public currentPageTitle: TemplateRef<any>;

    // TODIE: nope, it ain't going to work like that...
    public add(page: NewWizardPage): void {
        this.pages.push(page);

        // TODO: need to notify that a page was added
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