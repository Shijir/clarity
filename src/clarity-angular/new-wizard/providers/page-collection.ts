import {
    Injectable,
    QueryList
} from "@angular/core";
// import { Subject, Observable } from "rxjs";
import { NewWizardPage } from "../wizard-page";

@Injectable()
export class PageCollectionService {
    // create Observables for when list of pages changes

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

    private rangeStart: number;
    private rangeEnd: number;

    public get pageRange(): NewWizardPage[] {
        let start = this.rangeStart;
        let end = this.rangeEnd;

        if ( typeof start === "undefined" || typeof end === "undefined") {
            // using type check because negative number may throw falsy
            return [];
        }
        // SPECME

        return this.slicePageRange(start, end);
    }

    private slicePageRange(start: number, end: number): NewWizardPage[] {
        // slice does not return the last one in the range but it does include the first one
        // does not modify original array

        let pages = this.pagesAsArray;

        // slice behaves weirdly if start is a negative number
        if (start < 0) {
            start = 0;
        }
        // SPECME

        // slice end does not include item referenced by end index, which is weird for users
        // incrementing end here to overcome that
        end = end + 1;
        // SPECME

        return pages.slice(start, end);
        // SPECME
    }

    // TODO: MOVE TO PAGESERVICE
    // TAKES TWO PAGES, RETURNS THE PAGES BETWEEN THEM; OPTIONALLY INCLUDES PAGES ON THE END

    public getPageRange(page: NewWizardPage, otherPage: NewWizardPage, onlyMidPages: boolean = true): NewWizardPage[] {
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

        if (onlyMidPages) {
            startIndex = startIndex + 1;
        } else {
            // increase endIndex to make sure we get the last one
            // here we are saying we want endPages TOO
            endIndex = endIndex + 1;
        }
        // SPECME

        this.rangeStart = startIndex;
        this.rangeEnd = endIndex;

        return this.pageRange;
    }
}