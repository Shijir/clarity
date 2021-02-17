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
    <cds-pagination-number>1/3</cds-pagination-number>
    <cds-pagination-button action="next"></cds-pagination-button>
  </cds-pagination>`;
};

export const firstAndLast = () => {
  return html` <cds-pagination>
    <cds-pagination-button action="first" disabled></cds-pagination-button>
    <cds-pagination-button action="prev" disabled></cds-pagination-button>
    <cds-pagination-number>1/3</cds-pagination-number>
    <cds-pagination-button action="next"></cds-pagination-button>
    <cds-pagination-button action="last"></cds-pagination-button>
  </cds-pagination>`;
};

export const editablePaginationNumber = () => {
  return html` <cds-pagination>
    <cds-pagination-button action="first" disabled></cds-pagination-button>
    <cds-pagination-button action="prev" disabled></cds-pagination-button>
    <cds-pagination-number> <input type="text" value="1" size="1" />/3 </cds-pagination-number>
    <cds-pagination-button action="next"></cds-pagination-button>
    <cds-pagination-button action="last"></cds-pagination-button>
  </cds-pagination>`;
};

export const customPaginationStyles = () => {
  return html`
    <style>
      .custom-pagination-color cds-pagination-button {
        --color: blue;
      }
      .custom-pagination-color cds-pagination-button[disabled] {
        --color: lightblue;
      }
      .custom-pagination-color cds-pagination-number {
        --color: blue;
      }

      .custom-pagination-button cds-pagination {
        --color: green;
        --background: orange;

        --disabled-color: pink;
        --disabled-background: purple;
      }
    </style>
    <div cds-layout="m-y:sm" class="custom-pagination-color">
      <cds-pagination cds-layout="horizontal gap:xs align:center">
        <cds-pagination-button action="first" disabled></cds-pagination-button>
        <cds-pagination-button action="prev" disabled></cds-pagination-button>
        <cds-pagination-number> <input type="text" value="1" size="1" />/3 </cds-pagination-number>
        <cds-pagination-button action="next"></cds-pagination-button>
        <cds-pagination-button action="last"></cds-pagination-button>
      </cds-pagination>
    </div>
    <div cds-layout="m-y:md" class="custom-pagination-button">
      <cds-pagination cds-layout="horizontal gap:xxs align:center">
        <cds-pagination-button action="first" disabled></cds-pagination-button>
        <cds-pagination-button action="prev" disabled></cds-pagination-button>
        <cds-pagination-number> <input type="text" value="1" size="1" />/3 </cds-pagination-number>
        <cds-pagination-button action="next"></cds-pagination-button>
        <cds-pagination-button action="last"></cds-pagination-button>
      </cds-pagination>
    </div>
    <div cds-layout="m-y:md">
      <cds-pagination cds-layout="horizontal gap:xxs align:center">
        <cds-pagination-button disabled>first</cds-pagination-button>
        <cds-pagination-button disabled>prev</cds-pagination-button>
        <cds-pagination-button>next</cds-pagination-button>
        <cds-pagination-button>last</cds-pagination-button>
      </cds-pagination>
    </div>
    <div cds-layout="m-y:md">
      <cds-pagination cds-layout="horizontal gap:xxs align:center">
        <cds-pagination-button disabled>
          <cds-icon shape="arrow" direction="left"></cds-icon>
        </cds-pagination-button>
        <cds-pagination-button>
          <cds-icon shape="arrow" direction="right"></cds-icon>
        </cds-pagination-button>
      </cds-pagination>
    </div>
  `;
};
