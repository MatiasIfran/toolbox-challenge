import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Table from 'react-bootstrap/Table';
import Spinner from 'react-bootstrap/Spinner';
import Alert from 'react-bootstrap/Alert';
import { loadFilesData } from '../store/filesSlice';

function flattenRows(files) {
  return files.flatMap((file) =>
    file.lines.map((line, index) => ({
      key: `${file.file}-${index}`,
      file: file.file,
      text: line.text,
      number: line.number,
      hex: line.hex
    }))
  );
}

function FilesTable() {
  const dispatch = useDispatch();
  const { items, status, error } = useSelector((state) => state.files.data);
  const fileNameFilter = useSelector((state) => state.files.fileNameFilter);

  useEffect(() => {
    dispatch(loadFilesData(fileNameFilter || undefined));
  }, [dispatch, fileNameFilter]);

  if (status === 'loading' || status === 'idle') {
    return <Spinner animation="border" role="status" />;
  }

  if (status === 'failed') {
    return <Alert variant="danger">{error}</Alert>;
  }

  const rows = flattenRows(items);

  return (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th>File Name</th>
          <th>Text</th>
          <th>Number</th>
          <th>Hex</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.key}>
            <td>{row.file}</td>
            <td>{row.text}</td>
            <td>{row.number}</td>
            <td>{row.hex}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

export default FilesTable;
