# Document Translation Tool

A React web application for translating documents with the NLLB (No Language Left Behind) model. Upload USFM, DOCX, PDF, or PPTX files and translate them into one or more target languages.

## Features

- **Document jobs**: Submit one or more files as a batch translation job
- **Multiple target languages**: Select several languages, or all languages except the source
- **Job queue**: Track queued, processing, completed, and failed jobs
- **Preserved glossary**: Keep specific words untranslated
- **Push notifications**: Optional job-complete notifications

## Project Structure

```
src/
├── components/
│   ├── LanguageSelector.tsx    # Single- and multi-select language pickers
│   └── JobItem.tsx             # Job status card
├── pages/
│   ├── BatchTranslatePage.tsx  # Document translation
│   └── RecentJobsPage.tsx      # Job history
├── api/
│   └── translate.ts            # Job submit / poll / cancel
├── App.tsx
└── main.tsx
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

Document jobs are submitted to `{VITE_SERVER_API_ENDPOINT}/jobs` as `multipart/form-data`:

| Field | Type | Notes |
|-------|------|--------|
| `files` | File (repeated) | `.usfm`, `.docx`, `.pdf`, `.pptx` |
| `src_lang` | string | NLLB code, e.g. `eng_Latn` |
| `tgt_langs` | JSON string | Array of NLLB codes, e.g. `["spa_Latn","fra_Latn"]` |
| `preserved_words` | JSON string | Array of strings to leave untranslated |
| `subscription_id` | string | Optional push subscription |

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
