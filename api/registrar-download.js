const COUNTER_KEY = 'aeanp:revista:downloads';

function redisConfig() {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  return url && token ? { url: url.replace(/\/$/, ''), token } : null;
}

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Método não permitido.' });
  }

  const config = redisConfig();
  if (!config) return res.status(503).json({ error: 'Contador ainda não configurado.' });

  try {
    const response = await fetch(`${config.url}/incr/${encodeURIComponent(COUNTER_KEY)}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${config.token}` }
    });
    if (!response.ok) throw new Error('Falha ao registrar download');
    const data = await response.json();
    return res.status(200).json({ ok: true, total: Number(data.result) });
  } catch (error) {
    return res.status(503).json({ error: 'Não foi possível registrar o download.' });
  }
};
