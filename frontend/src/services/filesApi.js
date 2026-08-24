import { API_BASE_URL } from '../config';

export async function fetchFilesList() {
  const response = await fetch(`${API_BASE_URL}/files/list`);

  if (!response.ok) {
    throw new Error(`Failed to fetch files list: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data.files;
}

export async function fetchFilesData(fileName) {
  const url = fileName
    ? `${API_BASE_URL}/files/data?fileName=${encodeURIComponent(fileName)}`
    : `${API_BASE_URL}/files/data`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch files data: ${response.status} ${response.statusText}`);
  }

  return response.json();
}
