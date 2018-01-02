/**
 * Copyright (c) 2016-2017 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import {InjectionToken} from "@angular/core";
import {DragDispatcher} from "../../../utils/drag-and-drop/providers/drag-dispatcher";

export const DRAG_RESIZE_COLUMN = new InjectionToken<DragDispatcher>("DRAG_RESIZE_COLUMN");

export const DRAG_RESIZE_COLUMN_PROVIDER = {
    provide: DRAG_RESIZE_COLUMN,
    useClass: DragDispatcher
};
