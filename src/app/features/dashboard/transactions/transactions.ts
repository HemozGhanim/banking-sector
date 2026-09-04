import { Component, inject, viewChild, signal, OnInit, input, effect } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputNumberModule } from 'primeng/inputnumber';
import { Table, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';
import { SortEvent, FilterService } from 'primeng/api';
import { Database } from '@primeicons/angular/database';
import { SkeletonModule } from 'primeng/skeleton';
import { FilterMetadata } from 'primeng/api';
import { Eye } from '@primeicons/angular/eye';
import { LabelModule } from 'primeng/label';
import { TRANSACTION, TRANSACTION_TYPE } from '../../../core/interfaces/transaction.model';
import { Transaction } from '../../../core/services/transactionService/transaction';
import { SelectModule } from 'primeng/select';
import { FilterSlash } from '@primeicons/angular';
import { ButtonModule } from 'primeng/button';
import { Spinner } from '@primeicons/angular/spinner';
import { DatePickerModule } from 'primeng/datepicker';

@Component({
  imports: [
    TableModule,
    TagModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    InputNumberModule,
    FormsModule,
    Database,
    SkeletonModule,
    Eye,
    LabelModule,
    SelectModule,
    FilterSlash,
    ButtonModule,
    Spinner,
    DatePickerModule,
  ],
  selector: 'app-transactions',
  styleUrl: './transactions.css',
  templateUrl: './transactions.html',
})
export class Transactions implements OnInit {
  accountId = input<string>();
  dt = viewChild<Table>('dt');
  transactionService = inject(Transaction);
  private filterService = inject(FilterService);

  allTransactions = signal<TRANSACTION[]>([]);
  transactions = signal<TRANSACTION[]>([]);
  selectedTransaction!: TRANSACTION;
  initialValue: TRANSACTION[] = [];
  sortedField: string | null = null;
  isSorted: boolean | null = null;
  loading = signal<boolean>(true);
  loadingTransaction = signal<boolean>(false);
  visibleTransactionModal = signal<boolean>(false);
  typeOptions = signal<{ label: string; value: string }[]>([]);
  categoryOptions = signal<{ label: string; value: string }[]>([]);
  searchValue: string = '';

  constructor() {
    this.filterService.register(
      'dateRangeFilter',
      (value: string | Date | null, filter: (Date | null)[] | null): boolean => {
        if (!filter || !Array.isArray(filter) || filter[0] == null) {
          return true;
        }
        if (value == null) {
          return false;
        }
        const time = new Date(value).setHours(0, 0, 0, 0);
        const start = new Date(filter[0]).setHours(0, 0, 0, 0);
        const end = filter[1] != null ? new Date(filter[1]).setHours(0, 0, 0, 0) : start;
        return time >= start && time <= end;
      },
    );

    effect(() => {
      const id = this.accountId();
      const all = this.allTransactions();
      const filtered = id === undefined ? all : id ? all.filter((t) => t.accountId === id) : [];

      this.transactions.set(filtered);
      this.initialValue = [...filtered];
      this.sortedField = null;
      this.isSorted = null;
    });
  }

  ngOnInit() {
    this.transactionService.getTransactions().subscribe({
      next: (data: TRANSACTION[]) => {
        this.allTransactions.set(data);
        setTimeout(() => {
          this.loading.set(false);
        }, 800);
      },
      error: (error: any) => {
        console.error('Error fetching transactions:', error);
        this.loading.set(false);
      },
    });

    this.transactionService.getTransactionType().subscribe({
      next: (data: TRANSACTION_TYPE[]) => {
        var customizeType = data.map((el: TRANSACTION_TYPE) => {
          return { label: el.label, value: el.code };
        });
        this.typeOptions.set(customizeType);
      },
    });

    this.transactionService.getTransactionCategory().subscribe({
      next: (data: string[]) => {
        var customizeCategory = data.map((el) => {
          return { label: el, value: el };
        });
        this.categoryOptions.set(customizeCategory);
      },
    });
  }

  clear(table: Table) {
    table.clear();
    this.searchValue = '';
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
      this.transactions.set([...this.initialValue]);

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
  loadTransactionData(transactionData: TRANSACTION) {
    this.selectedTransaction = transactionData;
    this.visibleTransactionModal.set(true);
  }
}
