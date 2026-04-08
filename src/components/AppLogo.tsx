export default function AppLogo() {
  return (
    <div className="flex items-center gap-2">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 512 512"
        fill="none"
        stroke="currentColor"
        strokeWidth="30"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-blue-600 dark:text-blue-400"
      >
        {/* Cabeça do fisioterapeuta */}
        <circle cx="258" cy="82" r="48"/>
        {/* Corpo */}
        <path d="M212 130 C195 170 188 220 188 280 L188 340"/>
        <path d="M304 130 C318 165 318 220 318 280"/>
        <path d="M212 130 L304 130"/>
        {/* Braço/perna diagonal */}
        <line x1="220" y1="230" x2="390" y2="300"/>
        {/* Quadril */}
        <path d="M188 280 L318 280"/>
        {/* Suporte vertical */}
        <line x1="318" y1="280" x2="318" y2="340"/>
        {/* Mesa de tratamento */}
        <rect x="62" y="340" width="400" height="64" rx="32"/>
        {/* Cabeça do paciente deitado */}
        <circle cx="52" cy="372" r="38"/>
        {/* Pernas do fisioterapeuta */}
        <path d="M188 340 L188 372"/>
        <path d="M318 340 L318 372"/>
      </svg>
      <span className="font-bold text-blue-600 dark:text-blue-400">FisioTrack</span>
    </div>
  )
}
