/**
 * Copyright (c) 2016-2017 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {animate, AnimationBuilder, AnimationPlayer, style, transition, trigger} from "@angular/animations";
import {AfterViewInit, Component, ElementRef, HostBinding, Inject, OnDestroy} from "@angular/core";
import {Subscription} from "rxjs/Subscription";

import {DomAdapter} from "../../data/datagrid/render/dom-adapter";

import {DraggableEvent} from "./interfaces/draggable-event";
import {DragDispatcher} from "./providers/drag-dispatcher";
import {CUSTOM_GHOST_STATE, CustomGhostState} from "./providers/draggable-tracker";

const LEAVE_ANIMATION_SPEED = 200;  // 0.2ms

@Component({
    selector: "clr-draggable-ghost",
    template: `
        <ng-content></ng-content>`,
    host: {
        "[class.draggable-ghost]": "true",
        "[class.draggable-ghost--hidden]": "true",
        "[attr.focusable]": "false",
        "[@leaveAnimDuration]": "true"
    },
    animations: [trigger("leaveAnimDuration", [transition(":leave", [animate(LEAVE_ANIMATION_SPEED, null)])])]
})
export class DraggableGhost implements AfterViewInit, OnDestroy {
    private subscriptions: Subscription[] = [];

    draggableGhostEl: Node;

    leaveAnimation: AnimationPlayer;

    constructor(private el: ElementRef, private dragDispatcher: DragDispatcher, private domAdapter: DomAdapter,
                @Inject(CUSTOM_GHOST_STATE) private customGhostState: CustomGhostState,
                private builder: AnimationBuilder) {
        this.draggableGhostEl = el.nativeElement;
        console.log(this.draggableGhostEl);


        // this.subscriptions.push(dragDispatcher.onDragEnd.subscribe(($event: DraggableEvent) => {
        //     this.container.clear();
        // }));
    }

    ngAfterViewInit() {
        const originalLeft = this.domAdapter.clientRectLeft(this.dragDispatcher.draggable.self) + "px";
        const originalTop = this.domAdapter.clientRectTop(this.dragDispatcher.draggable.self) + "px";

        const leaveAnimationFactory = this.builder.build([
            style({left: "*", top: "*"}),
            animate(LEAVE_ANIMATION_SPEED, style({left: originalLeft, top: originalTop}))
        ]);

        this.leaveAnimation = leaveAnimationFactory.create(this.draggableGhostEl);
    }

    ngOnDestroy() {
        this.leaveAnimation.play();
    }
}
