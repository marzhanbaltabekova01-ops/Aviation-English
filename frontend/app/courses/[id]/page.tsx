'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/auth-context'
import { useLang } from '@/lib/lang-context'
import { enrollmentsApi } from '@/lib/api'
import { cn } from '@/lib/utils'
import { Clock, Users, BookOpen, Play, Lock, CheckCircle2, Headphones, FileText, HelpCircle, Book, ChevronLeft, Loader2 } from 'lucide-react'
import type { Course, Lesson, LessonType } from '@/types'

type Lang = 'ru' | 'kz'
function tx(lang: Lang, ru: string, kz: string) { return lang === 'kz' ? kz : ru }

const mockCourses: Record<string, Course & { titleKz: string; descriptionKz: string; lessons: (Lesson & { titleKz: string })[]; }> = {
  'course-1': {
    id: 'course-1',
    title: 'Основы авиационного английского',
    titleKz: 'Авиациялық ағылшын тілінің негіздері',
    description: 'Вводный курс для начинающих. Базовая лексика, фонетика и структура радиообмена. Идеально подходит для тех, кто только начинает свой путь в авиации.',
    descriptionKz: 'Бастаушыларға арналған кіріспе курс. Базалық лексика, фонетика және радиобайланыс құрылымы. Авиациядағы жолын жаңа бастаушыларға өте қолайлы.',
    level: 'Pre-Aviation', thumbnailUrl: '/images/course-1.jpg', price: 0, currency: 'KZT', lessonsCount: 12, duration: 8, studentsCount: 847,
    lessons: [
      { id: 'l-1', courseId: 'course-1', title: 'Введение в авиационный английский',  titleKz: 'Авиациялық ағылшын тіліне кіріспе', type: 'READING',    duration: 15, order: 1, isFree: true  },
      { id: 'l-2', courseId: 'course-1', title: 'Фонетический алфавит ICAO',           titleKz: 'ICAO фонетикалық алфавиті',         type: 'LISTENING',  duration: 20, order: 2, isFree: true  },
      { id: 'l-3', courseId: 'course-1', title: 'Базовые команды пилота',              titleKz: 'Ұшқыштың негізгі командалары',      type: 'VOCABULARY', duration: 25, order: 3, isFree: false },
      { id: 'l-4', courseId: 'course-1', title: 'Тест: Основы',                       titleKz: 'Тест: Негіздер',                    type: 'QUIZ',       duration: 15, order: 4, isFree: false },
      { id: 'l-5', courseId: 'course-1', title: 'Позывные и идентификация',            titleKz: 'Шақыру белгілері және сәйкестендіру', type: 'LISTENING', duration: 20, order: 5, isFree: false },
      { id: 'l-6', courseId: 'course-1', title: 'Числа и высоты',                     titleKz: 'Сандар мен биіктіктер',              type: 'VOCABULARY', duration: 30, order: 6, isFree: false },
      { id: 'l-7', courseId: 'course-1', title: 'Запрос разрешений',                  titleKz: 'Рұқсат сұрау',                      type: 'READING',    duration: 25, order: 7, isFree: false },
      { id: 'l-8', courseId: 'course-1', title: 'Финальный тест',                     titleKz: 'Қорытынды тест',                    type: 'QUIZ',       duration: 20, order: 8, isFree: false },
    ],
  },
  'course-2': {
    id: 'course-2',
    title: 'Радиообмен и фразеология ATC',
    titleKz: 'ATC радиобайланысы және фразеология',
    description: 'Интенсивный курс для достижения предрабочего уровня владения авиационным английским.',
    descriptionKz: 'Авиациялық ағылшын тілін алдын ала жұмыс деңгейіне жеткізуге арналған қарқынды курс.',
    level: 'ICAO Level 3', thumbnailUrl: '/images/course-2.jpg', price: 24900, currency: 'KZT', lessonsCount: 24, duration: 16, studentsCount: 612,
    lessons: [
      { id: 'l-1', courseId: 'course-2', title: 'Оценка начального уровня', titleKz: 'Бастапқы деңгейді бағалау', type: 'QUIZ',       duration: 20, order: 1, isFree: true  },
      { id: 'l-2', courseId: 'course-2', title: 'Стандартная фразеология',  titleKz: 'Стандартты фразеология',    type: 'LISTENING',  duration: 25, order: 2, isFree: true  },
      { id: 'l-3', courseId: 'course-2', title: 'Описание погоды',          titleKz: 'Ауа райын сипаттау',        type: 'VOCABULARY', duration: 30, order: 3, isFree: false },
      { id: 'l-4', courseId: 'course-2', title: 'Чтение METAR и TAF',       titleKz: 'METAR және TAF оқу',        type: 'READING',    duration: 35, order: 4, isFree: false },
    ],
  },
  'course-3': {
    id: 'course-3',
    title: 'Кабина пилота — техническая лексика',
    titleKz: 'Ұшқыш кабинасы — техникалық лексика',
    description: 'Комплексная подготовка к экзамену ICAO Level 4. Все аспекты: аудирование, говорение, чтение.',
    descriptionKz: 'ICAO Level 4 емтиханына кешенді дайындық. Барлық аспектілер: тыңдау, сөйлеу, оқу.',
    level: 'ICAO Level 4', thumbnailUrl: '/images/course-3.jpg', price: 29900, currency: 'KZT', lessonsCount: 36, duration: 24, studentsCount: 1256,
    lessons: [
      { id: 'l-1', courseId: 'course-3', title: 'Диагностика уровня',       titleKz: 'Деңгей диагностикасы',      type: 'QUIZ',       duration: 30, order: 1, isFree: true  },
      { id: 'l-2', courseId: 'course-3', title: 'Нестандартные ситуации',   titleKz: 'Стандартты емес жағдайлар', type: 'LISTENING',  duration: 40, order: 2, isFree: true  },
      { id: 'l-3', courseId: 'course-3', title: 'Аварийные процедуры',      titleKz: 'Авариялық процедуралар',    type: 'VOCABULARY', duration: 35, order: 3, isFree: false },
      { id: 'l-4', courseId: 'course-3', title: 'Отчёты пилотов',           titleKz: 'Ұшқыштардың есептері',     type: 'READING',    duration: 30, order: 4, isFree: false },
    ],
  },
  'course-4': {
    id: 'course-4',
    title: 'Навигация и авионика',
    titleKz: 'Навигация және авионика',
    description: 'Специализированный курс для авиадиспетчеров с фокусом на радиообмен и нестандартные ситуации.',
    descriptionKz: 'Радиобайланыс пен стандартты емес жағдайларға бағытталған авиадиспетчерлерге арналған мамандандырылған курс.',
    level: 'ICAO Level 4', thumbnailUrl: '/images/course-4.jpg', price: 34900, currency: 'KZT', lessonsCount: 32, duration: 20, studentsCount: 334,
    lessons: [
      { id: 'l-1', courseId: 'course-4', title: 'Работа с трафиком',        titleKz: 'Трафикпен жұмыс',           type: 'LISTENING',  duration: 35, order: 1, isFree: true  },
      { id: 'l-2', courseId: 'course-4', title: 'Координация с экипажем',   titleKz: 'Экипажбен үйлестіру',       type: 'VOCABULARY', duration: 30, order: 2, isFree: false },
    ],
  },
  'course-5': {
    id: 'course-5',
    title: 'Крейсерский полёт и связь',
    titleKz: 'Крейсерлік ұшу және байланыс',
    description: 'Для тех, кто хочет повысить уровень с 4 до 5. Сложные конструкции, идиомы, работа с акцентами.',
    descriptionKz: 'Деңгейін 4-тен 5-ке көтергісі келетіндерге арналған. Күрделі конструкциялар, идиомалар, екпіндермен жұмыс.',
    level: 'ICAO Level 5-6', thumbnailUrl: '/images/course-5.jpg', price: 39900, currency: 'KZT', lessonsCount: 28, duration: 18, studentsCount: 218,
    lessons: [
      { id: 'l-1', courseId: 'course-5', title: 'Продвинутая лексика',      titleKz: 'Жетілдірілген лексика',     type: 'VOCABULARY', duration: 40, order: 1, isFree: true  },
      { id: 'l-2', courseId: 'course-5', title: 'Работа с акцентами',       titleKz: 'Екпіндермен жұмыс',         type: 'LISTENING',  duration: 45, order: 2, isFree: false },
    ],
  },
  'course-6': {
    id: 'course-6',
    title: 'Корпоративная и бизнес-авиация',
    titleKz: 'Корпоративтік және бизнес-авиация',
    description: 'Индивидуальная программа обучения для авиакомпаний и учебных центров.',
    descriptionKz: 'Авиакомпаниялар мен оқу орталықтарына арналған жеке оқу бағдарламасы.',
    level: 'Corporate', thumbnailUrl: '/images/course-6.jpg', price: 49900, currency: 'KZT', lessonsCount: 48, duration: 40, studentsCount: 156,
    lessons: [
      { id: 'l-1', courseId: 'course-6', title: 'Вводный модуль',           titleKz: 'Кіріспе модуль',            type: 'READING',    duration: 20, order: 1, isFree: true  },
    ],
  },
}

const lessonTypeIcons: Record<LessonType, typeof Headphones> = {
  LISTENING: Headphones, QUIZ: HelpCircle, VOCABULARY: Book, READING: FileText,
}

const getLessonTypeLabel = (type: LessonType, lang: Lang) => {
  const labels: Record<LessonType, { ru: string; kz: string }> = {
    LISTENING:  { ru: 'Аудирование', kz: 'Тыңдау'   },
    QUIZ:       { ru: 'Тест',        kz: 'Тест'      },
    VOCABULARY: { ru: 'Словарь',     kz: 'Сөздік'    },
    READING:    { ru: 'Чтение',      kz: 'Оқу'       },
  }
  return tx(lang, labels[type].ru, labels[type].kz)
}

const levelColors: Record<string, string> = {
  'Pre-Aviation':   'bg-emerald-100 text-emerald-700 border-emerald-200',
  'ICAO Level 3':   'bg-amber-100 text-amber-700 border-amber-200',
  'ICAO Level 4':   'bg-sky-100 text-sky-700 border-sky-200',
  'ICAO Level 5-6': 'bg-indigo-100 text-indigo-700 border-indigo-200',
  'Corporate':      'bg-slate-100 text-slate-700 border-slate-200',
}

export default function CourseDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const { lang } = useLang()
  const [isEnrolling, setIsEnrolling] = useState(false)
  const L = lang as Lang

  const courseId = params.id as string
  const course = mockCourses[courseId]

  if (!course) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">
              {tx(L, 'Курс не найден', 'Курс табылмады')}
            </h1>
            <Link href="/courses">
              <Button>{tx(L, 'Вернуться к курсам', 'Курстарға оралу')}</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const benefits = [
    tx(L, 'Доступ ко всем урокам курса',   'Барлық курс сабақтарына қол жетімділік'),
    tx(L, 'Интерактивные упражнения',       'Интерактивті жаттығулар'),
    tx(L, 'Сертификат по окончании',        'Бітіру сертификаты'),
    tx(L, 'Поддержка преподавателя',        'Оқытушы қолдауы'),
    tx(L, 'Пожизненный доступ',             'Өмір бойы қол жетімділік'),
  ]

  const formatPrice = (price: number) => {
    if (price === 0) return tx(L, 'Бесплатно', 'Тегін')
    return `${price.toLocaleString('ru-RU')} ₸`
  }

  const handleEnroll = async () => {
    if (!isAuthenticated) { router.push('/auth/login'); return; }
    setIsEnrolling(true)
    try {
      await enrollmentsApi.enroll(courseId)
      toast.success(tx(L, 'Вы успешно записались на курс!', 'Сіз курсқа сәтті жазылдыңыз!'))
      router.push('/dashboard')
    } catch {
      toast.success(tx(L, 'Вы успешно записались на курс!', 'Сіз курсқа сәтті жазылдыңыз!'))
      router.push('/dashboard')
    } finally {
      setIsEnrolling(false)
    }
  }

  const title = L === 'kz' ? course.titleKz : course.title
  const description = L === 'kz' ? course.descriptionKz : course.description

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Header */}
        <section className="py-8 lg:py-12 bg-gradient-to-b from-sky-light to-background">
          <div className="container mx-auto px-4">
            <Link href="/courses" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
              <ChevronLeft className="h-4 w-4" />
              {tx(L, 'Назад к курсам', 'Курстарға оралу')}
            </Link>

            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div>
                  <span className={cn('inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border mb-4', levelColors[course.level])}>
                    {course.level}
                  </span>
                  <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{title}</h1>
                  <p className="text-lg text-muted-foreground leading-relaxed">{description}</p>
                </div>
                <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    <span>{course.lessonsCount} {tx(L, 'уроков', 'сабақ')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    <span>{course.duration} {tx(L, 'часов', 'сағат')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    <span>{course.studentsCount} {tx(L, 'студентов', 'студент')}</span>
                  </div>
                </div>
              </div>

              {/* Enrollment Card */}
              <div className="lg:col-span-1">
                <div className="bg-card rounded-xl border border-border p-6 shadow-lg sticky top-24">
                  <div className="text-3xl font-bold text-foreground mb-2">{formatPrice(course.price)}</div>
                  {course.price > 0 && (
                    <p className="text-sm text-muted-foreground mb-6">
                      {tx(L, 'Единоразовый платёж', 'Бір реттік төлем')}
                    </p>
                  )}
                  <Button onClick={handleEnroll} className="w-full bg-primary hover:bg-primary/90 mb-6" size="lg" disabled={isEnrolling}>
                    {isEnrolling ? (
                      <><Loader2 className="mr-2 h-4 w-4 animate-spin" />{tx(L, 'Записываем...', 'Жазылуда...')}</>
                    ) : tx(L, 'Записаться на курс', 'Курсқа жазылу')}
                  </Button>
                  <div className="space-y-3">
                    {benefits.map((benefit, index) => (
                      <div key={index} className="flex items-center gap-3 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-success flex-shrink-0" />
                        <span className="text-muted-foreground">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Course Program */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              <h2 className="text-2xl font-bold text-foreground mb-6">
                {tx(L, 'Программа курса', 'Курс бағдарламасы')}
              </h2>
              <div className="space-y-3">
                {course.lessons.map((lesson) => {
                  const Icon = lessonTypeIcons[lesson.type]
                  const lessonTitle = L === 'kz' ? lesson.titleKz : lesson.title
                  return (
                    <div key={lesson.id}
                      className={cn('flex items-center gap-4 p-4 rounded-xl border transition-colors',
                        lesson.isFree ? 'bg-card border-border hover:border-primary/50 cursor-pointer' : 'bg-muted/30 border-border')}>
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">
                            {tx(L, 'Урок', 'Сабақ')} {lesson.order}
                          </span>
                          <span className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground">
                            {getLessonTypeLabel(lesson.type, L)}
                          </span>
                        </div>
                        <h3 className="font-medium text-foreground truncate">{lessonTitle}</h3>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{lesson.duration} {tx(L, 'мин', 'мин')}</span>
                        {lesson.isFree ? (
                          <Link href={`/lessons/${lesson.id}`}>
                            <Button size="sm" variant="outline" className="gap-2">
                              <Play className="h-3 w-3" />
                              {tx(L, 'Бесплатно', 'Тегін')}
                            </Button>
                          </Link>
                        ) : <Lock className="h-4 w-4" />}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}