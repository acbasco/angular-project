export class Account {
  constructor(
    public id: Number,
    public name: string,
    public email: string,
    public password: string,
    public isAdmin: boolean,
  ) {
  }
}
