const base = import.meta.env.BASE_URL;

/** Default 卓写真（店舗提供のサンプル） */
export const TABLE_PHOTO_URLS = [
  `${base}table-photos/lounge-bamboo.png`,
  `${base}table-photos/lounge-leather.png`,
] as const;

export function getDefaultTablePhotoUrl(seed: number): string {
  const index = Math.abs(seed) % TABLE_PHOTO_URLS.length;
  return TABLE_PHOTO_URLS[index];
}
