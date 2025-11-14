# Zenith Tab

Zenith Tab is a minimalist and highly customizable new tab page designed for focus, productivity, and inspiration. It replaces the default browser new tab screen with a beautiful, personalized dashboard.

## Core Features

*   **Dynamic Backgrounds:** Personalize your view with stunning random images, a curated gallery, or by uploading your own background.
*   **Modular Widget System:** A fully flexible layout where you can add, remove, resize, and reorder widgets to fit your workflow.
    *   **Tasks:** A comprehensive to-do list with priority levels, due dates, and multiple sorting options.
    *   **Notes:** A simple and persistent scratchpad for capturing quick thoughts and ideas.
    *   **Weather:** Real-time weather information based on your current location.
    *   **Quote:** Display an inspirational quote, refreshed on demand.
*   **Personalization:** Greet yourself by name and choose between 12-hour and 24-hour clock formats.
*   **Zen Mode:** Instantly hide all widgets to enjoy a clean, distraction-free view of your background.
*   **Seamless Experience:** A fluid user interface with smooth animations and a consistent, modern aesthetic.

## Technology Stack

*   **Frontend:** React, TypeScript, Tailwind CSS
*   **APIs:** Google Gemini API is utilized for generating inspirational quotes and processing geolocation data for weather reports.

## Getting Started

To run this application, a valid API key is required for the features that rely on generative AI.

1.  The application is configured to access an API key via `process.env.API_KEY`. Ensure this is available in your execution environment.
2.  Open the `index.html` file in a modern web browser.

## Customization

All user preferences, including widget selection, layout, background, and personal details, can be configured through the settings panel, accessible via the gear icon. All settings are saved locally in your browser.
