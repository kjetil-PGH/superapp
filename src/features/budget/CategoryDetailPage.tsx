import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { TopNav } from "@/components/layout/TopNav";
import { Card, CardRow } from "@/components/ui/Card";
import { formatNOK } from "@/lib/format";
import {
  budgetMonthKeys,
  budgetMonthLabels,
  budgetData,
} from "@/data/budget-data";

export function CategoryDetailPage() {
  const { id } = useParams<{ id: string }>();
  const category = decodeURIComponent(id ?? "");

  const monthlySpend = useMemo(
    () => budgetMonthKeys.map((k) => budgetData[k].categories[category] ?? 0),
    [category],
  );

  const total = monthlySpend.reduce((a, b) => a + b, 0);
  const average = Math.round(total / 12);
  const maxSpend = Math.max(...monthlySpend, 1);
  const shortLabels = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];

  return (
    <div className="min-h-screen bg-surface-2 pb-28">
      <TopNav title={category} showBack />

      <Card className="mx-4 rounded-3! p-5 mb-5">
        <div
          className="flex items-end justify-between gap-1.5 mb-3"
          style={{ height: 140 }}
        >
          {monthlySpend.map((amount, i) => {
            const pct = (amount / maxSpend) * 100;
            return (
              <div
                key={budgetMonthKeys[i]}
                className="flex flex-col items-center flex-1"
              >
                <div
                  className="w-full flex items-end"
                  style={{ height: 120 }}
                >
                  <div
                    className={`w-full rounded-t-md transition-all duration-300 ${amount > 0 ? "bg-accent" : "bg-surface-3"}`}
                    style={{ height: amount > 0 ? `${Math.max(pct, 3)}%` : "3%" }}
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

      <Card className="mx-4 rounded-3! p-5 mb-5">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-xs font-bold text-ink-3 uppercase tracking-wider mb-1">
              Snitt/mnd
            </div>
            <div className="text-xl font-extrabold text-ink">
              {formatNOK(average)}
            </div>
          </div>
          <div>
            <div className="text-xs font-bold text-ink-3 uppercase tracking-wider mb-1">
              Totalt i år
            </div>
            <div className="text-xl font-extrabold text-ink">
              {formatNOK(total)}
            </div>
          </div>
        </div>
      </Card>

      <Card className="mx-4">
        {budgetMonthKeys.map((k, i) => {
          const amount = monthlySpend[i];
          return (
            <CardRow key={k}>
              <span className="text-[15px] font-medium text-ink">
                {budgetMonthLabels[k]}
              </span>
              <span
                className={`text-[15px] font-semibold tabular-nums ${amount > 0 ? "text-ink" : "text-ink-4"}`}
              >
                {formatNOK(amount)}
              </span>
            </CardRow>
          );
        })}
      </Card>
    </div>
  );
}
