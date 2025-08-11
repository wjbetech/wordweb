// src/hooks/useNodePositioning.ts
import { useCallback } from "react";
import type { Node } from "reactflow";

/**
 * Custom hook for managing node positioning logic in the word web
 * Handles overlap detection and smart positioning algorithms
 */
export const useNodePositioning = () => {
  // Helper: check if a position is too close to any node
  const isOverlapping = useCallback((x: number, y: number, placed: Node[], minDist: number): boolean => {
    return placed.some((node) => {
      const dx = node.position.x - x;
      const dy = node.position.y - y;
      return Math.sqrt(dx * dx + dy * dy) < minDist;
    });
  }, []);

  // Helper: Find a non-overlapping position using spiral placement if random fails
  const findNonOverlappingPosition = useCallback(
    (startX: number, startY: number, baseRadius: number, depth: number, spreadStep: number, placed: Node[]) => {
      const minDist = 180;

      // Center position for calculations
      const center = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

      // For initial layer (depth 1), use evenly distributed angles with some randomness
      if (depth === 1) {
        const nodeIndex = placed.length - 1; // Subtract 1 to account for center node
        const totalNodes = 8; // We typically place up to 8 nodes
        const baseAngle = (nodeIndex * 2 * Math.PI) / totalNodes;

        // Try multiple positions around the base angle
        for (let attempt = 0; attempt < 8; attempt++) {
          const angleVariation = (Math.PI / 6) * (Math.random() - 0.5); // ±30 degrees variation
          const angle = baseAngle + angleVariation;

          const radiusVariation = Math.random() * 60 - 30; // ±30px variation
          const radius = baseRadius + radiusVariation;

          const x = startX + radius * Math.cos(angle);
          const y = startY + radius * Math.sin(angle);

          // Ensure it doesn't overlap
          if (!isOverlapping(x, y, placed, minDist)) {
            return { x, y };
          }
        }
      }

      // For deeper layers or fallback, use directional placement away from parent
      const existingNodes = placed.filter((n) => n.position.x !== startX || n.position.y !== startY);

      // Calculate direction away from center and existing nodes
      let preferredAngle = Math.atan2(startY - center.y, startX - center.x); // Direction from center

      // If there are nearby nodes, avoid their directions
      const nearbyNodes = existingNodes.filter((n) => {
        const dx = n.position.x - startX;
        const dy = n.position.y - startY;
        return Math.sqrt(dx * dx + dy * dy) < baseRadius * 2;
      });

      if (nearbyNodes.length > 0) {
        const avoidAngles = nearbyNodes.map((n) => {
          const dx = n.position.x - startX;
          const dy = n.position.y - startY;
          return Math.atan2(dy, dx);
        });

        // Find the largest gap between avoid angles
        let maxGap = 0;
        let bestAngle = preferredAngle;

        for (let testAngle = 0; testAngle < 2 * Math.PI; testAngle += Math.PI / 12) {
          let minDistance = Math.PI;
          for (const avoidAngle of avoidAngles) {
            let angleDiff = Math.abs(testAngle - avoidAngle);
            if (angleDiff > Math.PI) angleDiff = 2 * Math.PI - angleDiff;
            minDistance = Math.min(minDistance, angleDiff);
          }
          if (minDistance > maxGap) {
            maxGap = minDistance;
            bestAngle = testAngle;
          }
        }
        preferredAngle = bestAngle;
      }

      // Try positions in a cone around the preferred direction
      const coneRange = Math.PI / 3; // 60-degree cone
      const numTries = 16; // More attempts for better placement

      for (let i = 0; i < numTries; i++) {
        const angleOffset = coneRange * (Math.random() - 0.5); // Random within cone
        const angle = preferredAngle + angleOffset;

        // Add more radius variation
        const radiusJitter = Math.random() * 80 - 40; // ±40px variation
        const radius = baseRadius + radiusJitter;

        const x = startX + radius * Math.cos(angle);
        const y = startY + radius * Math.sin(angle);

        if (!isOverlapping(x, y, placed, minDist)) {
          return { x, y };
        }
      }

      // Final fallback - spiral outward
      for (let r = baseRadius; r < baseRadius * 3; r += 30) {
        for (let a = 0; a < 2 * Math.PI; a += Math.PI / 8) {
          const x = startX + r * Math.cos(a);
          const y = startY + r * Math.sin(a);

          if (!isOverlapping(x, y, placed, minDist)) {
            return { x, y };
          }
        }
      }

      // Absolute fallback
      const fallbackRadius = baseRadius + 200;
      return {
        x: startX + fallbackRadius * Math.cos(preferredAngle),
        y: startY + fallbackRadius * Math.sin(preferredAngle)
      };
    },
    [isOverlapping]
  );

  return {
    isOverlapping,
    findNonOverlappingPosition
  };
};
