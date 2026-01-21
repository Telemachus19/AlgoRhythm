import GameEngine from "./core/GameEngine.js";
import CRTFilter from "./core/CRTFilter.js";

window.onload = () => {
  const crt = new CRTFilter("arcade-cabinet", {
    curvature: 0.0,
    scanlineIntensity: 0.15,
    resolutionScale: 0.5,
  });
  const engine = new GameEngine(crt);
  engine.start();
};
