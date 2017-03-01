import {
    Injectable,
    QueryList
} from "@angular/core";

import {
    Subject,
    Observable
} from "rxjs";

import { NewWizardPage } from "../wizard-page";

@Injectable()
export class PageCollectionService {
// TODO: create Observables for when list of pages changes?

    public pages: QueryList<NewWizardPage>;

    public get pagesAsArray(): NewWizardPage[] {
        return this.pages ? this.pages.toArray() : [];
        // SPECME
    }

    public get pagesCount(): number {
        return this.pagesAsArray.length;
        // SPECME
    }

    public get penultimatePage(): NewWizardPage {
        let pageCount = this.pagesCount;

        if (pageCount < 2) {
            return;
        }
        // SPECME

        return this.pagesAsArray[pageCount - 2];
        // SPECME
    }

    public get lastPage(): NewWizardPage {
        let pageCount = this.pagesCount;

        if (pageCount < 1) {
            return;
        }
        // SPECME

        return this.pagesAsArray[pageCount - 1];
        // SPECME
    }

    public get firstPage(): NewWizardPage {
        if (!this.pagesCount) {
            return;
        }
        // SPECME

        return this.pagesAsArray[0];
        // SPECME
    }

    public getPageById(id: string): NewWizardPage {
        let foundPages: NewWizardPage[] = this.pages.filter((page: NewWizardPage) => id === page.id);
        return this.checkResults(foundPages, id);
        // SPECME
    }

    public getPageByIndex(index: number): NewWizardPage {
        let pageArray: NewWizardPage[] = this.pagesAsArray;
        let pageArrayLastIndex: number = (pageArray && pageArray.length > 1) ? pageArray.length - 1 : 0;

        if (index < 0) {
            throw new Error("Cannot retrieve page with index of " + index);
        }
        // SPECME

        if (index > pageArrayLastIndex) {
            throw new Error("Page index is greater than length of pages array.");
        }
        // SPECME

        return this.pagesAsArray[index];
        // SPECME
    }

    public getPageIndex(page: NewWizardPage): number {
        let index = this.pagesAsArray.indexOf(page);

        if (index < 0) {
            throw new Error("Requested page cannot be found in collection of pages.");
        }
        // SPECME

        return index;
        // SPECME
    }

    private checkResults(results: NewWizardPage[], requestedPageId: string) {
        let foundPagesCount: number = results.length || 0;

        if (foundPagesCount > 1) {
            throw new Error("More than one page has the requested id " + requestedPageId + ".");
        } else if (foundPagesCount < 1) {
            throw new Error("No page can be found with the id " + requestedPageId + ".");
        } else {
            return results[0];
        }
        // SPECME
    }

    public pageRange(start: number, end: number): NewWizardPage[] {
        let pages: NewWizardPage[] = [];

        // make sure to test that this catches negative numbers
        if (!start) {
            return [];
        }
        // SPECME

        pages = this.pagesAsArray;

        if (!end) {
            end = pages.length;
        }
        // SPECME

        if (start === end) {
            // just return the one page they want
            pages.push(this.getPageByIndex(start));
            return pages;
        }
        // SPECME

        // slice end does not include item referenced by end index, which is weird for users
        // incrementing end index here to correct that so users and other methods
        // don't have to think about it
        end = end + 1;
        // SPECME

        // slice does not return the last one in the range but it does include the first one
        // does not modify original array
        return pages.slice(start, end);
        // SPECME
    }

    public getPageRangeFromPages(page: NewWizardPage, otherPage: NewWizardPage): NewWizardPage[] {
        let pageIndex = this.getPageIndex(page);
        let otherPageIndex = this.getPageIndex(otherPage);
        let startIndex: number;
        let endIndex: number;

        if (pageIndex <= otherPageIndex) {
            startIndex = pageIndex;
            endIndex = otherPageIndex;
        } else {
            startIndex = otherPageIndex;
            endIndex = pageIndex;
        }
        // SPECME

        return this.pageRange(startIndex, endIndex);
    }

    public getPreviousPage(page: NewWizardPage) {
        let myPageIndex = this.getPageIndex(page);
        let previousPageIndex = myPageIndex - 1;

        if (previousPageIndex < 0) {
            return null;
        }
        // SPECME

        return this.getPageByIndex(previousPageIndex);
    }

    public getNextPage(page: NewWizardPage) {
        let myPageIndex = this.getPageIndex(page);
        let nextPageIndex = myPageIndex + 1;

        if (nextPageIndex >= this.pagesAsArray.length) {
            return null;
        }
        // SPECME

        return this.getPageByIndex(nextPageIndex);
    }

    public getStepItemIdForPage(page: NewWizardPage) {
        let pageId = page.id;
        let pageIdParts = pageId.split("-").reverse();
        // SPECME^ (especially with userdefined page ids with dashes in them)

        pageIdParts[1] = "step";
        return pageIdParts.reverse().join("-");
    }

    public commitPage(page: NewWizardPage) {
        page.primaryButtonClicked.emit();
        page.completed = true;
        page.onCommit.emit();
    }

    // used by the navService to navigate back to first possible step after 
    // pages are reset
    private _pagesReset = new Subject<boolean>();
    public get pagesReset(): Observable<boolean> {
        return this._pagesReset.asObservable();
    }

    public reset() {
        this.pagesAsArray.forEach((page: NewWizardPage) => {
            page.completed = false;
        });
    }
}