# AlgoRhythm

##  Overview

**AlgoRhytm** is a browser-based application that gamifies common computer science algorithms. The project features a retro interface to demonstrate advanced DOM manipulation and CSS styling capabilities. 


## Interface

* **Retro UI Design:** A custom interface styled to resemble a CRT monitor using CSS animations and CRT Wrap points
* **Navigation:** A central "Arcade Menu" allowing users to switch between games ala Star Fled
* **State Management:** Usage of `localStorage` to save high scores and user preferences.

## Minigame 1: Insertion Sort

* **Algorithm Focus:** Insertion Sort
* **Gameplay Loop:** The user is presented with randomly shuffled containers that he has to sort under time limit while following the algorithm 
* **Key Features:**
  * Drag-and-Drop / Click Logic: Interactive reordering of DOM elements.
  * Accuracy Check: Moves are validated against the formal definition of an Insertion Sort step.
  * Constraints: A global timer pressures the user; incorrect insertions result in the loss of a "Heart" (life).

## Minigame 2: – 8/15-Puzzle (Heuristic Search)

* Algorithm Focus: A* Search Algorithm (Pathfinding).
* Gameplay Loop: A classic 8-puzzle/15-puzzle sliding game where the user attempts to order the tiles.
* Key Features:
  * Solvable Generation: A generation algorithm that ensures the randomized board state is mathematically solvable (checking inversion parity).
  * Auto-Solve Mode: A "Give Up" feature where the application takes control and visually solves the puzzle step-by-step using the A* algorithm.
