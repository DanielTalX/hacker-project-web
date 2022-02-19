export class HackerEvent {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  start: Date;
  end?: Date;
  breachType: string;
  group?: string;
  url: string;
  votes: number;

  public constructor(init?: Partial<HackerEvent>) {
    this.id = "";
    this.title = "";
    this.subtitle = "";
    this.description = "";
    this.start = new Date();
    this.breachType = "";
    this.group = "";
    this.url = "";
    this.votes = 0;
    Object.assign(this, init);
  }
}
