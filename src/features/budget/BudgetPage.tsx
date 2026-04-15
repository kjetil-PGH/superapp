import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { TopNav } from "@/components/layout/TopNav";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { CategoryBar } from "@/components/ui/CategoryBar";
import { Card, CardRow } from "@/components/ui/Card";
import { formatNOK } from "@/lib/format";
import {
  budgetMonthKeys,
  budgetMonthLabels,
  budgetData,
  fixedExpenses,
} from "@/data/budget-data";
import type { BudgetMonthKey } from "@/data/budget-data";

type View = "month" | "year";

function categoryAverage(cat: string): number {
  const values = budgetMonthKeys.map((k) => budgetData[k].categories[cat] ?? 0);
  return values.reduce((a, b) => a + b, 0) / values.length;
}

export function BudgetPage() {
  const navigate = useNavigate();
  const [monthIdx, setMonthIdx] = useState(9);
  const [view, setView] = useState<View>("month");

  const key = budgetMonthKeys[monthIdx];
  const month = budgetData[key];
  const label = budgetMonthLabels[key];
  const igjen = month.inn - month.ut;

  const sortedCategories = useMemo(
    () =>
      Object.entries(month.categories)
        .filter(([, v]) => v > 0)
        .sort(([, a], [, b]) => b - a),
    [month],
  );

  const maxCategory = sortedCategories[0]?.[1] ?? 1;

  const yearTotals = useMemo(() => {
    let inn = 0;
    let ut = 0;
    for (const k of budgetMonthKeys) {
      inn += budgetData[k].inn;
      ut += budgetData[k].ut;
    }
    return { inn, ut, igjen: inn - ut };
  }, []);

  const maxUt = useMemo(
    () => Math.max(...budgetMonthKeys.map((k) => budgetData[k].ut)),
    [],
  );

  return (
    <div className="min-h-screen bg-surface-2 pb-28">
      <TopNav title="Budsjett" />

      <div className="flex items-center justify-between mx-4 mb-4">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setMonthIdx((i) => Math.max(0, i - 1))}
            disabled={monthIdx === 0}
            className="w-9 h-9 rounded-full flex items-center justify-center text-ink-2 disabled:opacity-30 active:bg-surface-3 transition-colors text-lg font-semibold"
          >
            ‹
          </button>
          <span className="text-base font-bold text-ink min-w-[150px] text-center">
            {label}
          </span>
          <button
            onClick={() => setMonthIdx((i) => Math.min(11, i + 1))}
            disabled={monthIdx === 11}
            className="w-9 h-9 rounded-full flex items-center justify-center text-ink-2 disabled:opacity-30 active:bg-surface-3 transition-colors text-lg font-semibold"
          >
            ›
          </button>
        </div>

        <div className="flex bg-surface-3 rounded-full p-0.5">
          {(["month", "year"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-3.5 py-1 rounded-full text-xs font-bold transition-all ${
                view === v
                  ? "bg-surface text-ink shadow-sm"
                  : "text-ink-3"
              }`}
            >
              {v === "month" ? "Måned" : "År"}
            </button>
          ))}
        </div>
      </div>

      {view === "month" ? (
        <MonthView
          month={month}
          igjen={igjen}
          sortedCategories={sortedCategories}
          maxCategory={maxCategory}
          navigate={navigate}
        />
      ) : (
        <YearView yearTotals={yearTotals} maxUt={maxUt} />
      )}
    </div>
  );
}

function MonthView({
  month,
  igjen,
  sortedCategories,
  maxCategory,
  navigate,
}: {
  month: { inn: number; ut: number; categories: Record<string, number> };
  igjen: number;
  sortedCategories: [string, number][];
  maxCategory: number;
  navigate: ReturnType<typeof useNavigate>;
}) {
  return (
    <>
      <Card className="mx-4 rounded-3! p-5 mb-5">
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <div className="text-xs font-bold text-ink-3 uppercase tracking-wider mb-1">
              Inn
            </div>
            <div className="text-lg font-extrabold text-ok">
              {formatNOK(month.inn)}
            </div>
          </div>
          <div>
            <div className="text-xs font-bold text-ink-3 uppercase tracking-wider mb-1">
              Ut
            </div>
            <div className="text-lg font-extrabold text-ink">
              {formatNOK(month.ut)}
            </div>
          </div>
          <div>
            <div className="text-xs font-bold text-ink-3 uppercase tracking-wider mb-1">
              Igjen
            </div>
            <div
              className={`text-lg font-extrabold ${igjen >= 0 ? "text-accent" : "text-err"}`}
            >
              {formatNOK(igjen)}
            </div>
          </div>
        </div>
      </Card>

      <SectionHeader title="Faste utgifter" />
      <Card className="mx-4 mb-5">
        {fixedExpenses.map((exp) => (
          <CardRow key={exp.name} onClick={() => navigate(exp.dest)}>
            <span className="text-[15px] font-medium text-ink">
              {exp.name}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-[15px] font-semibold text-ink tabular-nums">
                {formatNOK(exp.amount)}
              </span>
              <span className="text-ink-4 text-base">›</span>
            </div>
          </CardRow>
        ))}
      </Card>

      <SectionHeader title="Variable utgifter" />
      <Card className="mx-4">
        {sortedCategories.map(([cat, amount]) => (
          <CardRow
            key={cat}
            onClick={() =>
              navigate(`/budget/category/${encodeURIComponent(cat)}`)
            }
            className="py-3.5!"
          >
            <div className="flex-1 min-w-0 mr-4">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[15px] font-medium text-ink truncate">
                  {cat}
                </span>
                <span className="text-[15px] font-semibold text-ink tabular-nums ml-2 shrink-0">
                  {formatNOK(amount)}
                </span>
              </div>
              <CategoryBar
                value={amount}
                max={maxCategory}
                normal={categoryAverage(cat)}
              />
            </div>
            <span className="text-ink-4 text-base ml-2">›</span>
          </CardRow>
        ))}
      </Card>
    </>
  );
}

function YearView({
  yearTotals,
  maxUt,
}: {
  yearTotals: { inn: number; ut: number; igjen: number };
  maxUt: number;
}) {
  const shortLabels = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];

  return (
    <>
      <Card className="mx-4 rounded-3! p-5 mb-5">
        <div className="flex items-end justify-between gap-1.5 mb-3" style={{ height: 140 }}>
          {budgetMonthKeys.map((k, i) => {
            const pct = (budgetData[k].ut / maxUt) * 100;
            return (
              <div key={k} className="flex flex-col items-center flex-1">
                <div className="w-full flex items-end" style={{ height: 120 }}>
                  <div
                    className="w-full rounded-t-md bg-accent transition-all duration-300"
                    style={{ height: `${pct}%` }}
                  />
                </div>
                <span className="text-[10px] font-bold text-ink-3 mt-1.5">
                  {shortLabels[i]}
                </span>
              </div>
            );
          })}
        </div>
      </Card>

      <Card className="mx-4 rounded-3! p-5">
        <div className="text-xs font-bold text-ink-3 uppercase tracking-wider mb-3">
          Hele året
        </div>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <div className="text-xs font-bold text-ink-3 uppercase tracking-wider mb-1">
              Inn
            </div>
            <div className="text-lg font-extrabold text-ok">
              {formatNOK(yearTotals.inn)}
            </div>
          </div>
          <div>
            <div className="text-xs font-bold text-ink-3 uppercase tracking-wider mb-1">
              Ut
            </div>
            <div className="text-lg font-extrabold text-ink">
              {formatNOK(yearTotals.ut)}
            </div>
          </div>
          <div>
            <div className="text-xs font-bold text-ink-3 uppercase tracking-wider mb-1">
              Igjen
            </div>
            <div
              className={`text-lg font-extrabold ${yearTotals.igjen >= 0 ? "text-accent" : "text-err"}`}
            >
              {formatNOK(yearTotals.igjen)}
            </div>
          </div>
        </div>
      </Card>
    </>
  );
}
