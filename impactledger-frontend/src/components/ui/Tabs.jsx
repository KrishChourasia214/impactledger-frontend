import { cn } from '@/utils/cn'
import { useState } from 'react'

export default function Tabs({ tabs, defaultTab = 0, onChange }) {
  const [active, setActive] = useState(defaultTab)

  const handleChange = (index) => {
    setActive(index)
    onChange?.(index)
  }

  return (
    <div>
      {/* Tab buttons */}
      <div className="flex bg-slate-100 rounded-xl p-1 gap-1">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => handleChange(index)}
            className={cn(
              'flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer',
              active === index
                ? 'bg-white text-primary shadow-sm'
                : 'text-text-muted hover:text-text-secondary'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="mt-6">
        {tabs[active]?.content}
      </div>
    </div>
  )
}