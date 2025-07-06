"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Box, Plane } from "@react-three/drei";
import { useEffect, useState } from "react";
import { Select, SelectItem } from "@heroui/select";
import { Building, Park, StreetLamp, Tree } from "./decoration";
import { triggerUrgentDirection, createDirectionKey } from "../utils/hardware";

function RoadSegment({
  position,
  rotation,
  length = 10,
  width = 2,
  isSelected = false,
  onClick
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
  length?: number;
  width?: number;
  isSelected?: boolean;
  onClick?: () => void;
}) {
  return (
    <group onClick={onClick}>
      {/* Main road */}
      <Box
        position={position}
        rotation={rotation}
        args={[length, 0.1, width]}
      >
        <meshStandardMaterial color="#404040" />
      </Box>

      {/* White border when selected */}
      {isSelected && (
        <Box
          position={[position[0], position[1] + 0.05, position[2]]}
          rotation={rotation}
          args={[length + 0.2, 0.02, width + 0.2]}
        >
          <meshStandardMaterial
            color="#fafafa"
            transparent
            opacity={0.5}
          />
        </Box>
      )}
    </group>
  );
}

function Intersection({
  position,
  isSelected = false,
  onClick
}: {
  position: [number, number, number];
  isSelected?: boolean;
  onClick?: () => void;
}) {
  return (
    <group onClick={onClick}>
      {/* Main intersection */};
      <Box
        position={position}
        args={[8, 0.1, 8]}
      >
        <meshStandardMaterial color="#404040" />
      </Box>
      {/* White border when selected */}
      {isSelected && (
        <Box
          position={[position[0], position[1] + 0.05, position[2]]}
          args={[8.2, 0.02, 8.2]}
        >
          <meshStandardMaterial
            color="#ffffff"
            transparent
            opacity={0.8}
          />
        </Box>
      )}
    </group>
  );
}

function TrafficLight({
  position,
  activeLight = "red",
  rotation,
  onLightClick
}: {
  position: [number, number, number];
  activeLight?: "red" | "yellow" | "green";
  rotation?: [number, number, number];
  onLightClick?: (lightColor: "red" | "yellow" | "green") => void;
}) {
  return (
    <group
      position={position}
      rotation={rotation}
    >
      {/* Traffic light pole */}
      <Box
        position={[0, 1.5, 0]}
        args={[0.1, 3, 0.1]}
      >
        <meshStandardMaterial color="#666666" />
      </Box>
      {/* Traffic light box */}
      <Box
        position={[0, 3.2, 0]}
        args={[0.4, 1.2, 0.25]}
      >
        <meshStandardMaterial color="#222222" />
      </Box>

      {/* Red Light */}
      <mesh
        position={[0, 3.6, 0.15]}
        onClick={() => onLightClick?.("red")}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          document.body.style.cursor = "default";
        }}
      >
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial
          color={activeLight === "red" ? "#ff0000" : "#440000"}
          emissive={activeLight === "red" ? "#ff0000" : "#000000"}
          emissiveIntensity={activeLight === "red" ? 0.8 : 0}
        />
      </mesh>

      {/* Yellow Light */}
      <mesh
        position={[0, 3.2, 0.15]}
        onClick={() => onLightClick?.("yellow")}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          document.body.style.cursor = "default";
        }}
      >
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial
          color={activeLight === "yellow" ? "#ffff00" : "#444400"}
          emissive={activeLight === "yellow" ? "#ffff00" : "#000000"}
          emissiveIntensity={activeLight === "yellow" ? 0.8 : 0}
        />
      </mesh>

      {/* Green Light */}
      <mesh
        position={[0, 2.8, 0.15]}
        onClick={() => onLightClick?.("green")}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          document.body.style.cursor = "default";
        }}
      >
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial
          color={activeLight === "green" ? "#00ff00" : "#004400"}
          emissive={activeLight === "green" ? "#00ff00" : "#000000"}
          emissiveIntensity={activeLight === "green" ? 0.8 : 0}
        />
      </mesh>
    </group>
  );
}

function DirectionalArrow({
  position,
  rotation
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
}) {
  return (
    <group
      position={position}
      rotation={rotation}
    >
      {/* Arrow body */}
      <Box
        position={[0, 0.05, 0]}
        args={[1.5, 0.02, 0.3]}
      >
        <meshStandardMaterial color="#FFFFFF" />
      </Box>
      {/* Arrow head */}
      <mesh position={[0.75, 0.05, 0]}>
        <coneGeometry args={[0.3, 0.6, 3]} />
        <meshStandardMaterial color="#FFFFFF" />
      </mesh>
    </group>
  );
}

export default function Road3D() {
  const [trafficLight1, setTrafficLight1] = useState<
    "red" | "yellow" | "green"
  >("green");
  const [trafficLight2, setTrafficLight2] = useState<
    "red" | "yellow" | "green"
  >("green");
  const [trafficLight3, setTrafficLight3] = useState<
    "red" | "yellow" | "green"
  >("yellow");
  const [trafficLight4, setTrafficLight4] = useState<
    "red" | "yellow" | "green"
  >("red");

  const [selectedRoad, setSelectedRoad] = useState<string>("");
  const [selectedDirection, setSelectedDirection] = useState<string>("");

  // Road options for the select dropdown
  const roadOptions = [
    { key: "north", label: "North Road" },
    { key: "south", label: "South Road" },
    { key: "east", label: "East Road" },
    { key: "west", label: "West Road" },
    { key: "intersection", label: "Center Intersection" }
  ];

  // Direction options
  const directionOptions = [
    { key: "left", label: "Turn Left" },
    { key: "right", label: "Turn Right" },
    { key: "straight", label: "Go Straight" }
  ];

  // Mapping of road destinations based on current road and turn direction
  const getDestinationRoad = (
    currentRoad: string,
    direction: string
  ): string => {
    // When coming FROM a road, you're facing TOWARDS the intersection
    // From North road: you're heading South towards intersection
    // From South road: you're heading North towards intersection
    // From East road: you're heading West towards intersection
    // From West road: you're heading East towards intersection
    const roadDestinations: Record<string, Record<string, string>> = {
      north: {
        left: "east", // Turn left from north road goes to east road
        right: "west", // Turn right from north road goes to west road
        straight: "south"
      },
      south: {
        left: "west", // Turn left from south road goes to west road
        right: "east", // Turn right from south road goes to east road
        straight: "north"
      },
      east: {
        left: "south", // Turn left from east road goes to south road
        right: "north", // Turn right from east road goes to north road
        straight: "west"
      },
      west: {
        left: "north", // Turn left from west road goes to north road
        right: "south", // Turn right from west road goes to south road
        straight: "east"
      }
    };

    return roadDestinations[currentRoad]?.[direction] || "";
  };

  // Get both current and destination roads for highlighting
  const getHighlightedRoads = (): string[] => {
    if (
      !selectedRoad ||
      !selectedDirection ||
      selectedRoad === "intersection"
    ) {
      return selectedRoad ? [selectedRoad] : [];
    }

    const destinationRoad = getDestinationRoad(selectedRoad, selectedDirection);
    return destinationRoad ? [selectedRoad, destinationRoad] : [selectedRoad];
  };

  const highlightedRoads = getHighlightedRoads();

  // Click handlers for each traffic light
  const handleLight1Click = (color: "red" | "yellow" | "green") => {
    if (selectedRoad && selectedDirection && selectedRoad !== "intersection") {
      console.log("Traffic lights are synchronized. Manual override disabled.");
      return;
    }
    setTrafficLight1(color);
    console.log("Traffic Light 1 changed to:", color);
  };

  const handleLight2Click = (color: "red" | "yellow" | "green") => {
    if (selectedRoad && selectedDirection && selectedRoad !== "intersection") {
      console.log("Traffic lights are synchronized. Manual override disabled.");
      return;
    }
    setTrafficLight2(color);
    console.log("Traffic Light 2 changed to:", color);
  };

  const handleLight3Click = (color: "red" | "yellow" | "green") => {
    if (selectedRoad && selectedDirection && selectedRoad !== "intersection") {
      console.log("Traffic lights are synchronized. Manual override disabled.");
      return;
    }
    setTrafficLight3(color);
    console.log("Traffic Light 3 changed to:", color);
  };

  const handleLight4Click = (color: "red" | "yellow" | "green") => {
    if (selectedRoad && selectedDirection && selectedRoad !== "intersection") {
      console.log("Traffic lights are synchronized. Manual override disabled.");
      return;
    }
    setTrafficLight4(color);
    console.log("Traffic Light 4 changed to:", color);
  };

  const handleRoadClick = (roadId: string) => {
    setSelectedRoad(roadId);
    // Reset direction when road changes
    setSelectedDirection("");
    console.log("Selected road:", roadId);
  };

  const handleRoadSelect = (roadId: string) => {
    setSelectedRoad(roadId);
    // Reset direction when road changes
    setSelectedDirection("");
    console.log("Selected road from dropdown:", roadId);
  };

  const handleDirectionSelect = (direction: string) => {
    setSelectedDirection(direction);
    console.log("Selected direction:", direction);
  };

  // Function to synchronize traffic lights based on urgent road
  const syncTrafficLights = (urgentRoad: string, direction: string) => {
    if (!urgentRoad || !direction || urgentRoad === "intersection") {
      // Reset to default state when no urgent road is selected
      setTrafficLight1("red");
      setTrafficLight2("red");
      setTrafficLight3("red");
      setTrafficLight4("red");
      return;
    }

    // Traffic light mapping:
    // Light 1: Controls traffic from West (left side)
    // Light 2: Controls traffic from East (right side)
    // Light 3: Controls traffic from North (top side)
    // Light 4: Controls traffic from South (bottom side)

    // Reset all lights to red first
    setTrafficLight1("red");
    setTrafficLight2("red");
    setTrafficLight3("red");
    setTrafficLight4("red");

    // Set green light for the urgent road direction
    switch (urgentRoad) {
      case "west":
        setTrafficLight1("green"); // Allow traffic from west
        // Block conflicting directions based on turn direction
        if (direction === "left") {
          // West turning left to north - block south traffic
          setTrafficLight4("red");
        } else if (direction === "right") {
          // West turning right to south - block north traffic
          setTrafficLight3("red");
        } else if (direction === "straight") {
          // West going straight to east - block north and south traffic
          setTrafficLight3("red");
          setTrafficLight4("red");
        }
        break;

      case "east":
        setTrafficLight2("green"); // Allow traffic from east
        if (direction === "left") {
          // East turning left to south - block north traffic
          setTrafficLight3("red");
        } else if (direction === "right") {
          // East turning right to north - block south traffic
          setTrafficLight4("red");
        } else if (direction === "straight") {
          // East going straight to west - block north and south traffic
          setTrafficLight3("red");
          setTrafficLight4("red");
        }
        break;

      case "north":
        setTrafficLight3("green"); // Allow traffic from north
        if (direction === "left") {
          // North turning left to west - block east traffic
          setTrafficLight2("red");
        } else if (direction === "right") {
          // North turning right to east - block west traffic
          setTrafficLight1("red");
        } else if (direction === "straight") {
          // North going straight to south - block east and west traffic
          setTrafficLight1("red");
          setTrafficLight2("red");
        }
        break;

      case "south":
        setTrafficLight4("green"); // Allow traffic from south
        if (direction === "left") {
          // South turning left to east - block west traffic
          setTrafficLight1("red");
        } else if (direction === "right") {
          // South turning right to west - block east traffic
          setTrafficLight2("red");
        } else if (direction === "straight") {
          // South going straight to north - block east and west traffic
          setTrafficLight1("red");
          setTrafficLight2("red");
        }
        break;
    }

    console.log(
      `Traffic lights synchronized for ${urgentRoad} road, ${direction} direction`
    );
  };

  useEffect(() => {
    const currentRoad = selectedRoad;
    const currentDirection = selectedDirection;

    console.log("Current road:", currentRoad);
    console.log("Current direction:", currentDirection);

    // Synchronize traffic lights based on selected road and direction
    syncTrafficLights(currentRoad, currentDirection);

    // Trigger hardware integration when both road and direction are selected
    if (currentRoad && currentDirection && currentRoad !== "intersection") {
      const directionKey = createDirectionKey(currentRoad, currentDirection);

      console.log("Direction key created:", directionKey);

      if (directionKey) {
        console.log("Triggering hardware with key:", directionKey);
        triggerUrgentDirection(directionKey)
          .then(() => {
            console.log("Hardware request successful for:", directionKey);
          })
          .catch((error) => {
            console.error("Hardware request failed:", error);
          });
      } else {
        console.warn(
          "Invalid direction key for:",
          currentRoad,
          currentDirection
        );
      }
    }
  }, [selectedRoad, selectedDirection]);

  return (
    <div className="w-full h-screen">
      <div className="flex flex-col gap-2 absolute top-4 right-4 md:left-auto h-fit z-10">
        {/* Synchronization Status */}

        <div className="bg-white p-4 rounded-lg shadow-lg w-72">
          {/* <h1 className="text-xl font-bold mb-2 ">Road Selection</h1> */}
          <p className="text-sm text-gray-600 mb-2">
            Choose a road to focus on
          </p>
          <div className="space-y-2">
            <Select
              className="max-w-xs"
              items={roadOptions}
              label="Select Road"
              placeholder="Choose a road"
              selectedKeys={selectedRoad ? [selectedRoad] : []}
              onSelectionChange={(keys) => {
                const selectedKey = Array.from(keys)[0] as string;
                handleRoadSelect(selectedKey);
              }}
            >
              {(road) => <SelectItem key={road.key}>{road.label}</SelectItem>}
            </Select>

            {selectedRoad && (
              <div className="text-sm">
                <span className="font-semibold">Selected: </span>
                {roadOptions.find((road) => road.key === selectedRoad)?.label}
              </div>
            )}
            <div className="space-y-1 text-sm">
              <Select
                className="max-w-xs"
                items={directionOptions}
                label="Turn Direction"
                placeholder="Select direction"
                selectedKeys={selectedDirection ? [selectedDirection] : []}
                onSelectionChange={(keys) => {
                  const selectedKey = Array.from(keys)[0] as string;
                  handleDirectionSelect(selectedKey);
                }}
                isDisabled={!selectedRoad || selectedRoad === "intersection"}
              >
                {(direction) => (
                  <SelectItem key={direction.key}>{direction.label}</SelectItem>
                )}
              </Select>
              {selectedDirection &&
                selectedRoad &&
                selectedRoad !== "intersection" && (
                  <div className="text-sm mt-2">
                    <span className="font-semibold">From: </span>
                    {
                      roadOptions.find((road) => road.key === selectedRoad)
                        ?.label
                    }
                    <br />
                    <span className="font-semibold">Direction: </span>
                    {
                      directionOptions.find(
                        (dir) => dir.key === selectedDirection
                      )?.label
                    }
                    <br />
                    <span className="font-semibold">To: </span>
                    {
                      roadOptions.find(
                        (road) =>
                          road.key ===
                          getDestinationRoad(selectedRoad, selectedDirection)
                      )?.label
                    }
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>

      <Canvas camera={{ position: [0, 15, 15], fov: 60 }}>
        <ambientLight intensity={0.6} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={1}
        />

        {/* Ground */}
        <Plane
          position={[0, -0.1, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          args={[50, 50]}
        >
          <meshStandardMaterial color="#228B22" />
        </Plane>

        {/* Main horizontal roads with IDs */}
        <RoadSegment
          position={[-12, 0, 0]}
          length={16}
          isSelected={highlightedRoads.includes("west")}
          onClick={() => handleRoadClick("west")}
        />
        <RoadSegment
          position={[12, 0, 0]}
          length={16}
          isSelected={highlightedRoads.includes("east")}
          onClick={() => handleRoadClick("east")}
        />

        {/* Main vertical roads with IDs */}
        <RoadSegment
          position={[0, 0, -12]}
          rotation={[0, Math.PI / 2, 0]}
          length={16}
          isSelected={highlightedRoads.includes("north")}
          onClick={() => handleRoadClick("north")}
        />
        <RoadSegment
          position={[0, 0, 12]}
          rotation={[0, Math.PI / 2, 0]}
          length={16}
          isSelected={highlightedRoads.includes("south")}
          onClick={() => handleRoadClick("south")}
        />

        {/* Center intersection with ID */}
        <Intersection
          position={[0, 0, 0]}
          isSelected={highlightedRoads.includes("intersection")}
          onClick={() => handleRoadClick("intersection")}
        />

        {/* DECORATIONS - Trees around the roads */}
        <Tree position={[-8, 0, 3]} />
        <Tree position={[-8, 0, -3]} />
        <Tree position={[-15, 0, 5]} />
        <Tree position={[-15, 0, -5]} />
        <Tree position={[8, 0, 3]} />
        <Tree position={[8, 0, -3]} />
        <Tree position={[15, 0, 5]} />
        <Tree position={[15, 0, -5]} />
        <Tree position={[3, 0, -8]} />
        <Tree position={[-3, 0, -8]} />
        <Tree position={[5, 0, -15]} />
        <Tree position={[-5, 0, -15]} />
        <Tree position={[3, 0, 8]} />
        <Tree position={[-3, 0, 8]} />
        <Tree position={[5, 0, 15]} />
        <Tree position={[-5, 0, 15]} />

        {/* Mini City Buildings */}
        <Building
          position={[-18, 0, -8]}
          height={4}
          width={2.5}
          depth={2}
          color="#FFB6C1"
        />
        <Building
          position={[-18, 0, -5]}
          height={3}
          width={2}
          depth={2}
          color="#98FB98"
        />
        {/* <Building
          position={[-18, 0, -2]}
          height={5}
          width={2.5}
          depth={2.5}
          color="#87CEEB"
        />
        <Building
          position={[-18, 0, 2]}
          height={3.5}
          width={2}
          depth={2}
          color="#DDA0DD"
        /> */}
        <Building
          position={[-18, 0, 5]}
          height={4.5}
          width={2.5}
          depth={2}
          color="#F0E68C"
        />
        <Building
          position={[-18, 0, 8]}
          height={3}
          width={2}
          depth={2}
          color="#FFA07A"
        />

        <Building
          position={[18, 0, -8]}
          height={3.5}
          width={2}
          depth={2}
          color="#20B2AA"
        />
        <Building
          position={[18, 0, -5]}
          height={4}
          width={2.5}
          depth={2.5}
          color="#DEB887"
        />
        {/* <Building
          position={[18, 0, -2]}
          height={3}
          width={2}
          depth={2}
          color="#CD853F"
        />
        <Building
          position={[18, 0, 2]}
          height={5}
          width={2.5}
          depth={2}
          color="#BC8F8F"
        /> */}
        <Building
          position={[18, 0, 5]}
          height={3.5}
          width={2}
          depth={2.5}
          color="#9370DB"
        />
        <Building
          position={[18, 0, 8]}
          height={4}
          width={2.5}
          depth={2}
          color="#FF69B4"
        />

        <Building
          position={[-8, 0, -18]}
          height={4}
          width={2}
          depth={2.5}
          color="#32CD32"
        />
        <Building
          position={[-5, 0, -18]}
          height={3}
          width={2.5}
          depth={2}
          color="#FF6347"
        />
        {/* <Building
          position={[-2, 0, -18]}
          height={5}
          width={2}
          depth={2.5}
          color="#4169E1"
        /> */}
        {/* <Building
          position={[2, 0, -18]}
          height={3.5}
          width={2.5}
          depth={2}
          color="#DC143C"
        /> */}
        <Building
          position={[5, 0, -18]}
          height={4}
          width={2}
          depth={2.5}
          color="#FFD700"
        />
        <Building
          position={[8, 0, -18]}
          height={3}
          width={2.5}
          depth={2}
          color="#00CED1"
        />

        <Building
          position={[-8, 0, 18]}
          height={3.5}
          width={2.5}
          depth={2}
          color="#FF1493"
        />
        <Building
          position={[-5, 0, 18]}
          height={4}
          width={2}
          depth={2.5}
          color="#00FF7F"
        />
        {/* <Building
          position={[-2, 0, 18]}
          height={3}
          width={2.5}
          depth={2}
          color="#BA55D3"
        />
        <Building
          position={[2, 0, 18]}
          height={5}
          width={2}
          depth={2.5}
          color="#FF4500"
        /> */}
        <Building
          position={[5, 0, 18]}
          height={3.5}
          width={2.5}
          depth={2}
          color="#2E8B57"
        />
        <Building
          position={[8, 0, 18]}
          height={4}
          width={2}
          depth={2.5}
          color="#4682B4"
        />

        {/* Street Lamps along the roads */}
        <StreetLamp position={[-6, 0, -1.5]} />
        <StreetLamp position={[6, 0, -1.5]} />
        <StreetLamp position={[-1.5, 0, -6]} />
        <StreetLamp position={[-1.5, 0, 6]} />
        <StreetLamp position={[-10, 0, -1.5]} />
        <StreetLamp position={[10, 0, -1.5]} />
        <StreetLamp position={[-1.5, 0, -10]} />
        <StreetLamp position={[-1.5, 0, 10]} />

        {/* Parks in corner areas */}
        <Park position={[-12, 0, -12]} />
        <Park position={[12, 0, -12]} />
        <Park position={[-12, 0, 12]} />
        <Park position={[12, 0, 12]} />

        {/* Traffic Lights at the center intersection - positioned off the road */}
        <TrafficLight
          position={[-3, 0, -1]}
          activeLight={trafficLight1}
          rotation={[0, Math.PI / -2, 0]}
          onLightClick={handleLight1Click}
        />

        {/* Right side traffic light - faces West (towards left road) */}
        <TrafficLight
          position={[3, 0, -1]}
          activeLight={trafficLight2}
          rotation={[0, -Math.PI / -2, 0]}
          onLightClick={handleLight2Click}
        />

        {/* Top side traffic light - faces South (towards bottom road) */}
        <TrafficLight
          position={[-1, 0, -3]}
          activeLight={trafficLight3}
          rotation={[0, 3.1, 0]}
          onLightClick={handleLight3Click}
        />

        {/* Bottom side traffic light - faces North (towards top road) */}
        <TrafficLight
          position={[-1, 0, 3]}
          activeLight={trafficLight4}
          rotation={[0, 6.5, 0]}
          onLightClick={handleLight4Click}
        />

        {/* Directional Arrows on the roads */}
        <DirectionalArrow
          position={[-8, 0.1, 0]}
          rotation={[0, 0, 0]}
        />
        <DirectionalArrow
          position={[8, 0.1, 0]}
          rotation={[0, 0, 0]}
        />
        <DirectionalArrow
          position={[0, 0.1, -8]}
          rotation={[0, Math.PI / 2, 0]}
        />
        <DirectionalArrow
          position={[0, 0.1, 8]}
          rotation={[0, Math.PI / 2, 0]}
        />

        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
        />
      </Canvas>
    </div>
  );
}
