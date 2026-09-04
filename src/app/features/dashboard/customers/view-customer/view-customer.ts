import { Component, input, model } from '@angular/core';
import { Dialog, DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { CUSTOMER } from '../../../../core/interfaces/customer.model';
import { TabsModule } from 'primeng/tabs';
import { CustomerData } from './customer-data/customer-data';
import { Accounts } from './accounts/accounts';

@Component({
  imports: [DialogModule, ButtonModule, TabsModule, CustomerData, Accounts],
  selector: 'app-view-customer',
  styleUrl: './view-customer.css',
  templateUrl: './view-customer.html',
})
export class ViewCustomer {
  visible = model.required<boolean>();
  customer = input.required<CUSTOMER>();
  tabs = [
    { id: 'tab1', title: 'Details' },
    { id: 'tab2', title: 'Accounts' },
  ];
}
