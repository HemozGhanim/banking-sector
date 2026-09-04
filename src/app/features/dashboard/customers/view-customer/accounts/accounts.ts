import { Component, inject, input, signal, ChangeDetectionStrategy } from '@angular/core';
import { ACCOUNT } from '../../../../../core/interfaces/account.model';
import { TableModule } from 'primeng/table';
import { Account } from '../../../../../core/services/accountService/account';

@Component({
  imports: [TableModule],
  selector: 'app-accounts',
  styleUrl: './accounts.css',
  templateUrl: './accounts.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Accounts {
  customerId = input<string>('');
  accountsServices = inject(Account);
  accounts = signal<ACCOUNT[]>([]);

  ngOnInit() {
    if (this.customerId()) {
      this.accountsServices.getAccountsByCustomerId(this.customerId()).subscribe({
        next: (accounts: ACCOUNT[]) => {
          this.accounts.set(
            accounts.filter((account: ACCOUNT) => account.customerId === this.customerId()),
          );
          console.log(this.accounts());
        },
        error: (error: any) => {
          console.error('Error fetching accounts:', error);
        },
      });
    }
  }
}
