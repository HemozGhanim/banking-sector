import {
  Component,
  OnInit,
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
import { Search } from '@primeicons/angular/search';
import { Database } from '@primeicons/angular/database';
import { CUSTOMER } from '../../../core/interfaces/customer.model';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  imports: [
    IconFieldModule,
    InputIconModule,
    InputNumberModule,
    TableModule,
    TagModule,
    InputTextModule,
    FormsModule,
    Search,
    Database,
    SkeletonModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-customers',
  styleUrl: './customers.css',
  templateUrl: './customers.html',
})
export class Customers {
  customerService = inject(Customer);
  private cd = inject(ChangeDetectorRef);
  dt = viewChild<Table>('dt');
  customers = signal<CUSTOMER[]>([]);
  initialValue!: CUSTOMER[];
  sortedField: string | null = null;
  isSorted: boolean | null = null;

  loading = signal(true);
  ngOnInit() {
    this.customerService.getCustomers().subscribe({
      next: (data: CUSTOMER[]) => {
        console.log('Fetched customers:', data);
        this.customers.set(data);
        console.log('Customers after assignment:', this.customers());
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
}
