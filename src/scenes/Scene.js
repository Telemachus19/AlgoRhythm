export default class Scene {
  constructor(engine) {
    this.engine = engine;
    this.container = document.getElementById("scene-layer");
  }

  enter() {}

  exit() {
    this.container.innerHTML = "";
  }

  update(dt) {}

  render() {}
}
