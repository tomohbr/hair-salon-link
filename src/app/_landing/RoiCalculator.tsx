'use client';

import { useMemo, useState } from 'react';

export default function RoiCalculator() {
  const [hpbMonthly, setHpbMonthly] = useState(50000);
  const [newPerMonth, setNewPerMonth] = useState(12);
  const [avgTicket, setAvgTicket] = useState(8500);
  const [currentRepeat, setCurrentRepeat] = useState(20); // %
  const [afterRepeat, setAfterRepeat] = useState(45); // %

  const result = useMemo(() => {
    const yrNew = newPerMonth * 12;
    const beforeRepeatVisits = yrNew * (currentRepeat / 100) * 3; // avg 3 repeat visits / yr
    const afterRepeatVisits = yrNew * (afterRepeat / 100) * 3;
    const repeatGain = (afterRepeatVisits - beforeRepeatVisits) * avgTicket;
    const adSave = hpbMonthly * 0.5 * 12; // assume shift 50% of HPB ad budget
    const toolCost = 4980 * 12;
    const net = repeatGain + adSave - toolCost;
    return {
      repeatGain: Math.round(repeatGain),
      adSave: Math.round(adSave),
      toolCost,
      net: Math.round(net),
    };
  }, [hpbMonthly, newPerMonth, avgTicket, currentRepeat, afterRepeat]);

  const yen = (n: number) => '¥' + n.toLocaleString('ja-JP');

  return (
    <div className="grid md:grid-cols-2 gap-6 md:gap-8">
      <div className="bg-[#0c0a09] border border-[#2a2320] p-6 md:p-8 space-y-5">
        <Field label="HPB 月額広告費" value={hpbMonthly} onChange={setHpbMonthly} min={0} max={300000} step={5000} unit="円/月" />
        <Field label="月の新規客数 (HPB 経由)" value={newPerMonth} onChange={setNewPerMonth} min={0} max={80} step={1} unit="人/月" />
        <Field label="平均客単価" value={avgTicket} onChange={setAvgTicket} min={3000} max={30000} step={500} unit="円" />
        <Field label="現在の新規 → リピート率" value={currentRepeat} onChange={setCurrentRepeat} min={0} max={80} step={1} unit="%" />
        <Field label="導入後の想定リピート率" value={afterRepeat} onChange={setAfterRepeat} min={0} max={90} step={1} unit="%" />
      </div>

      <div className="bg-[#1c1715] border border-[#c9a96e]/50 p-6 md:p-8 flex flex-col justify-between">
        <div>
          <div className="text-[10px] tracking-[0.28em] uppercase text-[#c9a96e] mb-6">
            ANNUAL — 年間の残り方
          </div>

          <Row label="リピート売上の増分" value={yen(result.repeatGain)} accent />
          <Row label="HPB 広告費の削減 (50% 置換)" value={yen(result.adSave)} accent />
          <Row label="HairSalonLink 年額" value={'-' + yen(result.toolCost)} />

          <div className="mt-6 pt-6 border-t border-[#c9a96e]/30">
            <div className="text-[11px] tracking-[0.2em] uppercase text-[#8a7f6e] mb-2">
              年間ネット効果
            </div>
            <div className="display-serif text-[42px] md:text-[54px] leading-none text-[#ebe1cf]">
              {yen(result.net)}
            </div>
          </div>
        </div>

        <p className="mt-6 text-[10px] text-[#6b5f52] leading-[1.8]">
          ※ 試算値です。実際の効果は店舗の立地・顧客層・施策実行度により変動します。
          リピートは年 3 回来店の前提。HPB 広告費の置換率・平均来店回数は保守的に設定しています。
        </p>
      </div>
    </div>
  );
}

function Field({
  label, value, onChange, min, max, step, unit,
}: {
  label: string; value: number; onChange: (n: number) => void;
  min: number; max: number; step: number; unit: string;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-2">
        <label className="text-[12px] text-[#b5a98f]">{label}</label>
        <div className="text-[13px] text-[#ebe1cf] display-serif tabular-nums">
          {value.toLocaleString('ja-JP')}
          <span className="text-[10px] text-[#8a7f6e] ml-1">{unit}</span>
        </div>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-[#c9a96e]"
      />
    </div>
  );
}

function Row({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex items-baseline justify-between py-2.5 border-b border-[#3a302a]/50">
      <span className="text-[12px] text-[#b5a98f]">{label}</span>
      <span className={`text-[14px] display-serif tabular-nums ${accent ? 'text-[#c9a96e]' : 'text-[#8a7f6e]'}`}>
        {value}
      </span>
    </div>
  );
}
