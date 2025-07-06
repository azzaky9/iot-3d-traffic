import { Box } from "@react-three/drei";

function Tree({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Tree trunk */}
      <Box
        position={[0, 0.5, 0]}
        args={[0.3, 1, 0.3]}
      >
        <meshStandardMaterial color="#8B4513" />
      </Box>
      {/* Tree foliage - bottom layer */}
      <mesh position={[0, 1.5, 0]}>
        <coneGeometry args={[1.2, 2, 8]} />
        <meshStandardMaterial color="#228B22" />
      </mesh>
      {/* Tree foliage - middle layer */}
      <mesh position={[0, 2.2, 0]}>
        <coneGeometry args={[1, 1.6, 8]} />
        <meshStandardMaterial color="#32CD32" />
      </mesh>
      {/* Tree foliage - top layer */}
      <mesh position={[0, 2.8, 0]}>
        <coneGeometry args={[0.8, 1.2, 8]} />
        <meshStandardMaterial color="#90EE90" />
      </mesh>
    </group>
  );
}

function Building({
  position,
  height = 3,
  width = 2,
  depth = 2,
  color = "#C0C0C0"
}: {
  position: [number, number, number];
  height?: number;
  width?: number;
  depth?: number;
  color?: string;
}) {
  return (
    <group position={position}>
      {/* Main building */}
      <Box
        position={[0, height / 2, 0]}
        args={[width, height, depth]}
      >
        <meshStandardMaterial color={color} />
      </Box>
      {/* Building roof */}
      <Box
        position={[0, height + 0.1, 0]}
        args={[width + 0.2, 0.2, depth + 0.2]}
      >
        <meshStandardMaterial color="#8B4513" />
      </Box>
      {/* Windows */}
      <Box
        position={[width / 2 - 0.05, height / 2, 0]}
        args={[0.1, 0.4, 0.4]}
      >
        <meshStandardMaterial color="#87CEEB" />
      </Box>
      <Box
        position={[-width / 2 + 0.05, height / 2, 0]}
        args={[0.1, 0.4, 0.4]}
      >
        <meshStandardMaterial color="#87CEEB" />
      </Box>
      {/* Door */}
      <Box
        position={[0, 0.4, depth / 2 - 0.05]}
        args={[0.3, 0.8, 0.1]}
      >
        <meshStandardMaterial color="#8B4513" />
      </Box>
    </group>
  );
}

function StreetLamp({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Lamp post */}
      <Box
        position={[0, 2, 0]}
        args={[0.1, 4, 0.1]}
      >
        <meshStandardMaterial color="#666666" />
      </Box>
      {/* Lamp head */}
      <mesh position={[0, 4.2, 0]}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial
          color="#FFFF99"
          emissive="#FFFF99"
          emissiveIntensity={0.3}
        />
      </mesh>
      {/* Lamp base */}
      <Box
        position={[0, 0.1, 0]}
        args={[0.3, 0.2, 0.3]}
      >
        <meshStandardMaterial color="#555555" />
      </Box>
    </group>
  );
}

function Park({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Grass area */}
      <Box
        position={[0, 0.02, 0]}
        args={[4, 0.04, 4]}
      >
        <meshStandardMaterial color="#90EE90" />
      </Box>
      {/* Bench */}
      <Box
        position={[1, 0.3, 1]}
        args={[1.2, 0.1, 0.4]}
      >
        <meshStandardMaterial color="#8B4513" />
      </Box>
      <Box
        position={[0.4, 0.2, 1]}
        args={[0.1, 0.2, 0.1]}
      >
        <meshStandardMaterial color="#666666" />
      </Box>
      <Box
        position={[1.6, 0.2, 1]}
        args={[0.1, 0.2, 0.1]}
      >
        <meshStandardMaterial color="#666666" />
      </Box>
      {/* Small fountain */}
      <mesh position={[-1, 0.2, -1]}>
        <cylinderGeometry args={[0.5, 0.5, 0.4, 16]} />
        <meshStandardMaterial color="#87CEEB" />
      </mesh>
    </group>
  );
}

export { Tree, Building, StreetLamp, Park };
