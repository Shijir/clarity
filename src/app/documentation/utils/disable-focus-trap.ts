/*
 * Copyright (c) 2016-2017 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

export class DisableFocusTrap {
    constructor() {
        if (document.activeElement) {
            (<HTMLElement>document.activeElement).blur();
        }
    }
    get current() { return; }
    set current(value: any) {}
    activatePreviousTrapper() {}
}