/*
 * Copyright (c) 2016-2018 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import {Component} from "@angular/core";

@Component({selector: "clr-card-grid-demo", styleUrls: ["./card.demo.scss"], templateUrl: "./card-grid.html"})
export class CardGridDemo {
    buttons = new Array(1);

    onDragStart() {
        // console.log("drag started");
    }

    onDragMove() {
        // console.log("drag moved");
    }

    onDragEnd() {
        // console.log("drag ended");
    }

    onDragOver() {
        // console.log("draggable is over");
    }

    onDragEnter() {
        // console.log("draggable entered");
    }

    onDragLeave() {
        // console.log("draggable left");
    }

    onDrop() {
        // console.log("draggable dropped");
    }
}
