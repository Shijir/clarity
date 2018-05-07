/*
 * Copyright (c) 2016-2018 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {Directive, ElementRef, OnDestroy} from "@angular/core";
import {ClrDragHandleRegistrar} from "./providers/drag-handle-registrar";

@Directive({selector: "[clrDragHandle]", host: {class: "drag-handle"}})
export class ClrDragHandle<T> implements OnDestroy {
    constructor(private el: ElementRef, private dragHandleRegistrar: ClrDragHandleRegistrar<T>) {
        this.dragHandleRegistrar.registerHandleEl(this.el.nativeElement);
    }

    ngOnDestroy() {
        this.dragHandleRegistrar.unregisterHandleEl();
    }
}