const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;


// CORS configurado para tu app móvil
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? process.env.ALLOWED_ORIGINS?.split(',') || false : true,
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Endpoint principal para servir el HTML de firma
app.get('/sign', (req, res) => {
  const { documentUrl } = req.query;

  // Obtener bearer token desde variables de entorno
  // const bearerToken = process.env.EDATALIA_BEARER_TOKEN;
  
  // Validaciones básicas
  // if (!bearerToken) {
  //   console.error('EDATALIA_BEARER_TOKEN not configured in environment variables');
  //   return res.status(500).json({ 
  //     error: 'Server configuration error: Bearer token not configured' 
  //   });
  // }

  // Generar el HTML con los parámetros
  const html = generateSigningHTML(documentUrl);
  
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  
  res.send(html);
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0'
  });
});

function generateSigningHTML() {
  // Base64 por defecto (PDF simple para testing)
  const defaultDocument ='data:application/pdf;base64,JVBERi0xLjMNCiXi48/TDQoNCjEgMCBvYmoNCjw8DQovVHlwZSAvQ2F0YWxvZw0KL091dGxpbmVzIDIgMCBSDQovUGFnZXMgMyAwIFINCj4+DQplbmRvYmoNCg0KMiAwIG9iag0KPDwNCi9UeXBlIC9PdXRsaW5lcw0KL0NvdW50IDANCj4+DQplbmRvYmoNCg0KMyAwIG9iag0KPDwNCi9UeXBlIC9QYWdlcw0KL0NvdW50IDINCi9LaWRzIFsgNCAwIFIgNiAwIFIgXSANCj4+DQplbmRvYmoNCg0KNCAwIG9iag0KPDwNCi9UeXBlIC9QYWdlDQovUGFyZW50IDMgMCBSDQovUmVzb3VyY2VzIDw8DQovRm9udCA8PA0KL0YxIDkgMCBSIA0KPj4NCi9Qcm9jU2V0IDggMCBSDQo+Pg0KL01lZGlhQm94IFswIDAgNjEyLjAwMDAgNzkyLjAwMDBdDQovQ29udGVudHMgNSAwIFINCj4+DQplbmRvYmoNCg0KNSAwIG9iag0KPDwgL0xlbmd0aCAxMDc0ID4+DQpzdHJlYW0NCjIgSg0KQlQNCjAgMCAwIHJnDQovRjEgMDAyNyBUZg0KNTcuMzc1MCA3MjIuMjgwMCBUZA0KKCBBIFNpbXBsZSBQREYgRmlsZSApIFRqDQpFVA0KQlQNCi9GMSAwMDEwIFRmDQo2OS4yNTAwIDY4OC42MDgwIFRkDQooIFRoaXMgaXMgYSBzbWFsbCBkZW1vbnN0cmF0aW9uIC5wZGYgZmlsZSAtICkgVGoNCkVUDQpCVA0KL0YxIDAwMTAgVGYNCjY5LjI1MDAgNjY0LjcwNDAgVGQNCigganVzdCBmb3IgdXNlIGluIHRoZSBWaXJ0dWFsIE1lY2hhbmljcyB0dXRvcmlhbHMuIE1vcmUgdGV4dC4gQW5kIG1vcmUgKSBUag0KRVQNCkJUDQovRjEgMDAxMCBUZg0KNjkuMjUwMCA2NTIuNzUyMCBUZA0KKCB0ZXh0LiBBbmQgbW9yZSB0ZXh0LiBBbmQgbW9yZSB0ZXh0LiBBbmQgbW9yZSB0ZXh0LiApIFRqDQpFVA0KQlQNCi9GMSAwMDEwIFRmDQo2OS4yNTAwIDYyOC44NDgwIFRkDQooIEFuZCBtb3JlIHRleHQuIEFuZCBtb3JlIHRleHQuIEFuZCBtb3JlIHRleHQuIEFuZCBtb3JlIHRleHQuIEFuZCBtb3JlICkgVGoNCkVUDQpCVA0KL0YxIDAwMTAgVGYNCjY5LjI1MDAgNjE2Ljg5NjAgVGQNCiggdGV4dC4gQW5kIG1vcmUgdGV4dC4gQm9yaW5nLCB6enp6ei4gQW5kIG1vcmUgdGV4dC4gQW5kIG1vcmUgdGV4dC4gQW5kICkgVGoNCkVUDQpCVA0KL0YxIDAwMTAgVGYNCjY5LjI1MDAgNjA0Ljk0NDAgVGQNCiggbW9yZSB0ZXh0LiBBbmQgbW9yZSB0ZXh0LiBBbmQgbW9yZSB0ZXh0LiBBbmQgbW9yZSB0ZXh0LiBBbmQgbW9yZSB0ZXh0LiApIFRqDQpFVA0KQlQNCi9GMSAwMDEwIFRmDQo2OS4yNTAwIDU5Mi45OTIwIFRkDQooIEFuZCBtb3JlIHRleHQuIEFuZCBtb3JlIHRleHQuICkgVGoNCkVUDQpCVA0KL0YxIDAwMTAgVGYNCjY5LjI1MDAgNTY5LjA4ODAgVGQNCiggQW5kIG1vcmUgdGV4dC4gQW5kIG1vcmUgdGV4dC4gQW5kIG1vcmUgdGV4dC4gQW5kIG1vcmUgdGV4dC4gQW5kIG1vcmUgKSBUag0KRVQNCkJUDQovRjEgMDAxMCBUZg0KNjkuMjUwMCA1NTcuMTM2MCBUZA0KKCB0ZXh0LiBBbmQgbW9yZSB0ZXh0LiBBbmQgbW9yZSB0ZXh0LiBFdmVuIG1vcmUuIENvbnRpbnVlZCBvbiBwYWdlIDIgLi4uKSBUag0KRVQNCmVuZHN0cmVhbQ0KZW5kb2JqDQoNCjYgMCBvYmoNCjw8DQovVHlwZSAvUGFnZQ0KL1BhcmVudCAzIDAgUg0KL1Jlc291cmNlcyA8PA0KL0ZvbnQgPDwNCi9GMSA5IDAgUiANCj4+DQovUHJvY1NldCA4IDAgUg0KPj4NCi9NZWRpYUJveCBbMCAwIDYxMi4wMDAwIDc5Mi4wMDAwXQ0KL0NvbnRlbnRzIDcgMCBSDQo+Pg0KZW5kb2JqDQoNCjcgMCBvYmoNCjw8IC9MZW5ndGggNjc2ID4+DQpzdHJlYW0NCjIgSg0KQlQNCjAgMCAwIHJnDQovRjEgMDAyNyBUZg0KNTcuMzc1MCA3MjIuMjgwMCBUZA0KKCBTaW1wbGUgUERGIEZpbGUgMiApIFRqDQpFVA0KQlQNCi9GMSAwMDEwIFRmDQo2OS4yNTAwIDY4OC42MDgwIFRkDQooIC4uLmNvbnRpbnVlZCBmcm9tIHBhZ2UgMS4gWWV0IG1vcmUgdGV4dC4gQW5kIG1vcmUgdGV4dC4gQW5kIG1vcmUgdGV4dC4gKSBUag0KRVQNCkJUDQovRjEgMDAxMCBUZg0KNjkuMjUwMCA2NzYuNjU2MCBUZA0KKCBBbmQgbW9yZSB0ZXh0LiBBbmQgbW9yZSB0ZXh0LiBBbmQgbW9yZSB0ZXh0LiBBbmQgbW9yZSB0ZXh0LiBBbmQgbW9yZSApIFRqDQpFVA0KQlQNCi9GMSAwMDEwIFRmDQo2OS4yNTAwIDY2NC43MDQwIFRkDQooIHRleHQuIE9oLCBob3cgYm9yaW5nIHR5cGluZyB0aGlzIHN0dWZmLiBCdXQgbm90IGFzIGJvcmluZyBhcyB3YXRjaGluZyApIFRqDQpFVA0KQlQNCi9GMSAwMDEwIFRmDQo2OS4yNTAwIDY1Mi43NTIwIFRkDQooIHBhaW50IGRyeS4gQW5kIG1vcmUgdGV4dC4gQW5kIG1vcmUgdGV4dC4gQW5kIG1vcmUgdGV4dC4gQW5kIG1vcmUgdGV4dC4gKSBUag0KRVQNCkJUDQovRjEgMDAxMCBUZg0KNjkuMjUwMCA2NDAuODAwMCBUZA0KKCBCb3JpbmcuICBNb3JlLCBhIGxpdHRsZSBtb3JlIHRleHQuIFRoZSBlbmQsIGFuZCBqdXN0IGFzIHdlbGwuICkgVGoNCkVUDQplbmRzdHJlYW0NCmVuZG9iag0KDQo4IDAgb2JqDQpbL1BERiAvVGV4dF0NCmVuZG9iag0KDQo5IDAgb2JqDQo8PA0KL1R5cGUgL0ZvbnQNCi9TdWJ0eXBlIC9UeXBlMQ0KL05hbWUgL0YxDQovQmFzZUZvbnQgL0hlbHZldGljYQ0KL0VuY29kaW5nIC9XaW5BbnNpRW5jb2RpbmcNCj4+DQplbmRvYmoNCg0KMTAgMCBvYmoNCjw8DQovQ3JlYXRvciAoUmF2ZSBcKGh0dHA6Ly93d3cubmV2cm9uYS5jb20vcmF2ZVwpKQ0KL1Byb2R1Y2VyIChOZXZyb25hIERlc2lnbnMpDQovQ3JlYXRpb25EYXRlIChEOjIwMDYwMzAxMDcyODI2KQ0KPj4NCmVuZG9iag0KDQp4cmVmDQowIDExDQowMDAwMDAwMDAwIDY1NTM1IGYNCjAwMDAwMDAwMTkgMDAwMDAgbg0KMDAwMDAwMDA5MyAwMDAwMCBuDQowMDAwMDAwMTQ3IDAwMDAwIG4NCjAwMDAwMDAyMjIgMDAwMDAgbg0KMDAwMDAwMDM5MCAwMDAwMCBuDQowMDAwMDAxNTIyIDAwMDAwIG4NCjAwMDAwMDE2OTAgMDAwMDAgbg0KMDAwMDAwMjQyMyAwMDAwMCBuDQowMDAwMDAyNDU2IDAwMDAwIG4NCjAwMDAwMDI1NzQgMDAwMDAgbg0KDQp0cmFpbGVyDQo8PA0KL1NpemUgMTENCi9Sb290IDEgMCBSDQovSW5mbyAxMCAwIFINCj4+DQoNCnN0YXJ0eHJlZg0KMjcxNA0KJSVFT0YNCg==';

  return `
<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta charset="utf-8" />
    <title>Firma Digital - Edatalia</title>
    <script>
      // Configurar logging para React Native WebView
      (function() {
        const originalLog = console.log;
        const originalError = console.error;
        const originalWarn = console.warn;
        
        console.log = function(...args) {
          window.ReactNativeWebView?.postMessage(JSON.stringify({ type: 'log', data: args }));
          originalLog.apply(console, args);
        };
        
        console.error = function(...args) {
          window.ReactNativeWebView?.postMessage(JSON.stringify({ type: 'error', data: args }));
          originalError.apply(console, args);
        };
        
        console.warn = function(...args) {
          window.ReactNativeWebView?.postMessage(JSON.stringify({ type: 'warn', data: args }));
          originalWarn.apply(console, args);
        };
      })();
    </script>
    <script src="https://cdn.jsdelivr.net/npm/edatalia-websign@3.0.2/web-sign-core.min.js"></script>
    <style>
      html, body {
        margin: 0;
        padding: 0;
        height: 100%;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        background-color: #f5f5f5;
      }
      
      #web-sign {
        height: 100vh;
        width: 100%;
      }
      
      .loading {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        font-size: 18px;
        color: #666;
      }
      
      .error {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 100vh;
        padding: 20px;
        text-align: center;
      }
      
      .error h3 {
        color: #e74c3c;
        margin-bottom: 10px;
      }
      
      .error p {
        color: #666;
        max-width: 400px;
      }
    </style>
  </head>
  <body>
    <div id="loading" class="loading">
      Cargando firma digital...
    </div>
    <div id="error" class="error" style="display: none;">
      <h3>Error al cargar la firma</h3>
      <p id="error-message"></p>
    </div>
    <div>

    <div id="web-sign"></div>

    <script>
      try {
        console.log('Inicializando Edatalia WebSign...');
        
        const config = {
          bearerToken: "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiQ3VzdG9tZXIiLCJDdXN0b21lcklkIjo1LCJUb2tlbklkIjo0MCwiYXVkIjoiZWRhdGFsaWEgZGF0YSBzb2x1dGlvbnMgcy5sLiIsIm5iZiI6MTc1NDU4MTI4NCwiZXhwIjoxNzU5MTkwNDAwLCJpYXQiOjE3NTQ1ODEyODQsImlzcyI6ImVkYXRhbGlhIGRhdGEgc29sdXRpb25zIHMubC4ifQ.IyGRrP3U1JhhPSivcVJuOvbdi2Llw0HBmczY6J8lvOP6_qtRI1tAVlhr5AMc35e_guAGHdvqP08LBBqlxoAC_Q",
          viewPDF: true,
          container: "#web-sign"
        };
        
        // Función para enviar eventos a React Native
        function sendToReactNative(eventData) {
          console.log('Enviando evento a React Native:', eventData);
          if (window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage(JSON.stringify(eventData));
          }
        }
        
        // Convertir base64 a blob y crear archivo
        const base64 = "${defaultDocument}";
        fetch(base64)
          .then(res => {
            if (!res.ok) {
              throw new Error('Error al cargar el documento');
            }
            return res.blob();
          })
          .then(blob => {
            console.log('Documento cargado, tamaño:', blob.size, 'bytes');
            
            const file = new File([blob], "documento.pdf", {
              type: "application/pdf",
              lastModified: new Date().getTime(),
            });
            
            console.log('Archivo creado:', file.name, file.type);
            
            // Ocultar loading y mostrar web-sign
            document.getElementById('loading').style.display = 'none';
            document.getElementById('web-sign').style.display = 'block';
            
            // Inicializar WebSign directamente
            const webSign = new WebSign(file, config, function(event) {
              console.log('Evento de WebSign:', event);
              
              // Mapear eventos de edatalia a nuestro formato
              let mappedEvent = {};
              
              switch(event.type) {
                case 'SIGNED':
                  mappedEvent = {
                    type: 'signed',
                    data: event.data
                  };
                  break;
                case 'CANCELLED':
                  mappedEvent = {
                    type: 'cancel'
                  };
                  break;
                case 'ERROR':
                  mappedEvent = {
                    type: 'error',
                    error: event.error || event.message || 'Error desconocido'
                  };
                  break;
                case 'READY':
                  mappedEvent = {
                    type: 'ready'
                  };
                  break;
                case 'LOADING':
                  mappedEvent = {
                    type: 'loading'
                  };
                  break;
                default:
                  mappedEvent = {
                    type: 'unknown',
                    originalEvent: event
                  };
              }
              
              sendToReactNative(mappedEvent);
            });
            
            console.log('WebSign inicializado correctamente');
            
            sendToReactNative({
              type: 'ready',
              message: 'WebSign inicializado'
            });
            
          })
          .catch(error => {
            console.error('Error al procesar el documento:', error);
            
            document.getElementById('loading').style.display = 'none';
            document.getElementById('error').style.display = 'flex';
            document.getElementById('error-message').textContent = error.message;
            
            sendToReactNative({
              type: 'error',
              error: error.message
            });
          });
          
      } catch (error) {
        console.error('Error general:', error);
        
        document.getElementById('loading').style.display = 'none';
        document.getElementById('error').style.display = 'flex';
        document.getElementById('error-message').textContent = error.message;
        
        if (window.ReactNativeWebView) {
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'error',
            error: error.message
          }));
        }
      }
    </script>
  </body>
</html>
  `;
}

app.listen(PORT, () => {
  console.log(`🚀 Servidor Edatalia corriendo en puerto ${PORT}`);
});

module.exports = app;