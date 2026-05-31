import type { Customer } from "@/data/types";
import {
  formatDateOfBirth,
  getCastPreferenceLabel,
  getHobbySpendingLabel,
  getOccupationLabel,
} from "@/data/customerProfileOptions";
import { formatBirthday } from "@/lib/customerDisplay";
import styles from "./CustomerProfileSection.module.css";

function resolveBirthDisplay(customer: Customer): string | null {
  if (customer.dateOfBirth) return formatDateOfBirth(customer.dateOfBirth);
  const legacy = formatBirthday(customer.birthday);
  return legacy ? legacy : null;
}

export function CustomerProfileSection({ customer }: { customer: Customer }) {
  const birthDisplay = resolveBirthDisplay(customer);
  const hasProfile =
    birthDisplay ||
    customer.prefecture ||
    customer.occupation ||
    (customer.castPreferences?.length ?? 0) > 0 ||
    customer.hobbySpending;

  if (!hasProfile) return null;

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>お客様プロフィール</h2>

      {birthDisplay && (
        <div className={styles.row}>
          <span className={styles.label}>生年月日</span>
          <span className={styles.value}>{birthDisplay}</span>
        </div>
      )}

      {customer.prefecture && (
        <div className={styles.row}>
          <span className={styles.label}>お住まいの地域</span>
          <span className={styles.value}>{customer.prefecture}</span>
        </div>
      )}

      {customer.occupation && (
        <div className={styles.row}>
          <span className={styles.label}>ご職業</span>
          <span className={styles.value}>{getOccupationLabel(customer.occupation)}</span>
        </div>
      )}

      {customer.castPreferences && customer.castPreferences.length > 0 && (
        <div className={styles.block}>
          <span className={styles.label}>キャストのお好み</span>
          <div className={styles.chips}>
            {customer.castPreferences.map((pref) => (
              <span key={pref} className={styles.chip}>
                {getCastPreferenceLabel(pref)}
              </span>
            ))}
          </div>
        </div>
      )}

      {customer.hobbySpending && (
        <div className={styles.row}>
          <span className={styles.label}>毎月趣味に使う金額</span>
          <span className={styles.value}>{getHobbySpendingLabel(customer.hobbySpending)}</span>
        </div>
      )}
    </section>
  );
}
