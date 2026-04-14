import { useNavigate, useLocation } from 'react-router-dom'

interface TopNavProps {
  title: string
  showBack?: boolean
  backLabel?: string
  right?: React.ReactNode
}

export function TopNav({ title, showBack = false, backLabel = 'Tilbake', right }: TopNavProps) {
  const navigate = useNavigate()
  const location = useLocation()

  const handleBack = () => {
    if (location.key !== 'default') {
      navigate(-1)
    } else {
      navigate('/')
    }
  }

  return (
    <div className="flex items-center justify-between px-5 py-3 flex-shrink-0">
      <div className="w-[70px]">
        {showBack && (
          <button onClick={handleBack} className="text-base font-semibold text-accent">
            ‹ {backLabel}
          </button>
        )}
      </div>
      <div className="text-lg font-bold text-ink text-center">{title}</div>
      <div className="w-[70px] flex justify-end">{right}</div>
    </div>
  )
}
