import { createBrowserRouter } from 'react-router-dom'
import { AppLayout } from './layouts/AppLayout'
import { DashboardPage } from '@/features/dashboard/DashboardPage'
import { RecurringPage } from '@/features/recurring/RecurringPage'
import { ExpenseDetailPage } from '@/features/expenses/ExpenseDetailPage'
import { InsightsPage } from '@/features/insights/InsightsPage'
import { SettingsPage } from '@/features/settings/SettingsPage'
import { ConnectPage } from '@/features/connect/ConnectPage'
import { ConnectCallbackPage } from '@/features/connect/ConnectCallbackPage'

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
    ],
  },
  { path: 'connect/callback', element: <ConnectCallbackPage /> },
])
