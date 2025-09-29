import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BatchTranslatePage from '../BatchTranslatePage';

describe('BatchTranslatePage', () => {
  it('shows language in alphabetical order by name', async () => {
    render(<BatchTranslatePage />);

    // Open the first language selector (Source Language)
    const sourceLanguageSelector = screen.getByLabelText(/Source Language/i);
    await userEvent.click(sourceLanguageSelector);

    // MUI Autocomplete renders a listbox with role="listbox" containing options role="option"
    const languageListbox = await screen.findByRole('listbox');
    const languageOptions = within(languageListbox).getAllByRole('option');
    const languageNames = languageOptions.map((option) => option.textContent?.trim() || '');

    const alphabeticallySortedLanguages = [...languageNames].sort((a, b) => a.localeCompare(b));
    expect(languageNames).toEqual(alphabeticallySortedLanguages);
    console.log(alphabeticallySortedLanguages);
  });
});


