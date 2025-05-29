export const connections = new Map<string, WebSocket>();

export const getConnection = (appointmentId: string, userId: string) => {
  const connectionId = `${appointmentId}-${userId}`;
  return connections.get(connectionId);
};

export const broadcastToAppointment = (appointmentId: string, message: any) => {
  connections.forEach((ws, key) => {
    if (key.startsWith(appointmentId)) {
      ws.send(JSON.stringify(message));
    }
  });
};