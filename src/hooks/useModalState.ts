import { useState, useCallback } from "react";

export function useModalState() {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showNoUniqueWordsModal, setShowNoUniqueWordsModal] = useState(false);
  const [lastClickedWord, setLastClickedWord] = useState<string>("");

  const openConfirmModal = useCallback(() => {
    setShowConfirmModal(true);
  }, []);

  const closeConfirmModal = useCallback(() => {
    setShowConfirmModal(false);
  }, []);

  const openNoUniqueWordsModal = useCallback((word: string) => {
    setLastClickedWord(word);
    setShowNoUniqueWordsModal(true);
  }, []);

  const closeNoUniqueWordsModal = useCallback(() => {
    setShowNoUniqueWordsModal(false);
    setLastClickedWord("");
  }, []);

  return {
    showConfirmModal,
    showNoUniqueWordsModal,
    lastClickedWord,
    openConfirmModal,
    closeConfirmModal,
    openNoUniqueWordsModal,
    closeNoUniqueWordsModal,
  };
}
