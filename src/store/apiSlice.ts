// apiSlice.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const fetchFromApi = async <T>(endpoint: string, method: 'GET' | 'POST' | 'PUT' | 'DELETE', data?: any): Promise<T> => {
    
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const url =  `${BACKEND_URL}${endpoint}`; 
 
  const requestOptions: RequestInit = {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: data ? JSON.stringify(data) : undefined,
  };

  const response = await fetch(url, requestOptions);
  if (!response.ok) {
    return response.json()
  }
  
  return response.json();
};
