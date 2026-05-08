'use client'
// components/layout/Navbar.tsx

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { useLang } from '@/lib/lang-context'
import { LangSwitcher } from '@/components/ui/LangSwitcher'
import { cn } from '@/lib/utils'

export function Navbar() {
  const pathname = usePathname()
  const router   = useRouter()
  const { user, logout } = useAuth()
  const { t } = useLang()

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: '#0A1628',
      borderBottom: '1px solid rgba(255,255,255,0.08)',
      height: 60,
      display: 'flex', alignItems: 'center',
    }}>
      <div style={{
        maxWidth: 1120, margin: '0 auto', padding: '0 24px',
        display: 'flex', alignItems: 'center', width: '100%', gap: 32,
      }}>
        {/* Brand */}
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 9, flexShrink: 0 }}>
          <div style={{
            width: 30, height: 30, background: '#C5A84B', borderRadius: 7,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 15, flexShrink: 0,
          }}>✈</div>
          <span style={{ fontSize: 15, fontWeight: 700, color: '#fff', letterSpacing: '-0.01em' }}>
            AviationEnglish<span style={{ color: '#C5A84B' }}>.kz</span>
          </span>
        </Link>

        {/* Nav links */}
        <div style={{ display: 'flex', gap: 4, flex: 1 }}>
          {[
            { href: '/',        label: t('nav', 'home')    },
            { href: '/courses', label: t('nav', 'courses') },
            { href: '/icao',    label: t('nav', 'icao')    },
            ...(user ? [{ href: '/dashboard', label: t('nav', 'dashboard') }] : []),
            ...(user?.role === 'ADMIN' ? [{ href: '/admin', label: t('nav', 'admin') }] : []),
          ].map(link => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                padding: '6px 12px', borderRadius: 7, fontSize: 13, fontWeight: 500,
                textDecoration: 'none', transition: 'all .15s',
                color: isActive(link.href) ? '#fff' : 'rgba(255,255,255,0.55)',
                background: isActive(link.href) ? 'rgba(255,255,255,0.1)' : 'transparent',
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          {/* Language switcher */}
          <LangSwitcher />

          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                width: 34, height: 34, borderRadius: '50%',
                background: '#185FA5', border: '2px solid rgba(255,255,255,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer',
              }}>
                {user.firstName?.[0]}{user.lastName?.[0]}
              </div>
              <button
                onClick={handleLogout}
                style={{
                  padding: '6px 14px', borderRadius: 7, fontSize: 13, fontWeight: 500,
                  background: 'transparent', color: 'rgba(255,255,255,0.55)',
                  border: '1px solid rgba(255,255,255,0.12)', cursor: 'pointer',
                }}
              >
                {t('nav', 'logout')}
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: 6 }}>
              <Link href="/auth/login" style={{ textDecoration: 'none' }}>
                <button style={{
                  padding: '7px 14px', borderRadius: 7, fontSize: 13, fontWeight: 500,
                  background: 'transparent', color: 'rgba(255,255,255,0.7)',
                  border: '1px solid rgba(255,255,255,0.15)', cursor: 'pointer',
                }}>
                  {t('nav', 'login')}
                </button>
              </Link>
              <Link href="/auth/register" style={{ textDecoration: 'none' }}>
                <button style={{
                  padding: '7px 16px', borderRadius: 7, fontSize: 13, fontWeight: 600,
                  background: '#C5A84B', color: '#0A1628', border: 'none', cursor: 'pointer',
                }}>
                  {t('nav', 'register')}
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
