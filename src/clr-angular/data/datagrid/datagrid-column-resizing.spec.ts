/*
 * Copyright (c) 2016-2018 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { ClrDatagridModule } from './datagrid.module';
import { ColumnResizerService } from './providers/column-resizer.service';
import { DatagridHeaderRenderer } from './render/header-renderer';
import { ClrDraggable } from '../../utils/drag-and-drop/draggable/draggable';
import { ClrDragEvent } from '../../utils/drag-and-drop/drag-event';
import { DragEventType } from '../../utils/drag-and-drop/interfaces/drag-event.interface';

@Component({
  template: `
    <div class="container" style="width: 1100px;">
        <clr-datagrid>
            <clr-dg-column>First</clr-dg-column>
            <clr-dg-column [style.min-width.px]="120">Second</clr-dg-column>
            <clr-dg-column [style.width.px]="column3WidthStrict" 
            (clrDgColumnResize)="newWidth = $event">Three</clr-dg-column>
            <clr-dg-column>Four</clr-dg-column>
            <clr-dg-row *clrDgItems="let item of items">
                <clr-dg-cell>{{item}}</clr-dg-cell>
                <clr-dg-cell [style.min-width.px]="120">{{item * 2}}</clr-dg-cell>
                <clr-dg-cell>{{item * 3}}</clr-dg-cell>
                <clr-dg-cell>{{item * 4}}</clr-dg-cell>
            </clr-dg-row>
            <clr-dg-footer>{{items.length}} items</clr-dg-footer>
        </clr-datagrid>
    </div>
`,
})
class ColumnResizerTest {
  items = [1, 2, 3];
  column3WidthStrict: number = 200;
  newWidth: number;
}

export default function(): void {
  fdescribe('Datagrid Columns Resizing', function() {
    let fixture: ComponentFixture<any>;

    let columnHeader1DebugElement: DebugElement;
    let columnHeader2DebugElement: DebugElement;
    let columnHeader3DebugElement: DebugElement;
    let columnHeader4DebugElement: DebugElement;

    let columnHeaderDirective1: DatagridHeaderRenderer;
    let columnHeaderDirective2: DatagridHeaderRenderer;
    let columnHeaderDirective3: DatagridHeaderRenderer;
    let columnHeaderDirective4: DatagridHeaderRenderer;

    let columnHeader1Element: HTMLElement;
    let columnHeader2Element: HTMLElement;
    let columnHeader3Element: HTMLElement;
    let columnHeader4Element: HTMLElement;

    let columnHeader1ResizerService: ColumnResizerService;
    let columnHeader2ResizerService: ColumnResizerService;
    let columnHeader3ResizerService: ColumnResizerService;
    let columnHeader4ResizerService: ColumnResizerService;

    let columnHeader1DraggableDebugElement: DebugElement;
    let columnHeader2DraggableDebugElement: DebugElement;
    let columnHeader3DraggableDebugElement: DebugElement;
    let columnHeader4DraggableDebugElement: DebugElement;

    let columnHeader1DraggableDirective: ClrDraggable<any>;
    let columnHeader2DraggableDirective: ClrDraggable<any>;
    let columnHeader3DraggableDirective: ClrDraggable<any>;
    let columnHeader4DraggableDirective: ClrDraggable<any>;

    const widthOf = (el: HTMLElement): number => {
      return Math.round(el.getBoundingClientRect().width);
    };

    const emulateResizeOnColumn = (moveX: number, columnDraggable: ClrDraggable<any>): void => {
      const moveEvent = new ClrDragEvent({
        type: DragEventType.DRAG_MOVE,
        dragPosition: { pageX: 0, pageY: 0, moveX: moveX, moveY: 0 },
      });
      columnDraggable.dragStartEmitter.emit();
      columnDraggable.dragMoveEmitter.emit(moveEvent);
      columnDraggable.dragEndEmitter.emit();
    };

    beforeEach(function() {
      TestBed.configureTestingModule({
        imports: [ClrDatagridModule],
        declarations: [ColumnResizerTest],
      });

      fixture = TestBed.createComponent(ColumnResizerTest);
      fixture.detectChanges();
      columnHeader1DebugElement = fixture.debugElement.queryAll(By.directive(DatagridHeaderRenderer))[0];
      columnHeader2DebugElement = fixture.debugElement.queryAll(By.directive(DatagridHeaderRenderer))[1];
      columnHeader3DebugElement = fixture.debugElement.queryAll(By.directive(DatagridHeaderRenderer))[2];
      columnHeader4DebugElement = fixture.debugElement.queryAll(By.directive(DatagridHeaderRenderer))[3];

      columnHeader1ResizerService = columnHeader1DebugElement.injector.get(ColumnResizerService);
      columnHeader2ResizerService = columnHeader2DebugElement.injector.get(ColumnResizerService);
      columnHeader3ResizerService = columnHeader3DebugElement.injector.get(ColumnResizerService);
      columnHeader4ResizerService = columnHeader4DebugElement.injector.get(ColumnResizerService);

      columnHeader1Element = columnHeader1DebugElement.nativeElement;
      columnHeader2Element = columnHeader2DebugElement.nativeElement;
      columnHeader3Element = columnHeader3DebugElement.nativeElement;
      columnHeader4Element = columnHeader4DebugElement.nativeElement;

      columnHeader1DraggableDebugElement = fixture.debugElement.queryAll(By.directive(ClrDraggable))[0];
      columnHeader2DraggableDebugElement = fixture.debugElement.queryAll(By.directive(ClrDraggable))[1];
      columnHeader3DraggableDebugElement = fixture.debugElement.queryAll(By.directive(ClrDraggable))[2];
      columnHeader4DraggableDebugElement = fixture.debugElement.queryAll(By.directive(ClrDraggable))[3];

      columnHeader1DraggableDirective = columnHeader1DraggableDebugElement.injector.get(ClrDraggable);
      columnHeader2DraggableDirective = columnHeader2DraggableDebugElement.injector.get(ClrDraggable);
      columnHeader3DraggableDirective = columnHeader3DraggableDebugElement.injector.get(ClrDraggable);
      columnHeader4DraggableDirective = columnHeader4DraggableDebugElement.injector.get(ClrDraggable);
    });

    it("each header's actual width should be greater than its minumum width initially", function() {
      expect(columnHeader1ResizerService.minColumnWidth).toBe(96);
      expect(columnHeader2ResizerService.minColumnWidth).toBe(120);
      expect(columnHeader3ResizerService.minColumnWidth).toBe(96);
      expect(columnHeader4ResizerService.minColumnWidth).toBe(96);
      expect(widthOf(columnHeader1Element)).toBeGreaterThan(columnHeader1ResizerService.minColumnWidth);
      expect(widthOf(columnHeader2Element)).toBeGreaterThan(columnHeader2ResizerService.minColumnWidth);
      expect(widthOf(columnHeader3Element)).toBeGreaterThan(columnHeader3ResizerService.minColumnWidth);
      expect(widthOf(columnHeader4Element)).toBeGreaterThan(columnHeader4ResizerService.minColumnWidth);
    });

    it("each header's actual width should be greater than its minumum width initially", function() {
      expect(columnHeader1ResizerService.minColumnWidth).toBe(96);
      expect(columnHeader2ResizerService.minColumnWidth).toBe(120);
      expect(columnHeader3ResizerService.minColumnWidth).toBe(96);
      expect(columnHeader4ResizerService.minColumnWidth).toBe(96);
      expect(widthOf(columnHeader1Element)).toBeGreaterThan(columnHeader1ResizerService.minColumnWidth);
      expect(widthOf(columnHeader2Element)).toBeGreaterThan(columnHeader2ResizerService.minColumnWidth);
      expect(widthOf(columnHeader3Element)).toBeGreaterThan(columnHeader3ResizerService.minColumnWidth);
      expect(widthOf(columnHeader4Element)).toBeGreaterThan(columnHeader4ResizerService.minColumnWidth);
    });

    it("shouldn't shrink below its min-width if column expands by large size", function() {
      const resizeBy = 1000;
      const column1WidthBeforeResize = widthOf(columnHeader1Element);
      emulateResizeOnColumn(resizeBy, columnHeader1DraggableDirective);
      expect(widthOf(columnHeader1Element)).toBe(column1WidthBeforeResize + resizeBy);
      expect(widthOf(columnHeader2Element)).toBe(120);
      expect(widthOf(columnHeader3Element)).toBe(200);
      expect(widthOf(columnHeader4Element)).toBe(96);
    });

    // it('should expand the column width by 50px', function() {
    //   column3ResizerDirective.dragStartHandler();
    //   pageDragPosX = column3ResizerDirective.pageStartPositionX;
    //   onMoveEvent = { pageX: pageDragPosX + 50 };
    //   column3ResizerDirective.dragMoveHandler(onMoveEvent);
    //   expect(column3ResizerDirective.dragDistancePositionX).toBe(50);
    //   expect(getComputedStyle(column3DragDispatcher.handleTrackerRef.nativeElement).getPropertyValue('right')).toBe(
    //     '-50px'
    //   );
    //   column3ResizerDirective.dragEndHandler();
    //   // IE has 1px off for some reason
    //   expect(domAdapter.clientRect(column3ResizerDirective.columnEl).width).toBeWithinRange(249, 250);
    // });
    // it('should shrink the column width by 50px', function() {
    //   column3ResizerDirective.dragStartHandler();
    //   pageDragPosX = column3ResizerDirective.pageStartPositionX;
    //   onMoveEvent = { pageX: pageDragPosX - 50 };
    //   column3ResizerDirective.dragMoveHandler(onMoveEvent);
    //   expect(column3ResizerDirective.dragDistancePositionX).toBe(-50);
    //   expect(document.body.style.cursor).toBe('col-resize');
    //   expect(getComputedStyle(column3DragDispatcher.handleTrackerRef.nativeElement).getPropertyValue('right')).toBe(
    //     '50px'
    //   );
    //   column3ResizerDirective.dragEndHandler();
    //   expect(domAdapter.clientRect(column3ResizerDirective.columnEl).width).toBe(150);
    // });
    // it("shouldn't shrink the column width if the actual width equals the minimum width", function() {
    //   context.testComponent.column3WidthStrict = 96;
    //   context.detectChanges();
    //   column3ResizerDirective.dragStartHandler();
    //   pageDragPosX = column3ResizerDirective.pageStartPositionX;
    //   onMoveEvent = { pageX: pageDragPosX - 50 };
    //   column3ResizerDirective.dragMoveHandler(onMoveEvent);
    //   expect(column3ResizerDirective.dragDistancePositionX).toBe(0);
    //   expect(document.body.style.cursor).toBe('col-resize');
    //   expect(getComputedStyle(column3DragDispatcher.handleTrackerRef.nativeElement).getPropertyValue('right')).toBe(
    //     '0px'
    //   );
    //   column3ResizerDirective.dragEndHandler();
    //   expect(domAdapter.clientRect(column3ResizerDirective.columnEl).width).toBe(96);
    // });
    // it("shouldn't shrink column below its minimum width", function() {
    //   context.testComponent.column3WidthStrict = 120;
    //   context.detectChanges();
    //   column3ResizerDirective.dragStartHandler();
    //   pageDragPosX = column3ResizerDirective.pageStartPositionX;
    //   onMoveEvent = { pageX: pageDragPosX - 50 };
    //   column3ResizerDirective.dragMoveHandler(onMoveEvent);
    //   /* Default minimum width is 96px; thus, 120-96 = 24 so it could be dragged and shrunk by only 24px. */
    //   expect(column3ResizerDirective.dragDistancePositionX).toBe(-24);
    //   expect(getComputedStyle(column3DragDispatcher.handleTrackerRef.nativeElement).getPropertyValue('right')).toBe(
    //     '24px'
    //   );
    //   column3ResizerDirective.dragEndHandler();
    //   expect(domAdapter.clientRect(column3ResizerDirective.columnEl).width).toBe(96);
    // });
    // it('should render the drag tracker in the appropriate styles', function() {
    //   expect(getComputedStyle(column3DragDispatcher.handleTrackerRef.nativeElement).display).toBe('none');
    //   column3ResizerDirective.dragStartHandler();
    //   expect(getComputedStyle(column3DragDispatcher.handleTrackerRef.nativeElement).display).toBe('block');
    //   pageDragPosX = column3ResizerDirective.pageStartPositionX;
    //   onMoveEvent = { pageX: pageDragPosX + 50 };
    //   column3ResizerDirective.dragMoveHandler(onMoveEvent);
    //   expect(document.body.style.cursor).toBe('col-resize');
    //   column3ResizerDirective.dragEndHandler();
    //   expect(document.body.style.cursor).toBe('auto');
    //   expect(getComputedStyle(column3DragDispatcher.handleTrackerRef.nativeElement).getPropertyValue('right')).toBe(
    //     '0px'
    //   );
    //   expect(getComputedStyle(column3DragDispatcher.handleTrackerRef.nativeElement).getPropertyValue('display')).toBe(
    //     'none'
    //   );
    // });
    // it('emits an event once dragging ends', function() {
    //   emulateResize(column3ResizerDirective, 50);
    //   expect(context.testComponent.newWidth).toBe(250);
    // });
    // it('reset the columnResizeBy property after dragging ends', function() {
    //   emulateResize(column3ResizerDirective, 50);
    //   expect(column3ResizerDirective.columnResizeBy).toBe(0);
    // });
    // it('if a column shrinks, other flexible columns should expand.', function() {
    //   const column1InitialWidth = domAdapter.clientRect(column1ResizerDirective.columnEl).width;
    //   const column2InitialWidth = domAdapter.clientRect(column2ResizerDirective.columnEl).width;
    //   const column4InitialWidth = domAdapter.clientRect(column4ResizerDirective.columnEl).width;
    //   emulateResize(column3ResizerDirective, -50);
    //   expect(domAdapter.clientRect(column1ResizerDirective.columnEl).width).toBeGreaterThan(column1InitialWidth);
    //   expect(domAdapter.clientRect(column2ResizerDirective.columnEl).width).toBeGreaterThan(column2InitialWidth);
    //   expect(domAdapter.clientRect(column3ResizerDirective.columnEl).width).toBe(150);
    //   expect(domAdapter.clientRect(column4ResizerDirective.columnEl).width).toBeGreaterThan(column4InitialWidth);
    // });
    // it('if a column expands, other flexible columns should shrink.', function() {
    //   const column1InitialWidth = domAdapter.clientRect(column1ResizerDirective.columnEl).width;
    //   const column2InitialWidth = domAdapter.clientRect(column2ResizerDirective.columnEl).width;
    //   const column4InitialWidth = domAdapter.clientRect(column4ResizerDirective.columnEl).width;
    //   emulateResize(column3ResizerDirective, 50);
    //   expect(domAdapter.clientRect(column1ResizerDirective.columnEl).width).toBeLessThan(column1InitialWidth);
    //   expect(domAdapter.clientRect(column2ResizerDirective.columnEl).width).toBeLessThan(column2InitialWidth);
    //   // IE is off 1px
    //   expect(domAdapter.clientRect(column3ResizerDirective.columnEl).width).toBeWithinRange(249, 250);
    //   expect(domAdapter.clientRect(column4ResizerDirective.columnEl).width).toBeLessThan(column4InitialWidth);
    // });
    // it('columns with strict width should keep their widths if other columns get resized', function() {
    //   const column1InitialWidth = domAdapter.clientRect(column1ResizerDirective.columnEl).width;
    //   const column2InitialWidth = domAdapter.clientRect(column2ResizerDirective.columnEl).width;
    //   const column4InitialWidth = domAdapter.clientRect(column4ResizerDirective.columnEl).width;
    //   emulateResize(column1ResizerDirective, -50);
    //   expect(domAdapter.clientRect(column1ResizerDirective.columnEl).width).toBe(column1InitialWidth - 50);
    //   expect(domAdapter.clientRect(column2ResizerDirective.columnEl).width).toBeGreaterThan(column2InitialWidth);
    //   expect(domAdapter.clientRect(column3ResizerDirective.columnEl).width).toBe(200);
    //   expect(domAdapter.clientRect(column4ResizerDirective.columnEl).width).toBeGreaterThan(column4InitialWidth);
    // });
    // it('should give resized columns strict width class', function() {
    //   expect(column1ResizerDirective.columnEl.classList.contains('datagrid-fixed-width')).toBe(false);
    //   expect(column2ResizerDirective.columnEl.classList.contains('datagrid-fixed-width')).toBe(false);
    //   expect(column3ResizerDirective.columnEl.classList.contains('datagrid-fixed-width')).toBe(true);
    //   expect(column4ResizerDirective.columnEl.classList.contains('datagrid-fixed-width')).toBe(false);
    //   emulateResize(column1ResizerDirective, -50);
    //   expect(column1ResizerDirective.columnEl.classList.contains('datagrid-fixed-width')).toBe(true);
    //   expect(column2ResizerDirective.columnEl.classList.contains('datagrid-fixed-width')).toBe(false);
    //   expect(column3ResizerDirective.columnEl.classList.contains('datagrid-fixed-width')).toBe(true);
    //   expect(column4ResizerDirective.columnEl.classList.contains('datagrid-fixed-width')).toBe(false);
    // });
    // it('should make the last column flexible and set the min-width once other columns become strict', function() {
    //   emulateResize(column2ResizerDirective, -50);
    //   emulateResize(column4ResizerDirective, -50);
    //   expect(column1ResizerDirective.columnEl.classList.contains('datagrid-fixed-width')).toBe(false);
    //   expect(column2ResizerDirective.columnEl.classList.contains('datagrid-fixed-width')).toBe(true);
    //   expect(column3ResizerDirective.columnEl.classList.contains('datagrid-fixed-width')).toBe(true);
    //   expect(column4ResizerDirective.columnEl.classList.contains('datagrid-fixed-width')).toBe(true);
    //   emulateResize(column1ResizerDirective, -50);
    //   expect(column1ResizerDirective.columnEl.classList.contains('datagrid-fixed-width')).toBe(true);
    //   expect(column2ResizerDirective.columnEl.classList.contains('datagrid-fixed-width')).toBe(true);
    //   expect(column3ResizerDirective.columnEl.classList.contains('datagrid-fixed-width')).toBe(true);
    //   expect(column4ResizerDirective.columnEl.classList.contains('datagrid-fixed-width')).toBe(false);
    // });
  });
}
