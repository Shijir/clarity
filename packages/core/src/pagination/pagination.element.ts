/*
 * Copyright (c) 2016-2021 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { baseStyles, property } from '@cds/core/internal';
import { html, LitElement } from 'lit-element';
import { styles } from './pagination.element.css.js';
import { PaginationControlSize } from './pagination.interfaces.js';

export class CdsPagination extends LitElement {
  @property({ type: String }) size: PaginationControlSize = 'default';

  render() {
    return this.hasAttribute('cds-layout')
      ? html`<slot></slot>`
      : html`<div cds-layout="horizontal gap:md align:center"><slot></slot></div>`;
  }

  static get styles() {
    return [baseStyles, styles];
  }
}
