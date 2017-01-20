import {Injectable} from "@angular/core";
// import {Subject, Observable} from "rxjs";

@Injectable()
export class Pages {
    // constructor() {}

    // TODIE: nope, it ain't going to work like that...
    private _all: any[] = [];

    // TODIE: nope, it ain't going to work like that...
    public add(page: any): void {
        this._all.push(page);
        // need to notify that a page was added
    }

    // TODIE: nope, it ain't going to work like that...
    public list(onlyVisible: boolean = true): any[] {
        if (onlyVisible) {
            // return this._all.filter("by only visible attr prolly !hidden tbh");
            return this._all;
        }
        return this._all;
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