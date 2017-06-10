export class Err {
  public message: string;
  constructor(message) {
    this.message = message;
    console.error(message);
  }
}