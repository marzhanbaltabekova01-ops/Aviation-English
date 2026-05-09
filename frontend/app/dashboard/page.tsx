'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import { useLang } from '@/lib/lang-context'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { LayoutDashboard, BookOpen, Play, Flame, Award, Target, GraduationCap, Calendar, Clock, ChevronRight, Loader2 } from 'lucide-react'
import type { Enrollment, DashboardStats } from '@/types'
import XpLevelCard from '@/components/ui/XpLevelCard'

const mockStats: DashboardStats = { streakDays: 7, lessonsCompleted: 24, icaoProgress: 68, coursesCompleted: 2 }

const mockEnrollments = [
  {
    id: 'e-1', userId: 'u-1', courseId: 'course-1', progress: 100,
    startedAt: '2024-01-15T10:00:00Z', completedAt: '2024-02-01T14:30:00Z',
    course: {
      id: 'course-1',
      title: 'Основы авиационного английского',
      titleKz: 'Авиациялық ағылшын тілінің негіздері',
      description: 'Вводный курс', level: 'Pre-Aviation',
      thumbnailUrl: '/images/course-1.jpg', price: 0, currency: 'KZT', lessonsCount: 12, duration: 8, studentsCount: 847
    },
  },
  {
    id: 'e-2', userId: 'u-1', courseId: 'course-3', progress: 45,
    startedAt: '2024-02-05T09:00:00Z',
    course: {
      id: 'course-3',
      title: 'ICAO Level 4 для пилотов',
      titleKz: 'Ұшқыштарға арналған ICAO Level 4',
      description: 'Подготовка к ICAO Level 4', level: 'ICAO Level 4',
      thumbnailUrl: '/images/course-3.jpg', price: 120000, currency: 'KZT', lessonsCount: 36, duration: 24, studentsCount: 1256
    },
  },
]

const levelColors: Record<string, string> = {
  'Pre-Aviation':   'bg-emerald-100 text-emerald-700',
  'ICAO Level 3':   'bg-amber-100 text-amber-700',
  'ICAO Level 4':   'bg-sky-100 text-sky-700',
  'ICAO Level 5-6': 'bg-indigo-100 text-indigo-700',
  'Corporate':      'bg-slate-100 text-slate-700',
}

export default function DashboardPage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading } = useAuth()
  const { lang } = useLang()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.push('/auth/login')
  }, [isLoading, isAuthenticated, router])

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  )
  if (!isAuthenticated) return null

  const T = {
    welcome:        lang === 'kz' ? `Қош келдіңіз, ${user?.firstName}!`        : `Добро пожаловать, ${user?.firstName}!`,
    subtitle:       lang === 'kz' ? 'Оқуды жалғастырыңыз және ICAO деңгейіңізді жақсартыңыз' : 'Продолжайте обучение и улучшайте свой уровень ICAO',
    streakDays:     lang === 'kz' ? 'Күн қатарынан'  : 'Дней подряд',
    lessonsComp:    lang === 'kz' ? 'Сабақ аяқталды' : 'Уроков пройдено',
    icaoProgress:   lang === 'kz' ? 'ICAO үлгерімі'  : 'Прогресс ICAO',
    coursesComp:    lang === 'kz' ? 'Курс аяқталды'  : 'Курсов завершено',
    myCourses:      lang === 'kz' ? 'Менің курстарым': 'Мои курсы',
    allCourses:     lang === 'kz' ? 'Барлық курстар' : 'Все курсы',
    progress:       lang === 'kz' ? 'Үлгерім'        : 'Прогресс',
    completed:      lang === 'kz' ? 'Аяқталды'       : 'Завершён',
    repeat:         lang === 'kz' ? 'Қайталау'       : 'Повторить',
    continue:       lang === 'kz' ? 'Жалғастыру'     : 'Продолжить',
    noCourses:      lang === 'kz' ? 'Белсенді курстар жоқ'   : 'Нет активных курсов',
    noCoursesDesc:  lang === 'kz' ? 'Оқуды бастау үшін курсқа жазылыңыз' : 'Запишитесь на курс, чтобы начать обучение',
    chooseCourse:   lang === 'kz' ? 'Курс таңдау'    : 'Выбрать курс',
    events:         lang === 'kz' ? 'Жақындағы оқиғалар' : 'Ближайшие события',
    findCourse:     lang === 'kz' ? 'Жаңа курс табу' : 'Найти новый курс',
    icaoLevels:     lang === 'kz' ? 'ICAO деңгейлері': 'Уровни ICAO',
    dashboard:      lang === 'kz' ? 'Басқару тақтасы': 'Дашборд',
    continuelesson: lang === 'kz' ? 'Сабақты жалғастыру' : 'Продолжить урок',
  }

  const mockEvents = [
    { id: 1, title: lang === 'kz' ? 'Вебинар: Стандартты емес жағдайлар' : 'Вебинар: Нестандартные ситуации', date: lang === 'kz' ? '25 сәуір, 18:00' : '25 апреля, 18:00', type: 'webinar' },
    { id: 2, title: lang === 'kz' ? 'Мерзім: 5-сабақ'                    : 'Дедлайн: Урок 5',                  date: lang === 'kz' ? '27 сәуір'        : '27 апреля',       type: 'deadline' },
    { id: 3, title: lang === 'kz' ? 'Жаттығу: Радиобайланыс'             : 'Практика: Радиообмен',             date: lang === 'kz' ? '30 сәуір, 15:00' : '30 апреля, 15:00', type: 'practice' },
  ]

  const sidebarLinks = [
    { href: '/dashboard',       label: T.dashboard,      icon: LayoutDashboard },
    { href: '/dashboard#courses', label: T.myCourses,    icon: BookOpen },
    { href: '/lessons/l-2',     label: T.continuelesson, icon: Play },
  ]

  const statCards = [
    { key: 'streakDays',       label: T.streakDays,  icon: Flame,         color: 'text-orange-500', bgColor: 'bg-orange-100' },
    { key: 'lessonsCompleted', label: T.lessonsComp, icon: Award,         color: 'text-sky-500',    bgColor: 'bg-sky-100' },
    { key: 'icaoProgress',     label: T.icaoProgress,icon: Target,        color: 'text-emerald-500',bgColor: 'bg-emerald-100', suffix: '%' },
    { key: 'coursesCompleted', label: T.coursesComp, icon: GraduationCap, color: 'text-indigo-500', bgColor: 'bg-indigo-100' },
  ]

  const getInitials = (firstName?: string, lastName?: string) => {
    if (!firstName) return 'U'
    return `${firstName.charAt(0)}${lastName?.charAt(0) || ''}`.toUpperCase()
  }

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Navbar />
      <div className="flex-1 flex">
        <aside className="hidden lg:flex w-64 flex-col border-r border-border bg-card">
          <div className="p-6 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold text-lg">
                {getInitials(user?.firstName, user?.lastName)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-foreground truncate">{user?.firstName} {user?.lastName}</div>
                <div className="text-sm text-muted-foreground truncate">{user?.email}</div>
              </div>
            </div>
          </div>
          <nav className="flex-1 p-4">
            <div className="space-y-1">
              {sidebarLinks.map(link => (
                <Link key={link.href} href={link.href}
                  className={cn('flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                    link.href === '/dashboard' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-muted')}>
                  <link.icon className="h-5 w-5" />{link.label}
                </Link>
              ))}
            </div>
          </nav>
        </aside>

        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto p-6 lg:p-8 max-w-6xl">
            <div className="mb-8">
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">{T.welcome}</h1>
              <p className="text-muted-foreground mt-1">{T.subtitle}</p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {statCards.map(stat => {
                const value = mockStats[stat.key as keyof DashboardStats]
                return (
                  <div key={stat.key} className="bg-card rounded-xl border border-border p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={cn('flex h-10 w-10 items-center justify-center rounded-lg', stat.bgColor)}>
                        <stat.icon className={cn('h-5 w-5', stat.color)} />
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-foreground">{value}{(stat as any).suffix || ''}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                )
              })}
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2" id="courses">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-foreground">{T.myCourses}</h2>
                  <Link href="/courses" className="text-sm text-primary hover:text-primary/80 transition-colors">{T.allCourses}</Link>
                </div>
                <div className="space-y-4">
                  {mockEnrollments.map(enrollment => {
                    const courseTitle = lang === 'kz' && (enrollment.course as any).titleKz
                      ? (enrollment.course as any).titleKz
                      : enrollment.course?.title
                    return (
                      <div key={enrollment.id} className="bg-card rounded-xl border border-border p-5">
                        <div className="flex items-start gap-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                            <BookOpen className="h-6 w-6 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium', levelColors[enrollment.course?.level || ''] || 'bg-gray-100 text-gray-700')}>
                                {enrollment.course?.level}
                              </span>
                              {enrollment.progress === 100 && (
                                <span className="text-xs px-2 py-0.5 rounded-full bg-success/10 text-success font-medium">{T.completed}</span>
                              )}
                            </div>
                            <h3 className="font-semibold text-foreground truncate">{courseTitle}</h3>
                            <div className="mt-3">
                              <div className="flex items-center justify-between text-sm mb-1">
                                <span className="text-muted-foreground">{T.progress}</span>
                                <span className="font-medium text-foreground">{enrollment.progress}%</span>
                              </div>
                              <ProgressBar value={enrollment.progress} variant={enrollment.progress === 100 ? 'success' : 'default'} size="sm" />
                            </div>
                          </div>
                          <Link href={enrollment.progress === 100 ? `/courses/${enrollment.courseId}` : '/lessons/l-2'}>
                            <Button size="sm" variant={enrollment.progress === 100 ? 'outline' : 'default'} className="gap-2">
                              {enrollment.progress === 100 ? T.repeat : T.continue}
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-foreground mb-4">{T.events}</h2>
                <div className="bg-card rounded-xl border border-border divide-y divide-border">
                  {mockEvents.map(event => (
                    <div key={event.id} className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                          {event.type === 'webinar'  && <Calendar className="h-5 w-5 text-primary" />}
                          {event.type === 'deadline' && <Clock    className="h-5 w-5 text-destructive" />}
                          {event.type === 'practice' && <Play     className="h-5 w-5 text-success" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-foreground text-sm truncate">{event.title}</h4>
                          <p className="text-xs text-muted-foreground mt-1">{event.date}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 space-y-3">
                  <Link href="/courses" className="block">
                    <Button variant="outline" className="w-full justify-start gap-3">
                      <BookOpen className="h-4 w-4" />{T.findCourse}
                    </Button>
                  </Link>
                  <Link href="/icao" className="block">
                    <Button variant="outline" className="w-full justify-start gap-3">
                      <Target className="h-4 w-4" />{T.icaoLevels}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  )
}