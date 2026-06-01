import styles from "./Greeting.module.css";

type Props = {
  name?: string;
  allSent?: boolean;
  unsent?: number;
  centered?: boolean;
  messageOnly?: boolean;
  monthlyCount?: number;
  onPrimary?: boolean;
};

export function Greeting({
  name,
  allSent,
  unsent,
  centered,
  messageOnly,
  monthlyCount,
  onPrimary,
}: Props) {
  const showStatus = !messageOnly && (allSent !== undefined || unsent !== undefined);

  const mainMessage = messageOnly
    ? monthlyCount != null && monthlyCount > 0
      ? "今月もお客様と出会えています"
      : "今日もお疲れ様でした！"
    : `${name}さん、今日もお疲れ様でした！`;

  return (
    <div
      className={`${styles.greeting} ${centered ? styles.centered : ""} ${onPrimary ? styles.onPrimary : ""}`}
    >
      <p className={styles.greetingMain}>{mainMessage}</p>
      {showStatus && (
        <p className={styles.greetingSub}>
          {allSent
            ? "本日のお礼LINE、処理完了 ✨"
            : unsent && unsent > 0
              ? `タップして確認 — あと${unsent}件`
              : "本日の接客おつかれさまです"}
        </p>
      )}
    </div>
  );
}
