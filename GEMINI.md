# Gemini Project Context: はかったけ (Hakattake)

## Project Overview

This project, "はかったけ (Hakattake)," is a client-side web application for measurement. It is designed to be installation-free and run entirely in the browser. The application has two primary modes:

1.  **Measurement Mode:** For measuring objects like furniture and rooms, up to a distance of 10 meters. This mode provides a real-time measurement on the screen but does not save the data.
2.  **Growth Record Mode:** For tracking a child's growth by measuring height, foot size, and hand size. It also allows for manual input of weight. The application automatically saves a composite image (including the measurement, value, and date) to the user's device gallery.

The application prioritizes user privacy by performing all processing on the device. No data or images are sent to any cloud servers.

## Core Technologies

- **Framework:** Vite + React (or Preact) with TypeScript
- **3D & AR:** Three.js and the WebXR API for augmented reality measurements.
- **Fallback Mechanism:** For devices that do not support WebXR, the application uses a photo-based measurement system. This system calculates dimensions by using a reference object (like A4 paper, a credit card, or coins) within the photo for scale correction.
- **State Management:** Zustand
- **Hosting:** Vercel (Static site deployment)
- **Testing:** Jest for unit tests and Playwright for end-to-end tests.

## Building and Running

While explicit commands are not found in a single script, the project documentation (`todo.md` and `prompt_spec.md`) outlines the intended setup and execution flow.

### Setup

1.  **Install Dependencies:** The project uses `pnpm` as the recommended package manager.

    ```bash
    # Install pnpm if you haven't already
    npm install -g pnpm

    # Install project dependencies
    pnpm install
    ```

### Key Commands

- **Development:** To run the application in development mode.
  ```bash
  # Inferred from standard Vite projects
  pnpm dev
  ```
- **Building:** To create a production build.
  ```bash
  # Inferred from standard Vite projects
  pnpm build
  ```
- **Testing:** The project is configured with Jest for unit tests and Playwright for E2E tests.
  ```bash
  # Inferred from standard testing setups
  pnpm test:unit
  pnpm test:e2e
  ```
  _(Note: The exact script names in `package.json` might differ)_

## Development Conventions

- **Code Style:** The project enforces a consistent code style using ESLint and Prettier.
- **TypeScript:** A strict TypeScript configuration (`"strict": true`) is used to ensure type safety.
- **Directory Structure:** The source code is organized into modules under the `src/` directory, with clear separation for `core` logic (AR, camera, fallback), `features`, `components`, and `utils`.
- **CI/CD:** The project is set up with GitHub Actions to run linting, type checks, and tests on every pull request. The Vercel integration automatically deploys the `main` branch to production and creates preview deployments for pull requests.
- **Privacy:** A core principle is that no user data, images, or analytics are sent to any external server. All processing and storage happen on the client-side.
