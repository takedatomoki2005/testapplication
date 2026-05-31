import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { ThankYouEntry } from "@/data/types";
import { initialAppData } from "@/data";
import { useApp } from "@/context/AppContext";
import { getRecommendReasonScore } from "@/lib/discoverRecommendReasons";
import {
  getFollowUpContacts,
  mergeFollowUpRecords,
} from "@/lib/followUpDiscover";
import {
  CARD_PAGE_LABELS,
  CustomerSwipeCardContent,
  type CardPageIndex,
} from "./CustomerSwipeCardContent";
import { SwipeCompletePopupModal } from "./SwipeCompletePopupModal";
import {
  computeVisitCategoryProgress,
  resolveSwipeCompletionPopup,
  type SwipeCompleteVariant,
} from "@/lib/visitCategory";
import styles from "./SwipeCustomerModal.module.css";

const SWIPE_THRESHOLD = 90;
const MAX_ROTATION = 12;
const DRAG_LOCK_PX = 10;
const PAGE_COUNT = CARD_PAGE_LABELS.length;

const INTERACTIVE_SELECTOR = "input, textarea, select, button, label, a";

function isInteractiveTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  return !!target.closest(INTERACTIVE_SELECTOR);
}

/** Blocks tap-to-flip-page only (images still allow horizontal swipe). */
function isTapNavigationBlockedTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  return isInteractiveTarget(target) || !!target.closest("img");
}

interface SwipeCustomerModalProps {
  entries: ThankYouEntry[];
  startIndex: number;
  onClose: () => void;
}

type SwipeDir = "left" | "right" | "center" | null;

export function SwipeCustomerModal({ entries, startIndex, onClose }: SwipeCustomerModalProps) {
  const navigate = useNavigate();
  const { hotCriteria, markSent, markNoLineExchange, markNoContact, session, myEntries, followUpOverrides, businessDate } =
    useApp();
  const categorySummary = computeVisitCategoryProgress(myEntries);

  const discoverCount = useMemo(() => {
    const castId = session.castId ?? "cast-a";
    const records = mergeFollowUpRecords(initialAppData.followUpRecords, followUpOverrides);
    const contacts = getFollowUpContacts(
      records,
      initialAppData.customers,
      castId,
      hotCriteria,
      businessDate,
    );
    return contacts.filter(
      (c) =>
        getRecommendReasonScore(c, businessDate) > 0 &&
        !followUpOverrides[c.id]?.followUpSentAt,
    ).length;
  }, [session.castId, hotCriteria, businessDate, followUpOverrides]);
  const [index, setIndex] = useState(startIndex);
  const [pageIndex, setPageIndex] = useState<CardPageIndex>(0);
  const [completePopup, setCompletePopup] = useState<SwipeCompleteVariant | null>(null);
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
    setPageIndex(0);
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
    setPageIndex(0);
    setIndex(0);
  }, []);

  const goToPrevPage = useCallback(() => {
    setPageIndex((current) => (current > 0 ? ((current - 1) as CardPageIndex) : current));
  }, []);

  const goToNextPage = useCallback(() => {
    setPageIndex((current) =>
      current < PAGE_COUNT - 1 ? ((current + 1) as CardPageIndex) : current,
    );
  }, []);

  const handleCardTap = useCallback(
    (clientX: number, cardLeft: number, cardWidth: number, target: EventTarget | null) => {
      if (isTapNavigationBlockedTarget(target)) return;
      const isRightHalf = clientX - cardLeft > cardWidth / 2;
      if (isRightHalf) goToNextPage();
      else goToPrevPage();
    },
    [goToNextPage, goToPrevPage],
  );

  const commitSwipe = useCallback(
    (dir: SwipeDir) => {
      if (!entry || !dir) return;
      setExiting(dir);
      const flyX = dir === "right" ? 420 : dir === "left" ? -420 : 0;
      setOffsetX(flyX);

      window.setTimeout(() => {
        if (dir === "right") markSent(entry.id, notes);
        else if (dir === "left") markNoLineExchange(entry.id, notes);
        else markNoContact(entry.id, notes);

        const popup = resolveSwipeCompletionPopup(entry, queue);
        if (popup) {
          setCompletePopup(popup);
        } else {
          advanceOrClose();
        }
      }, 280);
    },
    [
      entry,
      lineName,
      memo,
      tablePhotoUrl,
      markSent,
      markNoLineExchange,
      markNoContact,
      advanceOrClose,
      queue.length,
    ],
  );

  const onPointerDown = (e: React.PointerEvent) => {
    if (exiting || !entry || isInteractiveTarget(e.target)) return;
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
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      handleCardTap(e.clientX, rect.left, rect.width, e.target);
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

  const rotation =
    exiting && exiting !== "center"
      ? exiting === "right"
        ? MAX_ROTATION
        : -MAX_ROTATION
      : (offsetX / 20) * (MAX_ROTATION / 10);
  const rightOpacity = Math.min(Math.max(offsetX / SWIPE_THRESHOLD, 0), 1);
  const leftOpacity = Math.min(Math.max(-offsetX / SWIPE_THRESHOLD, 0), 1);

  const dismissComplete = () => {
    const wasAllDone = completePopup === "all";
    setCompletePopup(null);
    if (wasAllDone) {
      onClose();
    } else {
      advanceOrClose();
    }
  };

  const goDiscover = () => {
    setCompletePopup(null);
    onClose();
    navigate("/discover");
  };

  if (completePopup || queue.length === 0 || !entry) {
    return (
      <SwipeCompletePopupModal
        castName={session.name}
        variant={completePopup ?? "all"}
        categorySummary={categorySummary}
        discoverCount={discoverCount}
        onClose={dismissComplete}
        onDiscover={goDiscover}
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
            className={`${styles.card}${exiting ? ` ${styles.cardExiting}` : ""}${
              exiting === "center" ? ` ${styles.cardExitingCenter}` : ""
            }`}
            style={{
              transform:
                exiting === "center"
                  ? undefined
                  : `translate(${offsetX}px, ${offsetY}px) rotate(${rotation}deg)`,
              opacity: exiting === "center" ? 0 : 1,
            }}
          >
            <div className={styles.pageHeader}>
              <span className={styles.pageTitle}>{CARD_PAGE_LABELS[pageIndex]}</span>
              <div className={styles.pageDots} aria-hidden>
                {CARD_PAGE_LABELS.map((label, i) => (
                  <span
                    key={label}
                    className={`${styles.pageDot}${i === pageIndex ? ` ${styles.pageDotActive}` : ""}`}
                  />
                ))}
              </div>
            </div>
            <div className={styles.cardBody}>
              <CustomerSwipeCardContent
                entry={entry}
                hotCriteria={hotCriteria}
                tablePhotoUrl={tablePhotoUrl}
                onPhotoChange={setTablePhotoUrl}
                page={pageIndex}
                lineName={lineName}
                memo={memo}
                onLineNameChange={setLineName}
                onMemoChange={setMemo}
              />
            </div>
            <div className={styles.pageNavHint} aria-hidden>
              <span className={pageIndex > 0 ? styles.pageNavActive : ""}>← 戻る</span>
              <span className={pageIndex < PAGE_COUNT - 1 ? styles.pageNavActive : ""}>
                次へ →
              </span>
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
            className={styles.actionCenter}
            onClick={() => commitSwipe("center")}
          >
            連絡しない
          </button>
          <button
            type="button"
            className={styles.actionRight}
            onClick={() => commitSwipe("right")}
          >
            送信済み →
          </button>
        </div>

        <p className={styles.hint}>左右をタップで画面切替 · フリックまたはボタンで対応</p>
      </div>
    </div>
  );
}
