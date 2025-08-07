// src/components/NodeTooltip.tsx
import React, { useState, useEffect } from "react";

interface NodeTooltipProps {
  word: string;
  score?: number;
  tags?: string[];
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
  tags = [],
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

  // Process tags for display
  const processedTags = tags
    .filter(
      (tag) =>
        !tag.startsWith("f:") && // Remove frequency tags
        !tag.startsWith("u:") && // Remove usage tags
        tag.length > 1
    )
    .slice(0, 3); // Limit to 3 tags

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
        border rounded-lg shadow-lg p-3 pointer-events-auto
        ${isExpanded ? "animate-pulse-once" : ""}
        ${isPinned ? "border-blue-400 shadow-blue-200/50" : ""}
      `}>
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <h4 className="font-bold text-lg">{word}</h4>
          {isPinned && (
            <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded-full font-medium">📌 pinned</span>
          )}
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className={`text-xs opacity-60 hover:opacity-100 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
            ✕
          </button>
        )}
      </div>

      {/* Score and Strength */}
      {score && (
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-medium">Relevance:</span>
          <span className={`text-xs font-semibold ${strength?.color}`}>{strength?.label}</span>
          <span className="text-xs opacity-60">({score.toLocaleString()})</span>
        </div>
      )}

      {/* Tags */}
      {processedTags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {processedTags.map((tag, index) => (
            <span
              key={index}
              className={`
                text-xs px-2 py-1 rounded-full
                ${isDark ? "bg-zinc-700 text-zinc-300" : "bg-gray-200 text-gray-700"}
              `}>
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Definition Section */}
      <div className="border-t pt-2 mt-2">
        {!isExpanded ? (
          <div className="flex items-center justify-between">
            <span className="text-xs opacity-70">Definition</span>
            <button
              onClick={handleExpand}
              className={`
                text-xs font-medium hover:underline
                ${isDark ? "text-blue-400" : "text-blue-600"}
              `}>
              show <span className="opacity-60">...</span>
            </button>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium">Definition</span>
              <button
                onClick={() => setIsExpanded(false)}
                className={`
                  text-xs opacity-60 hover:opacity-100
                  ${isDark ? "text-gray-300" : "text-gray-600"}
                `}>
                minimize
              </button>
            </div>

            {isLoadingDefinition ? (
              <div className="text-xs opacity-60">Loading definition...</div>
            ) : definition ? (
              <div className="space-y-2">
                {definition.partOfSpeech && (
                  <div className="text-xs font-medium opacity-80 italic">{definition.partOfSpeech}</div>
                )}
                <div className="text-sm leading-relaxed">{definition.definition}</div>
                {definition.example && <div className="text-xs opacity-70 italic">"{definition.example}"</div>}
              </div>
            ) : (
              <div className="text-xs opacity-60">No definition available</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NodeTooltip;
