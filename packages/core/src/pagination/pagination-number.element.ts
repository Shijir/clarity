/*
 * Copyright (c) 2016-2021 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { baseStyles } from '@cds/core/internal';
import { html, LitElement } from 'lit-element';
import { styles } from './pagination-number.element.css.js';

export class CdsPaginationNumber extends LitElement {
  render() {
    return html`<div cds-layout="horizontal gap:sm align:center">
      <slot></slot>
    </div>`;
  }

  static get styles() {
    return [baseStyles, styles];
  }
}
