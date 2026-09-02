import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { CUSTOMER } from '../../interfaces/customer.model';
import { HttpClient } from '@angular/common/http';
@Service()
export class Customer {
  http = inject(HttpClient);

  getCustomers(): Observable<CUSTOMER[]> {
    return this.http.get<CUSTOMER[]>('mock/customers.json');
  }
}
