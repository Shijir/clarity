import { TableSizeService } from './table-size.service';

// With this mock service, we could test individual child components of Datagrid that are dependent on TableSizeService
// without placing them inside a whole Datagrid component.
export class MockTableSizeService {
  // Currently only this property needed.
  // We could add more properties if necessary in the future
  public getColumnDragHeight(): string {
    return '500px';
  }
}

export const MOCK_TABLE_SIZE_PROVIDER = {
  provide: TableSizeService,
  useClass: MockTableSizeService,
};
