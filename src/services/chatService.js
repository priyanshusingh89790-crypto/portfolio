const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://portfolio-izjv.onrender.com';

/**
 * Send a chat message to the backend AI service
 * @param {string} message - The user's question
 * @returns {Promise<{answer: string, sources: Array}>} - The AI response with sources
 */
export async function sendChatMessage(message) {
  const trimmedMessage = message.trim();
  console.log(message)
  if (!trimmedMessage) {
    throw new Error('Message cannot be empty');
  }

  const response = await fetch(`${BACKEND_URL}/api/ai/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message: trimmedMessage }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: 'Unknown error' }));
    throw new Error(errorData.detail || `API error: ${response.status}`);
  }

  const data = await response.json();
    console.log(data)

  return data;

}

export async function analyzeJobDescription(jobDescription) {
  const trimmed = jobDescription.trim();
  if (!trimmed) throw new Error("Job description cannot be empty");
  const response = await fetch(`${BACKEND_URL}/api/ai/analyze-jd`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ job_description: trimmed }),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: "Unknown error" }));
    throw new Error(errorData.detail || `API error: ${response.status}`);
  }
  return response.json();
}
