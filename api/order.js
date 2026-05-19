const crypto = require('crypto');

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { id, token } = req.body;

  const body = JSON.stringify({ id, token });

  const sign = crypto.createHmac('sha256', process.env.FF_API_SECRET).update(body).digest('hex');

  const response = await fetch('https://ff.io/api/v2/order', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-KEY': process.env.FF_API_KEY,
      'X-API-SIGN': sign,
    },
    body,
  });

  const data = await response.json();
  res.status(200).json(data);
}
