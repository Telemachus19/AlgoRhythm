import GameEngine from "./core/GameEngine.js";
import { CRTFilterWebGL } from "./core/CRTFilter.js";

window.onload = () => {
  const canvas = document.getElementById("game-canvas");

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  // canvas.width = 800;
  // canvas.height = 600;

  const crt = new CRTFilterWebGL(canvas, {
    barrelDistortion: 0.015, // Simulates CRT screen curvature
    curvature: 0.02, // Adjusts the amount of CRT screen curvature
    chromaticAberration: 0.0005, // Slightly separates RGB colors for a realistic effect
    staticNoise: 0.001, // Adds static noise to the image
    horizontalTearing: 0.00012, // Simulates horizontal distortion in a faulty screen
    glowBloom: 0.001, // Simulates the glow of CRT pixels
    verticalJitter: 0.001, // Makes the image slightly oscillate vertically
    retraceLines: true, // Adds CRT refresh lines
    scanlineIntensity: 0.6, // Adjusts scanline intensity
    dotMask: false, // Simulates the pixel structure of a CRT screen
    motionBlur: 0, // Simulates motion blur (currently not implemented)
    brightness: 0.9, // Adjusts screen brightness
    contrast: 1.0, // Adjusts image contrast
    desaturation: 0.2, // Reduces color saturation for a faded effect
    flicker: 0.01, // Simulates occasional flicker on a CRT screen
    signalLoss: 0.05, // Simulates VHS or UHF signal loss artifacts
  });
  crt.start();
  const engine = new GameEngine(canvas, crt);
  engine.start();
};
