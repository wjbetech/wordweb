import { useState, useCallback, useEffect } from "react";
import ReactFlow, {
  Background,
  Controls,
  useReactFlow,
  BackgroundVariant,
} from "reactflow";
import ColoredNode from "./ColoredNode";
import type { Node, Edge } from "reactflow";
import Sidebar from "./Sidebar";
import LoadingOverlay from "./LoadingOverlay";
import Toast from "./Toast";
import ConfirmModal from "./ConfirmModal";
import NodeTooltip from "./NodeTooltip";
import { usePersistence } from "../hooks/usePersistence";
import { useTooltipState } from "../hooks/useTooltipState";
import { useModalState } from "../hooks/useModalState";
import { useLoadingState } from "../hooks/useLoadingState";
import { useUserPreferences } from "../hooks/useUserPreferences";
import { useNodeInteraction } from "../hooks/useNodeInteraction";
import { useWordWebCreation } from "../hooks/useWordWebCreation";
import { loadUserPreferences } from "../utils/localStorage";
import type { LineStyle } from "../types/common";

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
  const [usedWords, setUsedWords] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const [centerWord, setCenterWord] = useState<string>("");

  const reactFlow = useReactFlow();
  const {
    tooltipData,
    showTooltip,
    hideTooltip,
    pinTooltip,
    unpinTooltip,
    closeTooltip,
    forceTooltipUpdate,
    getTooltipPosition,
  } = useTooltipState();
  const {
    showConfirmModal,
    showNoUniqueWordsModal,
    lastClickedWord,
    openConfirmModal,
    closeConfirmModal,
    openNoUniqueWordsModal,
    closeNoUniqueWordsModal,
  } = useModalState();
  const {
    isInitialLoading,
    isUpdatingLineStyle,
    startInitialLoading,
    stopInitialLoading,
    startLineStyleUpdate,
    stopLineStyleUpdate,
    addLoadingNode,
    removeLoadingNode,
    isNodeLoading,
  } = useLoadingState();
  const {
    sidebarOpen,
    setSidebarOpen,
    tooltipsEnabled,
    setTooltipsEnabled,
    recentSearches,
    setRecentSearches,
  } = useUserPreferences();

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
    recentSearches,
    tooltipsEnabled,
  });

  const edgeColor = isDark ? "#6b7280" : "#94a3b8"; // Lighter gray for dark, darker for light

  const { onNodeClick } = useNodeInteraction({
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
  });
  const { createWordWeb } = useWordWebCreation({
    setNodes,
    setEdges,
    setExpandedNodes,
    setUsedWords,
    setCenterWord,
    setError,
    startInitialLoading,
    stopInitialLoading,
    lineStyle,
    edgeColor,
  });

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

      startLineStyleUpdate();

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
            strokeWidth: 1.5,
          },
        }))
      );

      stopLineStyleUpdate();
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
          strokeWidth: 1.5,
        },
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

  // Clear tooltips when disabled
  useEffect(() => {
    if (!tooltipsEnabled && tooltipData.isVisible) {
      closeTooltip();
    }
  }, [tooltipsEnabled, tooltipData.isVisible, closeTooltip]);

  // Handle viewport changes to update tooltip positions
  const handleViewportChange = useCallback(() => {
    forceTooltipUpdate();
  }, [forceTooltipUpdate]);

  // Manual save/load/clear functions
  const handleSaveWordweb = useCallback(() => {
    saveCurrentState();
    // You could show a toast notification here
  }, [saveCurrentState]);

  const handleClearWordweb = useCallback(() => {
    openConfirmModal();
  }, [openConfirmModal]);

  const handleConfirmClear = useCallback(() => {
    setNodes([]);
    setEdges([]);
    setExpandedNodes(new Set());
    setUsedWords(new Set());
    setCenterWord("");
    clearSavedState();
    reactFlow.fitView();
    closeConfirmModal();
  }, [clearSavedState, reactFlow, closeConfirmModal]);

  const handleCancelClear = useCallback(() => {
    closeConfirmModal();
  }, [closeConfirmModal]);

  const handleCloseNoUniqueWordsModal = useCallback(() => {
    closeNoUniqueWordsModal();
  }, [closeNoUniqueWordsModal]);

  const nodeTypes = { colored: ColoredNode };

  return (
    <>
      <div
        className="fixed inset-0 flex items-center justify-center overflow-hidden pointer-events-none"
        style={{ zIndex: 1 }}
      >
        <div
          className="text-5xl font-bold opacity-10 select-none"
          style={{ color: isDark ? "#ece2c7" : "#374151" }}
        >
          wordweb.
        </div>
      </div>

      {isInitialLoading && (
        <LoadingOverlay isDark={isDark} message="Generating word web..." />
      )}

      <Toast
        message="Line style updated!"
        isVisible={isUpdatingLineStyle}
        isDark={isDark}
      />

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
        onMove={handleViewportChange}
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
          animated: false,
        }}
        edgesFocusable={true}
        elementsSelectable={true}
        nodesConnectable={false}
        onNodeMouseEnter={(_, node) => {
          // Only show tooltip on hover if tooltips enabled and not pinned
          if (!tooltipsEnabled || tooltipData.isPinned) {
            return;
          }

          showTooltip({
            word: node.data.label,
            score: node.data.score,
            tags: node.data.tags,
            nodeId: node.id,
          });
        }}
        onNodeMouseLeave={() => {
          // Only hide on mouse leave if not pinned and tooltips enabled
          if (tooltipsEnabled && !tooltipData.isPinned) {
            hideTooltip();
          }
        }}
        onNodeContextMenu={(event, node) => {
          // Right-click to pin/unpin tooltip (only if tooltips enabled)
          if (!tooltipsEnabled) {
            return;
          }

          event.preventDefault();
          event.stopPropagation();

          // If clicking the same node that's already pinned, unpin it but keep visible
          if (tooltipData.isPinned && tooltipData.word === node.data.label) {
            unpinTooltip();

            // After a brief delay, check if mouse is still over the node and hide if needed
            setTimeout(() => {
              if (
                !tooltipData.isPinned &&
                tooltipData.word === node.data.label
              ) {
                hideTooltip();
              }
            }, 100); // Short delay to allow for natural mouse movement
          } else {
            // Pin the tooltip for this node
            pinTooltip({
              word: node.data.label,
              score: node.data.score,
              tags: node.data.tags,
              nodeId: node.id,
            });
          }
        }}
      >
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
        tooltipsEnabled={tooltipsEnabled}
        onTooltipToggle={setTooltipsEnabled}
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

      <NodeTooltip
        word={tooltipData.word}
        score={tooltipData.score}
        position={getTooltipPosition(tooltipData.nodeId, nodes)}
        isVisible={tooltipsEnabled && tooltipData.isVisible}
        isPinned={tooltipData.isPinned}
        isDark={isDark}
        onClose={closeTooltip}
      />
    </>
  );
}
