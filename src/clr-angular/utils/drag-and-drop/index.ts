/*
 * Copyright (c) 2016-2018 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import {Type} from "@angular/core";

import {ClrDragHandle} from "./drag-handle";
import {ClrDraggable} from "./draggable";
import {ClrDraggableGhost} from "./draggable-ghost";
import {ClrDroppable} from "./droppable";
import {ClrIfDragged} from "./if-dragged";

export * from "./draggable";
export * from "./droppable";
export * from "./if-dragged";
export * from "./drag-handle";
export * from "./draggable-ghost";

export const DRAG_AND_DROP_DIRECTIVES: Type<any>[] =
    [ClrDraggable, ClrDroppable, ClrIfDragged, ClrDragHandle, ClrDraggableGhost];