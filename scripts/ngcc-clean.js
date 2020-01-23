/*
 * Copyright (c) 2016-2020 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

'use strict';

const fs = require('fs');

// We have to run ngcc during postinstall since it does not support parallel builds https://github.com/angular/angular/issues/32431
// ngcc pollutes package.json files in the monorepo use case https://github.com/angular/angular/issues/33395
// this script removes the breaking generated properties from ngcc

cleanNGCCPollution('./src/clr-angular/package.json');
cleanNGCCPollution('./src/clr-ui/package.json');
cleanNGCCPollution('./src/clr-icons/package.json');
cleanNGCCPollution('./src/clr-core/package.json');
cleanNGCCPollution('./src/clr-core/badge/package.json');
cleanNGCCPollution('./src/clr-core/button/package.json');
cleanNGCCPollution('./src/clr-core/common/package.json');
cleanNGCCPollution('./src/clr-core/icon-shapes/package.json');
cleanNGCCPollution('./src/clr-core/icon/package.json');
cleanNGCCPollution('./src/clr-core/tag/package.json');
cleanNGCCPollution('./src/clr-core/test-dropdown/package.json');

function cleanNGCCPollution(file) {
  const data = JSON.parse(fs.readFileSync(file));
  delete data['__processed_by_ivy_ngcc__'];
  delete data['scripts'];
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n');
}
