/*
 * Copyright (c) 2016-2021 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { registerElementSafely } from '@cds/core/internal';
import { CdsPaginationPrev } from './pagination-prev.element';
import { CdsPaginationNext } from './pagination-next.element';
import { CdsPagination } from './pagination.element';
import { CdsPaginationFirst } from './pagination-first.element';
import { CdsPaginationLast } from './pagination-last.element';
import { CdsPaginationNumber } from './pagination-number.element';

import { CdsPaginationButton } from './pagination-button.element';

registerElementSafely('cds-pagination', CdsPagination);
registerElementSafely('cds-pagination-next', CdsPaginationNext);
registerElementSafely('cds-pagination-prev', CdsPaginationPrev);
registerElementSafely('cds-pagination-first', CdsPaginationFirst);
registerElementSafely('cds-pagination-last', CdsPaginationLast);
registerElementSafely('cds-pagination-number', CdsPaginationNumber);

registerElementSafely('cds-pagination-button', CdsPaginationButton);

declare global {
  interface HTMLElementTagNameMap {
    'cds-pagination': CdsPagination;
    'cds-pagination-next': CdsPaginationNext;
    'cds-pagination-prev': CdsPaginationPrev;
    'cds-pagination-first': CdsPaginationFirst;
    'cds-pagination-last': CdsPaginationLast;
    'cds-pagination-number': CdsPaginationNumber;
    'cds-pagination-button': CdsPaginationButton;
  }
}
