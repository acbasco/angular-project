export class Account {
  constructor(
    public id: string | null,
    public name: string,
    public email: string,
    public password: undefined,
    public dateJoined: undefined | null,
    public adminStatus: number,
    public accountStatus: number
  ) {}
}
