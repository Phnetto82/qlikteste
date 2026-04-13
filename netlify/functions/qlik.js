const QLIK_HOST = 'itprime1.us.qlikcloud.com';
const API_KEY   = 'eyJhbGciOiJFUzM4NCIsImtpZCI6ImNmOWU0NWRmLWMwZDUtNGUwNy05MjIyLTczY2UxODVkOTcxYiIsInR5cCI6IkpXVCJ9.eyJzdWJUeXBlIjoidXNlciIsInRlbmFudElkIjoiUkZzalI4NHprSnc3NDJtbDZObmJlejJlbElVUUM3NjgiLCJqdGkiOiJjZjllNDVkZi1jMGQ1LTRlMDctOTIyMi03M2NlMTg1ZDk3MWIiLCJhdWQiOiJxbGlrLmFwaSIsImlzcyI6InFsaWsuYXBpL2FwaS1rZXlzIiwic3ViIjoiaGdQY1VMSFJadWo0R09RYWZGazFybW1QR1d4MnNOMVoifQ.NslfQabd4JEF492B2nWbqhZeKgENXoyhrJWEeTHmNW1d_40MioqmSfuok7TYu-wp-m172smAnc94jNJSeRCasteGTRdNg5kwK2TlRmFUBYqweyoKGEstM8nbUy8Cvd_C';

const CORS = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

exports.handler = async function(event) {
  // Preflight CORS
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: CORS, body: '' };
  }

  let qlikPath, qlikQs, qlikMethod, qlikBody;

  if (event.httpMethod === 'POST') {
    // POST: recebe { path, qs, method, body } no body
    let req;
    try { req = JSON.parse(event.body || '{}'); }
    catch(e) { return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'Invalid JSON' }) }; }
    qlikPath   = req.path  || '';
    qlikQs     = req.qs    || '';
    qlikMethod = req.method || 'POST';
    qlikBody   = req.body  || undefined;

  } else if (event.httpMethod === 'GET') {
    // GET: path vem nos queryStringParameters
    qlikPath   = event.queryStringParameters && event.queryStringParameters.path || '';
    qlikQs     = event.queryStringParameters && event.queryStringParameters.qs   || '';
    qlikMethod = 'GET';
    qlikBody   = undefined;

  } else {
    return { statusCode: 405, headers: CORS, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  if (!qlikPath) {
    return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'Missing path' }) };
  }

  const url = `https://${QLIK_HOST}${qlikPath}${qlikQs}`;

  try {
    const resp = await fetch(url, {
      method:  qlikMethod,
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type':  'application/json',
        'Accept':        'application/json',
      },
      body: qlikBody ? JSON.stringify(qlikBody) : undefined,
    });

    const body = await resp.text();
    return {
      statusCode: resp.status,
      headers:    { ...CORS, 'Content-Type': 'application/json' },
      body,
    };
  } catch(err) {
    return {
      statusCode: 500,
      headers:    CORS,
      body:       JSON.stringify({ error: err.message }),
    };
  }
};
