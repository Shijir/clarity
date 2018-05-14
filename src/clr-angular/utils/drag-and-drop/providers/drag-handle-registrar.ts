/*
 * Copyright (c) 2016-2018 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {Injectable, Renderer2} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {Subject} from "rxjs/Subject";
import {ClrDragEventListener} from "./drag-event-listener";

// This provider registers the drag handle element.
// When it registers the custom handle element, it attaches the element to the listeners from ClrDragEventListener.
// Also, it adds the "drag-handle" css class to the registered element through Renderer.
@Injectable()
export class ClrDragHandleRegistrar<T> {
    private _customHandleEl: Node;
    private _draggableEl: Node;

    set draggableEl(value: Node) {
        // First, we set clrDraggable element as the default drag handle.
        this._draggableEl = value;
        this.makeElementHandle(this._draggableEl);
    }

    constructor(private dragEventListener: ClrDragEventListener<T>, private renderer: Renderer2) {}

    private makeElementHandle(el: Node) {
        if (el !== this._draggableEl) {
            // Before making an element the custom handle element,
            // we should remove the previous drag-handle class from the draggable element.
            this.renderer.removeClass(this._draggableEl, "drag-handle");
        }
        this.dragEventListener.attachDragListeners(el);
        this.renderer.addClass(el, "drag-handle");
    }

    get customHandle() {
        return this._customHandleEl;
    }

    public registerCustomHandle(handleElement: Node) {
        this._customHandleEl = handleElement;
        this.makeElementHandle(this._customHandleEl);
    }

    public unregisterCustomHandle() {
        delete this._customHandleEl;
        this.makeElementHandle(this._draggableEl);
    }
}