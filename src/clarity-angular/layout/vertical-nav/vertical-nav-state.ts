import { Injectable } from "@angular/core";
import { Subject } from "rxjs/Subject";
import { Observable } from "rxjs/Observable";
/**
 * Copyright (c) 2016-2017 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

@Injectable()
export class VerticalNavState {
    private _collapsed: Subject<boolean> = new Subject<boolean>();

    get collapsed(): Observable<Boolean> {
        return this._collapsed.asObservable();
    }

    setCollapsed(value: Boolean): void {
        this._collapsed.next(value);
    }
}
