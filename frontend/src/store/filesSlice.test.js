import reducer, { setFileNameFilter, loadFilesList, loadFilesData } from './filesSlice';

const initialState = {
  list: { items: [], status: 'idle', error: null },
  data: { items: [], status: 'idle', error: null },
  fileNameFilter: ''
};

describe('filesSlice', () => {
  it('returns the initial state', () => {
    expect(reducer(undefined, { type: '@@INIT' })).toEqual(initialState);
  });

  it('sets the fileName filter', () => {
    const state = reducer(initialState, setFileNameFilter('file1.csv'));
    expect(state.fileNameFilter).toBe('file1.csv');
  });

  describe('loadFilesList', () => {
    it('sets list status to loading on pending', () => {
      const state = reducer(initialState, { type: loadFilesList.pending.type });
      expect(state.list.status).toBe('loading');
    });

    it('stores the files and sets status to succeeded on fulfilled', () => {
      const state = reducer(initialState, {
        type: loadFilesList.fulfilled.type,
        payload: ['file1.csv', 'file2.csv']
      });
      expect(state.list.status).toBe('succeeded');
      expect(state.list.items).toEqual(['file1.csv', 'file2.csv']);
    });

    it('stores the error and sets status to failed on rejected', () => {
      const state = reducer(initialState, {
        type: loadFilesList.rejected.type,
        error: { message: 'boom' }
      });
      expect(state.list.status).toBe('failed');
      expect(state.list.error).toBe('boom');
    });
  });

  describe('loadFilesData', () => {
    it('sets data status to loading on pending', () => {
      const state = reducer(initialState, { type: loadFilesData.pending.type });
      expect(state.data.status).toBe('loading');
    });

    it('stores the data and sets status to succeeded on fulfilled', () => {
      const payload = [{ file: 'file1.csv', lines: [] }];
      const state = reducer(initialState, { type: loadFilesData.fulfilled.type, payload });
      expect(state.data.status).toBe('succeeded');
      expect(state.data.items).toEqual(payload);
    });

    it('stores the error and sets status to failed on rejected', () => {
      const state = reducer(initialState, {
        type: loadFilesData.rejected.type,
        error: { message: 'boom' }
      });
      expect(state.data.status).toBe('failed');
      expect(state.data.error).toBe('boom');
    });
  });
});
