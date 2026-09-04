import { Component, inject, input, signal, ChangeDetectionStrategy } from '@angular/core';
import { ACCOUNT } from '../../../../../core/interfaces/account.model';
import { TableModule } from 'primeng/table';
import { Account } from '../../../../../core/services/accountService/account';
import { SkeletonModule } from 'primeng/skeleton';
import { Database } from '@primeicons/angular/database';
import { Spinner } from '@primeicons/angular/spinner';
import { ButtonModule } from 'primeng/button';
import { Eye } from '@primeicons/angular/eye';
import { Transactions } from '../../../transactions/transactions';

@Component({
  imports: [TableModule, SkeletonModule, Database, Spinner, ButtonModule, Eye, Transactions],
  selector: 'app-accounts',
  styleUrl: './accounts.css',
  templateUrl: './accounts.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Accounts {
  customerId = input<string>('');
  accountsServices = inject(Account);

  accounts = signal<ACCOUNT[]>([]);
  loading = signal<boolean>(true);
  loadingAccountTransaction = signal<boolean>(false);
  selectedAccount = signal<string>('');
  ngOnInit() {
    if (this.customerId()) {
      this.accountsServices.getAccountsByCustomerId(this.customerId()).subscribe({
        next: (accounts: ACCOUNT[]) => {
          this.accounts.set(
            accounts.filter((account: ACCOUNT) => account.customerId === this.customerId()),
          );
          setTimeout(() => {
            this.loading.set(false);
          }, 800);
        },
        error: (error: any) => {
          console.error('Error fetching accounts:', error);
          this.loading.set(false);
        },
      });
    }
  }
  loadTransactionData(account_id: string) {
    this.selectedAccount.set(account_id);
  }
}
