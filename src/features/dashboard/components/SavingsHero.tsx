import { formatNOK } from '@/lib/format'

interface SavingsHeroProps {
  totalMonthly: number
  totalYearly: number
  expenseCount: number
}

export function SavingsHero({ totalMonthly, totalYearly, expenseCount }: SavingsHeroProps) {
  return (
    <div className="mx-4 mb-4 bg-gradient-to-br from-accent-dark via-accent to-accent-mid rounded-[24px] p-6 pb-5 overflow-hidden shadow-lg shadow-accent/15">
      <div className="text-sm font-semibold text-white/50 uppercase tracking-widest mb-2">
        Faste utgifter oppdaget
      </div>
      <div className="text-3xl font-extrabold text-white tracking-tighter leading-none">
        {formatNOK(totalMonthly)}
      </div>
      <div className="text-base text-white/55 mt-1.5 mb-5">
        per måned · {formatNOK(totalYearly)} per år · {expenseCount} abonnementer
      </div>

      <div className="flex gap-4 border-t border-white/10 pt-4 -mx-6 px-6">
        <div className="flex-1 text-center">
          <div className="text-lg font-bold text-white">{expenseCount}</div>
          <div className="text-xs text-white/40 mt-0.5 font-medium">Gjenkjent</div>
        </div>
        <div className="flex-1 text-center border-l border-white/10">
          <div className="text-lg font-bold text-white">{formatNOK(totalMonthly)}</div>
          <div className="text-xs text-white/40 mt-0.5 font-medium">Per måned</div>
        </div>
        <div className="flex-1 text-center border-l border-white/10">
          <div className="text-lg font-bold text-white">{formatNOK(totalYearly)}</div>
          <div className="text-xs text-white/40 mt-0.5 font-medium">Per år</div>
        </div>
      </div>
    </div>
  )
}
