/*
 * Copyright (c) 2016-2019 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { ReorderAnimationState } from '../enums/reorder-animation-state.enum';
import { AnimationOptions } from '@angular/animations';

export interface ReorderAnimationData {
  value: ReorderAnimationState;
  params?: AnimationOptions;
}

export type ReorderAnimationModel = { [newOrder: number]: ReorderAnimationData };
