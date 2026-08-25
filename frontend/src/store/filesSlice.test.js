import reducer, { setFileNameFilter, loadFilesList, loadFilesData } from './filesSlice';

const initialState = {
  list: { items: [], status: 'idle', error: null },
  data: { items: [], status: 'idle', error: null, requestId: null },
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
    it('sets data status to loading and stores the requestId on pending', () => {
      const state = reducer(initialState, {
        type: loadFilesData.pending.type,
        meta: { requestId: 'req-1' }
      });
      expect(state.data.status).toBe('loading');
      expect(state.data.requestId).toBe('req-1');
    });

    it('stores the data and sets status to succeeded on fulfilled', () => {
      const pendingState = reducer(initialState, {
        type: loadFilesData.pending.type,
        meta: { requestId: 'req-1' }
      });
      const payload = [{ file: 'file1.csv', lines: [] }];
      const state = reducer(pendingState, {
        type: loadFilesData.fulfilled.type,
        payload,
        meta: { requestId: 'req-1' }
      });
      expect(state.data.status).toBe('succeeded');
      expect(state.data.items).toEqual(payload);
    });

    it('stores the error and sets status to failed on rejected', () => {
      const pendingState = reducer(initialState, {
        type: loadFilesData.pending.type,
        meta: { requestId: 'req-1' }
      });
      const state = reducer(pendingState, {
        type: loadFilesData.rejected.type,
        error: { message: 'boom' },
        meta: { requestId: 'req-1' }
      });
      expect(state.data.status).toBe('failed');
      expect(state.data.error).toBe('boom');
    });

    it('ignores a fulfilled action from a request superseded by a newer one', () => {
      const firstPending = reducer(initialState, {
        type: loadFilesData.pending.type,
        meta: { requestId: 'req-1' }
      });
      const secondPending = reducer(firstPending, {
        type: loadFilesData.pending.type,
        meta: { requestId: 'req-2' }
      });

      const state = reducer(secondPending, {
        type: loadFilesData.fulfilled.type,
        payload: [{ file: 'stale.csv', lines: [] }],
        meta: { requestId: 'req-1' }
      });

      expect(state.data.status).toBe('loading');
      expect(state.data.items).toEqual([]);
      expect(state.data.requestId).toBe('req-2');
    });

    it('ignores a rejected action from a request superseded by a newer one', () => {
      const firstPending = reducer(initialState, {
        type: loadFilesData.pending.type,
        meta: { requestId: 'req-1' }
      });
      const secondPending = reducer(firstPending, {
        type: loadFilesData.pending.type,
        meta: { requestId: 'req-2' }
      });

      const state = reducer(secondPending, {
        type: loadFilesData.rejected.type,
        error: { message: 'stale error' },
        meta: { requestId: 'req-1' }
      });

      expect(state.data.status).toBe('loading');
      expect(state.data.error).toBeNull();
    });
  });
});
