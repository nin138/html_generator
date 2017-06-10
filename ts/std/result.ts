export class Result<T,E> {
  private ret: T;
  private e: E;
  constructor() {
  }

  ok(data: T) {
    this.ret = data;
  }
  err(data: E) {
    this.e = data;
  }
}
class b{
  constructor(){
  }
  exe(): Result<number, string>{
    const ret = new Result<number, string>();
    ret.ok(2);
    return ret;
  }
  use() {

  }
}
// }
// a->ok {
//
// },
// err-> {
//
// }