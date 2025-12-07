import React from 'react'

interface PresetSelectorProps {
  onSelect: (url: string) => void
}

export const PresetSelector: React.FC<PresetSelectorProps> = ({ onSelect }) => {
  const presets = [
    { name: 'JSONPlaceholder Posts', url: 'https://jsonplaceholder.typicode.com/posts' },
    { name: 'JSONPlaceholder Users', url: 'https://jsonplaceholder.typicode.com/users' },
    { name: 'Пример API', url: 'https://api.example.com/data' },
  ]

  return (
    <div>
      <h4>API Пресеты</h4>
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {presets.map(preset => (
          <button
            key={preset.url}
            onClick={() => onSelect(preset.url)}
            style={{
              padding: '8px 12px',
              background: '#f0f0f0',
              border: '1px solid #ddd',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            {preset.name}
          </button>
        ))}
      </div>
    </div>
  )
}
