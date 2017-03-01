/*
 * Copyright (c) 2016 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {TreeSelectionService} from "./treeSelection.service";

export function TreeSelectionSpecs(): void {
    describe("Tree Selection Service", () => {
        let selectionService: TreeSelectionService;

        beforeEach(() => {
            selectionService = new TreeSelectionService();
        });

        it("Throws an error if the selection passed does not have a selected property", () => {
            let selection: any = {
                model: "Model",
                children: []
            };

            let exceptionMessage: string = "";

            try {
                selectionService.verifyTreeSelection(selection);
            } catch (e) {
                exceptionMessage = e;
            }

            expect(exceptionMessage).toBe("clrTreeSelection should have the selected property");
        });

        it("Throws an error if the children property is not an array", () => {
            let selection: any = {
                model: "Model",
                selected: false,
                children: "Children"
            };

            let exceptionMessage: string = "";

            try {
                selectionService.verifyTreeSelection(selection);
            } catch (e) {
                exceptionMessage = e;
            }

            expect(exceptionMessage).
                toBe("clrTreeSelection should be of type array. Received type "
                    + typeof selection.children);
        });

    });
}