/*
 * Copyright (c) 2016-2018 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Component, ElementRef, Renderer2 } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DomAdapter } from '../../../utils/dom-adapter/dom-adapter';
import { ClrDragEvent } from '../../../utils/drag-and-drop/drag-event';
import { generateDragPosition } from '../../../utils/drag-and-drop/helpers.spec';
import { DragEventType } from '../../../utils/drag-and-drop/interfaces/drag-event.interface';
import { DatagridRenderOrganizer } from '../render/render-organizer';
import { ColumnResizerService } from './column-resizer.service';

export default function(): void {
  describe('Column Resizer Service', function() {
    let columnResizerService: ColumnResizerService;
    let datagridRenderOrganizer: DatagridRenderOrganizer;

    let fixture: ComponentFixture<any>;
    let columnHostEl: HTMLElement;

    // The component's host element has the width of 200px;
    // The max resize range would be 104px as the min width of column is 96px (200px - 96px);

    // We will test on two different drag events:

    // (a) one within the max resize range:
    const mockIntDragEventWithinRange = {
      type: DragEventType.DRAG_MOVE,
      dragPosition: generateDragPosition([10, 20], [50, 60]), // moveX will be (50 - 10);
    };
    const mockExtDragEventWithinRange = new ClrDragEvent(mockIntDragEventWithinRange);

    // (b) one exceeded the max resize range:
    const mockIntDragEventExceededRange = {
      type: DragEventType.DRAG_MOVE,
      dragPosition: generateDragPosition([10, 20], [-95, 60]), // moveX will be (-95 - 10);
    };
    const mockExtDragEventExceededRange = new ClrDragEvent(mockIntDragEventExceededRange);

    beforeEach(function() {
      TestBed.configureTestingModule({ declarations: [TestComponent] });

      fixture = TestBed.createComponent(TestComponent);
      fixture.detectChanges();

      columnHostEl = fixture.nativeElement;
      columnResizerService = <ColumnResizerService>fixture.debugElement.injector.get(ColumnResizerService);
      datagridRenderOrganizer = <DatagridRenderOrganizer>fixture.debugElement.injector.get(DatagridRenderOrganizer);
    });

    afterEach(() => {
      fixture.destroy();
    });

    it('provides the min column width', function() {
      expect(columnResizerService.minColumnWidth).toBe(96);
      columnHostEl.style.minWidth = '123px';
      expect(columnResizerService.minColumnWidth).toBe(123);
    });

    it('provides correct max range for resizing', function() {
      columnResizerService.startResize();
      // MAX_RESIZE_RANGE = COLUMN_WIDTH - MIN_COLUMN_WIDTH
      expect(columnResizerService.maxResizeRange).toBe(104);
    });

    it('provides correct resized width', function() {
      columnResizerService.startResize();
      expect(columnResizerService.resizedBy).toBe(0);
      columnResizerService.calculateResize(mockExtDragEventWithinRange);
      expect(columnResizerService.resizedBy).toBe(40);
    });

    it('provides min column width if max resize range gets exceeded', function() {
      columnResizerService.startResize();
      expect(columnResizerService.resizedBy).toBe(0);
      columnResizerService.calculateResize(mockExtDragEventExceededRange);
      expect(columnResizerService.resizedBy).toBe(-columnResizerService.maxResizeRange);
      expect(columnResizerService.widthAfterResize).toBe(columnResizerService.minColumnWidth);
    });

    it('provides boolean value of whether resize is within max range or not', function() {
      columnResizerService.startResize();
      expect(columnResizerService.isWithinMaxResizeRange).toBeTrue();
      columnResizerService.calculateResize(mockExtDragEventExceededRange);
      expect(columnResizerService.isWithinMaxResizeRange).toBeFalse();
      columnResizerService.calculateResize(mockExtDragEventWithinRange);
      expect(columnResizerService.isWithinMaxResizeRange).toBeTrue();
    });

    it('triggers datagrid render resize process', function() {
      spyOn(datagridRenderOrganizer, 'resize');
      columnResizerService.endResize();
      expect(datagridRenderOrganizer.resize).toHaveBeenCalled();
    });
  });
}

@Component({
  providers: [ColumnResizerService, DomAdapter, DatagridRenderOrganizer], // Should be declared here in a component level, not in the TestBed because Renderer2 wouldn't be present
  template: `<div></div>`,
  styles: [':host { position: position; width: 200px; height: 400px;}'],
})
class TestComponent {
  constructor(el: ElementRef, renderer: Renderer2, domAdapter: DomAdapter, organizer: DatagridRenderOrganizer) {}
}
