'use client';

import { useActionState, useState } from 'react';
import { saveBusinessHoursAction } from './settings-actions';
import { Plus, X, Check, AlertCircle } from 'lucide-react';
import type { BusinessHoursMap, DayHours } from '@/lib/availability';

const DOWS: { key: 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun'; label: string; color?: string }[] = [
  { key: 'mon', label: '月' },
  { key: 'tue', label: '火' },
  { key: 'wed', label: '水' },
  { key: 'thu', label: '木' },
  { key: 'fri', label: '金' },
  { key: 'sat', label: '土', color: '#2563eb' },
  { key: 'sun', label: '日', color: '#dc2626' },
];

type Key = typeof DOWS[number]['key'];

export default function BusinessHoursForm({ initial }: { initial: BusinessHoursMap }) {
  const [state, formAction, pending] = useActionState(saveBusinessHoursAction, null);

  const defaultDay = (_k: Key, fallback?: DayHours): DayHours => ({
    open: fallback?.open ?? '10:00',
    close: fallback?.close ?? '20:00',
    is_closed: fallback?.is_closed ?? false,
    break_start: fallback?.break_start,
    break_end: fallback?.break_end,
  });

  const [days, setDays] = useState<Record<Key, DayHours>>(() => ({
    mon: defaultDay('mon', initial.mon),
    tue: defaultDay('tue', initial.tue),
    wed: defaultDay('wed', initial.wed),
    thu: defaultDay('thu', initial.thu),
    fri: defaultDay('fri', initial.fri),
    sat: defaultDay('sat', initial.sat),
    sun: defaultDay('sun', initial.sun),
  }));

  const [slotInterval, setSlotInterval] = useState(initial._slot_interval ?? 30);
  const [bufferMinutes, setBufferMinutes] = useState(initial._buffer_minutes ?? 0);
  const [holidays, setHolidays] = useState<string[]>(initial._holidays ?? []);
  const [newHoliday, setNewHoliday] = useState('');

  function updateDay(k: Key, patch: Partial<DayHours>) {
    setDays((d) => ({ ...d, [k]: { ...d[k], ...patch } }));
  }
  function applyWeekdayTemplate() {
    const base = days.mon;
    setDays((d) => ({
      ...d,
      tue: { ...base }, wed: { ...base }, thu: { ...base }, fri: { ...base },
    }));
  }
  function addHoliday() {
    if (!newHoliday) return;
    if (holidays.includes(newHoliday)) return;
    setHolidays([...holidays, newHoliday].sort());
    setNewHoliday('');
  }
  function removeHoliday(d: string) {
    setHolidays(holidays.filter((h) => h !== d));
  }

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="data" value={JSON.stringify({
        ...days,
        _holidays: holidays,
        _slot_interval: slotInterval,
        _buffer_minutes: bufferMinutes,
      })} />

      {state?.error && (
        <div className="p-2.5 rounded text-xs bg-red-50 border border-red-200 text-red-700 flex items-start gap-2">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
          {state.error}
        </div>
      )}
      {state?.ok && (
        <div className="p-2.5 rounded text-xs bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-start gap-2">
          <Check className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
          {state.message}
        </div>
      )}

      {/* 曜日別営業時間 */}
      <div className="space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="text-xs font-semibold text-stone-700">曜日別 営業時間</div>
          <button
            type="button"
            onClick={applyWeekdayTemplate}
            className="text-[11px] brand-text underline whitespace-nowrap"
          >
            月曜の設定を火〜金にコピー
          </button>
        </div>

        <div className="border border-stone-200 rounded-lg overflow-hidden">
          {DOWS.map((d) => {
            const h = days[d.key];
            const hasBreak = !!(h.break_start || h.break_end);
            return (
              <div
                key={d.key}
                className={`px-3 py-3 border-b border-stone-100 last:border-b-0 ${h.is_closed ? 'bg-stone-50' : 'bg-white'}`}
              >
                {/* 1行目: 曜日 + 定休日チェック */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-7 text-center font-bold text-sm"
                      style={{ color: d.color ?? '#44403c' }}
                    >
                      {d.label}
                    </div>
                    <label className="flex items-center gap-1.5 text-xs text-stone-600 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        className="w-4 h-4"
                        checked={h.is_closed}
                        onChange={(e) => updateDay(d.key, { is_closed: e.target.checked })}
                      />
                      定休日
                    </label>
                  </div>

                  {!h.is_closed && (
                    <div className="flex items-center gap-1.5 text-xs">
                      <input
                        type="time"
                        value={h.open}
                        onChange={(e) => updateDay(d.key, { open: e.target.value })}
                        className="input !py-1 !px-2 !text-xs !w-[82px]"
                      />
                      <span className="text-stone-400">〜</span>
                      <input
                        type="time"
                        value={h.close}
                        onChange={(e) => updateDay(d.key, { close: e.target.value })}
                        className="input !py-1 !px-2 !text-xs !w-[82px]"
                      />
                    </div>
                  )}
                </div>

                {/* 2行目: 昼休み */}
                {!h.is_closed && (
                  <div className="mt-2 pl-10 flex flex-wrap items-center gap-1.5 text-[11px] text-stone-500">
                    <label className="flex items-center gap-1 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        className="w-3.5 h-3.5"
                        checked={hasBreak}
                        onChange={(e) => updateDay(d.key, {
                          break_start: e.target.checked ? '12:00' : undefined,
                          break_end: e.target.checked ? '13:00' : undefined,
                        })}
                      />
                      昼休み
                    </label>
                    {hasBreak && (
                      <>
                        <input
                          type="time"
                          value={h.break_start ?? '12:00'}
                          onChange={(e) => updateDay(d.key, { break_start: e.target.value })}
                          className="input !py-0.5 !px-1.5 !text-[11px] !w-[74px]"
                        />
                        <span className="text-stone-400">〜</span>
                        <input
                          type="time"
                          value={h.break_end ?? '13:00'}
                          onChange={(e) => updateDay(d.key, { break_end: e.target.value })}
                          className="input !py-0.5 !px-1.5 !text-[11px] !w-[74px]"
                        />
                      </>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 臨時休業日 */}
      <div className="space-y-2">
        <div className="text-xs font-semibold text-stone-700">臨時休業日</div>
        <div className="flex items-stretch gap-2">
          <input
            type="date"
            value={newHoliday}
            onChange={(e) => setNewHoliday(e.target.value)}
            className="input !py-1.5 !text-xs flex-1 min-w-0"
          />
          <button
            type="button"
            onClick={addHoliday}
            disabled={!newHoliday}
            className="btn-brand text-xs px-3 py-1.5 inline-flex items-center gap-1 flex-shrink-0 disabled:opacity-50"
          >
            <Plus className="w-3 h-3" />追加
          </button>
        </div>
        {holidays.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {holidays.map((d) => (
              <span key={d} className="inline-flex items-center gap-1 px-2 py-1 bg-stone-100 rounded-lg text-[11px] text-stone-700">
                {d}
                <button
                  type="button"
                  onClick={() => removeHoliday(d)}
                  aria-label={`${d} を削除`}
                  className="text-stone-400 hover:text-stone-700 p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* 予約枠の刻み・バッファ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">予約枠の刻み</label>
          <select
            value={slotInterval}
            onChange={(e) => setSlotInterval(Number(e.target.value))}
            className="input !py-2 !text-xs"
          >
            <option value={15}>15分刻み</option>
            <option value={30}>30分刻み</option>
            <option value={60}>60分刻み</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">バッファ時間</label>
          <select
            value={bufferMinutes}
            onChange={(e) => setBufferMinutes(Number(e.target.value))}
            className="input !py-2 !text-xs"
          >
            <option value={0}>なし</option>
            <option value={5}>5分</option>
            <option value={10}>10分</option>
            <option value={15}>15分</option>
            <option value={30}>30分</option>
          </select>
        </div>
      </div>
      <p className="text-[10px] text-stone-500 -mt-2">
        バッファ = 予約の前後に自動で確保する片付け／準備時間
      </p>

      <button
        type="submit"
        disabled={pending}
        className="w-full sm:w-auto btn-brand text-sm sm:text-xs px-4 py-3 sm:py-2"
      >
        {pending ? '保存中...' : '営業時間を保存'}
      </button>
    </form>
  );
}
