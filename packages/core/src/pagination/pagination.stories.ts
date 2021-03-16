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
  return html`
    <div cds-layout="m-y:sm">
      <cds-pagination>
        <cds-pagination-button action="prev" disabled></cds-pagination-button>
        9
        <cds-pagination-button action="next"></cds-pagination-button>
      </cds-pagination>
    </div>
    <div cds-layout="m-y:sm">
      <cds-pagination>
        <cds-pagination-button action="prev" disabled></cds-pagination-button>
        1 / 3
        <cds-pagination-button action="next"></cds-pagination-button>
      </cds-pagination>
    </div>
  `;
};

export const firstAndLast = () => {
  return html` <cds-pagination>
    <cds-pagination-button action="first" disabled></cds-pagination-button>
    <cds-pagination-button action="prev" disabled></cds-pagination-button>
    1 / 3
    <cds-pagination-button action="next"></cds-pagination-button>
    <cds-pagination-button action="last"></cds-pagination-button>
  </cds-pagination>`;
};

export const editablePaginationNumber = () => {
  return html`<cds-pagination>
    <cds-pagination-button action="first" disabled></cds-pagination-button>
    <cds-pagination-button action="prev" disabled></cds-pagination-button>
    <cds-input cds-pagination-number box>
      <label cds-layout="display:screen-reader-only">suffix</label>
      <input type="text" value="40" size="2" />
      <cds-control-message action="suffix" readonly>/ 80</cds-control-message>
    </cds-input>
    <cds-pagination-button action="next"></cds-pagination-button>
    <cds-pagination-button action="last"></cds-pagination-button>
  </cds-pagination>`;
};

export const customPaginationContent = () => {
  return html`
    <style>
      .show-pages {
        --color: var(--cds-alias-status-neutral);
      }
      .show-pages .active {
        --background: var(--cds-alias-status-neutral);
        --color: white;
      }
      .outline-pagination-items cds-pagination-button {
        --border-width: 1px;
      }

      .outline-pagination-items cds-pagination-number {
        --input-border-width: 1px;
      }
    </style>
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
    <div cds-layout="m-y:md">
      <cds-pagination cds-layout="horizontal gap:xxs align:center">
        <cds-pagination-button disabled>First</cds-pagination-button>
        <cds-pagination-button disabled>Prev</cds-pagination-button>
        <cds-pagination-button>Next</cds-pagination-button>
        <cds-pagination-button>Last</cds-pagination-button>
      </cds-pagination>
    </div>
    <div cds-layout="m-y:md">
      <cds-pagination class="show-pages">
        <cds-pagination-button action="first"></cds-pagination-button>
        <cds-pagination-button action="prev"></cds-pagination-button>
        <cds-pagination-button>1</cds-pagination-button>
        <cds-pagination-button>2</cds-pagination-button>
        ...
        <cds-pagination-button>49</cds-pagination-button>
        <cds-pagination-button class="active">50</cds-pagination-button>
        <cds-pagination-button>51</cds-pagination-button>
        ...
        <cds-pagination-button>99</cds-pagination-button>
        <cds-pagination-button>100</cds-pagination-button>
        <cds-pagination-button action="next"></cds-pagination-button>
        <cds-pagination-button action="last"></cds-pagination-button>
      </cds-pagination>
    </div>
    <div cds-layout="m-y:md">
      <cds-pagination class="show-pages outline-pagination-items">
        <cds-pagination-button action="first"></cds-pagination-button>
        <cds-pagination-button action="prev"></cds-pagination-button>
        <cds-pagination-button>1</cds-pagination-button>
        <cds-pagination-button>2</cds-pagination-button>
        ...
        <cds-pagination-button>49</cds-pagination-button>
        <cds-pagination-button class="active">50</cds-pagination-button>
        <cds-pagination-button>51</cds-pagination-button>
        ...
        <cds-pagination-button>99</cds-pagination-button>
        <cds-pagination-button>100</cds-pagination-button>
        <cds-pagination-button action="next"></cds-pagination-button>
        <cds-pagination-button action="last"></cds-pagination-button>
      </cds-pagination>
    </div>
  `;
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

      .custom-outline-pagination-items cds-pagination-button {
        --border-color: #666666;
        --border-width: 1px;
        --border-radius: 0;

        --disabled-color: #666666;
        --disabled-background: #999999;
      }

      .custom-outline-pagination-items cds-pagination-button:not([disabled]):hover {
        --background: #666666;
        --color: #ffffff;
      }

      .custom-outline-pagination-items cds-pagination-number {
        --input-border-color: #666666;
        --input-border-width: 1px;
        --input-border-radius: 0;
      }
    </style>
    <div cds-layout="m-y:sm" class="custom-pagination-color">
      <cds-pagination cds-layout="horizontal gap:xs align:center">
        <cds-pagination-button action="first" disabled></cds-pagination-button>
        <cds-pagination-button action="prev" disabled></cds-pagination-button>
        <cds-input cds-pagination-number box>
          <label cds-layout="display:screen-reader-only">suffix</label>
          <input type="text" value="40" size="2" />
          <cds-control-message action="suffix" readonly>/ 80</cds-control-message>
        </cds-input>
        <cds-pagination-button action="next"></cds-pagination-button>
        <cds-pagination-button action="last"></cds-pagination-button>
      </cds-pagination>
    </div>
    <div cds-layout="m-y:md" class="custom-pagination-button">
      <cds-pagination>
        <cds-pagination-button action="first" disabled></cds-pagination-button>
        <cds-pagination-button action="prev" disabled></cds-pagination-button>
        <cds-input cds-pagination-number box>
          <label cds-layout="display:screen-reader-only">suffix</label>
          <input type="text" value="40" size="2" />
          <cds-control-message action="suffix" readonly>/ 80</cds-control-message>
        </cds-input>
        <cds-pagination-button action="next"></cds-pagination-button>
        <cds-pagination-button action="last"></cds-pagination-button>
      </cds-pagination>
    </div>
    <div cds-layout="m-y:md" class="custom-outline-pagination-items">
      <cds-pagination>
        <cds-pagination-button action="first" disabled></cds-pagination-button>
        <cds-pagination-button action="prev" disabled></cds-pagination-button>
        <cds-input cds-pagination-number box>
          <label cds-layout="display:screen-reader-only">suffix</label>
          <input type="text" value="40" size="2" />
          <cds-control-message action="suffix" readonly>/ 80</cds-control-message>
        </cds-input>
        <cds-pagination-button action="next"></cds-pagination-button>
        <cds-pagination-button action="last"></cds-pagination-button>
      </cds-pagination>
    </div>
  `;
};

export const customPaginationAlignments = () => {
  return html`
    <div cds-layout="m-y:sm">
      <cds-pagination cds-layout="horizontal gap:md align:left">
        <cds-pagination-button action="first" disabled></cds-pagination-button>
        <cds-pagination-button action="prev" disabled></cds-pagination-button>
        <cds-input cds-pagination-number box>
          <label cds-layout="display:screen-reader-only">suffix</label>
          <input type="text" value="40" size="2" />
          <cds-control-message action="suffix" readonly>/ 80</cds-control-message>
        </cds-input>
        <cds-pagination-button action="next"></cds-pagination-button>
        <cds-pagination-button action="last"></cds-pagination-button>
      </cds-pagination>
    </div>
    <div cds-layout="m-y:sm">
      <cds-pagination cds-layout="horizontal gap:md align:right">
        <cds-pagination-button action="first" disabled></cds-pagination-button>
        <cds-pagination-button action="prev" disabled></cds-pagination-button>
        <cds-input cds-pagination-number box>
          <label cds-layout="display:screen-reader-only">suffix</label>
          <input type="text" value="40" size="2" />
          <cds-control-message action="suffix" readonly>/ 80</cds-control-message>
        </cds-input>
        <cds-pagination-button action="next"></cds-pagination-button>
        <cds-pagination-button action="last"></cds-pagination-button>
      </cds-pagination>
    </div>
    <div cds-layout="m-y:sm">
      <cds-pagination cds-layout="vertical gap:md align:center">
        <cds-pagination-button disabled>
          <cds-icon shape="angle" direction="up"></cds-icon>
        </cds-pagination-button>
        1 / 3
        <cds-pagination-button>
          <cds-icon shape="angle" direction="down"></cds-icon>
        </cds-pagination-button>
      </cds-pagination>
    </div>
    <div cds-layout="m-y:sm">
      <cds-pagination cds-layout="vertical gap:md align:center">
        <cds-pagination-button disabled>
          <cds-icon shape="angle" direction="up"></cds-icon>
        </cds-pagination-button>
        <cds-input cds-pagination-number box>
          <label cds-layout="display:screen-reader-only">suffix</label>
          <input type="text" value="40" size="2" />
          <cds-control-message action="suffix" readonly>/ 80</cds-control-message>
        </cds-input>
        <cds-pagination-button>
          <cds-icon shape="angle" direction="down"></cds-icon>
        </cds-pagination-button>
      </cds-pagination>
    </div>
  `;
};

export const darkTheme = () => {
  return html`
    <div cds-layout="m-y:sm" cds-theme="dark">
      <cds-pagination>
        <cds-pagination-button action="first" disabled></cds-pagination-button>
        <cds-pagination-button action="prev" disabled></cds-pagination-button>
        <cds-input cds-pagination-number box>
          <label cds-layout="display:screen-reader-only">suffix</label>
          <input type="text" value="40" size="2" />
          <cds-control-message action="suffix" readonly>/ 80</cds-control-message>
        </cds-input>
        <cds-pagination-button action="next"></cds-pagination-button>
        <cds-pagination-button action="last"></cds-pagination-button>
      </cds-pagination>
    </div>
  `;
};
