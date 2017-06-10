export class Html {
  private nodes;
  private active_node;
  constructor(
    private path,
    private name,
  ) {}
  get_name() { return this.name }
  get_path() { return this.path }

  add_element(el) {
    //{"name":"[div] n2","type":"div","css":{"backgroundColor":"#0f3"},"parent":"BODY"}
  }
}