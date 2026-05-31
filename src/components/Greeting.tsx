import styles from "./Greeting.module.css";

type Props = {
  name?: string;
  allSent?: boolean;
  unsent?: number;
  centered?: boolean;
  messageOnly?: boolean;
};

export function Greeting({ name, allSent, unsent, centered, messageOnly }: Props) {
  const showStatus = !messageOnly && (allSent !== undefined || unsent !== undefined);

  return (
    <div className={`${styles.greeting} ${centered ? styles.centered : ""}`}>
      <p className={styles.greetingMain}>
        {messageOnly ? "今日もお疲れ様でした！" : `${name}さん、今日もお疲れ様でした！`}
      </p>
      {showStatus && (
        <p className={styles.greetingSub}>
          {allSent
            ? "本日のお礼LINE、全員に処理完了 ✨"
            : unsent && unsent > 0
              ? `タップして確認 — あと${unsent}件`
              : "本日の接客おつかれさまです"}
        </p>
      )}
    </div>
  );
}
