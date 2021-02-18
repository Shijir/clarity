/*
 * Copyright (c) 2016-2021 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { baseStyles, CdsBaseButton, property, querySlot } from '@cds/core/internal';
import { html } from 'lit-element';
import { styles } from './pagination-button.element.css.js';

export class CdsPaginationButton extends CdsBaseButton {
  @property({ type: String }) action: 'prev' | 'next' | 'first' | 'last';

  /** @private */
  @querySlot('cds-icon', { assign: 'cds-icon-slot' }) cdsIcon: HTMLElement;

  get customContent() {
    return !this.action && !this.cdsIcon;
  }

  render() {
    return html`
      <div class="private-host" cds-layout="horizontal align:center ${this.customContent ? 'p-x:sm' : ''}">
        <slot name="cds-icon-slot">
          ${this.action === 'next' ? html`<cds-icon shape="angle" direction="right"></cds-icon>` : ''}
          ${this.action === 'last' ? html`<cds-icon shape="step-forward-2"></cds-icon>` : ''}
          ${this.action === 'prev' ? html`<cds-icon shape="angle" direction="left"></cds-icon>` : ''}
          ${this.action === 'first' ? html`<cds-icon shape="step-forward-2" direction="down"></cds-icon>` : ''}
        </slot>
        <slot></slot>
      </div>
    `;
  }

  static get styles() {
    return [baseStyles, styles];
  }
}
