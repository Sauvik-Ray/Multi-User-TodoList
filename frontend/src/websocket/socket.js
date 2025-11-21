import { Client } from "@stomp/stompjs";

let client = null;
let currentRoom = null;
let connected = false;

/**
 * Connects to WebSocket and subscribes to a specific room.
 * onMessage is called every time a new WS message arrives.
 */
export function connectSocket(roomId, onMessage) {
  if (connected && roomId === currentRoom) return; // already connected

  currentRoom = roomId;

  client = new Client({
    brokerURL: "ws://localhost:8080/ws",
    reconnectDelay: 2000,
    heartbeatIncoming: 4000,
    heartbeatOutgoing: 4000,

    onConnect: () => {
      connected = true;

      // Subscribe to this room
      client.subscribe(`/topic/rooms/${roomId}`, (msg) => {
        try {
          const body = JSON.parse(msg.body);
          onMessage && onMessage(body);
        } catch (e) {
          console.error("WS Message Parse Error:", e);
        }
      });

      console.log("WebSocket connected to room:", roomId);
    },

    onStompError(frame) {
      console.error("Broker STOMP error:", frame.headers["message"]);
    },

    onWebSocketError(ev) {
      console.error("WebSocket error:", ev);
    },
  });

  client.activate();
}

/**
 * Send update to other clients in same room.
 */
export function sendUpdate(roomId, message) {
  if (!client || !connected) {
    console.warn("WS not connected, cannot send message");
    return;
  }

  try {
    client.publish({
      destination: `/app/rooms/${roomId}/notify`,
      body: JSON.stringify(message),
    });
  } catch (e) {
    console.error("Failed to send WS message:", e);
  }
}

/**
 * Disconnect
 */
export function disconnectSocket() {
  try {
    if (client && connected) {
      client.deactivate();
    }
  } catch (e) {
    console.error("Error disconnecting:", e);
  } finally {
    connected = false;
    currentRoom = null;
    client = null;
  }
}
