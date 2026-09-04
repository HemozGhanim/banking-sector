import {
  Component,
  inject,
  viewChild,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputNumberModule } from 'primeng/inputnumber';
import { Table, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';
import { Customer } from '../../../core/services/customerService/customer';
import { SortEvent } from 'primeng/api';
import { Database } from '@primeicons/angular/database';
import { CUSTOMER } from '../../../core/interfaces/customer.model';
import { SkeletonModule } from 'primeng/skeleton';
import { FilterMetadata } from 'primeng/api';
import { ViewCustomer } from './view-customer/view-customer';
import { Eye } from '@primeicons/angular/eye';
import { LabelModule } from 'primeng/label';

@Component({
  imports: [
    IconFieldModule,
    InputIconModule,
    InputNumberModule,
    TableModule,
    TagModule,
    InputTextModule,
    FormsModule,
    Eye,
    Database,
    SkeletonModule,
    ViewCustomer,
    LabelModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-customers',
  styleUrl: './customers.css',
  templateUrl: './customers.html',
})
export class Customers {
  dt = viewChild<Table>('dt');

  customerService = inject(Customer);
  private cd = inject(ChangeDetectorRef);

  customers = signal<CUSTOMER[]>([]);
  selectedCustomers!: CUSTOMER;
  initialValue!: CUSTOMER[];
  sortedField: string | null = null;
  isSorted: boolean | null = null;
  loadingCustomer = signal(false);
  visibleCustomerModal = signal(false);

  loading = signal(true);
  ngOnInit() {
    this.customerService.getCustomers().subscribe({
      next: (data: CUSTOMER[]) => {
        this.customers.set(data);
        this.initialValue = [...this.customers()];
        setTimeout(() => {
          this.loading.set(false);
        }, 800);
      },
      error: (error: any) => {
        console.error('Error fetching customers:', error);
        this.loading.set(false);
      },
    });
  }
  globalFilterValue(table: Table): string {
    return (table.filters['global'] as FilterMetadata)?.value ?? '';
  }

  customSort(event: SortEvent) {
    if (this.sortedField !== event.field) {
      this.sortedField = event.field ?? null;
      this.isSorted = true;
      this.sortTableData(event);
    } else if (this.isSorted) {
      this.isSorted = false;
      this.sortTableData(event);
    } else {
      this.sortedField = null;
      this.isSorted = null;
      this.customers.set([...this.initialValue]);

      const table = this.dt()!;
      table.sortField = null;
      table.sortOrder = table.defaultSortOrder();
      table.tableService.onSort(null);
    }
  }
  sortTableData(event: SortEvent) {
    event.data!.sort((data1: any, data2: any) => {
      let value1 = data1[event.field!];
      let value2 = data2[event.field!];
      let result: number;
      if (value1 == null && value2 != null) result = -1;
      else if (value1 != null && value2 == null) result = 1;
      else if (value1 == null && value2 == null) result = 0;
      else if (typeof value1 === 'string' && typeof value2 === 'string')
        result = value1.localeCompare(value2);
      else result = value1 < value2 ? -1 : value1 > value2 ? 1 : 0;

      return event.order! * result;
    });
  }
  loadCustomerData(customerData: CUSTOMER) {
    this.selectedCustomers = customerData;
    this.visibleCustomerModal.set(true);
  }
}
