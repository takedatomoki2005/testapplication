import styles from "./BarcelonaLogo.module.css";

type Props = {
  className?: string;
  variant?: "dark" | "light";
};

/** Readable header mark — green O + wordmark (matches brand logo). */
export function BarcelonaLogo({ className, variant = "dark" }: Props) {
  return (
    <div
      className={[styles.mark, variant === "light" ? styles.light : "", className]
        .filter(Boolean)
        .join(" ")}
      aria-label="BARCELONA"
    >
      <span className={styles.word}>BARCEL</span>
      <span className={styles.oWrap} aria-hidden>
        <svg className={styles.oIcon} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="1.6" />
          <circle cx="16" cy="16" r="5" stroke="currentColor" strokeWidth="1.4" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
            <path
              key={deg}
              d="M16 3 Q17 8 16 11"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              transform={`rotate(${deg} 16 16)`}
            />
          ))}
        </svg>
      </span>
      <span className={styles.word}>NA</span>
    </div>
  );
}
