/**
 * Helper untuk parsing dan pengelompokan jadwal donor darah
 * Mendukung format bahasa Indonesia seperti "12 Mei 2026", "24 November 2026", maupun ISO "2026-11-24".
 */

export function parseJadwalDate(dateStr: string): Date | null {
  if (!dateStr) return null;
  const MONTH_NAMES = [
    "januari", "februari", "maret", "april", "mei", "juni",
    "juli", "agustus", "september", "oktober", "november", "desember"
  ];
  const parts = dateStr.trim().split(/\s+/);
  if (parts.length >= 3) {
    const day = parseInt(parts[0], 10);
    const monthIndex = MONTH_NAMES.indexOf(parts[1].toLowerCase());
    const year = parseInt(parts[2], 10);
    if (!isNaN(day) && monthIndex !== -1 && !isNaN(year)) {
      return new Date(year, monthIndex, day);
    }
  }
  const fallback = new Date(dateStr);
  return isNaN(fallback.getTime()) ? null : fallback;
}

export type ScheduleStatus = 'today' | 'upcoming' | 'past';

/**
 * Mendapatkan status jadwal:
 * - 'today': Berlangsung hari ini
 * - 'upcoming': Terjadwal di masa mendatang (besok dan seterusnya)
 * - 'past': Tanggal sudah terlewat (masuk riwayat / selesai)
 */
export function getScheduleStatus(dateStr: string): ScheduleStatus {
  const d = parseJadwalDate(dateStr);
  if (!d) return 'upcoming';

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
  const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

  const targetTime = d.getTime();
  if (targetTime < todayStart.getTime()) {
    return 'past';
  } else if (targetTime <= todayEnd.getTime()) {
    return 'today';
  } else {
    return 'upcoming';
  }
}
