export class Account {
  constructor(
    public id: number | null,
    public name: string,
    public email: string,
    public password: string,
  ) {
  }
}
