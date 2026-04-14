interface ToggleProps {
  checked: boolean
  onChange: (checked: boolean) => void
}

export function Toggle({ checked, onChange }: ToggleProps) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative w-[51px] h-[31px] rounded-full transition-colors flex-shrink-0 ${checked ? 'bg-accent' : 'bg-ink-4'}`}
    >
      <div
        className={`absolute top-[2px] w-[27px] h-[27px] rounded-full bg-white shadow-sm transition-[left] ${checked ? 'left-[22px]' : 'left-[2px]'}`}
      />
    </button>
  )
}
