// pages/api/index.js
export default function handler(req, res) {
    const { method, url } = req;
  
    if (url === '/api/rota1' && method === 'GET') {
      // Lógica para rota1
    } else if (url === '/api/rota2' && method === 'POST') {
      // Lógica para rota2
    } else {
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Método ${method} não permitido para ${url}`);
    }
  }
  