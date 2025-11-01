# Project Overview

This is a React-based web application designed to help users create logos and brand kits. It utilizes the Gemini API for AI-powered image generation, image editing, and brainstorming. Firebase is used for storing chat history.

**Key Technologies:**

*   **Frontend:** React, TypeScript, Vite, Tailwind CSS
*   **AI:** Google Gemini API (`@google/genai`)
*   **Database:** Firebase Firestore

**Architecture:**

The application is structured as a single-page application (SPA). The main `App.tsx` component manages the UI and state. It uses a tab-based navigation to switch between different features:

*   **Image Generator:** Generates logos based on user prompts.
*   **Image Editor:** Edits existing images.
*   **Brand Kit Generator:** Creates brand kits including color palettes, fonts, and taglines.
*   **Logo Idea Assistant:** A chat-based assistant to help users brainstorm ideas.

The application interacts with the Gemini API through a dedicated `geminiService.ts` which handles all the API calls. Chat history is stored in Firebase Firestore, managed by `firestoreService.ts`.

# Building and Running

**Prerequisites:**

*   Node.js
*   A Gemini API key

**Instructions:**

1.  **Install dependencies:**
    ```bash
    npm install
    ```

2.  **Set up environment variables:**
    Create a `.env.local` file in the root of the project and add your Gemini API key:
    ```
    GEMINI_API_KEY=YOUR_GEMINI_API_KEY
    ```

3.  **Configure Firebase:**
    Update the `firebase.ts` file with your own Firebase project configuration.

4.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:3000`.

**Other Commands:**

*   **Build for production:**
    ```bash
    npm run build
    ```
*   **Preview the production build:**
    ```bash
    npm run preview
    ```

# Development Conventions

*   **Styling:** The project uses Tailwind CSS for styling. Utility classes are preferred over custom CSS.
*   **Components:** The UI is built with React components, located in the `components` directory.
*   **Services:** External API interactions are handled in the `services` directory.
*   **Types:** TypeScript types are defined in the `types.ts` file.
