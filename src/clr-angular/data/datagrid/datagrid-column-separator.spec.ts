/*
 * Copyright (c) 2016-2018 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DomAdapter } from 'src/clr-angular/utils/dom-adapter/dom-adapter';

import { ClrDragAndDropModule } from '../../utils/drag-and-drop/drag-and-drop.module';
import { ClrDragEvent } from '../../utils/drag-and-drop/drag-event';
import { ClrDraggable } from '../../utils/drag-and-drop/draggable/draggable';
import { DragEventType } from '../../utils/drag-and-drop/interfaces/drag-event.interface';
import { ClrDatagridColumnSeparator } from './datagrid-column-separator';
import { ColumnResizerService } from './providers/column-resizer.service';
import { TableSizeService } from './providers/table-size.service';
import { MOCK_TABLE_SIZE_PROVIDER } from './providers/table-size.service.mock';
import { DatagridRenderOrganizer } from './render/render-organizer';

export default function(): void {
  describe('ClrDatagridColumnSeparator component', function() {
    let fixture: ComponentFixture<any>;

    let columnSeparatorDebugElement: DebugElement;
    let columnSeparatorComponent: ClrDatagridColumnSeparator;
    let columnSeparatorElement: HTMLElement;
    let columnResizerService: ColumnResizerService;
    let tableSizeService: TableSizeService;

    let draggableDebugElement: DebugElement;
    let draggableDirective: ClrDraggable<any>;

    beforeEach(function() {
      TestBed.configureTestingModule({
        imports: [ClrDragAndDropModule],
        declarations: [TestComponent, ClrDatagridColumnSeparator],
        providers: [DomAdapter, DatagridRenderOrganizer],
      });

      fixture = TestBed.createComponent(TestComponent);

      fixture.detectChanges();

      columnSeparatorDebugElement = fixture.debugElement.query(By.directive(ClrDatagridColumnSeparator));

      columnSeparatorComponent = columnSeparatorDebugElement.injector.get(ClrDatagridColumnSeparator);
      columnSeparatorElement = columnSeparatorDebugElement.nativeElement;
      columnResizerService = columnSeparatorDebugElement.injector.get(ColumnResizerService);
      tableSizeService = columnSeparatorDebugElement.injector.get(TableSizeService);

      draggableDebugElement = fixture.debugElement.query(By.directive(ClrDraggable));
      draggableDirective = draggableDebugElement.injector.get(ClrDraggable);
    });

    afterEach(function() {
      fixture.destroy();
    });

    it('calls columnResizerService.startResize() and showTracker() methods when resizing starts', function() {
      const resizeTrackerEl: HTMLElement = columnSeparatorElement.querySelector('.datagrid-column-resize-tracker');
      spyOn(columnResizerService, 'startResize');
      spyOn(columnSeparatorComponent, 'showTracker');
      draggableDirective.dragStartEmitter.emit();
      expect(columnResizerService.startResize).toHaveBeenCalled();
      expect(columnSeparatorComponent.showTracker).toHaveBeenCalledWith(resizeTrackerEl);
    });

    it('shows trackerEl when resizing starts', function() {
      const resizeTrackerEl: HTMLElement = columnSeparatorElement.querySelector('.datagrid-column-resize-tracker');
      columnSeparatorComponent.showTracker(resizeTrackerEl);
      expect(resizeTrackerEl.style.height).toBe(tableSizeService.getColumnDragHeight());
    });

    it('calls columnResizerService.calculateResize() and moveTracker() methods when resizing starts', function() {
      const resizeTrackerEl: HTMLElement = columnSeparatorElement.querySelector('.datagrid-column-resize-tracker');
      const moveEvent = new ClrDragEvent({
        type: DragEventType.DRAG_MOVE,
        dragPosition: { pageX: 0, pageY: 0, moveX: 0, moveY: 0 },
      });
      spyOn(columnResizerService, 'calculateResize');
      spyOn(columnSeparatorComponent, 'moveTracker');

      draggableDirective.dragMoveEmitter.emit(moveEvent);
      expect(columnResizerService.calculateResize).toHaveBeenCalledWith(moveEvent);
      expect(columnSeparatorComponent.moveTracker).toHaveBeenCalledWith(resizeTrackerEl);
    });

    it('moves trackerEl during resizing', function() {
      const resizeTrackerEl: HTMLElement = columnSeparatorElement.querySelector('.datagrid-column-resize-tracker');
      columnSeparatorComponent.showTracker(resizeTrackerEl);
      expect(resizeTrackerEl.style.transform).toBe('');
      columnResizerService.resizedBy = 123;
      columnSeparatorComponent.moveTracker(resizeTrackerEl);
      expect(resizeTrackerEl.style.transform).toBe(`translateX(${columnResizerService.resizedBy}px)`);
    });

    it('calls columnResizerService.endResize() and hideTracker() methods when resizing starts', function() {
      const resizeTrackerEl: HTMLElement = columnSeparatorElement.querySelector('.datagrid-column-resize-tracker');
      spyOn(columnResizerService, 'endResize');
      spyOn(columnSeparatorComponent, 'hideTracker');
      draggableDirective.dragEndEmitter.emit();
      expect(columnResizerService.endResize).toHaveBeenCalled();
      expect(columnSeparatorComponent.hideTracker).toHaveBeenCalledWith(resizeTrackerEl);
    });

    it('hides trackerEl when resizing ends', function() {
      const resizeTrackerEl: HTMLElement = columnSeparatorElement.querySelector('.datagrid-column-resize-tracker');
      columnSeparatorComponent.showTracker(resizeTrackerEl);
      columnResizerService.resizedBy = 123;
      columnSeparatorComponent.moveTracker(resizeTrackerEl);

      columnSeparatorComponent.hideTracker(resizeTrackerEl);
      expect(resizeTrackerEl.style.display).toBe('none');
      expect(resizeTrackerEl.style.transform).toBe('translateX(0px)');
    });

    it('toggles redflag class on trackerEl whether resizing exceeds max range or not', function() {
      const resizeTrackerEl: HTMLElement = columnSeparatorElement.querySelector('.datagrid-column-resize-tracker');
      columnSeparatorComponent.showTracker(resizeTrackerEl);
      columnResizerService.isWithinMaxResizeRange = false;
      columnSeparatorComponent.moveTracker(resizeTrackerEl);
      expect(resizeTrackerEl.classList.contains('exceeded-max')).toBeTrue();
      columnResizerService.isWithinMaxResizeRange = true;
      columnSeparatorComponent.moveTracker(resizeTrackerEl);
      expect(resizeTrackerEl.classList.contains('exceeded-max')).toBeFalse();
    });
  });
}
@Component({
  template: `<clr-dg-column-separator></clr-dg-column-separator>`,
  styles: [':host { position: position; width: 200px; height: 400px;}'],
  providers: [ColumnResizerService, MOCK_TABLE_SIZE_PROVIDER],
})
class TestComponent {}
