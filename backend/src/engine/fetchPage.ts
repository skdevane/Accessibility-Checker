import axios from 'axios';

export async function fetchPage(url: string): Promise<string> {
  const response = await axios.get<string>(url, {
    timeout: 10_000,
    headers: {
      'User-Agent': 'AccessibilityChecker/1.0 (+https://github.com/starklab/accessibility-checker)',
    },
    maxRedirects: 5,
    responseType: 'text',
  });
  return response.data;
}
