import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchFilesList, fetchFilesData } from '../services/filesApi';

export const loadFilesList = createAsyncThunk('files/loadFilesList', () => fetchFilesList());

export const loadFilesData = createAsyncThunk('files/loadFilesData', (fileName) => fetchFilesData(fileName));

const initialState = {
  list: { items: [], status: 'idle', error: null },
  data: { items: [], status: 'idle', error: null },
  fileNameFilter: ''
};

const filesSlice = createSlice({
  name: 'files',
  initialState,
  reducers: {
    setFileNameFilter(state, action) {
      state.fileNameFilter = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadFilesList.pending, (state) => {
        state.list.status = 'loading';
      })
      .addCase(loadFilesList.fulfilled, (state, action) => {
        state.list.status = 'succeeded';
        state.list.items = action.payload;
      })
      .addCase(loadFilesList.rejected, (state, action) => {
        state.list.status = 'failed';
        state.list.error = action.error.message;
      })
      .addCase(loadFilesData.pending, (state) => {
        state.data.status = 'loading';
      })
      .addCase(loadFilesData.fulfilled, (state, action) => {
        state.data.status = 'succeeded';
        state.data.items = action.payload;
      })
      .addCase(loadFilesData.rejected, (state, action) => {
        state.data.status = 'failed';
        state.data.error = action.error.message;
      });
  }
});

export const { setFileNameFilter } = filesSlice.actions;
export default filesSlice.reducer;
