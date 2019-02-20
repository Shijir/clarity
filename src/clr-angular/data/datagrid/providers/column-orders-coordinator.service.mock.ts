/*
 * Copyright (c) 2016-2018 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ColumnOrdersCoordinatorService } from './column-orders-coordinator.service';
import { ColumnOrderModelService } from './column-order-model.service';
import { Subject } from 'rxjs';

export class MockColumnOrdersCoordinatorService
  implements Pick<ColumnOrdersCoordinatorService, keyof ColumnOrdersCoordinatorService> {
  public orderModels: ColumnOrderModelService[] = [];

  public orderChange = new Subject<void>();

  public get columnGroupId() {
    return 'mock-dg-column-group-0';
  }

  public broadcastOrderChange() {
    this.orderChange.next();
  }

  public modelAtflexOrderOf(flexOrder: number): ColumnOrderModelService {
    return this.orderModels.filter(orderModel => orderModel.flexOrder === flexOrder)[0];
  }
}

export const MOCK_COLUMN_ORDERS_COORDINATOR_PROVIDER = {
  provide: ColumnOrdersCoordinatorService,
  useClass: MockColumnOrdersCoordinatorService,
};
