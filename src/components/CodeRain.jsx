import { useMemo } from 'react'

const keywords = ['struct', 'void', 'int*', 'delete[]', 'nullptr']

function CodeRain({ opacity = 0.1 }) {
  const columns = useMemo(
    () =>
      Array.from({ length: 14 }).map((_, idx) => ({
        id: idx,
        left: (idx / 14) * 100,
        duration: 15 + Math.random() * 10,
        delay: Math.random() * -10,
      })),
    [],
  )

  return (
    <div
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      style={{ opacity }}
      aria-hidden
    >
      <style>
        {`
          @keyframes code-rain-fall {
            0% { transform: translateY(-110%); }
            100% { transform: translateY(110%); }
          }
          .code-rain__column {
            position: absolute;
            top: -40%;
            display: flex;
            flex-direction: column;
            gap: 12px;
            color: rgba(64,64,64,0.1);
            text-shadow: 0 0 10px rgba(64,64,64,0.12);
            font-size: 12px;
            letter-spacing: 0.08em;
            animation-name: code-rain-fall;
            animation-timing-function: linear;
            animation-iteration-count: infinite;
          }
          .code-rain__keyword {
            color: rgba(64,64,64,0.25);
            mix-blend-mode: screen;
          }
        `}
      </style>
      {columns.map((col) => (
        <div
          key={col.id}
          className="code-rain__column"
          style={{
            left: `${col.left}%`,
            animationDuration: `${col.duration}s`,
            animationDelay: `${col.delay}s`,
          }}
        >
          {keywords.map((word, i) => (
            <span key={`${col.id}-${word}-${i}`} className="code-rain__keyword">
              {word}
            </span>
          ))}
        </div>
      ))}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-b from-transparent to-neutral-950" />
    </div>
  )
}

export default CodeRain

