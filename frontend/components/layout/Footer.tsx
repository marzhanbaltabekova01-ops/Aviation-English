'use client'

import Link from 'next/link'
import { Plane, Mail, Phone, MapPin } from 'lucide-react'

const footerLinks = {
  platform: [
    { href: '/courses', label: 'Курсы' },
    { href: '/icao', label: 'Уровни ICAO' },
    { href: '/auth/register', label: 'Регистрация' },
  ],
  company: [
    { href: '#', label: 'О нас' },
    { href: '#', label: 'Контакты' },
    { href: '#', label: 'Партнерство' },
  ],
  legal: [
    { href: '#', label: 'Условия использования' },
    { href: '#', label: 'Политика конфиденциальности' },
    { href: '#', label: 'Оферта' },
  ],
}

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 text-xl font-bold">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Plane className="h-5 w-5" />
              </div>
              <span>AviationEnglish.kz</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Профессиональная подготовка к экзамену ICAO для пилотов и авиадиспетчеров Казахстана.
            </p>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>info@aviationenglish.kz</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>+7 (777) 123-45-67</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>Алматы, Казахстан</span>
              </div>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Платформа</h4>
            <ul className="space-y-3">
              {footerLinks.platform.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Компания</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Правовая информация</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} AviationEnglish.kz. Все права защищены.
          </p>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <span className="inline-block w-2 h-2 rounded-full bg-success animate-pulse"></span>
              Онлайн поддержка
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
