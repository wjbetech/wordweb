import { useCallback } from "react";
import { useReactFlow } from "reactflow";
import type { Node, Edge } from "reactflow";
import type { DatamuseWord } from "../types/Datamuse";
import { useColorPalette } from "./useColorPalette";
import { useNodePositioning } from "./useNodePositioning";

const center = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

interface UseWordWebCreationProps {
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
  setExpandedNodes: React.Dispatch<React.SetStateAction<Set<string>>>;
  setUsedWords: React.Dispatch<React.SetStateAction<Set<string>>>;
  setCenterWord: React.Dispatch<React.SetStateAction<string>>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  startInitialLoading: () => void;
  stopInitialLoading: () => void;
  lineStyle: string;
  edgeColor: string;
}

export function useWordWebCreation({
  setNodes,
  setEdges,
  setExpandedNodes,
  setUsedWords,
  setCenterWord,
  setError,
  startInitialLoading,
  stopInitialLoading,
  lineStyle,
  edgeColor
}: UseWordWebCreationProps) {
  const reactFlow = useReactFlow();
  const colors = useColorPalette();
  const { findNonOverlappingPosition } = useNodePositioning();

  const createWordWeb = useCallback(
    async (searchWord: string, related: DatamuseWord[]) => {
      startInitialLoading();
      setError(null);
      setCenterWord(searchWord);

      // Clear existing nodes and edges immediately
      setNodes([]);
      setEdges([]);
      setExpandedNodes(new Set());
      setUsedWords(new Set([searchWord.toLowerCase()])); // Initialize with center word

      // Reset viewport
      reactFlow.setViewport({
        x: 0,
        y: 0,
        zoom: 1
      });

      try {
        // Add artificial delay for better UX feedback (minimum 1200ms for initial load)
        await new Promise((resolve) => setTimeout(resolve, 1200));

        // Center node
        const centerId = `center-${searchWord}`;
        // Use a unique, vibrant color for the core node (e.g., DaisyUI primary)
        const coreColor = colors[0]?.bg || "#3b82f6";
        const centerNode: Node = {
          id: centerId,
          data: {
            label: searchWord,
            depth: 0,
            color: coreColor,
            isCore: true,
            isExpanded: false
          },
          position: { x: center.x, y: center.y },
          type: "colored"
          // draggable: true (default)
        };

        setNodes([centerNode]);
        stopInitialLoading();

        // After 0.5s, add related nodes around the center
        setTimeout(() => {
          const baseRadius = 220; // Increased for more spread between layers
          const spreadStep = 140; // Increased to create more space between each layer
          const depth = 1;
          const placed: Node[] = [centerNode];
          const relatedNodes: Node[] = related.slice(0, 8).map((wordData, idx) => {
            const position = findNonOverlappingPosition(center.x, center.y, baseRadius, depth, spreadStep, placed);
            // Assign a new color for each layer (depth)
            const layerColor =
              colors[depth + (idx % (colors.length - 1)) + 1]?.bg ||
              colors[(depth + idx) % colors.length]?.bg ||
              "#10b981";
            const node = {
              id: `related-${searchWord}-${wordData.word}`,
              data: {
                label: wordData.word,
                depth,
                color: layerColor,
                isCore: false,
                isExpanded: false,
                score: wordData.score,
                tags: wordData.tags
              },
              position,
              type: "colored" as const
              // draggable: true (default)
            };
            placed.push(node);
            return node;
          });
          setNodes([centerNode, ...relatedNodes]);

          // Add related words to usedWords set
          setUsedWords((prev) => {
            const newSet = new Set(prev);
            related.slice(0, 8).forEach((wordData) => newSet.add(wordData.word.toLowerCase()));
            return newSet;
          });

          const initialEdges = relatedNodes.map((n) => ({
            id: `e-${centerId}-${n.id}`,
            source: centerId,
            target: n.id,
            style: {
              stroke: edgeColor,
              strokeWidth: 1.5
            },
            type: lineStyle,
            animated: false
          }));
          setEdges(initialEdges);

          // Auto-zoom to fit all nodes (center + related) with smooth animation
          setTimeout(() => {
            reactFlow.fitView({
              nodes: [centerNode, ...relatedNodes],
              duration: 800,
              padding: 0.15 // Add 15% padding around the nodes for better visibility
            });
          }, 100); // Small delay to ensure nodes are rendered
        }, 500);
      } catch (error) {
        console.error("Failed to create word web:", error);
        setError("Failed to create word web. Please try again.");
        stopInitialLoading();
      }
    },
    [
      reactFlow,
      colors,
      findNonOverlappingPosition,
      lineStyle,
      edgeColor,
      startInitialLoading,
      setError,
      setCenterWord,
      setNodes,
      setEdges,
      setExpandedNodes,
      setUsedWords,
      stopInitialLoading
    ]
  );

  return {
    createWordWeb
  };
}
