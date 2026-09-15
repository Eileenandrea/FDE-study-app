import { useEffect, useRef, useState } from 'react';

interface ConfirmButtonProps {
  label: string;
  confirmLabel: string;
  onConfirm: () => void;
  className?: string;
  confirmClassName?: string;
  /** How long the confirm state stays armed before reverting, in ms. */
  resetAfterMs?: number;
}

/**
 * Two-click confirmation button: first click arms it (label swaps to
 * `confirmLabel`), second click within `resetAfterMs` fires `onConfirm`.
 * Arming auto-reverts after `resetAfterMs` if not confirmed.
 */
export default function ConfirmButton({
  label,
  confirmLabel,
  onConfirm,
  className,
  confirmClassName,
  resetAfterMs = 4000,
}: ConfirmButtonProps) {
  const [confirming, setConfirming] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  function handleClick() {
    if (!confirming) {
      setConfirming(true);
      timeoutRef.current = setTimeout(() => setConfirming(false), resetAfterMs);
      return;
    }
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setConfirming(false);
    onConfirm();
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={confirming ? confirmLabel : label}
      className={confirming ? (confirmClassName ?? className) : className}
    >
      {confirming ? confirmLabel : label}
    </button>
  );
}
