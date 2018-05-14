/*
 * Copyright (c) 2016-2018 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {Subject} from "rxjs/Subject";

@Injectable()
export class ClrDragHandleRegistrar<T> {
    private _handleEl: Node;
    private _handleChanged: Subject<void> = new Subject<void>();

    get handleChanged(): Observable<void> {
        return this._handleChanged.asObservable();
    }

    get handleEl() {
        return this._handleEl;
    }

    public registerHandleEl(handleElement: Node) {
        this._handleEl = handleElement;
        this._handleChanged.next();
    }

    public unregisterHandleEl() {
        delete this._handleEl;
        this._handleChanged.next();
    }
}