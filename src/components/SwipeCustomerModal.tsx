import { useCallback, useEffect, useRef, useState } from "react";
import type { ThankYouEntry } from "@/data/types";
import { useApp } from "@/context/AppContext";
import { CustomerSwipeCardContent } from "./CustomerSwipeCardContent";
import { CustomerEntryNotesForm } from "./CustomerEntryNotesForm";
import { SwipeCompletePopupModal } from "./SwipeCompletePopupModal";
import styles from "./SwipeCustomerModal.module.css";

const SWIPE_THRESHOLD = 90;
const MAX_ROTATION = 12;
const DRAG_LOCK_PX = 10;

function isSwipeBlockedTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  return !!target.closest("input, textarea, select, button, label, a, img");
}

interface SwipeCustomerModalProps {
  entries: ThankYouEntry[];
  startIndex: number;
  onClose: () => void;
}

type SwipeDir = "left" | "right" | null;

export function SwipeCustomerModal({ entries, startIndex, onClose }: SwipeCustomerModalProps) {
  const { hotCriteria, markSent, markNoLineExchange, session } = useApp();
  const [index, setIndex] = useState(startIndex);
  const [showCompletePopup, setShowCompletePopup] = useState(false);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [exiting, setExiting] = useState<SwipeDir>(null);
  const [lineName, setLineName] = useState("");
  const [memo, setMemo] = useState("");
  const [tablePhotoUrl, setTablePhotoUrl] = useState<string | undefined>();
  const dragStart = useRef<{ x: number; y: number } | null>(null);
  const isDragging = useRef(false);
  const offsetXRef = useRef(0);

  const queue = entries;
  const safeIndex = Math.min(index, Math.max(0, queue.length - 1));
  const entry = queue[safeIndex];

  useEffect(() => {
    setIndex(Math.min(startIndex, Math.max(0, entries.length - 1)));
  }, [startIndex, entries.length]);

  useEffect(() => {
    setLineName(entry?.lineName ?? "");
    setMemo(entry?.memo ?? "");
    setTablePhotoUrl(undefined);
  }, [entry?.id, entry?.lineName, entry?.memo]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const notes = { lineName, memo, tablePhotoUrl };

  const advanceOrClose = useCallback(() => {
    setOffsetX(0);
    setOffsetY(0);
    setExiting(null);
    offsetXRef.current = 0;
    setIndex(0);
  }, []);

  const commitSwipe = useCallback(
    (dir: SwipeDir) => {
      if (!entry || !dir) return;
      setExiting(dir);
      const flyX = dir === "right" ? 420 : -420;
      setOffsetX(flyX);

      const isLastInQueue = queue.length === 1;

      window.setTimeout(() => {
        if (dir === "right") markSent(entry.id, notes);
        else markNoLineExchange(entry.id, notes);

        if (isLastInQueue) {
          setShowCompletePopup(true);
        } else {
          advanceOrClose();
        }
      }, 280);
    },
    [entry, lineName, memo, tablePhotoUrl, markSent, markNoLineExchange, advanceOrClose, queue.length],
  );

  const onPointerDown = (e: React.PointerEvent) => {
    if (exiting || !entry || isSwipeBlockedTarget(e.target)) return;
    isDragging.current = false;
    dragStart.current = { x: e.clientX, y: e.clientY };
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragStart.current || exiting) return;

    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;

    if (!isDragging.current) {
      if (Math.abs(dx) < DRAG_LOCK_PX && Math.abs(dy) < DRAG_LOCK_PX) return;
      if (Math.abs(dy) > Math.abs(dx)) {
        dragStart.current = null;
        return;
      }
      isDragging.current = true;
      (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
    }

    const tiltY = dy * 0.25;
    offsetXRef.current = dx;
    setOffsetX(dx);
    setOffsetY(tiltY);
  };

  const onPointerUp = (e: React.PointerEvent) => {
    if (!dragStart.current) return;

    if (!isDragging.current) {
      dragStart.current = null;
      return;
    }

    isDragging.current = false;
    dragStart.current = null;
    (e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);

    const dx = offsetXRef.current;

    if (dx > SWIPE_THRESHOLD) commitSwipe("right");
    else if (dx < -SWIPE_THRESHOLD) commitSwipe("left");
    else {
      offsetXRef.current = 0;
      setOffsetX(0);
      setOffsetY(0);
    }
  };

  const rotation = exiting ? (exiting === "right" ? MAX_ROTATION : -MAX_ROTATION) : (offsetX / 20) * (MAX_ROTATION / 10);
  const rightOpacity = Math.min(Math.max(offsetX / SWIPE_THRESHOLD, 0), 1);
  const leftOpacity = Math.min(Math.max(-offsetX / SWIPE_THRESHOLD, 0), 1);

  const dismissComplete = () => {
    setShowCompletePopup(false);
    onClose();
  };

  if (showCompletePopup || queue.length === 0 || !entry) {
    return (
      <SwipeCompletePopupModal
        castName={session.name}
        onClose={dismissComplete}
      />
    );
  }

  return (
    <div className={styles.overlay} onClick={onClose} role="presentation">
      <button
        type="button"
        className={styles.closeIcon}
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        aria-label="閉じる"
      >
        ✕
      </button>

      <p
        className={styles.counter}
        onClick={(e) => e.stopPropagation()}
      >
        {safeIndex + 1} / {queue.length}
      </p>

      <div className={styles.modalBody} onClick={(e) => e.stopPropagation()}>
        <div
          className={styles.cardWrap}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          <div
            className={`${styles.stamp} ${styles.stampRight}`}
            style={{ opacity: rightOpacity }}
          >
            送信済み ✓
          </div>
          <div
            className={`${styles.stamp} ${styles.stampLeft}`}
            style={{ opacity: leftOpacity }}
          >
            LINE未交換
          </div>

          <div
            className={`${styles.card}${exiting ? ` ${styles.cardExiting}` : ""}`}
            style={{
              transform: `translate(${offsetX}px, ${offsetY}px) rotate(${rotation}deg)`,
            }}
          >
            <div className={styles.cardScroll}>
              <CustomerSwipeCardContent
                entry={entry}
                hotCriteria={hotCriteria}
                tablePhotoUrl={tablePhotoUrl}
                onPhotoChange={setTablePhotoUrl}
              />
              <CustomerEntryNotesForm
                variant="embedded"
                lineName={lineName}
                memo={memo}
                onLineNameChange={setLineName}
                onMemoChange={setMemo}
              />
            </div>
          </div>
        </div>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.actionLeft}
            onClick={() => commitSwipe("left")}
          >
            ← LINE未交換
          </button>
          <button
            type="button"
            className={styles.actionRight}
            onClick={() => commitSwipe("right")}
          >
            送信済み →
          </button>
        </div>

        <p className={styles.hint}>左右にフリック、またはボタンで処理</p>
      </div>
    </div>
  );
}
