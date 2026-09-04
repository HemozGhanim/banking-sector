import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { TRANSACTION, TRANSACTION_TYPE } from '../../interfaces/transaction.model';
import { Observable } from 'rxjs/internal/Observable';

@Service()
export class Transaction {
  http = inject(HttpClient);

  getTransactions(): Observable<TRANSACTION[]> {
    return this.http.get<TRANSACTION[]>('/mock/transactions.json');
  }

  getTransactionType(): Observable<TRANSACTION_TYPE[]> {
    return this.http.get<TRANSACTION_TYPE[]>('/mock/transaction-types.json');
  }

  getTransactionCategory(): Observable<string[]> {
    return this.http.get<string[]>('/mock/transaction-categories.json');
  }
}
