/*
 * Copyright (c) 2016-2018 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import {Component, ElementRef, OnDestroy, Renderer2} from "@angular/core";
import {Subscription} from "rxjs/Subscription";

import {ClrDragEvent} from "./interfaces/drag-event";
import {ClrDragAndDropEventBus} from "./providers/drag-and-drop-event-bus";
import {ClrDragEventListener} from "./providers/drag-event-listener";

@Component({selector: "clr-draggable-ghost", template: `<ng-content></ng-content>`, host: {class: "draggable-ghost"}})
export class ClrDraggableGhost<T> implements OnDestroy {
    private draggableGhostEl: Node;

    private subscriptions: Subscription[] = [];

    private dragStartX: number;
    private dragStartY: number;

    private translateX: number;
    private translateY: number;

    private offsetX: number = 0;
    private offsetY: number = 0;

    private dragStartRegistered: boolean = false;

    public draggableClientRect: ClientRect;

    constructor(private el: ElementRef, private dragEventListener: ClrDragEventListener<T>,
                private eventBus: ClrDragAndDropEventBus<T>, private renderer: Renderer2) {
        this.draggableGhostEl = this.el.nativeElement;

        this.subscriptions.push(this.dragEventListener.dragStarted.subscribe((event: ClrDragEvent<T>) => {
            this.handleDragStart(event);
        }));
        this.subscriptions.push(this.dragEventListener.dragMoved.subscribe((event: ClrDragEvent<T>) => {
            if (!this.dragStartRegistered) {
                this.handleDragStart(event);
            }
            this.translateX = event.dragPosition.pageX - this.dragStartX - this.offsetX;
            this.translateY = event.dragPosition.pageY - this.dragStartY - this.offsetY;
            const translate3d = `translate3d(${this.translateX}px, ${this.translateY}px, 0)`;
            this.renderer.setStyle(this.draggableGhostEl, "transform", translate3d);
        }));
        this.subscriptions.push(this.dragEventListener.dragEnded.subscribe((event: ClrDragEvent<T>) => {
            this.dragStartRegistered = false;
            this.leaveDragState();
        }));
    }

    private handleDragStart(event: ClrDragEvent<T>) {
        this.dragStartRegistered = true;
        this.enterDragState();
        this.setInitialState(event);
    }

    private enterDragState() {
        this.renderer.addClass(document.body, "in-drag");
        this.renderer.addClass(this.draggableGhostEl, "dragged");
    }

    private leaveDragState() {
        this.renderer.removeClass(document.body, "in-drag");
        this.renderer.removeClass(this.draggableGhostEl, "dragged");
    }

    private setInitialState(event: ClrDragEvent<T>) {
        this.dragStartX = event.dragPosition.pageX;
        this.dragStartY = event.dragPosition.pageY;

        this.renderer.setStyle(this.draggableGhostEl, "transform", `translate3d(0px, 0px, 0)`);

        this.renderer.setStyle(this.draggableGhostEl, "left", `${this.dragStartX}px`);
        this.renderer.setStyle(this.draggableGhostEl, "top", `${this.dragStartY}px`);

        if (this.draggableClientRect) {
            this.offsetX = this.dragStartX - this.draggableClientRect.left;
            this.offsetY = this.dragStartY - this.draggableClientRect.top;
        }
    }

    ngOnDestroy() {
        this.leaveDragState();
        this.subscriptions.forEach((sub: Subscription) => sub.unsubscribe());
    }
}
