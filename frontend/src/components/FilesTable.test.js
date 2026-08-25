import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import filesReducer from '../store/filesSlice';
import FilesTable from './FilesTable';
import * as filesApi from '../services/filesApi';

jest.mock('../services/filesApi');

function renderWithStore () {
  const store = configureStore({ reducer: { files: filesReducer } });
  return render(
    <Provider store={store}>
      <FilesTable />
    </Provider>
  );
}

describe('FilesTable', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('shows a spinner while loading', () => {
    filesApi.fetchFilesData.mockReturnValue(new Promise(() => {}));

    renderWithStore();

    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders the table rows once data loads', async () => {
    filesApi.fetchFilesData.mockResolvedValue([
      { file: 'file1.csv', lines: [{ text: 'RgTya', number: 64075909, hex: '70ad29aacf0b690b0467fe2b2767f765' }] }
    ]);

    renderWithStore();

    expect(await screen.findByText('file1.csv')).toBeInTheDocument();
    expect(screen.getByText('RgTya')).toBeInTheDocument();
    expect(screen.getByText('64075909')).toBeInTheDocument();
    expect(screen.getByText('70ad29aacf0b690b0467fe2b2767f765')).toBeInTheDocument();
  });

  it('shows an error message when the fetch fails', async () => {
    filesApi.fetchFilesData.mockRejectedValue(new Error('Failed to fetch files data: 500 Internal Server Error'));

    renderWithStore();

    expect(await screen.findByText('Failed to fetch files data: 500 Internal Server Error')).toBeInTheDocument();
  });
});
