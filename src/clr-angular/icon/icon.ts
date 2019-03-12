/*
 * Copyright (c) 2016-2018 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Directive, Input } from '@angular/core';

@Directive({
  selector: 'clr-icon',
  host: {
    '[attr.shape]': 'shape',
    '[attr.title]': 'title',
    '[attr.size]': 'size',
  },
})
export class ClrIconCustomTag {
  // No behavior
  // The only purpose is to "declare" the tag in Angular
  @Input() public title: string;
  @Input() public shape: string;
  @Input() public size: number;
}
