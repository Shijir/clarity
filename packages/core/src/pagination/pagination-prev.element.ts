/*
 * Copyright (c) 2016-2021 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { baseStyles, property } from '@cds/core/internal';
import { html, LitElement } from 'lit-element';
import { styles } from './pagination-next.element.css.js';
import { PaginationControlItem, PaginationControlSize } from './pagination.interfaces.js';

export class CdsPaginationPrev extends LitElement implements PaginationControlItem {
  @property({ type: String }) size: PaginationControlSize = 'default';

  render() {
    return html`<cds-icon-button size="sm" action="flat"
      ><cds-icon shape="angle" direction="left"></cds-icon
    ></cds-icon-button>`;
  }

  static get styles() {
    return [baseStyles, styles];
  }
}
