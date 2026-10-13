// GET /api/geo → { "country": "VN" }
// Vercel adds the X-Vercel-IP-Country header (2-letter code of the caller's
// IP) to every request it routes to a function. Not set when run locally,
// so this returns null there. Nothing is logged or stored here — the reader's
// browser saves the code on its own profile row (app.js: syncMyCountry).
module.exports = function handler(req, res) {
  var c = req.headers['x-vercel-ip-country'];
  c = (typeof c === 'string' && /^[A-Z]{2}$/i.test(c)) ? c.toUpperCase() : null;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.statusCode = 200;
  res.end(JSON.stringify({ country: c }));
};
