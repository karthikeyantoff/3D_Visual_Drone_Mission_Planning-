import React, { useEffect } from 'react';
import { CanvasContainer } from './components/3d/CanvasContainer';
import { HUD } from './components/ui/HUD';
import { useAurisStore } from './state/aurisStore';

export const App: React.FC = () => {
  const { drone, setDroneTelemetry, setTargetWaypoint } = useAurisStore();

  // Gentle Manual Keyboard Flight Controls (W/S: Pitch, A/D: Roll, Q/E: Yaw, R/F: Altitude)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['input', 'textarea'].includes((e.target as HTMLElement)?.tagName?.toLowerCase())) return;

      // Slow & gentle manual step size for crystal clear observation
      const step = e.shiftKey ? 0.6 : 0.22;
      const [x, y, z] = drone.position;
      let [rx, ry, rz] = drone.rotation;

      let newPos: [number, number, number] = [x, y, z];
      let newRot: [number, number, number] = [rx, ry, rz];
      let moved = false;

      switch (e.key.toLowerCase()) {
        case 'w': // Forward
          newPos[2] += step;
          moved = true;
          break;
        case 's': // Backward
          newPos[2] -= step;
          moved = true;
          break;
        case 'a': // Left
          newPos[0] -= step;
          moved = true;
          break;
        case 'd': // Right
          newPos[0] += step;
          moved = true;
          break;
        case 'r': // Ascend
          newPos[1] = Math.min(45, newPos[1] + step);
          moved = true;
          break;
        case 'f': // Descend
          newPos[1] = Math.max(0.4, newPos[1] - step);
          moved = true;
          break;
        case 'q': // Yaw Left
          newRot[1] += 0.04;
          moved = true;
          break;
        case 'e': // Yaw Right
          newRot[1] -= 0.04;
          moved = true;
          break;
      }

      if (moved) {
        setDroneTelemetry({
          position: newPos,
          rotation: newRot,
          altitude: newPos[1],
          speed: e.shiftKey ? 3.5 : 1.8
        });
        setTargetWaypoint(newPos);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [drone, setDroneTelemetry, setTargetWaypoint]);

  return (
    <main className="w-screen h-screen relative bg-[#050811] overflow-hidden">
      <CanvasContainer />
      <HUD />
    </main>
  );
};

export default App;
