import { Account } from '../models/account';

export interface LoginAccountResponse {
  status: number;
  message: string;
  account: Account | null;
}
