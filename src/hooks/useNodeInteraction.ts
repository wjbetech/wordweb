import { useCallback } from "react";
import { useReactFlow } from "reactflow";
import type { Node, Edge, NodeMouseHandler } from "reactflow";
import { searchDatamuse } from "../api/datamuse";
import { useNodePositioning } from "./useNodePositioning";
import { useColorPalette } from "./useColorPalette";

interface UseNodeInteractionProps {
  nodes: Node[];
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
  expandedNodes: Set<string>;
  setExpandedNodes: React.Dispatch<React.SetStateAction<Set<string>>>;
  usedWords: Set<string>;
  setUsedWords: React.Dispatch<React.SetStateAction<Set<string>>>;
  lineStyle: string;
  edgeColor: string;
  addLoadingNode: (nodeId: string) => void;
  removeLoadingNode: (nodeId: string) => void;
  isNodeLoading: (nodeId: string) => boolean;
  openNoUniqueWordsModal: (word: string) => void;
  setError: (error: string | null) => void;
}

export function useNodeInteraction({
  nodes,
  setNodes,
  setEdges,
  expandedNodes,
  setExpandedNodes,
  usedWords,
  setUsedWords,
  lineStyle,
  edgeColor,
  addLoadingNode,
  removeLoadingNode,
  isNodeLoading,
  openNoUniqueWordsModal,
  setError,
}: UseNodeInteractionProps) {
  const reactFlow = useReactFlow();
  const colors = useColorPalette();
  const { findNonOverlappingPosition } = useNodePositioning();

  const getAllDescendantIds = useCallback(
    (nodeId: string): Set<string> => {
      const descendants = new Set<string>();
      const directChildren = nodes.filter((n) =>
        n.id.startsWith(`expanded-${nodeId}-`)
      );

      for (const child of directChildren) {
        descendants.add(child.id);
        const childDescendants = getAllDescendantIds(child.id);
        childDescendants.forEach((id) => descendants.add(id));
      }
      return descendants;
    },
    [nodes]
  );

  const collapseNode = useCallback(
    (node: Node) => {
      const allDescendantIds = getAllDescendantIds(node.id);

      // Remove nodes and edges
      setNodes((prev) => prev.filter((n) => !allDescendantIds.has(n.id)));
      setEdges((prev) =>
        prev.filter(
          (e) =>
            !allDescendantIds.has(e.source) && !allDescendantIds.has(e.target)
        )
      );

      // Update expanded state for this node and all descendants
      setExpandedNodes((prev) => {
        const newSet = new Set(prev);
        newSet.delete(node.id);
        allDescendantIds.forEach((id) => newSet.delete(id));
        return newSet;
      });

      // Update the node's visual state
      setNodes((prev) =>
        prev.map((n) =>
          n.id === node.id
            ? { ...n, data: { ...n.data, isExpanded: false } }
            : n
        )
      );
    },
    [getAllDescendantIds, setNodes, setEdges, setExpandedNodes]
  );

  const expandNode = useCallback(
    async (node: Node) => {
      // Set loading state
      addLoadingNode(node.id);

      // Update the node to show loading state
      setNodes((prev) =>
        prev.map((n) =>
          n.id === node.id ? { ...n, data: { ...n.data, isLoading: true } } : n
        )
      );

      try {
        // Add artificial delay for better UX feedback (minimum 600ms)
        const [results] = await Promise.all([
          searchDatamuse(node.data.label),
          new Promise((resolve) => setTimeout(resolve, 600)),
        ]);

        const related = results.slice(0, 4);

        // Filter out words that have already been used anywhere in the web
        const uniqueRelated = related.filter(
          (wordData) => !usedWords.has(wordData.word.toLowerCase())
        );

        // Check if we have any unique words to show
        if (uniqueRelated.length === 0) {
          // No unique words available - show modal
          openNoUniqueWordsModal(node.data.label);

          // Reset node state
          setNodes((prev) =>
            prev.map((n) =>
              n.id === node.id
                ? { ...n, data: { ...n.data, isLoading: false } }
                : n
            )
          );

          // Remove from loading state
          removeLoadingNode(node.id);
          return; // Exit early
        }

        const parentDepth = node.data.depth ?? 1;
        const depth = parentDepth + 1;
        const baseRadius = 160;
        const spreadStep = 120;
        const placed: Node[] = [node, ...nodes];

        const newNodes: Node[] = uniqueRelated.map((wordData) => {
          const position = findNonOverlappingPosition(
            node.position.x,
            node.position.y,
            baseRadius,
            depth,
            spreadStep,
            placed
          );
          const n = {
            id: `expanded-${node.id}-${wordData.word}`,
            data: {
              label: wordData.word,
              depth,
              color: colors[depth % colors.length],
              isExpanded: false,
              score: wordData.score,
              tags: wordData.tags,
            },
            position,
            type: "colored" as const,
          };
          placed.push(n);
          return n;
        });

        // Add edges from parent node to each new node
        const newEdges = newNodes.map((n) => ({
          id: `e-${node.id}-${n.id}`,
          source: node.id,
          target: n.id,
          style: {
            stroke: edgeColor,
            strokeWidth: 1.5,
          },
          type: lineStyle,
          animated: false,
        }));

        setNodes((prev) => [...prev, ...newNodes]);
        setEdges((prev) => [...prev, ...newEdges]);

        // Add new words to usedWords set
        setUsedWords((prev) => {
          const newSet = new Set(prev);
          uniqueRelated.forEach((wordData) =>
            newSet.add(wordData.word.toLowerCase())
          );
          return newSet;
        });

        // Mark this node as expanded
        setExpandedNodes((prev) => new Set([...prev, node.id]));

        // Update the node's visual state (remove loading, set expanded)
        setNodes((prev) =>
          prev.map((n) =>
            n.id === node.id
              ? {
                  ...n,
                  data: { ...n.data, isExpanded: true, isLoading: false },
                }
              : n
          )
        );

        // Refocus on new nodes
        reactFlow.fitView({ nodes: newNodes, duration: 500 });
      } catch (error) {
        console.error("Failed to expand node:", error);
        setError("Failed to expand node. Please try again.");

        // Reset node state on error
        setNodes((prev) =>
          prev.map((n) =>
            n.id === node.id
              ? { ...n, data: { ...n.data, isLoading: false } }
              : n
          )
        );
      } finally {
        // Remove from loading state
        removeLoadingNode(node.id);
      }
    },
    [
      addLoadingNode,
      setNodes,
      usedWords,
      openNoUniqueWordsModal,
      removeLoadingNode,
      nodes,
      findNonOverlappingPosition,
      colors,
      edgeColor,
      lineStyle,
      setEdges,
      setUsedWords,
      setExpandedNodes,
      reactFlow,
      setError,
    ]
  );

  const onNodeClick: NodeMouseHandler = useCallback(
    async (_event, node) => {
      // Only process clicks on related or expanded nodes (not center node)
      if (node.id.startsWith("related-") || node.id.startsWith("expanded-")) {
        const isCurrentlyExpanded = expandedNodes.has(node.id);
        const isCurrentlyLoading = isNodeLoading(node.id);

        // Don't allow clicks while loading
        if (isCurrentlyLoading) return;

        if (isCurrentlyExpanded) {
          collapseNode(node);
        } else {
          await expandNode(node);
        }
      }
    },
    [expandedNodes, isNodeLoading, collapseNode, expandNode]
  );

  return {
    onNodeClick,
  };
}
