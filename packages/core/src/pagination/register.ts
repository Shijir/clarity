/*
 * Copyright (c) 2016-2021 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import '@cds/core/button/register.js';
import '@cds/core/icon/register.js';
import { registerElementSafely } from '@cds/core/internal';
import { ClarityIcons } from '../icon/icon.service.js';
import { angleIcon, stepForward2Icon } from '../icon/index.js';
import { CdsPaginationButton } from './pagination-button.element.js';
import { CdsPaginationNumber } from './pagination-number.element.js';
import { CdsPagination } from './pagination.element.js';

registerElementSafely('cds-pagination', CdsPagination);
registerElementSafely('cds-pagination-number', CdsPaginationNumber);
registerElementSafely('cds-pagination-button', CdsPaginationButton);

ClarityIcons.addIcons(angleIcon);
ClarityIcons.addIcons(stepForward2Icon);
declare global {
  interface HTMLElementTagNameMap {
    'cds-pagination': CdsPagination;
    'cds-pagination-number': CdsPaginationNumber;
    'cds-pagination-button': CdsPaginationButton;
  }
}
