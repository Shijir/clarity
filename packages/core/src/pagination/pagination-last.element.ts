/*
 * Copyright (c) 2016-2021 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { baseStyles, property } from '@cds/core/internal';
import { html, LitElement } from 'lit-element';
import { styles } from './pagination-next.element.css.js';
import { PaginationControlSize } from './pagination.interfaces.js';

export class CdsPaginationLast extends LitElement {
  @property({ type: String }) size: PaginationControlSize = 'default';

  render() {
    return html`<cds-icon-button size="sm" action="flat"
      ><cds-icon shape="step-forward-2"></cds-icon
    ></cds-icon-button>`;
  }

  static get styles() {
    return [baseStyles, styles];
  }
}
