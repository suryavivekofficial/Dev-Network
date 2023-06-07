import Pusher from "pusher-js";

// Enable pusher logging - don't include this in production
Pusher.logToConsole = true;

export const pusherClient = new Pusher("475586ad7d4c637fe047", {
  cluster: "ap2",
});
