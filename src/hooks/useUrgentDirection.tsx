const IP = import.meta.env.VITE_HARDWARE_IP;

const roadLineMapper = {
  "turn-right-north": "/urgent/right/north",
  "straight-north": "/urgent/straight/north",
  "turn-left-north": "/urgent/left/north",
  "turn-right-south": "/urgent/right/south",
  "straight-south": "/urgent/straight/south",
  "turn-left-south": "/urgent/left/south",
  "turn-right-east": "/urgent/right/east",
  "straight-east": "/urgent/straight/east",
  "turn-left-east": "/urgent/left/east",
  "turn-right-west": "/urgent/right/west",
  "straight-west": "/urgent/straight/west",
  "turn-left-west": "/urgent/left/west"
};

export async function useUrgentDirection(direction: keyof typeof roadLineMapper) {
  try {
    const req = await fetch(`${IP}${roadLineMapper[direction]}`);
    console.log(req);
  } catch (error) {
    console.error(error);
  }
}
