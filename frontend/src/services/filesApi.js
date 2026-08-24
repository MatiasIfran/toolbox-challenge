import { API_BASE_URL } from '../config';

export async function fetchFilesData() {
  const response = await fetch(`${API_BASE_URL}/files/data`);

  if (!response.ok) {
    throw new Error(`Failed to fetch files data: ${response.status} ${response.statusText}`);
  }

  return response.json();
}
