export default class SceneManager {
  constructor(engine) {
    this.engine = engine;
    this.currentScene = null;
  }

  changeScene(SceneClass) {
    if (this.currentScene) {
      this.currentScene.exit();
    }
    this.currentScene = new SceneClass(this.engine);
    this.currentScene.enter();
  }

  update(dt) {
    if (this.currentScene) this.currentScene.update(dt);
  }

  render() {
    if (this.currentScene) this.currentScene.render();
  }
}
