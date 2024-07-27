export const fetchFromApi = async <T>(endpoint: string, method: 'GET' | 'POST' | 'PUT' | 'DELETE', data?: any): Promise<T> => {
    
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const url =  `${BACKEND_URL}${endpoint}`; 
  const token = localStorage.getItem("vs-token")
 
  const requestOptions: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'token': `${token}` }), // Include the token if it exists
    },
    body: data ? JSON.stringify(data) : undefined,
  };

  const response = await fetch(url, requestOptions);
  if (!response.ok) {
    return response.json()
  }
  
  return response.json();
};
