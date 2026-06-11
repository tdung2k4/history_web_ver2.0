import { useState, useCallback } from "react";
import { useIsPremium } from "./useIsPremium";
import { useNavigate } from "react-router";

/**
 * Hook chính để gate premium features.
 * 
 * Usage:
 *   const { requirePremium, showModal, closeModal } = usePremiumGate();
 *   <button onClick={() => requirePremium(() => doSomething())}>...</button>
 *   {showModal && <PremiumModal onClose={closeModal} onSuccess={() => doSomething()} />}
 */
export function usePremiumGate() {
  const isPremium = useIsPremium();
  const [showModal, setShowModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);
  const nav = useNavigate();

  const requirePremium = useCallback(
    (action?: () => void) => {
      if (isPremium) {
        action?.();
        return;
      }
      if (action) setPendingAction(() => action);
      setShowModal(true);
    },
    [isPremium]
  );

  const closeModal = useCallback(() => {
    setShowModal(false);
    setPendingAction(null);
  }, []);

  const onUpgradeSuccess = useCallback(() => {
    setShowModal(false);
    pendingAction?.();
    setPendingAction(null);
  }, [pendingAction]);

  const goToPricing = useCallback(() => {
    setShowModal(false);
    nav("/premium");
  }, [nav]);

  return { requirePremium, showModal, closeModal, onUpgradeSuccess, goToPricing, isPremium };
}
