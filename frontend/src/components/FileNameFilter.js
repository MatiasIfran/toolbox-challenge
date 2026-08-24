import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Form from 'react-bootstrap/Form';
import { loadFilesList, setFileNameFilter } from '../store/filesSlice';

function FileNameFilter() {
  const dispatch = useDispatch();
  const { items, status } = useSelector((state) => state.files.list);
  const fileNameFilter = useSelector((state) => state.files.fileNameFilter);

  useEffect(() => {
    dispatch(loadFilesList());
  }, [dispatch]);

  return (
    <Form.Select
      aria-label="Filter by file name"
      value={fileNameFilter}
      disabled={status !== 'succeeded'}
      onChange={(event) => dispatch(setFileNameFilter(event.target.value))}
      className="mb-3"
      style={{ maxWidth: 300 }}
    >
      <option value="">All files</option>
      {items.map((file) => (
        <option key={file} value={file}>
          {file}
        </option>
      ))}
    </Form.Select>
  );
}

export default FileNameFilter;
