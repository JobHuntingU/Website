// Same local/prod base-switching pattern as apiClient.js, pointing at the
// chatbot-backend service instead of the main Node backend.
const getBaseUrl = () => {
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    return 'http://localhost:8000';
  }
  return ''; // Relative path for production (Traefik handles routing)
};

const API_BASE_URL = getBaseUrl();

export async function sendChatMessage(message, history) {
  const response = await fetch(`${API_BASE_URL}/api/chatbot/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, history }),
  });

  if (!response.ok) {
    throw new Error(`Chat request failed with status ${response.status}`);
  }

  return response.json();
}
