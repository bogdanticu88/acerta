interface LogoProps {
  size?: number;
  variant?: 'full' | 'mark'; // full = mark + wordmark, mark = icon only
  theme?: 'dark' | 'light';  // dark bg or light bg
}

export function AcertaMark({ size = 48, theme = 'dark' }: { size?: number; theme?: 'dark' | 'light' }) {
  const shield  = '#991B1B';
  const letter  = '#FFFFFF';
  const rim     = theme === 'dark' ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.2)';

  return (
    <svg
      width={size}
      height={Math.round(size * 1.2)}
      viewBox="0 0 60 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Acerta"
    >
      {/* Shield body */}
      <path
        d="M30 3 L54 13 L54 38 C54 53 43 64 30 69 C17 64 6 53 6 38 L6 13 Z"
        fill={shield}
      />
      {/* Inner rim — subtle depth */}
      <path
        d="M30 9 L49 17.5 L49 38 C49 50 40 60 30 64 C20 60 11 50 11 38 L11 17.5 Z"
        fill="none"
        stroke={rim}
        strokeWidth="1.5"
      />
      {/* Stylised A — two diagonal strokes + crossbar */}
      <path
        d="M21 51 L30 24 L39 51"
        stroke={letter}
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M24.5 42 H35.5"
        stroke={letter}
        strokeWidth="3.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function AcertaWordmark({ theme = 'dark' }: { theme?: 'dark' | 'light' }) {
  const text  = theme === 'dark' ? '#FFFFFF' : '#0F172A';
  const accent = '#991B1B';
  return (
    <svg width="120" height="28" viewBox="0 0 120 28" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Acerta">
      <text
        x="0" y="22"
        fontFamily="system-ui, -apple-system, sans-serif"
        fontSize="22"
        fontWeight="900"
        letterSpacing="-0.5"
        fill={text}
      >
        Ac
      </text>
      <text
        x="30" y="22"
        fontFamily="system-ui, -apple-system, sans-serif"
        fontSize="22"
        fontWeight="900"
        letterSpacing="-0.5"
        fill={accent}
      >
        erta
      </text>
    </svg>
  );
}

export default function Logo({ size = 48, variant = 'full', theme = 'dark' }: LogoProps) {
  if (variant === 'mark') return <AcertaMark size={size} theme={theme} />;
  return (
    <div className="flex items-center gap-3">
      <AcertaMark size={size} theme={theme} />
      <AcertaWordmark theme={theme} />
    </div>
  );
}
