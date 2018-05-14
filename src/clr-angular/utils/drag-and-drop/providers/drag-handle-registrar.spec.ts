/*
 * Copyright (c) 2016-2018 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import {Subscription} from "rxjs/Subscription";

import {ClrDragHandleRegistrar} from "./drag-handle-registrar";

export default function(): void {
    describe("Drag Handle Registrar", function() {
        const dragHandleRegistrar = new ClrDragHandleRegistrar();
        const testElement = document.createElement("button");

        let notified: boolean;
        let handleChangeSub: Subscription;

        beforeEach(() => {
            notified = false;
            handleChangeSub = dragHandleRegistrar.handleChanged.subscribe(() => {
                notified = true;
            });
        });

        afterEach(() => {
            handleChangeSub.unsubscribe();
        });

        it("should register element and notifies the change", function() {
            // testing the state before registering
            expect(dragHandleRegistrar.handleEl).toBeUndefined();
            expect(notified).toBeFalsy();
            // register element
            dragHandleRegistrar.registerHandleEl(testElement);
            expect(dragHandleRegistrar.handleEl).toBe(testElement);
            expect(notified).toBeTruthy();
        });

        it("should unregister element and notifies the change", function() {
            // testing the state before unregistering
            expect(dragHandleRegistrar.handleEl).toBe(testElement);
            expect(notified).toBeFalsy();
            // unregister element
            dragHandleRegistrar.unregisterHandleEl();
            expect(dragHandleRegistrar.handleEl).toBeUndefined();
            expect(notified).toBeTruthy();
        });
    });
}
