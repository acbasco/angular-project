import { Account } from '../models/account';

export interface AccountsResponse {
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
  accounts: Account[];
}
