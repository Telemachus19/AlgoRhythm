import GameEngine from "./core/GameEngine.js";
import CRTFilter from "./core/CRTFilter.js";

window.onload = () => {
  // Init Visuals
  // Curvature removed to improve performance and alignment
  new CRTFilter("arcade-cabinet", {
    curvature: 0.0,
    vignetteOpacity: 0,
  });

  // Init Logic
  const engine = new GameEngine();
  engine.start();
};
