import { Component, input } from '@angular/core';
import { CUSTOMER } from '../../../../../core/interfaces/customer.model';

@Component({
  imports: [],
  selector: 'app-customer-data',
  styleUrl: './customer-data.css',
  templateUrl: './customer-data.html',
})
export class CustomerData {
  customerData = input.required<CUSTOMER>();
}
