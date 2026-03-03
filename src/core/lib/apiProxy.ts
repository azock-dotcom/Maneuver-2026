type ApiProvider = 'tba' | 'nexus';

interface ProxyRequestOptions {
  apiKeyOverride?: string;
}

export async function proxyGetJson<T>(
  provider: ApiProvider,
  endpoint: string,
  options: ProxyRequestOptions = {}
): Promise<T> {
  // 1. Determine the Base URL
  // If it's TBA, we go to their v3 API. 
  const baseUrl = provider === 'tba' 
    ? 'https://www.thebluealliance.com/api/v3' 
    : ''; 

  // 2. Clean the endpoint (remove leading slashes if they exist)
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;

  // 3. Make the direct call
  const response = await fetch(`${baseUrl}/${cleanEndpoint}`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      // Use your API key from the .env file
      'X-TBA-Auth-Key': options.apiKeyOverride || import.meta.env.VITE_TBA_API_KEY,
    },
  });

  if (!response.ok) {
    throw new Error(`TBA Request failed: ${response.status} ${response.statusText}`);
  }

  return await response.json() as T;
}
