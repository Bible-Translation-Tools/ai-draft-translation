# Task: Build a React Web App for NLLB Translation Service

## Goal
Create a simple React web app that mimics Google Translate functionality. The app should allow a user to:
1. Enter text in an input box.  
2. Select source and target languages from dropdown menus.  
3. Submit the request to the NLLB model serving endpoint.  
4. Display the translated text in an output box.  

---

## Breakdown Instructions

### 1. Project Setup
- Initialize a new React project (using Vite or CRA).
- Use pnpm instead of npm
- Install dependencies:
  - `axios` (for API requests).
  - `@mui/material` and releated @mui packages

### 2. Layout
- Create a page with a **two-column or stacked layout**:
  - Left: input text area + source language selection.
  - Right: output text area (read-only) + target language selection.

### 3. Language Selection
- Create two dropdown menus:
  - **Source Language** (`from`).
  - **Target Language** (`to`).
- Populate with available languages (provided list from NLLB model).
- Default values: English → Spanish.

### 4. Input Area
- Text input (multiline `<textarea>` or MUI `TextField`).
- Button: **Translate**.

### 5. API Request
- On submit:
  - Collect `text`, `from`, and `to`.
  - Make a POST request to the NLLB API endpoint. Example:
    ```ts
    axios.post("/api/translate", {
      text,
      source_lang: from,
      target_lang: to,
    })
    ```
- **Important:** The response from the API endpoint may take a long time (from 10 seconds to several minutes). The app must be designed to handle long-running requests gracefully, ensuring that it does not time out or leave the user uncertain about the status. Show appropriate loading indicators and handle potential network timeouts or retries as needed.
- Handle loading + error states.

### 6. Output Area
- Show translated text returned from the API.
- Display inside a read-only text area or styled card.

### 7. Extra (Optional Enhancements)
- Add "Clear" button to reset fields.
- Show history of translations.
- Add copy-to-clipboard on output.

---

## Suggested File Structure
src/
components/
LanguageSelector.tsx
TextInput.tsx
OutputBox.tsx
pages/
TranslatePage.tsx
api/
translate.ts
App.tsx
main.tsx