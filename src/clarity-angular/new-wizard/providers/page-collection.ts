import {
    Injectable,
    QueryList
} from "@angular/core";
// import { Subject, Observable } from "rxjs";
import { NewWizardPage } from "../wizard-page";

@Injectable()
export class PageCollectionService {
    // TODO: create Observables for when list of pages changes?

    public pages: QueryList<NewWizardPage>;

    // TODO: ANYTHING RELATED TO ALL PAGES BUT NOT NAVIGATION METHODS GOES HERE

    public get pagesAsArray(): NewWizardPage[] {
        return this.pages ? this.pages.toArray() : [];
        // SPECME
    }

    public get pagesCount(): number {
        return this.pagesAsArray.length;
        // SPECME
    }

    public get lastPage(): NewWizardPage {
        let pageCount = this.pagesCount;

        if (pageCount > 0) {
            return this.pagesAsArray[pageCount - 1];
        }

        // TOASK: what to do if no pages?
        return;
        // SPECME
    }

    public get firstPage(): NewWizardPage {
        if (this.pagesCount) {
            return this.pagesAsArray[0];
        }

        // TOASK: what to do if no pages?
        return;
        // SPECME
    }

    public getPage(pageOrId: any): NewWizardPage {
        let page: NewWizardPage;

        if (typeof pageOrId === "string") {
            // assume string is an id
            page = this.getPageById(pageOrId);

        } else {
            page = this.getPageByObject(pageOrId);
        }

        if (!page) {
            // THROW ERROR?
            return null;
        }

        return page;
    }

    public getPageById(id: string): NewWizardPage {
        let foundPages: NewWizardPage[] = this.pages.filter((page: NewWizardPage) => id === page.id);
        return this.checkResults(foundPages);
    }

    public getPageByObject(page: NewWizardPage): NewWizardPage {
        let foundPages: NewWizardPage[] = this.pages.filter((item: NewWizardPage) => page === item);
        return this.checkResults(foundPages);
    }

    public getPageByIndex(index: number): NewWizardPage {
        let pageArray: NewWizardPage[] = this.pagesAsArray;
        let pageArrayLastIndex: number = (pageArray && pageArray.length > 1) ? pageArray.length - 1 : 0;

        if (index < 0 || index > pageArrayLastIndex) {
            // TOASK: PAGE NOT FOUND... THROW ERROR? JUST IGNORE IT?
            return null;
        }

        return this.pagesAsArray[index];
    }

    public getPageIndex(page: NewWizardPage): number {
        let index = this.pagesAsArray.indexOf(page);

        if (index < 0) {
            // PAGE NOT FOUND; ERROR?
            return null;
        }

        return index;
    }

    private checkResults(results: NewWizardPage[]) {
        let foundPagesCount: number = results.length || 0;

        if (foundPagesCount > 1) {
            // TOASK: TOO MANY FOUND PAGES!!! THROW ERROR?
            return null;
        } else if (foundPagesCount < 1) {
            // TOASK: PAGE NOT FOUND... THROW ERROR? JUST IGNORE IT?
            return null;
        } else {
            return results[0];
        }
    }

    public pageRange(start: number, end: number): NewWizardPage[] {
        let pages: NewWizardPage[] = [];

        // TODO: slice behaves weirdly if start is a negative number
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
        // incrementing end index here to correct for that so users and other methods
        // don't have to think about it
        end = end + 1;
        // SPECME

        // slice does not return the last one in the range but it does include the first one
        // does not modify original array
        return pages.slice(start, end);
        // SPECME
    }

    // TODO: MOVE TO PAGESERVICE
    // TAKES TWO PAGES, RETURNS THE PAGES BETWEEN THEM; OPTIONALLY INCLUDES PAGES ON THE END

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
            // THROW ERROR HERE?
            return null;
        }

        // SPECME

        return this.getPageByIndex(previousPageIndex);
    }

    public getNextPage(page: NewWizardPage) {
        let myPageIndex = this.getPageIndex(page);
        let nextPageIndex = myPageIndex + 1;

        if (nextPageIndex >= this.pagesAsArray.length) {
            // THROW ERROR HERE?
            return null;
        }

        // SPECME

        return this.getPageByIndex(nextPageIndex);
    }

}