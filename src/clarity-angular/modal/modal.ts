/*
 * Copyright (c) 2016 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import {
    Component,
    Input,
    Output,
    EventEmitter,
    HostListener,
    OnChanges,
    OnDestroy,
    SimpleChange,
    animate,
    style,
    transition,
    trigger,
    state
} from "@angular/core";
import {ScrollingService} from "../main/scrolling-service";

@Component({
    selector: "clr-modal",
    viewProviders: [ScrollingService],
    templateUrl: "./modal.html",
    styles: [`
        :host { display: inline-block; }
    `],
    animations: [
        trigger("fadeDown", [
            transition("* => false", [
                style({
                    opacity: 0,
                    transform: "translate(0, -25%)"
                }),
                animate("0.2s ease-in-out")]
            ),
            transition("false => *", [
                animate("0.2s ease-in-out", style({
                    opacity: 0,
                    transform: "translate(0, -25%)"
                }))]
            )
        ]),
        trigger("fade", [
            transition("void => *", [
                    style({
                        opacity: 0
                    }),
                    animate("0.2s ease-in-out", style({
                        opacity: 0.85
                    }))
                ]
            ),
            transition("* => void", [
                    animate("0.2s ease-in-out", style({
                        opacity: 0
                    }))
                ]
            )
        ]),
        trigger("ghostPageOneState", [
            state("inactive", style({
                left: "-24px"
            })),
            state("ready", style({
                left: "0"
            })),
            state("penultimateGhost", style({
                left: "-24px"
            })),
            state("lastGhost", style({
                left: "-24px"
            })),
            transition("inactive => *", animate("100ms ease-out")),
            transition("ready => *", animate("100ms ease-in")),
            transition("lastGhost => *", animate("100ms ease-out")),
            transition("penultimateGhost => *", animate("100ms ease-in"))
        ]),
// TODO: ANIMATE THE COLOR
        trigger("ghostPageTwoState", [
            state("inactive", style({
                left: "-24px",
                top: "24px",
                bottom: "24px"
            })),
            state("ready", style({
                left: "24px"
            })),
            state("penultimateGhost", style({
                left: "0px",
                top: "24px",
                bottom: "24px"
            })),
            state("lastGhost", style({
                left: "-24px",
                top: "24px",
                bottom: "24px"
            })),
            transition("inactive => *", animate("100ms ease-out")),
            transition("ready => *", animate("100ms ease-in")),
            transition("lastGhost => *", animate("100ms ease-out")),
            transition("penultimateGhost => *", animate("100ms ease-in"))
        ])
    ]

})
export class Modal implements OnChanges, OnDestroy {
    // We grab animated children from the view, to wait for them to finish animating out
    // before completely hiding the component itself.
    @Input("clrModalOpen") _open: boolean = false;
    @Output("clrModalOpenChange") _openChanged: EventEmitter<boolean> = new EventEmitter<boolean>(false);

    @Input("clrModalClosable") closable: boolean = true;
    @Input("clrModalSize") size: string;
    @Input("clrModalStaticBackdrop") staticBackdrop: boolean = false;
    @Input("clrModalSkipAnimation") skipAnimation: boolean = false;

    // presently this is only used by wizards
    @Input("clrModalGhostPageState") ghostPageState: string = "hidden";

    constructor(private _scrollingService: ScrollingService) {
    }

    get sizeClass(): string {
        if (this.size) {
            return "modal-" + this.size;
        } else {
            return "";
        }
    }

    //Detect when _open is set to true and set no-scrolling to true
    ngOnChanges(changes: {[propName: string]: SimpleChange}): void {
        if (changes && changes.hasOwnProperty("_open")) {
            if (changes["_open"].currentValue) {
                this._scrollingService.stopScrolling();
            } else {
                this._scrollingService.resumeScrolling();
            }
        }
    }

    ngOnDestroy(): void {
        this._scrollingService.resumeScrolling();
    }

    open(): void {
        if (this._open) {
            return;
        }
        this._open = true;
        this._openChanged.emit(true);
    }

    @HostListener("body:keyup.escape")
    close(): void {
        if (!this.closable || this._open === false) {
            return;
        }
        this._open = false;
        this._openChanged.emit(false);
    }
}