/*
 * Copyright (c) 2016-2019 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClrIconModule } from '@clr/angular';

@Component({
  template: `<clr-icon [shape]="shape" [title]="title" [size]="size"></clr-icon>`,
})
class TestComponent {
  public shape: string;
  public title: string;
  public size: number;
}

describe('Clarity Icon in Angular', function() {
  let fixture: ComponentFixture<any>;
  let iconElement: any;
  let testComponent: TestComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [ClrIconModule], declarations: [TestComponent] });
    fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
    testComponent = fixture.componentInstance;
    iconElement = fixture.nativeElement.querySelector('clr-icon');
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should not bind to any property initially', () => {
    expect(iconElement.hasAttribute('title')).toBeFalsy();
    expect(iconElement.hasAttribute('size')).toBeFalsy();
    expect(iconElement.hasAttribute('title')).toBeFalsy();
  });

  it('binds to shape property to shape attribute', () => {
    testComponent.shape = 'test-shape';
    fixture.detectChanges();
    expect(iconElement.getAttribute('shape')).toBe('test-shape');
  });

  it('binds to title property title attribute', () => {
    testComponent.title = 'test title';
    fixture.detectChanges();
    expect(iconElement.getAttribute('title')).toBe('test title');
  });

  it('binds to size property to size attribute', () => {
    testComponent.size = 123;
    fixture.detectChanges();
    expect(iconElement.getAttribute('size')).toBe('123');
  });

  it('removing value from property removes attribute value as well', () => {
    testComponent.shape = 'test-shape';
    fixture.detectChanges();
    expect(iconElement.getAttribute('shape')).toBe('test-shape');
    testComponent.shape = '';
    fixture.detectChanges();
    expect(iconElement.getAttribute('shape')).toBe('');
    delete testComponent.shape;
    fixture.detectChanges();
    expect(iconElement.hasAttribute('shape')).toBeFalsy();
  });
});
