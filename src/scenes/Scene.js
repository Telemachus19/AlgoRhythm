export default class Scene {
  constructor(engine) {
    this.engine = engine;
  }

  // Dynamic dimensions based on current canvas size
  get width() {
    return this.engine.canvas.width;
  }
  get height() {
    return this.engine.canvas.height;
  }

  enter() {}
  exit() {}
  update(dt) {}
  render(ctx) {}
}
