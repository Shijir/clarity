/*
 * Copyright (c) 2016 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {addHelpers} from "../helpers.spec";

import ButtonHub from "./button-hub.spec";
import WizardNavigation from "./wizard-navigation.spec";
import PageCollection from "./page-collection.spec";
import HeaderActions from "./header-actions.spec";

fdescribe("Providers", function() {

    addHelpers();

    ButtonHub();

    WizardNavigation();

    PageCollection();

    HeaderActions();

});