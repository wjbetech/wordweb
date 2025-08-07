import { useState, useCallback, useEffect } from "react";
import ReactFlow, { Background, Controls, useReactFlow, BackgroundVariant } from "reactflow";
import ColoredNode from "./ColoredNode";
import type { Node, Edge, NodeMouseHandler } from "reactflow";
import Sidebar from "./Sidebar";
import LoadingOverlay from "./LoadingOverlay";
import Toast from "./Toast";
import ConfirmModal from "./ConfirmModal";
import { searchDatamuse } from "../api/datamuse";
import { useColorPalette } from "../hooks/useColorPalette";
import { usePersistence } from "../hooks/usePersistence";
import { loadUserPreferences } from "../utils/localStorage";

const center = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

type LineStyle = "default" | "straight" | "smoothstep" | "step" | "bezier";

type WordWebFlowProps = {
  isDark: boolean;
  onThemeChange: (isDark: boolean) => void;
};

export function WordWebFlow({ isDark, onThemeChange }: WordWebFlowProps) {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [lineStyle, setLineStyle] = useState<LineStyle>(() => {
    const savedPrefs = loadUserPreferences();
    return savedPrefs?.lineStyle || "smoothstep";
  });
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [loadingNodes, setLoadingNodes] = useState<Set<string>>(new Set());
  const [usedWords, setUsedWords] = useState<Set<string>>(new Set());
  const [isInitialLoading, setIsInitialLoading] = useState(false);
  const [isUpdatingLineStyle, setIsUpdatingLineStyle] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [centerWord, setCenterWord] = useState<string>("");
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    const savedPrefs = loadUserPreferences();
    return savedPrefs?.sidebarOpen || false;
  });
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    const savedPrefs = loadUserPreferences();
    return savedPrefs?.recentSearches || [];
  });
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showNoUniqueWordsModal, setShowNoUniqueWordsModal] = useState(false);
  const [lastClickedWord, setLastClickedWord] = useState<string>("");
  const reactFlow = useReactFlow();
  const colors = useColorPalette();

  // Get current viewport for persistence
  const viewport = reactFlow.getViewport();

  // Initialize persistence hook
  const { saveCurrentState, loadSavedState, clearSavedState } = usePersistence({
    nodes,
    edges,
    expandedNodes,
    usedWords,
    viewport,
    centerWord,
    isDark,
    lineStyle,
    sidebarOpen,
    recentSearches
  });

  const edgeColor = isDark ? "#6b7280" : "#94a3b8"; // Lighter gray for dark, darker for light

  // Set ReactFlow canvas background color based on theme
  const canvasBg = isDark ? "bg-gray-800" : "bg-white";

  // Function to update line style for all existing edges
  const updateLineStyle = useCallback(
    async (newLineStyle: LineStyle) => {
      if (edges.length === 0) {
        // If no edges exist, just update the line style
        setLineStyle(newLineStyle);
        return;
      }

      setIsUpdatingLineStyle(true);

      // Add a small delay for visual feedback
      await new Promise((resolve) => setTimeout(resolve, 150));

      setLineStyle(newLineStyle);

      // Update all existing edges with the new line style
      setEdges((prevEdges) =>
        prevEdges.map((edge) => ({
          ...edge,
          type: newLineStyle,
          style: {
            ...edge.style,
            stroke: edgeColor,
            strokeWidth: 1.5
          }
        }))
      );

      setIsUpdatingLineStyle(false);
    },
    [edges.length, edgeColor]
  );

  // Update edge colors when theme changes
  useEffect(() => {
    setEdges((prevEdges) =>
      prevEdges.map((edge) => ({
        ...edge,
        style: {
          ...edge.style,
          stroke: edgeColor,
          strokeWidth: 1.5
        }
      }))
    );
  }, [edgeColor]);

  // Auto-dismiss error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Load saved state on component mount
  useEffect(() => {
    const savedState = loadSavedState();
    const savedPrefs = loadUserPreferences();

    if (savedState && savedState.nodes.length > 0) {
      setNodes(savedState.nodes);
      setEdges(savedState.edges);
      setExpandedNodes(new Set(savedState.expandedNodes));
      setUsedWords(new Set(savedState.usedWords || []));
      if (savedState.centerWord) {
        setCenterWord(savedState.centerWord);
      }

      // Restore viewport after a small delay to ensure ReactFlow is ready
      setTimeout(() => {
        reactFlow.setViewport(savedState.viewport);
      }, 100);
    }

    // Apply theme if different from current (preferences already loaded in state initializers)
    if (savedPrefs && (savedPrefs.theme === "dark") !== isDark) {
      onThemeChange(savedPrefs.theme === "dark");
    }
  }, [loadSavedState, reactFlow, isDark, onThemeChange]);

  // Helper: check if a position is too close to any node
  const isOverlapping = useCallback((x: number, y: number, nodes: Node[], minDist = 180) => {
    return nodes.some((n) => {
      const dx = n.position.x - x;
      const dy = n.position.y - y;
      return Math.sqrt(dx * dx + dy * dy) < minDist;
    });
  }, []);

  // Helper: Find a non-overlapping position using spiral placement if random fails
  const findNonOverlappingPosition = useCallback(
    (startX: number, startY: number, baseRadius: number, depth: number, spreadStep: number, placed: Node[]) => {
      const minDist = 180;

      // For initial layer (depth 1), use evenly distributed angles with some randomness
      if (depth === 1) {
        const nodeIndex = placed.length - 1; // Subtract 1 to account for center node
        const totalNodes = 8; // We typically place up to 8 nodes
        const baseAngle = (nodeIndex * 2 * Math.PI) / totalNodes;
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
        const radius = baseRadius + (depth - 1) * spreadStep + radiusJitter;

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
      const fallbackRadius = baseRadius + (depth - 1) * spreadStep + 200;
      return {
        x: startX + fallbackRadius * Math.cos(preferredAngle),
        y: startY + fallbackRadius * Math.sin(preferredAngle)
      };
    },
    [isOverlapping]
  );

  // Handler to create a word web
  const createWordWeb = useCallback(
    async (searchWord: string, related: string[]) => {
      setIsInitialLoading(true);
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
        const centerNode: Node = {
          id: centerId,
          data: {
            label: searchWord,
            depth: 0,
            color: colors[0],
            isExpanded: false
          },
          position: { x: center.x, y: center.y },
          type: "colored"
        };

        setNodes([centerNode]);
        setIsInitialLoading(false);

        // After 0.5s, add related nodes around the center
        setTimeout(() => {
          const baseRadius = 220; // Increased for more spread between layers
          const spreadStep = 140; // Increased to create more space between each layer
          const depth = 1;
          const placed: Node[] = [centerNode];
          const relatedNodes: Node[] = related.slice(0, 8).map((word) => {
            const position = findNonOverlappingPosition(center.x, center.y, baseRadius, depth, spreadStep, placed);
            const node = {
              id: `related-${searchWord}-${word}`,
              data: {
                label: word,
                depth,
                color: colors[depth % colors.length],
                isExpanded: false
              },
              position,
              type: "colored" as const
            };
            placed.push(node);
            return node;
          });
          setNodes([centerNode, ...relatedNodes]);

          // Add related words to usedWords set
          setUsedWords((prev) => {
            const newSet = new Set(prev);
            related.slice(0, 8).forEach((word) => newSet.add(word.toLowerCase()));
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
        setIsInitialLoading(false);
      }
    },
    [reactFlow, colors, findNonOverlappingPosition, lineStyle, edgeColor]
  );

  // Node click handler to expand/collapse web
  const onNodeClick: NodeMouseHandler = useCallback(
    async (_event, node) => {
      // Only process clicks on related or expanded nodes (not center node)
      if (node.id.startsWith("related-") || node.id.startsWith("expanded-")) {
        const isCurrentlyExpanded = expandedNodes.has(node.id);
        const isCurrentlyLoading = loadingNodes.has(node.id);

        // Don't allow clicks while loading
        if (isCurrentlyLoading) return;

        if (isCurrentlyExpanded) {
          // Collapse - remove all child nodes and edges recursively
          const getAllDescendantIds = (nodeId: string): Set<string> => {
            const descendants = new Set<string>();
            const directChildren = nodes.filter((n) => n.id.startsWith(`expanded-${nodeId}-`));

            for (const child of directChildren) {
              descendants.add(child.id);
              const childDescendants = getAllDescendantIds(child.id);
              childDescendants.forEach((id) => descendants.add(id));
            }
            return descendants;
          };

          const allDescendantIds = getAllDescendantIds(node.id);

          // Remove nodes and edges
          setNodes((prev) => prev.filter((n) => !allDescendantIds.has(n.id)));
          setEdges((prev) => prev.filter((e) => !allDescendantIds.has(e.source) && !allDescendantIds.has(e.target)));

          // Update expanded state for this node and all descendants
          setExpandedNodes((prev) => {
            const newSet = new Set(prev);
            newSet.delete(node.id);
            allDescendantIds.forEach((id) => newSet.delete(id));
            return newSet;
          });

          // Update the node's visual state
          setNodes((prev) =>
            prev.map((n) => (n.id === node.id ? { ...n, data: { ...n.data, isExpanded: false } } : n))
          );
        } else {
          // Set loading state
          setLoadingNodes((prev) => new Set([...prev, node.id]));

          // Update the node to show loading state
          setNodes((prev) => prev.map((n) => (n.id === node.id ? { ...n, data: { ...n.data, isLoading: true } } : n)));

          try {
            // Add artificial delay for better UX feedback (minimum 600ms)
            const [results] = await Promise.all([
              searchDatamuse(node.data.label),
              new Promise((resolve) => setTimeout(resolve, 600))
            ]);

            const related = results.slice(0, 4).map((w: { word: string }) => w.word);

            // Filter out words that have already been used anywhere in the web
            const uniqueRelated = related.filter((word) => !usedWords.has(word.toLowerCase()));

            // Check if we have any unique words to show
            if (uniqueRelated.length === 0) {
              // No unique words available - show modal
              setLastClickedWord(node.data.label);
              setShowNoUniqueWordsModal(true);

              // Reset node state
              setNodes((prev) =>
                prev.map((n) => (n.id === node.id ? { ...n, data: { ...n.data, isLoading: false } } : n))
              );

              // Remove from loading state
              setLoadingNodes((prev) => {
                const newSet = new Set(prev);
                newSet.delete(node.id);
                return newSet;
              });

              return; // Exit early
            }

            const parentDepth = node.data.depth ?? 1;
            const depth = parentDepth + 1;
            const baseRadius = 160;
            const spreadStep = 120;
            const placed: Node[] = [node, ...nodes];

            const newNodes: Node[] = uniqueRelated.map((word) => {
              const position = findNonOverlappingPosition(
                node.position.x,
                node.position.y,
                baseRadius,
                depth,
                spreadStep,
                placed
              );
              const n = {
                id: `expanded-${node.id}-${word}`,
                data: {
                  label: word,
                  depth,
                  color: colors[depth % colors.length],
                  isExpanded: false
                },
                position,
                type: "colored" as const
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
                strokeWidth: 1.5
              },
              type: lineStyle,
              animated: false
            }));

            setNodes((prev) => [...prev, ...newNodes]);
            setEdges((prev) => [...prev, ...newEdges]);

            // Add new words to usedWords set
            setUsedWords((prev) => {
              const newSet = new Set(prev);
              uniqueRelated.forEach((word) => newSet.add(word.toLowerCase()));
              return newSet;
            });

            // Mark this node as expanded
            setExpandedNodes((prev) => new Set([...prev, node.id]));

            // Update the node's visual state (remove loading, set expanded)
            setNodes((prev) =>
              prev.map((n) =>
                n.id === node.id ? { ...n, data: { ...n.data, isExpanded: true, isLoading: false } } : n
              )
            );

            // Refocus on new nodes
            reactFlow.fitView({ nodes: newNodes, duration: 500 });
          } catch (error) {
            console.error("Failed to expand node:", error);
            setError("Failed to expand node. Please try again.");

            // Reset node state on error
            setNodes((prev) =>
              prev.map((n) => (n.id === node.id ? { ...n, data: { ...n.data, isLoading: false } } : n))
            );
          } finally {
            // Remove from loading state
            setLoadingNodes((prev) => {
              const newSet = new Set(prev);
              newSet.delete(node.id);
              return newSet;
            });
          }
        }
      }
    },
    [nodes, expandedNodes, loadingNodes, colors, findNonOverlappingPosition, lineStyle, edgeColor, reactFlow, usedWords]
  );

  // Manual save/load/clear functions
  const handleSaveWordweb = useCallback(() => {
    saveCurrentState();
    // You could show a toast notification here
  }, [saveCurrentState]);

  const handleClearWordweb = useCallback(() => {
    setShowConfirmModal(true);
  }, []);

  const handleConfirmClear = useCallback(() => {
    setNodes([]);
    setEdges([]);
    setExpandedNodes(new Set());
    setUsedWords(new Set());
    setCenterWord("");
    clearSavedState();
    reactFlow.fitView();
    setShowConfirmModal(false);
  }, [clearSavedState, reactFlow]);

  const handleCancelClear = useCallback(() => {
    setShowConfirmModal(false);
  }, []);

  const handleCloseNoUniqueWordsModal = useCallback(() => {
    setShowNoUniqueWordsModal(false);
    setLastClickedWord("");
  }, []);

  const nodeTypes = { colored: ColoredNode };

  return (
    <>
      <div
        className="fixed inset-0 flex items-center justify-center overflow-hidden pointer-events-none"
        style={{ zIndex: 1 }}>
        <div className="text-5xl font-bold opacity-10 select-none" style={{ color: isDark ? "#ece2c7" : "#374151" }}>
          wordweb.
        </div>
      </div>

      {isInitialLoading && <LoadingOverlay isDark={isDark} message="Generating word web..." />}

      <Toast message="Line style updated!" isVisible={isUpdatingLineStyle} isDark={isDark} />

      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        minZoom={0.5}
        maxZoom={2}
        className={canvasBg + " w-full h-full"}
        style={{ background: isDark ? "#1f2937" : "#faf0e6" }}
        onNodeClick={onNodeClick}
        onWheel={(event) => {
          if (!event.ctrlKey) {
            // Allow regular scroll only when Ctrl is pressed
            const { deltaY } = event;
            const zoom = reactFlow.getZoom();
            const newZoom = deltaY > 0 ? zoom * 0.9 : zoom * 1.1;
            reactFlow.zoomTo(Math.min(Math.max(newZoom, 0.5), 2));
            event.preventDefault();
          }
        }}
        defaultEdgeOptions={{
          style: { stroke: edgeColor, strokeWidth: 1.5 },
          type: lineStyle,
          animated: false
        }}
        edgesFocusable={true}
        elementsSelectable={true}
        nodesConnectable={false}>
        <Background
          color={isDark ? "#374151" : "#ddd"}
          variant={BackgroundVariant.Lines}
          gap={20}
          offset={1}
          style={{ backgroundColor: "transparent" }}
        />
        <Controls />
      </ReactFlow>
      <Sidebar
        onSearch={createWordWeb}
        onLineStyleChange={updateLineStyle}
        currentLineStyle={lineStyle}
        isDark={isDark}
        onThemeChange={onThemeChange}
        isLoading={isInitialLoading}
        error={error}
        onSave={handleSaveWordweb}
        onClear={handleClearWordweb}
        recentSearches={recentSearches}
        onRecentSearchesChange={setRecentSearches}
        sidebarOpen={sidebarOpen}
        onSidebarToggle={setSidebarOpen}
      />

      <ConfirmModal
        isOpen={showConfirmModal}
        title="Clear Word Web"
        message="Are you sure you want to clear the current word web?

This will remove all nodes and edges, and cannot be undone."
        confirmText="Clear"
        cancelText="Cancel"
        confirmButtonClass="btn-error"
        onConfirm={handleConfirmClear}
        onCancel={handleCancelClear}
        isDark={isDark}
      />

      <ConfirmModal
        isOpen={showNoUniqueWordsModal}
        title="No More Unique Words"
        message={`All related words for "${lastClickedWord}" have already been explored in this word web.

Try expanding a different word or start a new word web to continue discovering connections.`}
        confirmText="Got it"
        cancelText=""
        confirmButtonClass="btn-primary"
        onConfirm={handleCloseNoUniqueWordsModal}
        onCancel={handleCloseNoUniqueWordsModal}
        isDark={isDark}
      />
    </>
  );
}
