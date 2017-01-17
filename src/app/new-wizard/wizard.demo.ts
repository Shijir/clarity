/*
 * Copyright (c) 2016 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import {Component, ViewEncapsulation} from "@angular/core";

// TODO: remove "NEW" when finishing up

@Component({
   moduleId: module.id,
   selector: "clr-new-wizard-demo",
   styleUrls: ["./wizard.demo.css"],
   template: `
      <h2>New Wizard</h2>
      <ul>
         <li><a [routerLink]="['./basic-demo']">Basic Demo</a></li>
      </ul>
      <router-outlet></router-outlet>
   `,
   encapsulation: ViewEncapsulation.None
})
export class NewWizardDemo {}
