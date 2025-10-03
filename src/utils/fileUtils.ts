export type ItemKey = 'shinchou' | 'ashi' | 'te' | 'taijuu';

/**
 * Generates a formatted filename for a growth record image based on spec.
 * Format: hakattake_YYYY-MM-DD_[itemKey]_[value][unit].jpg
 */
export const generateFileName = (
  itemKey: ItemKey,
  value: number,
  unit: 'cm' | 'kg',
  dateISO: string
): string => {
  const date = new Date(dateISO);

  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');

  const formattedDate = `${year}-${month}-${day}`;
  const formattedValue = value.toFixed(1);

  return `hakattake_${formattedDate}_${itemKey}_${formattedValue}${unit}.jpg`;
};
