/*
 * Copyright (c) 2016-2021 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { baseStyles } from '@cds/core/internal';
import { html, LitElement } from 'lit-element';
import { CdsInput } from '../input/input.element.js';
import { styles } from './pagination.element.css.js';

export const PAGINATION_LAYOUT = 'horizontal gap:md align:center';

export class CdsPagination extends LitElement {
  render() {
    return this.hasAttribute('cds-layout')
      ? html`<slot></slot>`
      : html`<div cds-layout="${PAGINATION_LAYOUT}"><slot></slot></div>`;
  }

  static get styles() {
    return [baseStyles, styles];
  }

  firstUpdated() {
    const numberInput = this.querySelector('[cds-pagination-number]') as CdsInput;
    if (numberInput) {
      numberInput.controlWidth = 'shrink';
      numberInput.layout = 'compact';
    }
  }
}
