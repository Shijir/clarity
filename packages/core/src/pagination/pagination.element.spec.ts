/*
 * Copyright (c) 2016-2021 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { html } from 'lit-html';
import '@cds/core/pagination/register.js';
import '@cds/core/icon/register.js';
import { componentIsStable, createTestElement, getComponentSlotContent, removeTestElement } from '@cds/core/test';
import { CdsPagination, PAGINATION_LAYOUT } from '@cds/core/pagination';

describe('Pagination Element', () => {
  let defaultLayoutElement: HTMLElement;
  let defaultLayoutComponent: CdsPagination;

  const placeholderText = 'I am a pagination content.';

  beforeEach(async () => {
    defaultLayoutElement = await createTestElement(html`<cds-pagination>${placeholderText}</cds-pagination>`);
    defaultLayoutComponent = defaultLayoutElement.querySelector<CdsPagination>('cds-pagination');
  });

  afterEach(() => {
    removeTestElement(defaultLayoutElement);
  });

  it('should slot the component', async () => {
    await componentIsStable(defaultLayoutComponent);
    const slots = getComponentSlotContent(defaultLayoutComponent);
    expect(slots.default).toBe(`${placeholderText}`);
  });

  it('should have default layout wrapper for content', async () => {
    await componentIsStable(defaultLayoutComponent);
    const wrapper = defaultLayoutComponent.shadowRoot.querySelector('div');
    expect(wrapper.getAttribute('cds-layout')).toBe(PAGINATION_LAYOUT);
  });

  it('should allow custom layout for content', async () => {
    const customLayoutElement = await createTestElement(
      html`<cds-pagination cds-layout="test">${placeholderText}</cds-pagination>`
    );
    const customLayoutComponent = customLayoutElement.querySelector<CdsPagination>('cds-pagination');
    await componentIsStable(customLayoutComponent);

    expect(customLayoutElement.shadowRoot).toBeNull(`No wrappers for custom layouts.`);
    const slots = getComponentSlotContent(customLayoutComponent);
    expect(slots.default).toBe(`${placeholderText}`);
  });
});
