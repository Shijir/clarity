/*
 * Copyright (c) 2016-2021 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { registerElementSafely } from '@cds/core/internal';
import { CdsPaginationButton } from './pagination-button.element';
import { CdsPaginationNumber } from './pagination-number.element';
import { CdsPagination } from './pagination.element';

registerElementSafely('cds-pagination', CdsPagination);
registerElementSafely('cds-pagination-number', CdsPaginationNumber);
registerElementSafely('cds-pagination-button', CdsPaginationButton);
declare global {
  interface HTMLElementTagNameMap {
    'cds-pagination': CdsPagination;
    'cds-pagination-number': CdsPaginationNumber;
    'cds-pagination-button': CdsPaginationButton;
  }
}
