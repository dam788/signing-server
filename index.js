const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid'); // Importa uuid
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Almacenamiento temporal en memoria para las sesiones de firma
const signingSessions = {};

app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? process.env.ALLOWED_ORIGINS?.split(',') || false : true,
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Aumenta el límite del body para aceptar el Base64
app.use(express.json({ limit: '10mb' }));

// --- NUEVO ENDPOINT ---
// Paso 1: Recibe el Base64 y crea una sesión de firma
app.post('/prepare-sign', (req, res) => {
  const { documentBase64 } = req.body;

  if (!documentBase64) {
    return res.status(400).json({ error: 'documentBase64 is required' });
  }

  const sessionId = uuidv4(); // Genera un ID único
  // Guarda el Base64 en memoria con el ID como clave
  // Agrega un TTL (Time-To-Live) de 5 minutos para que se borre solo
  signingSessions[sessionId] = documentBase64;
  setTimeout(() => {
    delete signingSessions[sessionId];
    console.log(`Session ${sessionId} expired and was deleted.`);
  }, 300000); // 300,000 ms = 5 minutos

  // Devuelve el ID a la app de React Native
  res.json({ sessionId });
});


// --- ENDPOINT MODIFICADO ---
// Paso 2: El WebView carga esta URL con el sessionId
app.get('/sign/:sessionId', (req, res) => {
  const { sessionId } = req.params;
  const documentBase64 = signingSessions[sessionId]; // Recupera el Base64 desde la memoria

  if (!documentBase64) {
    return res.status(404).send('<h1>Sesión de firma no encontrada o expirada.</h1>');
  }
  
  const bearerToken = process.env.EDATALIA_BEARER_TOKEN;

  if (!bearerToken) {
    console.error('EDATALIA_BEARER_TOKEN not configured');
    return res.status(500).send('<h1>Error de configuración del servidor.</h1>');
  }

  // Genera el HTML usando el Base64 recuperado
  const html = generateSigningHTML(documentBase64, bearerToken);
  
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.send(html);
});

// El resto de tu código (generateSigningHTML, health check, etc.)
// ...

// Solo un cambio en generateSigningHTML: cambia la variable de 'documentUrl' a 'documentBase64'
function generateSigningHTML(documentBase64, bearerToken) {
  // La variable ahora es documentBase64, no documentUrl
  const finalDocument = documentBase64.startsWith('data:') ? documentBase64 : `data:application/pdf;base64,${documentBase64}`;

  return `
<!DOCTYPE html>
<html>
  <head>
    </head>
  <body>
    <script>
      try {
        // ...
        // AQUÍ ESTÁ EL CAMBIO CLAVE DENTRO DEL SCRIPT HTML
        const base64 = "${finalDocument}"; // Usa la variable que pasamos
        
        fetch(base64)
          .then(res => res.blob())
          .then(blob => {
            const file = new File([blob], "documento.pdf", { type: "application/pdf" });
            const config = {
              bearerToken: "${bearerToken}",
              viewPDF: true,
              container: "#web-sign"
            };
            const webSign = new WebSign(file, config, function(event) {
              // ... tu lógica de eventos de WebSign
            });
          })
          .catch(error => {
            console.error('Error al procesar el documento:', error);
          });
      } catch (error) {
        console.error('Error general:', error);
      }
    </script>
  </body>
</html>`;
}


app.listen(PORT, () => {
  console.log(`🚀 Servidor Edatalia corriendo en puerto ${PORT}`);
});

module.exports = app;