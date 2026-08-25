import { fetchFilesList, fetchFilesData } from './filesApi';
import { API_BASE_URL } from '../config';

describe('filesApi', () => {
  afterEach(() => {
    delete global.fetch;
  });

  describe('fetchFilesList', () => {
    it('returns the files array on success', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ files: ['file1.csv', 'file2.csv'] })
      });

      const result = await fetchFilesList();

      expect(global.fetch).toHaveBeenCalledWith(`${API_BASE_URL}/files/list`);
      expect(result).toEqual(['file1.csv', 'file2.csv']);
    });

    it('throws when the response is not ok', async () => {
      global.fetch = jest.fn().mockResolvedValue({ ok: false, status: 500, statusText: 'Internal Server Error' });

      await expect(fetchFilesList()).rejects.toThrow('Failed to fetch files list: 500 Internal Server Error');
    });
  });

  describe('fetchFilesData', () => {
    it('calls /files/data without a query param when no fileName is given', async () => {
      global.fetch = jest.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve([]) });

      await fetchFilesData();

      expect(global.fetch).toHaveBeenCalledWith(`${API_BASE_URL}/files/data`);
    });

    it('calls /files/data with the fileName query param when given', async () => {
      global.fetch = jest.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve([]) });

      await fetchFilesData('file1.csv');

      expect(global.fetch).toHaveBeenCalledWith(`${API_BASE_URL}/files/data?fileName=file1.csv`);
    });

    it('throws when the response is not ok', async () => {
      global.fetch = jest.fn().mockResolvedValue({ ok: false, status: 404, statusText: 'Not Found' });

      await expect(fetchFilesData('missing.csv')).rejects.toThrow('Failed to fetch files data: 404 Not Found');
    });
  });
});
