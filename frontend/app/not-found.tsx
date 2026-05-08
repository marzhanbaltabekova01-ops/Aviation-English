import Link from 'next/link'

export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#F8F7F4',
      fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
      padding: '24px',
    }}>
      <div style={{ textAlign: 'center', maxWidth: 480 }}>

        <div style={{
          fontSize: 120, fontWeight: 800, color: '#0A1628',
          lineHeight: 1, letterSpacing: '-0.04em', marginBottom: 8,
        }}>404</div>

        <div style={{ fontSize: 48, marginBottom: 24 }}>✈️</div>

        <h1 style={{ fontSize: 26, fontWeight: 700, color: '#0A1628', margin: '0 0 12px' }}>
          Маршрут не найден
        </h1>

        <p style={{ fontSize: 15, color: '#6B6967', lineHeight: 1.6, margin: '0 0 32px' }}>
          Запрошенная страница не существует или была перемещена.
          Проверьте адрес или вернитесь на главную.
        </p>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 40 }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <button style={{ padding: '11px 24px', borderRadius: 10, fontSize: 14, fontWeight: 600, background: '#0A1628', color: '#fff', border: 'none', cursor: 'pointer' }}>
              🏠 На главную
            </button>
          </Link>
          <Link href="/courses" style={{ textDecoration: 'none' }}>
            <button style={{ padding: '11px 24px', borderRadius: 10, fontSize: 14, fontWeight: 600, background: 'transparent', color: '#0A1628', border: '1px solid #E8E6E1', cursor: 'pointer' }}>
              Курсы
            </button>
          </Link>
        </div>

        <div style={{ borderTop: '1px solid #E8E6E1', paddingTop: 24, display: 'flex', gap: 20, justifyContent: 'center', flexWrap: 'wrap' }}>
          {[
            { href: '/courses', label: 'Курсы' },
            { href: '/icao', label: 'Уровни ICAO' },
            { href: '/auth/login', label: 'Вход' },
          ].map(l => (
            <Link key={l.href} href={l.href} style={{ fontSize: 13, color: '#185FA5', textDecoration: 'none', fontWeight: 500 }}>
              {l.label}
            </Link>
          ))}
        </div>

      </div>
    </div>
  )
}
