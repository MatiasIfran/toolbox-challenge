import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Form from 'react-bootstrap/Form';
import { loadFilesList, setFileNameFilter } from '../store/filesSlice';

function FileNameFilter() {
  const dispatch = useDispatch();
  const { items, status, error } = useSelector((state) => state.files.list);
  const fileNameFilter = useSelector((state) => state.files.fileNameFilter);

  useEffect(() => {
    dispatch(loadFilesList());
  }, [dispatch]);

  return (
    <div className="mb-3">
      <Form.Select
        aria-label="Filter by file name"
        value={fileNameFilter}
        disabled={status !== 'succeeded'}
        onChange={(event) => dispatch(setFileNameFilter(event.target.value))}
        style={{ maxWidth: 300 }}
      >
        <option value="">All files</option>
        {items.map((file) => (
          <option key={file} value={file}>
            {file}
          </option>
        ))}
      </Form.Select>
      {status === 'failed' && (
        <Form.Text className="text-danger">Unable to load the file list: {error}</Form.Text>
      )}
    </div>
  );
}

export default FileNameFilter;
