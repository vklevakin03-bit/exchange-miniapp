const crypto = require('crypto');

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { fromCcy, toCcy, amount, type, toAddress } = req.body;

  const body = JSON.stringify({ fromCcy, toCcy, amount, direction: 'from', type, toAddress });

  const sign = crypto.createHmac('sha256', process.env.FF_API_SECRET).update(body).digest('hex');

  const response = await fetch('https://ff.io/api/v2/create', {
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
