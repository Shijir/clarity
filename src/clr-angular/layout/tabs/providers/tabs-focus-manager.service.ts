/*
 * Copyright (c) 2016-2019 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Injectable } from '@angular/core';
import { ClrTabLink } from '../tab-link.directive';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class TabsFocusManagerService {
  currentTabLinkIds: string[];

  private _focusMoveRequested: Subject<string> = new Subject<string>();

  get focusMoveRequested(): Observable<string> {
    return this._focusMoveRequested.asObservable();
  }

  focusSiblingTabLink(tabLinkId: string, next: 1 | -1): ClrTabLink {
    let siblingTabLinkIdIndex: number;

    // for now we only need to find next or previous sibling ClrTabLink
    siblingTabLinkIdIndex = this.currentTabLinkIds.indexOf(tabLinkId) + next;

    if (siblingTabLinkIdIndex >= this.currentTabLinkIds.length) {
      siblingTabLinkIdIndex = 0;
    } else if (siblingTabLinkIdIndex < 0) {
      siblingTabLinkIdIndex = this.currentTabLinkIds.length - 1;
    }

    this._focusMoveRequested.next(this.currentTabLinkIds[siblingTabLinkIdIndex]);
  }
}
