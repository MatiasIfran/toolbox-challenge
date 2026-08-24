import { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import Spinner from 'react-bootstrap/Spinner';
import Alert from 'react-bootstrap/Alert';
import { fetchFilesData } from '../services/filesApi';

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
  const [rows, setRows] = useState([]);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    fetchFilesData()
      .then((files) => {
        if (!isMounted) return;
        setRows(flattenRows(files));
        setStatus('success');
      })
      .catch((err) => {
        if (!isMounted) return;
        setError(err.message);
        setStatus('error');
      });

    return () => {
      isMounted = false;
    };
  }, []);

  if (status === 'loading') {
    return <Spinner animation="border" role="status" />;
  }

  if (status === 'error') {
    return <Alert variant="danger">{error}</Alert>;
  }

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
