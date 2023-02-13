export interface Chat {
  readonly id: string;
  createdAt: number;
  members: string[];
  owner: string;
}
