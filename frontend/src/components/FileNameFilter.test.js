import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import filesReducer from '../store/filesSlice';
import FileNameFilter from './FileNameFilter';
import * as filesApi from '../services/filesApi';

jest.mock('../services/filesApi');

function renderWithStore () {
  const store = configureStore({ reducer: { files: filesReducer } });
  return {
    store,
    ...render(
      <Provider store={store}>
        <FileNameFilter />
      </Provider>
    )
  };
}

describe('FileNameFilter', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('is disabled until the file list loads, then lists the files as options', async () => {
    filesApi.fetchFilesList.mockResolvedValue(['file1.csv', 'file2.csv']);

    renderWithStore();

    const select = screen.getByRole('combobox');
    expect(select).toBeDisabled();

    await waitFor(() => expect(select).toBeEnabled());

    expect(screen.getByRole('option', { name: 'file1.csv' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'file2.csv' })).toBeInTheDocument();
  });

  it('dispatches setFileNameFilter when a file is selected', async () => {
    filesApi.fetchFilesList.mockResolvedValue(['file1.csv']);

    const { store } = renderWithStore();

    const select = screen.getByRole('combobox');
    await waitFor(() => expect(select).toBeEnabled());

    fireEvent.change(select, { target: { value: 'file1.csv' } });

    expect(store.getState().files.fileNameFilter).toBe('file1.csv');
  });
});
