/*
 * Copyright (c) 2016-2019 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { ChangeDetectorRef, Component, EventEmitter, Input, Optional, Output } from '@angular/core';

// providers
import { AlertIconAndTypesService } from './providers/icon-and-types.service';
import { MultiAlertService } from './providers/multi-alert.service';
import { isBooleanAttributeSet } from '../../utils/component/is-boolean-attribute-set';
import { ClrCommonStringsService } from '../../utils/i18n/common-strings.service';

@Component({
  selector: 'clr-alert',
  providers: [AlertIconAndTypesService],
  templateUrl: './alert.html',
  styles: [':host { display: block; }'],
})
export class ClrAlert {
  constructor(
    public iconService: AlertIconAndTypesService,
    public cdr: ChangeDetectorRef,
    @Optional() public multiAlertService: MultiAlertService,
    public commonStrings: ClrCommonStringsService
  ) {}

  @Input('clrAlertSizeSmall') isSmall: boolean = false;
  @Input('clrAlertClosable') closable: boolean = true;
  @Input('clrAlertAppLevel') isAppLevel: boolean = false;

  // Aria
  @Input() clrCloseButtonAriaLabel: string = this.commonStrings.keys.alertCloseButtonAriaLabel;

  @Input('clrAlertClosed') _closed: boolean = false;
  @Output('clrAlertClosedChange') _closedChanged: EventEmitter<boolean> = new EventEmitter<boolean>(false);

  @Input('clrAlertType')
  set alertType(val: string) {
    this.iconService.alertType = val;
  }
  get alertType(): string {
    return this.iconService.alertType;
  }

  /**
   * clrPolite is not used in the code. Is here just to provide
   * code complition and also mark component what type AriaLive
   * will be used.
   */
  @Input('clrPolite') polite: boolean = true;
  @Input('clrAssertive') assertive: boolean;
  @Input('clrOff') off: boolean;
  /**
   * There is an order on how the attributes will take effect.
   * Assertive, Off, Polite.
   *
   * Polite is default if non is passed.
   *
   * In the case of setting all of them to true. Assertive will be used.
   *
   */
  get setAriaLive(): string {
    if (isBooleanAttributeSet(this.assertive)) {
      return 'assertive';
    }
    if (isBooleanAttributeSet(this.off)) {
      return 'off';
    }
    return 'polite';
  }

  @Input('clrAlertIcon')
  set alertIconShape(value: string) {
    this.iconService.alertIconShape = value;
  }

  get alertClass(): string {
    return this.iconService.iconInfoFromType(this.iconService.alertType).cssClass;
  }

  private previouslyHidden = false;
  private hidden = false;

  private detectChangesIfNeeded() {
    if (this.previouslyHidden !== this.hidden) {
      this.previouslyHidden = this.hidden;
      this.cdr.detectChanges();
    }
  }

  get isHidden() {
    if (this.multiAlertService) {
      // change detection issue in production mode causes currentAlert to be undefined when only the first alert exists
      // https://github.com/vmware/clarity/issues/2430
      if (this.multiAlertService.currentAlert === this || this.multiAlertService.count === 0) {
        if (this.hidden === true) {
          this.previouslyHidden = true;
          this.hidden = false;
        }
      } else if (this.hidden === false) {
        this.previouslyHidden = false;
        this.hidden = true;
      }
      this.detectChangesIfNeeded();
    }

    return this.hidden;
  }

  close(): void {
    if (!this.closable) {
      return;
    }
    this._closed = true;
    if (this.multiAlertService) {
      this.multiAlertService.close();
    }
    this._closedChanged.emit(true);
  }

  open(): void {
    this._closed = false;
    this._closedChanged.emit(false);
  }
}
