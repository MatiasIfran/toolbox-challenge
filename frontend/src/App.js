import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import FileNameFilter from './components/FileNameFilter';
import FilesTable from './components/FilesTable';
import './App.css';

function App() {
  return (
    <>
      <header className="app-header">
        <Container fluid>
          <h1>React Test App</h1>
        </Container>
      </header>
      <Container className="py-4">
        <FileNameFilter />
        <FilesTable />
      </Container>
    </>
  );
}

export default App;
