/*
 * Copyright (c) 2016-2018 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {Injectable} from "@angular/core";

@Injectable()
export class ClrDragHandleRegistrar<T> {
    private _handleEl: Node;

    get handleEl() {
        return this._handleEl;
    }

    public registerHandle(handleElement: Node) {
        if (this._handleEl) {
            // if there is an existing handle,
            // don't register new one.
            return;
        }
        this._handleEl = handleElement;
    }

    public unregisterHandle() {
        delete this._handleEl;
    }
}