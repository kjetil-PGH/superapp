import { createBrowserRouter } from 'react-router-dom'
import { AppLayout } from './layouts/AppLayout'
import { DashboardPage } from '@/features/dashboard/DashboardPage'
import { RecurringPage } from '@/features/recurring/RecurringPage'
import { ExpenseDetailPage } from '@/features/expenses/ExpenseDetailPage'
import { InsightsPage } from '@/features/insights/InsightsPage'
import { SettingsPage } from '@/features/settings/SettingsPage'
import { ConnectPage } from '@/features/connect/ConnectPage'
import { ConnectCallbackPage } from '@/features/connect/ConnectCallbackPage'
import { BudgetPage } from '@/features/budget/BudgetPage'
import { CategoryDetailPage } from '@/features/budget/CategoryDetailPage'
import { EconomyPage } from '@/features/economy/EconomyPage'
import { PropertyDetailPage } from '@/features/economy/PropertyDetailPage'
import { CarDetailPage } from '@/features/economy/CarDetailPage'
import { FormueDetailPage } from '@/features/economy/FormueDetailPage'
import { LoansPage } from '@/features/economy/LoansPage'
import { SamlelanPage } from '@/features/economy/SamlelanPage'
import { RefinansierPage } from '@/features/economy/RefinansierPage'
import { ForhandlePage } from '@/features/economy/ForhandlePage'
import { InsurancePage } from '@/features/economy/InsurancePage'
import { MobilPage } from '@/features/economy/MobilPage'
import { StromPage } from '@/features/economy/StromPage'
import { SavingsGoalsPage } from '@/features/economy/SavingsGoalsPage'
import { AskPage } from '@/features/ask/AskPage'

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'recurring', element: <RecurringPage /> },
      { path: 'recurring/:id', element: <ExpenseDetailPage /> },
      { path: 'insights', element: <InsightsPage /> },
      { path: 'settings', element: <SettingsPage /> },
      { path: 'connect', element: <ConnectPage /> },
      { path: 'budget', element: <BudgetPage /> },
      { path: 'budget/category/:id', element: <CategoryDetailPage /> },
      { path: 'economy', element: <EconomyPage /> },
      { path: 'economy/formue', element: <FormueDetailPage /> },
      { path: 'economy/eiendom', element: <PropertyDetailPage /> },
      { path: 'economy/bil', element: <CarDetailPage /> },
      { path: 'economy/lan', element: <LoansPage /> },
      { path: 'economy/lan/samlelan', element: <SamlelanPage /> },
      { path: 'economy/lan/refinansier', element: <RefinansierPage /> },
      { path: 'economy/lan/forhandle', element: <ForhandlePage /> },
      { path: 'economy/forsikring', element: <InsurancePage /> },
      { path: 'economy/mobil', element: <MobilPage /> },
      { path: 'economy/strom', element: <StromPage /> },
      { path: 'economy/sparemal', element: <SavingsGoalsPage /> },
      { path: 'ask', element: <AskPage /> },
    ],
  },
  { path: 'connect/callback', element: <ConnectCallbackPage /> },
])
