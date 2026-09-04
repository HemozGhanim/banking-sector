export interface TRANSACTION {
  id: string;
  accountId: string;
  date: string;
  type: string;
  amount: number;
  merchant: string;
  category: string;
}

export interface TRANSACTION_TYPE {
  code: string;
  label: string;
}
