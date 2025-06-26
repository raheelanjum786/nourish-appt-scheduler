export const getConnections = new Map<string, WebSocket>();

export const getConnection = (appointmentId: string, userId: string) => {
  const connectionId = `${appointmentId}-${userId}`;
  return getConnections.get(connectionId);
};

export const broadcastToAppointment = (appointmentId: string, message: any) => {
  getConnections.forEach((ws, key) => {
    if (key.startsWith(appointmentId)) {
      ws.send(JSON.stringify(message));
    }
  });
};