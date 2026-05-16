const API = 'http://localhost:5000/api';

export const getFieldAdvice = async (context) => {
  try {
    const res = await fetch(`${API}/advice`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ context }),
    });
    const data = await res.json();
    return data.response;
  } catch (err) {
    return `Advice unavailable. Focus on ${context.activity} for ${context.crop} this month.`;
  }
};

export const sendChatMessage = async (messages, context) => {
  try {
    const res = await fetch(`${API}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages, context }),
    });
    const data = await res.json();
    return data.response;
  } catch (err) {
    return 'Sorry, I could not connect to the server. Please try again.';
  }
};

export const diagnosePlant = async (imageBase64, context) => {
  try {
    const res = await fetch(`${API}/diagnose`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: imageBase64, context }),
    });
    return await res.json();
  } catch (err) {
    return { name: 'Connection Error', severity: 'Unknown', cause: 'Could not reach server', treatment: 'Check backend connection', prevention: 'Ensure backend is running' };
  }
};
