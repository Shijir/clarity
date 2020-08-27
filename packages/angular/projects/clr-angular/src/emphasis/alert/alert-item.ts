/*
 * Copyright (c) 2016-2020 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { AlertIconAndTypesService } from './providers/icon-and-types.service';

@Component({
  selector: 'clr-alert-item',
  template: `
    <cds-alert closable>
      <ng-content select=".alert-text"></ng-content>
      <cds-alert-actions>
        <ng-content select=".alert-actions"></ng-content>
      </cds-alert-actions>
    </cds-alert>
  `,
  host: { class: 'alert-item' },
})
export class ClrAlertItem {
  constructor(public iconService: AlertIconAndTypesService) {}
}
