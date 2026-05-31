import type { Customer } from "@/data/types";
import {
  formatDateOfBirth,
  getCastPreferenceLabel,
  getHobbySpendingLabel,
  getOccupationLabel,
} from "@/data/customerProfileOptions";
import { formatBirthday } from "@/lib/customerDisplay";
import type { FlameCount } from "@/lib/matchRate";
import { MatchRateFlames } from "./MatchRateFlames";
import styles from "./CustomerProfileSection.module.css";

function resolveBirthDisplay(customer: Customer): string | null {
  if (customer.dateOfBirth) return formatDateOfBirth(customer.dateOfBirth);
  const legacy = formatBirthday(customer.birthday);
  return legacy ? legacy : null;
}

type ProfileField = {
  key: string;
  label: string;
  value: string;
  icon: string;
};

type Props = {
  customer: Customer;
  /** Tighter layout inside swipe card pages */
  compact?: boolean;
  /** Show match rate flames on the right side of the header */
  flameCount?: FlameCount;
};

export function CustomerProfileSection({ customer, compact = false, flameCount }: Props) {
  const birthDisplay = resolveBirthDisplay(customer);
  const fields: ProfileField[] = [];

  if (birthDisplay) {
    fields.push({ key: "birth", label: "生年月日", value: birthDisplay, icon: "🎂" });
  }
  if (customer.prefecture) {
    fields.push({ key: "area", label: "お住まい", value: customer.prefecture, icon: "📍" });
  }
  if (customer.occupation) {
    fields.push({
      key: "job",
      label: "ご職業",
      value: getOccupationLabel(customer.occupation),
      icon: "💼",
    });
  }
  if (customer.hobbySpending) {
    fields.push({
      key: "hobby",
      label: "趣味への支出",
      value: getHobbySpendingLabel(customer.hobbySpending),
      icon: "✨",
    });
  }

  const preferences = customer.castPreferences ?? [];
  const hasProfile = fields.length > 0 || preferences.length > 0;

  if (!hasProfile) return null;

  return (
    <section className={`${styles.section}${compact ? ` ${styles.compact}` : ""}`}>
      <header className={styles.header}>
        <span className={styles.headerIcon} aria-hidden>
          👤
        </span>
        <div className={styles.headerInfo}>
          <h2 className={styles.title}>お客様プロフィール</h2>
          <p className={styles.subtitle}>接客の参考情報</p>
        </div>
        {flameCount && (
          <span className={styles.headerFlames}>
            <MatchRateFlames count={flameCount} />
          </span>
        )}
      </header>

      {fields.length > 0 && (
        <ul className={styles.fieldList}>
          {fields.map((field) => (
            <li key={field.key} className={styles.fieldCard}>
              <span className={styles.fieldIcon} aria-hidden>
                {field.icon}
              </span>
              <div className={styles.fieldBody}>
                <span className={styles.fieldLabel}>{field.label}</span>
                <span className={styles.fieldValue}>{field.value}</span>
              </div>
            </li>
          ))}
        </ul>
      )}

      {preferences.length > 0 && (
        <div className={styles.prefBlock}>
          <p className={styles.prefLabel}>キャストのお好み</p>
          <div className={styles.chips}>
            {preferences.map((pref) => (
              <span key={pref} className={styles.chip}>
                {getCastPreferenceLabel(pref)}
              </span>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
