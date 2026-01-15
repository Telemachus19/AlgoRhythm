import InputHandler from "./InputHandler.js";
import SceneManager from "./SceneManager.js";
import MenuScene from "../scenes/MenuScene.js";

export default class GameEngine {
  constructor() {
    this.lastTime = 0;
    this.input = new InputHandler();
    this.sceneManager = new SceneManager(this);
  }

  start() {
    // Boot into Menu
    this.sceneManager.changeScene(MenuScene);
    this.lastTime = performance.now();
    requestAnimationFrame(this.loop.bind(this));
  }

  loop(timeStamp) {
    const dt = (timeStamp - this.lastTime) / 1000;
    this.lastTime = timeStamp;

    this.sceneManager.update(dt);
    this.sceneManager.render();

    requestAnimationFrame(this.loop.bind(this));
  }
}
