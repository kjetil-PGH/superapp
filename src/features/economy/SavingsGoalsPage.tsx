import { TopNav } from '@/components/layout/TopNav'
import { GoalCard } from '@/components/ui/GoalCard'
import { Button } from '@/components/ui/Button'
import { goals } from '@/data/goals-data'

export function SavingsGoalsPage() {
  return (
    <div className="flex flex-col min-h-full pb-32">
      <TopNav title="Sparemål" showBack />

      <div className="px-4 space-y-3 mt-2">
        {goals.map((g) => (
          <GoalCard key={g.id} {...g} />
        ))}
      </div>

      <div className="px-4 mt-6">
        <Button variant="secondary" onClick={() => alert('Legg til nytt sparemål')}>
          Legg til nytt mål
        </Button>
      </div>
    </div>
  )
}
