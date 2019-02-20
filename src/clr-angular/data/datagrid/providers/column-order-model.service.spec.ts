/*
 * Copyright (c) 2016-2018 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ColumnOrderModelService } from './column-order-model.service';
import { ColumnOrdersCoordinatorService } from './column-orders-coordinator.service';
import { DatagridHideableColumnModel } from '../datagrid-hideable-column.model';
import { DomAdapter } from '../../../utils/dom-adapter/dom-adapter';
import { createMockHeaderEl, destroyMockHeaderEl } from './column-order-model.service.mock';
import { DragEventInterface, DragEventType } from '../../../utils/drag-and-drop/interfaces/drag-event.interface';

export default function(): void {
  fdescribe('ColumnOrderModelService', function() {
    let columnOrdersCoordinatorService = new ColumnOrdersCoordinatorService();
    let columnOrderModelService: ColumnOrderModelService;
    let columnOrderModelServicePrev: ColumnOrderModelService;
    let columnOrderModelServiceNext: ColumnOrderModelService;

    const generateMockDropHeaderEvent = (
      columnModelService: ColumnOrderModelService
    ): DragEventInterface<ColumnOrderModelService> => {
      return {
        type: DragEventType.DROP,
        dragPosition: { pageX: 0, pageY: 0, moveX: 0, moveY: 0 },
        dragDataTransfer: columnModelService,
      };
    };

    beforeEach(function() {
      columnOrdersCoordinatorService = new ColumnOrdersCoordinatorService();

      columnOrderModelService = new ColumnOrderModelService(columnOrdersCoordinatorService, new DomAdapter());
      columnOrderModelServicePrev = new ColumnOrderModelService(columnOrdersCoordinatorService, new DomAdapter());
      columnOrderModelServiceNext = new ColumnOrderModelService(columnOrdersCoordinatorService, new DomAdapter());

      // Here visually their columns would appear in the following order:
      // columnOrderModelServicePrev, columnOrderModelService, columnOrderModelServiceNext;
      columnOrderModelService.flexOrder = 1;
      columnOrderModelService.headerEl = createMockHeaderEl(200, 40);

      columnOrderModelServicePrev.flexOrder = 0;
      columnOrderModelServicePrev.headerEl = createMockHeaderEl(400, 40);

      columnOrderModelServiceNext.flexOrder = 2;
      columnOrderModelServiceNext.headerEl = createMockHeaderEl(300, 40);

      columnOrdersCoordinatorService.orderModels.push(columnOrderModelService);
      columnOrdersCoordinatorService.orderModels.push(columnOrderModelServicePrev);
      columnOrdersCoordinatorService.orderModels.push(columnOrderModelServiceNext);
    });

    afterEach(function() {
      destroyMockHeaderEl(columnOrderModelService.headerEl);
      destroyMockHeaderEl(columnOrderModelServicePrev.headerEl);
      destroyMockHeaderEl(columnOrderModelServiceNext.headerEl);
    });

    it('should have column group id from column order coordinator service', function() {
      expect(columnOrderModelService.columnGroupId).toBe(columnOrdersCoordinatorService.columnGroupId);
      expect(columnOrderModelServicePrev.columnGroupId).toBe(columnOrdersCoordinatorService.columnGroupId);
      expect(columnOrderModelServiceNext.columnGroupId).toBe(columnOrdersCoordinatorService.columnGroupId);
    });

    it('returns correct boolean value if column appears at first', function() {
      expect(columnOrderModelService.isFirst).toBeFalsy();
      expect(columnOrderModelServicePrev.isFirst).toBeTruthy();
      expect(columnOrderModelServiceNext.isFirst).toBeFalsy();
    });

    it('returns correct boolean value if column appears at end', function() {
      expect(columnOrderModelService.isLast).toBeFalsy();
      expect(columnOrderModelServicePrev.isLast).toBeFalsy();
      expect(columnOrderModelServiceNext.isLast).toBeTruthy();
    });

    it('returns width of its own column', function() {
      expect(columnOrderModelService.headerWidth).toBe(200);
    });

    it('returns width of previous column', function() {
      expect(columnOrderModelService.previousVisibleHeaderWidth).toBe(400);
    });

    it('returns width of next column', function() {
      expect(columnOrderModelService.nextVisibleHeaderWidth).toBe(300);
    });

    it('returns 0 for the previousVisibleHeaderWidth of the very first visible column', function() {
      expect(columnOrderModelServicePrev.previousVisibleHeaderWidth).toBe(0);
    });

    it('returns 0 for the nextVisibleHeaderWidth of the very last visible column', function() {
      expect(columnOrderModelServiceNext.nextVisibleHeaderWidth).toBe(0);
    });

    it('returns correct boolean value if column is hidden', function() {
      columnOrderModelService.hideableColumnModel = new DatagridHideableColumnModel(null, 'dg-col-0', true);
      columnOrderModelServicePrev.hideableColumnModel = new DatagridHideableColumnModel(null, 'dg-col-0', false);
      columnOrderModelServiceNext.hideableColumnModel = new DatagridHideableColumnModel(null, 'dg-col-0', true);
      expect(columnOrderModelService.isHidden).toBeTruthy();
      expect(columnOrderModelServicePrev.isHidden).toBeFalsy();
      expect(columnOrderModelServiceNext.isHidden).toBeTruthy();
    });

    it('returns correct next visible model', function() {
      // visually the middle one and hidden
      columnOrderModelService.hideableColumnModel = new DatagridHideableColumnModel(null, 'dg-col-0', true);

      // visually the first one
      columnOrderModelServicePrev.hideableColumnModel = new DatagridHideableColumnModel(null, 'dg-col-0', false);

      // visually the last one
      columnOrderModelServiceNext.hideableColumnModel = new DatagridHideableColumnModel(null, 'dg-col-0', false);

      expect(columnOrderModelServicePrev.nextVisibleColumnModel).toBe(columnOrderModelServiceNext);
      expect(columnOrderModelServiceNext.nextVisibleColumnModel).toBeUndefined();
    });

    it('returns undefined if it has no next visible column', function() {
      columnOrderModelService.hideableColumnModel = new DatagridHideableColumnModel(null, 'dg-col-0', true);
      columnOrderModelServicePrev.hideableColumnModel = new DatagridHideableColumnModel(null, 'dg-col-0', false);
      columnOrderModelServiceNext.hideableColumnModel = new DatagridHideableColumnModel(null, 'dg-col-0', true);
      expect(columnOrderModelServicePrev.nextVisibleColumnModel).toBeUndefined();
    });

    it('returns correct previous visible model', function() {
      columnOrderModelService.hideableColumnModel = new DatagridHideableColumnModel(null, 'dg-col-0', true);
      columnOrderModelServicePrev.hideableColumnModel = new DatagridHideableColumnModel(null, 'dg-col-0', false);
      columnOrderModelServiceNext.hideableColumnModel = new DatagridHideableColumnModel(null, 'dg-col-0', false);
      expect(columnOrderModelServiceNext.previousVisibleColumnModel).toBe(columnOrderModelServicePrev);
      expect(columnOrderModelServicePrev.previousVisibleColumnModel).toBeUndefined();
    });

    it('returns undefined if it has no previous visible column', function() {
      columnOrderModelService.hideableColumnModel = new DatagridHideableColumnModel(null, 'dg-col-0', true);
      columnOrderModelServicePrev.hideableColumnModel = new DatagridHideableColumnModel(null, 'dg-col-0', true);
      columnOrderModelServiceNext.hideableColumnModel = new DatagridHideableColumnModel(null, 'dg-col-0', false);
      expect(columnOrderModelServiceNext.previousVisibleColumnModel).toBeUndefined();
    });

    fit('swaps flex orders if previous model is dropped on current model', function() {
      columnOrderModelService.dropReceived(generateMockDropHeaderEvent(columnOrderModelServicePrev));

      expect(columnOrderModelServicePrev.flexOrder).toBe(1);
      expect(columnOrderModelService.flexOrder).toBe(0);
      expect(columnOrderModelServiceNext.flexOrder).toBe(2);
    });

    fit('swaps flex orders if next model is dropped on current model', function() {
      columnOrderModelService.dropReceived(generateMockDropHeaderEvent(columnOrderModelServiceNext));

      expect(columnOrderModelServicePrev.flexOrder).toBe(0);
      expect(columnOrderModelService.flexOrder).toBe(2);
      expect(columnOrderModelServiceNext.flexOrder).toBe(1);
    });

    fit('swaps flex orders if next model is dropped on previous model', function() {
      columnOrderModelServicePrev.dropReceived(generateMockDropHeaderEvent(columnOrderModelServiceNext));

      expect(columnOrderModelServicePrev.flexOrder).toBe(1);
      expect(columnOrderModelService.flexOrder).toBe(2);
      expect(columnOrderModelServiceNext.flexOrder).toBe(0);
    });

    fit('swaps flex orders if previous model is dropped on next model', function() {
      columnOrderModelServiceNext.dropReceived(generateMockDropHeaderEvent(columnOrderModelServicePrev));

      expect(columnOrderModelServicePrev.flexOrder).toBe(2);
      expect(columnOrderModelService.flexOrder).toBe(0);
      expect(columnOrderModelServiceNext.flexOrder).toBe(1);
    });
  });
}
