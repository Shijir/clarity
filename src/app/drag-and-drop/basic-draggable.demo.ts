/*
 * Copyright (c) 2016-2018 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import {Component} from "@angular/core";

@Component({
    selector: "basic-draggable-demo",
    styleUrls: ["./drag-and-drop.demo.scss"],
    templateUrl: "./basic-draggable.demo.html"
})
export class BasicDraggableDemo {
    onDragStart($event: any) {
        // console.log($event);
    }
    onDragMove($event: any) {
        // console.log($event);
    }
    onDragEnd($event: any) {
        // console.log($event);
    }
}
