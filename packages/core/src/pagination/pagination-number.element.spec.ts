/*
 * Copyright (c) 2016-2021 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import '@cds/core/icon/register.js';
import { CdsPagination } from '@cds/core/pagination';
import '@cds/core/pagination/register.js';
import { componentIsStable, createTestElement, getComponentSlotContent, removeTestElement } from '@cds/core/test';
import { html } from 'lit-html';
import { CdsPaginationNumber } from './pagination-number.element';

describe('Pagination Number Element', () => {
  let defaultLayoutElement: HTMLElement;
  let defaultLayoutComponent: CdsPagination;

  const placeholderText = 'I am a pagination number content.';

  beforeEach(async () => {
    defaultLayoutElement = await createTestElement(
      html`<cds-pagination-number>${placeholderText}</cds-pagination-number>`
    );
    defaultLayoutComponent = defaultLayoutElement.querySelector<CdsPaginationNumber>('cds-pagination-number');
  });

  afterEach(() => {
    removeTestElement(defaultLayoutElement);
  });

  it('should slot the component', async () => {
    await componentIsStable(defaultLayoutComponent);
    const slots = getComponentSlotContent(defaultLayoutComponent);
    expect(slots.default).toBe(`${placeholderText}`);
  });
});
