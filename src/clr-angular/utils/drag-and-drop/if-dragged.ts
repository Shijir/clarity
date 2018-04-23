/*
 * Copyright (c) 2016-2018 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {Directive, OnDestroy, TemplateRef, ViewContainerRef} from "@angular/core";
import {Subscription} from "rxjs/Subscription";

import {ClrDragEvent} from "./interfaces/drag-event";
import {ClrDragEventListener} from "./providers/drag-event-listener";

@Directive({selector: "[clrIfDragged]"})
export class ClrIfDragged<T> implements OnDestroy {
    private subscriptions: Subscription[] = [];
    constructor(private template: TemplateRef<any>, private container: ViewContainerRef,
                private dragEventListener: ClrDragEventListener<T>) {
        this.subscriptions.push(this.dragEventListener.dragStarted.subscribe((event: ClrDragEvent<T>) => {
            this.container.createEmbeddedView(this.template);
        }));
        this.subscriptions.push(this.dragEventListener.dragEnded.subscribe((event: ClrDragEvent<T>) => {
            this.container.clear();
        }));
    }

    ngOnDestroy() {
        this.subscriptions.forEach((sub: Subscription) => sub.unsubscribe());
    }
}
