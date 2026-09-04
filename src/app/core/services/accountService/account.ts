import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { ACCOUNT } from '../../interfaces/account.model';
import { Observable } from 'rxjs/internal/Observable';

@Service()
export class Account {
  http = inject(HttpClient);

  getAccountsByCustomerId(customerId: string): Observable<ACCOUNT[]> {
    return this.http.get<ACCOUNT[]>('/mock/accounts.json');
  }
}
