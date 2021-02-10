/*
 * Copyright (c) 2016-2021 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import '@cds/core/button/register.js';
import '@cds/core/pagination/register.js';
import { getElementStorybookArgTypes, spreadProps, getElementStorybookArgs } from '@cds/core/internal';
import { html } from 'lit-html';
import customElements from '../../dist/core/custom-elements.json';

export default {
  title: 'Stories/Pagination',
  component: 'cds-pagination',
  argTypes: getElementStorybookArgTypes('cds-pagination', customElements),
  parameters: {
    options: { showPanel: true },
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/v2mkhzKQdhECXOx8BElgdA/Clarity-UI-Library---light-2.2.0?node-id=51%3A673',
    },
  },
};
// pager, pagination, paginator
export const API = (args: any) => {
  return html`
    <cds-pagination ...="${spreadProps(getElementStorybookArgs(args))}">
      ${args.default}
    </cds-pagination>
  `;
};

export const basic = () => {
  return html` <cds-pagination>
    <cds-pagination-button action="prev" disabled></cds-pagination-button>
    <cds-pagination-button action="next"></cds-pagination-button>
  </cds-pagination>`;
};

export const basicPaginationNumber = () => {
  return html` <cds-pagination>
    <cds-pagination-button action="prev" disabled></cds-pagination-button>
    <cds-pagination-number>1</cds-pagination-number>
    <cds-pagination-button action="next"></cds-pagination-button>
  </cds-pagination>`;
};

export const firstAndLast = () => {
  return html` <cds-pagination>
    <cds-pagination-button action="first" disabled></cds-pagination-button>
    <cds-pagination-button action="prev" disabled></cds-pagination-button>
    <cds-pagination-number>1 / 3</cds-pagination-number>
    <cds-pagination-button action="next"></cds-pagination-button>
    <cds-pagination-button action="last"></cds-pagination-button>
  </cds-pagination>`;
};

export const editablePaginationNumber = () => {
  return html` <cds-pagination>
    <cds-pagination-button action="first" disabled></cds-pagination-button>
    <cds-pagination-button action="prev" disabled></cds-pagination-button>
    <cds-pagination-number> <input type="text" value="1" size="1" /> / 3 </cds-pagination-number>
    <cds-pagination-button action="next"></cds-pagination-button>
    <cds-pagination-button action="last"></cds-pagination-button>
  </cds-pagination>`;
};

export const customPaginationStyles = () => {
  return html`
    <style>
      .custom-color-pagination cds-pagination-button {
        --color: hotpink;
      }
      .custom-color-pagination cds-pagination-button[disabled] {
        --color: pink;
      }
      .custom-color-pagination cds-pagination-number {
        --color: hotpink;
      }

      .custom-background-pagination cds-pagination {
        --color: green;
        --background: orange;

        --disabled-color: pink;
        --disabled-background: purple;
      }
    </style>
    <div class="custom-color-pagination">
      <cds-pagination cds-layout="horizontal gap:sm align:center">
        <cds-pagination-button action="first" disabled></cds-pagination-button>
        <cds-pagination-button action="prev" disabled></cds-pagination-button>
        <cds-pagination-number> <input type="text" value="1" size="1" /> / 3 </cds-pagination-number>
        <cds-pagination-button action="next"></cds-pagination-button>
        <cds-pagination-button action="last"></cds-pagination-button>
      </cds-pagination>
    </div>
    <div class="custom-background-pagination">
      <cds-pagination cds-layout="horizontal gap:sm align:center">
        <cds-pagination-button action="first" disabled></cds-pagination-button>
        <cds-pagination-button action="prev" disabled></cds-pagination-button>
        <cds-pagination-number> <input type="text" value="1" size="1" /> / 3 </cds-pagination-number>
        <cds-pagination-button action="next"></cds-pagination-button>
        <cds-pagination-button action="last"></cds-pagination-button>
      </cds-pagination>
    </div>
  `;
};
