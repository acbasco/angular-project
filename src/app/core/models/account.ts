export class Account {
  constructor(
    public id: number | null,
    public name: string,
    public email: string,
    public password: string | null,
    public dateJoined: string | null,
    public adminStatus: number,
    public accountStatus: number
  ) {}
}
