const API_URL = 'https://fjfobafukxuhhyeoqzlt.supabase.co/functions/v1/api';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZqZm9iYWZ1a3h1aGh5ZW9xemx0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5OTU3NjYsImV4cCI6MjA5MzU3MTc2Nn0.NCM4WaWs2mDXsHJRXjqKqMfQ4CnIW6eCURjAUrFQmQ4';

export async function fetchConversations() {
  const response = await fetch(`${API_URL}?type=conversations`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch conversations');
  }

  const data = await response.json();
  
  // Convert ISO timestamp strings back to Date objects for the frontend
  if (data.conversations) {
    data.conversations = data.conversations.map(conv => ({
      ...conv,
      timestamp: new Date(conv.timestamp)
    }));
  }

  return data.conversations;
}

export async function fetchMetrics() {
  const response = await fetch(`${API_URL}?type=metrics`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch metrics');
  }

  return await response.json();
}
