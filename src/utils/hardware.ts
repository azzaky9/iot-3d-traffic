// Hardware integration constants and functions
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

export async function triggerUrgentDirection(direction: keyof typeof roadLineMapper) {
  try {
    const url = roadLineMapper[direction];
    console.log("Triggering hardware with URL:", `${IP}${url}`);
    const req = await fetch(`${IP}${roadLineMapper[direction]}`);
    console.log("Hardware request sent:", req);
    return req;
  } catch (error) {
    console.error("Hardware request failed:", error);
    throw error;
  }
}

// Helper function to create the direction key from road and direction
export function createDirectionKey(road: string, direction: string): keyof typeof roadLineMapper | null {
  if (!road || !direction || road === "intersection") {
    return null;
  }

  // Map direction to the hardware format
  const directionMap: Record<string, string> = {
    "left": "turn-left",
    "right": "turn-right",
    "straight": "straight"
  };

  const mappedDirection = directionMap[direction];
  if (!mappedDirection) {
    return null;
  }

  const key = `${mappedDirection}-${road}` as keyof typeof roadLineMapper;
  return roadLineMapper[key] ? key : null;
}
