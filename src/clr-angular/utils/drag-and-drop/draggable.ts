/*
 * Copyright (c) 2016-2018 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import {
    ComponentFactory,
    ComponentFactoryResolver,
    ContentChild,
    Directive,
    ElementRef,
    EventEmitter,
    Injector,
    Input,
    OnDestroy,
    OnInit,
    Output,
    ViewContainerRef
} from "@angular/core";
import {Subscription} from "rxjs/Subscription";

import {DomAdapter} from "../../data/datagrid/render/dom-adapter";

import {ClrDraggableGhost} from "./draggable-ghost";
import {ClrIfDragged} from "./if-dragged";
import {ClrDragEvent} from "./interfaces/drag-event";
import {ClrDragEventListener} from "./providers/drag-event-listener";

@Directive({selector: "[clrDraggable]", providers: [ClrDragEventListener, DomAdapter], host: {class: "draggable"}})
export class ClrDraggable<T> implements OnInit, OnDestroy {
    private draggableEl: Node;

    private subscriptions: Subscription[] = [];

    private componentFactory: ComponentFactory<ClrDraggableGhost<T>>;

    constructor(private el: ElementRef, private componentFactoryResolver: ComponentFactoryResolver,
                private viewContainerRef: ViewContainerRef, private dragEventListener: ClrDragEventListener<T>,
                private injector: Injector, private domAdapter: DomAdapter) {
        this.draggableEl = this.el.nativeElement;
        this.componentFactory = this.componentFactoryResolver.resolveComponentFactory(ClrDraggableGhost);
    }

    private createDefaultGhost() {
        const draggableGhost = this.viewContainerRef.createComponent(this.componentFactory, 0, this.injector,
                                                                     [[this.draggableEl.cloneNode(true)]]);
        draggableGhost.instance.draggableClientRect = this.domAdapter.clientRect(this.draggableEl);
    }

    private destroyDefaultGhost() {
        this.viewContainerRef.clear();
    }

    @ContentChild(ClrIfDragged) customGhost: ClrDraggableGhost<T>;

    @Input("clrDraggable")
    set dataTransfer(value: T) {
        this.dragEventListener.dragDataTransfer = value;
    }

    @Input("clrGroup")
    set group(value: string|string[]) {
        this.dragEventListener.group = value;
    }

    @Output("clrDragStart") dragStartEmitter: EventEmitter<ClrDragEvent<T>> = new EventEmitter();
    @Output("clrDragMove") dragMoveEmitter: EventEmitter<ClrDragEvent<T>> = new EventEmitter();
    @Output("clrDragEnd") dragEndEmitter: EventEmitter<ClrDragEvent<T>> = new EventEmitter();

    ngOnInit() {
        this.dragEventListener.attachDragListeners(this.draggableEl);
        this.subscriptions.push(this.dragEventListener.dragStarted.subscribe((event: ClrDragEvent<T>) => {
            if (!this.customGhost) {
                this.createDefaultGhost();
            }
            this.dragStartEmitter.emit(event);
        }));
        this.subscriptions.push(this.dragEventListener.dragMoved.subscribe((event: ClrDragEvent<T>) => {
            this.dragMoveEmitter.emit(event);
        }));
        this.subscriptions.push(this.dragEventListener.dragEnded.subscribe((event: ClrDragEvent<T>) => {
            if (!this.customGhost) {
                this.destroyDefaultGhost();
            }
            this.dragEndEmitter.emit(event);
        }));
    }

    ngOnDestroy() {
        this.subscriptions.forEach((sub: Subscription) => sub.unsubscribe());
        this.dragEventListener.detachDragListeners();
    }
}
