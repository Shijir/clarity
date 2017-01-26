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

    private _id: string;
    public get id(): string {
        return this._id;
    }
    public set id(value: string) {
        // if already defined we want to early return; ghetto private;
        // SPECME
        if (this._id) {
            return;
        }
        this._id = value;
    }

    public get currentPageTitle(): TemplateRef<any> {
        return this.currentPage.title;
    }

    public add(page: NewWizardPage): void {
        this.pages.push(page);
        this.pageAdded.emit(this);

        // TELLME: do we need .hidden?!
        if (!this.currentPage && !page.hidden) {
            this.updateCurrent(page);
        }
    }

    public updateCurrent(page: NewWizardPage): void {
        this.currentPage = page;
        this.currentPageUpdated.emit(this);
    }
}