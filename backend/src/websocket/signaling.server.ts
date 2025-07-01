import { Server } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import { getConnections, reconnectAttempts } from '../utils/websocket';
import { verifyToken } from '../utils/auth';
import { logCallEvent } from '../services/callLog.service';

export const createSignalingServer = (server: Server) => {
  const wss = new WebSocketServer({ 
    server,
    verifyClient: async (info, callback) => {
      try {
        const token = new URL(info.req.url || '', `http://${info.req.headers.host}`)
          .searchParams.get('token');
        
        if (!token) {
          return callback(false, 401, 'Unauthorized');
        }

        const decoded = verifyToken(token);
        callback(true);
      } catch (error) {
        callback(false, 401, 'Unauthorized');
      }
    }
  });

  wss.on('connection', (ws: WebSocket, req) => {
    const url = new URL(req.url || '', `http://${req.headers.host}`);
    const appointmentId = url.searchParams.get('appointmentId');
    const userId = url.searchParams.get('userId');
    
    if (!appointmentId || !userId) {
      ws.close();
      return;
    }

    const connectionId = `${appointmentId}-${userId}`;
    getConnections.set(connectionId, ws);

    ws.on('message', async (message) => {
      const data = JSON.parse(message.toString());
      
      // Log WebSocket events
      if (data.type) {
        await logCallEvent(
          appointmentId,
          userId,
          `ws-${data.type}`,
          data
        );
      }

      getConnections.forEach((conn, key) => {
        if (key.startsWith(appointmentId) && key !== connectionId) {
          conn.send(JSON.stringify(data));
        }
      });
    });

    ws.on('close', () => {
      const attempt = reconnectAttempts.get(connectionId) || 0;
      if (attempt < 3) {
        setTimeout(() => {
          reconnectAttempts.set(connectionId, attempt + 1);
        }, 1000 * attempt);
      } else {
        getConnections.delete(connectionId);
        reconnectAttempts.delete(connectionId);
      }
    });
  });

  setInterval(() => {
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.ping();
      }
    });
  }, 30000);

  return wss;
};