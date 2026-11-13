const COUNTER_KEY = 'a eanp:revista:downloads'.replace(/ /g, '');

function redisConfig() {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  return url && token ? { url: url.replace(/\/$/, ''), token } : null;
}

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Método não permitido.' });
  }

  const config = redisConfig();
  if (!config) {
    return res.status(503).json({ error: 'Contador ainda não configurado.' });
  }

  try {
    const response = await fetch(`${config.url}/get/${encodeURIComponent(COUNTER_KEY)}`, {
      headers: { Authorization: `Bearer ${config.token}` }
    });
    if (!response.ok) throw new Error('Falha ao consultar o contador');
    const data = await response.json();
    const total = Number(data.result || 0);
    return res.status(200).json({ total: Number.isFinite(total) && total >= 0 ? total : 0 });
  } catch (error) {
    return res.status(503).json({ error: 'Não foi possível consultar o contador.' });
  }
};
