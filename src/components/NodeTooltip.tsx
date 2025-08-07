// src/components/NodeTooltip.tsx
import React, { useState, useEffect } from "react";

interface NodeTooltipProps {
  word: string;
  score?: number;
  position: { x: number; y: number };
  isVisible: boolean;
  isPinned?: boolean;
  isDark?: boolean;
  onClose?: () => void;
}

interface WordDefinition {
  definition: string;
  partOfSpeech: string;
  example?: string;
}

const NodeTooltip: React.FC<NodeTooltipProps> = ({
  word,
  score,
  position,
  isVisible,
  isPinned = false,
  isDark = false,
  onClose
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [definition, setDefinition] = useState<WordDefinition | null>(null);
  const [isLoadingDefinition, setIsLoadingDefinition] = useState(false);

  // Reset expanded state when tooltip becomes visible
  useEffect(() => {
    if (isVisible) {
      setIsExpanded(false);
      setDefinition(null);
    }
  }, [isVisible, word]);

  // Fetch definition when expanding
  const handleExpand = async () => {
    if (!isExpanded && !definition) {
      setIsLoadingDefinition(true);
      try {
        // Try to get definition from Free Dictionary API
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
        if (response.ok) {
          const data = await response.json();
          if (data && data[0] && data[0].meanings && data[0].meanings[0]) {
            const meaning = data[0].meanings[0];
            const phonetic = data[0].phonetic || "";
            setDefinition({
              definition: meaning.definitions[0]?.definition || "No definition available",
              partOfSpeech: meaning.partOfSpeech || "",
              example: meaning.definitions[0]?.example || phonetic
            });
          }
        }
      } catch (error) {
        console.error("Failed to fetch definition:", error);
        setDefinition({
          definition: "Definition not available",
          partOfSpeech: "",
          example: ""
        });
      }
      setIsLoadingDefinition(false);
    }
    setIsExpanded(!isExpanded);
  };

  if (!isVisible) return null;

  // Calculate relationship strength
  const getStrengthLabel = (score: number) => {
    if (score >= 80000) return { label: "Very Strong", color: "text-green-600" };
    if (score >= 40000) return { label: "Strong", color: "text-blue-600" };
    if (score >= 10000) return { label: "Moderate", color: "text-yellow-600" };
    return { label: "Weak", color: "text-gray-500" };
  };

  const strength = score ? getStrengthLabel(score) : null;

  // Tooltip positioning
  const tooltipStyle = {
    position: "fixed" as const,
    left: `${position.x}px`,
    top: `${position.y - 10}px`,
    transform: "translate(-50%, -100%)",
    zIndex: 1000,
    maxWidth: isExpanded ? "320px" : "240px",
    transition: "all 0.2s ease-in-out"
  };

  return (
    <div
      style={tooltipStyle}
      className={`
        ${isDark ? "bg-zinc-800 border-zinc-600 text-white" : "bg-white border-gray-300 text-gray-900"}
        border rounded-lg p-3 pointer-events-auto
        ${isExpanded ? "animate-pulse-once" : ""}
        ${isPinned ? "border-blue-400 shadow-blue-200/50" : ""}
      `}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h4 className="font-bold text-lg">{word}</h4>
          {isPinned && <span className="text-lg">📌</span>}
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className={`text-xs opacity-60 hover:opacity-100 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
            ✕
          </button>
        )}
      </div>

      {/* Relevance Strength (without numeric score) */}
      {score && (
        <div className="flex items-center gap-2 mb-4">
          <span className="text-sm font-medium">Relevance:</span>
          <span className={`text-sm font-semibold ${strength?.color}`}>{strength?.label}</span>
        </div>
      )}

      {/* Definition Section */}
      <div className="border-t pt-4 mt-4">
        {!isExpanded ? (
          <div className="flex items-center justify-between">
            <span className="text-sm opacity-70">Definition</span>
            {isPinned ? (
              <button
                onClick={handleExpand}
                className={`
                  text-sm font-medium cursor-pointer hover:underline
                  ${isDark ? "text-blue-400" : "text-blue-600"}
                `}>
                show <span className="opacity-60">...</span>
              </button>
            ) : (
              <span className="text-sm opacity-40 cursor-default" title="Right-click to pin tooltip first">
                show <span className="opacity-60">...</span>
              </span>
            )}
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium">Definition</span>
              <button
                onClick={() => setIsExpanded(false)}
                className={`
                  text-sm opacity-60 cursor-pointer hover:opacity-100
                  ${isDark ? "text-gray-300" : "text-gray-600"}
                `}>
                ...minimize
              </button>
            </div>

            {isLoadingDefinition ? (
              <div className="text-sm opacity-60 py-2">Loading definition...</div>
            ) : definition ? (
              <div className="space-y-3">
                {definition.partOfSpeech && (
                  <div className="text-sm font-medium opacity-80 italic">{definition.partOfSpeech}</div>
                )}
                <div className="text-base leading-relaxed py-1">{definition.definition}</div>
                {definition.example && <div className="text-sm opacity-70 italic py-1">"{definition.example}"</div>}
              </div>
            ) : (
              <div className="text-sm opacity-60 py-2">No definition available</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NodeTooltip;
