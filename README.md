# NLLB Translation Service

A React web application that provides translation services using the NLLB (No Language Left Behind) model. The app mimics Google Translate functionality with a modern, responsive interface.

## Features

- **Multi-language Support**: Support for 20+ languages including English, Spanish, French, German, Chinese, Japanese, and more
- **Real-time Translation**: Submit text for translation with proper handling of long-running requests
- **Modern UI**: Built with Material-UI components for a clean, professional interface
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Translation History**: Keeps track of recent translations for easy reference
- **Copy to Clipboard**: One-click copying of translated text
- **Language Swapping**: Quick swap between source and target languages
- **Error Handling**: Comprehensive error handling with user-friendly messages

## Key Technical Features

- **Long Request Handling**: Configured to handle translation requests that may take 10 seconds to several minutes
- **Timeout Management**: 5-minute timeout with proper error handling
- **Loading States**: Clear visual feedback during translation process
- **Keyboard Shortcuts**: Ctrl/Cmd + Enter to trigger translation

## Project Structure

```
src/
├── components/
│   ├── LanguageSelector.tsx    # Language dropdown component
│   ├── TextInput.tsx          # Input text area with translate button
│   └── OutputBox.tsx          # Output display with copy functionality
├── pages/
│   └── TranslatePage.tsx      # Main translation page
├── api/
│   └── translate.ts           # API service and language definitions
├── App.tsx                    # Main app component with theme
└── main.tsx                   # Application entry point
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- pnpm (recommended) or npm

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd ai-draft-translation
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Start the development server:
   ```bash
   pnpm dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
pnpm build
```

## API Configuration

The app expects the NLLB translation API to be available at `/api/translate`. The API should accept POST requests with the following structure:

```json
{
  "text": "Text to translate",
  "source_lang": "eng_Latn",
  "target_lang": "spa_Latn"
}
```

And return responses in this format:

```json
{
  "translated_text": "Translated text",
  "source_lang": "eng_Latn",
  "target_lang": "spa_Latn"
}
```

## Supported Languages

The app includes support for the following languages:

- English (eng_Latn)
- Spanish (spa_Latn)
- French (fra_Latn)
- German (deu_Latn)
- Italian (ita_Latn)
- Portuguese (por_Latn)
- Russian (rus_Cyrl)
- Japanese (jpn_Jpan)
- Korean (kor_Hang)
- Chinese Simplified (cmn_Hans)
- Arabic (ara_Arab)
- Hindi (hin_Deva)
- Bengali (ben_Beng)
- Dutch (nld_Latn)
- Swedish (swe_Latn)
- Norwegian (nor_Latn)
- Danish (dan_Latn)
- Finnish (fin_Latn)
- Polish (pol_Latn)
- Turkish (tur_Latn)

## Technologies Used

- **React 18** with TypeScript
- **Vite** for build tooling
- **Material-UI (MUI)** for UI components
- **Axios** for HTTP requests
- **Emotion** for styling

## Development

### Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build
- `pnpm lint` - Run ESLint

### Code Style

The project uses TypeScript for type safety and ESLint for code quality. All components are functional components with hooks.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
