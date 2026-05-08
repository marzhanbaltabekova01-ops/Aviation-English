'use client'

import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { useLang } from '@/lib/lang-context'
import { cn } from '@/lib/utils'
import { AlertCircle, CheckCircle2, Info } from 'lucide-react'

const icaoLevelsRu = [
  { level: 1, name: 'Pre-Elementary',  pronunciation: 'Произношение затрудняет понимание',       structure: 'Минимальное владение грамматикой',         vocabulary: 'Очень ограниченный словарный запас', fluency: 'Речь прерывистая, паузы частые',          comprehension: 'Понимает только отдельные слова', validityPeriod: 'Не допускается' },
  { level: 2, name: 'Elementary',       pronunciation: 'Сильный акцент мешает пониманию',         structure: 'Базовые структуры с ошибками',             vocabulary: 'Базовый словарный запас',            fluency: 'Длинные паузы, неуверенность',            comprehension: 'Понимает простые фразы',           validityPeriod: 'Не допускается' },
  { level: 3, name: 'Pre-Operational', pronunciation: 'Акцент иногда мешает пониманию',           structure: 'Базовые структуры с редкими ошибками',     vocabulary: 'Достаточный для рутинных ситуаций',  fluency: 'Речь с паузами при поиске выражений',    comprehension: 'Понимает простые рабочие диалоги', validityPeriod: 'Не допускается' },
  { level: 4, name: 'Operational',      pronunciation: 'Акцент не мешает пониманию',              structure: 'Базовые и сложные структуры, редкие ошибки',vocabulary: 'Достаточный для нестандартных ситуаций',fluency: 'Речь беглая, естественные паузы',        comprehension: 'Понимает диалекты и акценты',     validityPeriod: '3 года' },
  { level: 5, name: 'Extended',         pronunciation: 'Минимальный акцент, чёткая речь',         structure: 'Сложные конструкции без затруднений',      vocabulary: 'Широкий и точный словарный запас',   fluency: 'Свободная и естественная речь',           comprehension: 'Полное понимание в любых условиях',validityPeriod: '6 лет' },
  { level: 6, name: 'Expert',           pronunciation: 'Владение на уровне носителя',             structure: 'Безупречная грамматика',                   vocabulary: 'Богатый словарный запас, идиомы',    fluency: 'Речь носителя языка',                    comprehension: 'Абсолютное понимание',             validityPeriod: 'Бессрочно' },
]

const icaoLevelsKz = [
  { level: 1, name: 'Pre-Elementary',  pronunciation: 'Айтылым түсінуге кедергі келтіреді',        structure: 'Грамматиканы ең аз меңгеру',               vocabulary: 'Өте шектеулі сөздік қор',             fluency: 'Сөйлеу үзік-үзік, үзілістер жиі',        comprehension: 'Тек жекелеген сөздерді түсінеді',  validityPeriod: 'Жол берілмейді' },
  { level: 2, name: 'Elementary',       pronunciation: 'Күшті екпін түсінуге кедергі',              structure: 'Қателермен базалық құрылымдар',            vocabulary: 'Базалық сөздік қор',                  fluency: 'Ұзақ үзілістер, сенімсіздік',             comprehension: 'Қарапайым фразаларды түсінеді',    validityPeriod: 'Жол берілмейді' },
  { level: 3, name: 'Pre-Operational', pronunciation: 'Екпін кейде түсінуге кедергі',              structure: 'Сирек қателермен базалық құрылымдар',      vocabulary: 'Күнделікті жағдайларға жеткілікті',  fluency: 'Сөз іздегенде үзіліспен сөйлеу',         comprehension: 'Қарапайым жұмыс диалогтарын түсінеді', validityPeriod: 'Жол берілмейді' },
  { level: 4, name: 'Operational',      pronunciation: 'Екпін түсінуге кедергі келтірмейді',        structure: 'Базалық және күрделі құрылымдар, сирек қате', vocabulary: 'Стандартты емес жағдайларға жеткілікті', fluency: 'Сөйлеу шапшаң, табиғи үзілістер',     comprehension: 'Диалектілер мен екпіндерді түсінеді', validityPeriod: '3 жыл' },
  { level: 5, name: 'Extended',         pronunciation: 'Ең аз екпін, анық сөйлеу',                structure: 'Қиындықсыз күрделі конструкциялар',        vocabulary: 'Кең және дәл сөздік қор',             fluency: 'Еркін және табиғи сөйлеу',                comprehension: 'Кез келген жағдайда толық түсіну', validityPeriod: '6 жыл' },
  { level: 6, name: 'Expert',           pronunciation: 'Ана тілі деңгейіндегі меңгеру',            structure: 'Мінсіз грамматика',                        vocabulary: 'Бай сөздік қор, идиомалар',           fluency: 'Ана тілінде сөйлеу',                      comprehension: 'Абсолютті түсіну',                validityPeriod: 'Мерзімсіз' },
]

const levelColors: Record<number, { bg: string; text: string }> = {
  1: { bg: 'bg-red-100',     text: 'text-red-700'     },
  2: { bg: 'bg-orange-100',  text: 'text-orange-700'  },
  3: { bg: 'bg-amber-100',   text: 'text-amber-700'   },
  4: { bg: 'bg-sky-100',     text: 'text-sky-700'     },
  5: { bg: 'bg-emerald-100', text: 'text-emerald-700' },
  6: { bg: 'bg-indigo-100',  text: 'text-indigo-700'  },
}

export default function ICAOPage() {
  const { lang } = useLang()
  const icaoLevels = lang === 'kz' ? icaoLevelsKz : icaoLevelsRu

  const T = {
    title:       lang === 'kz' ? 'ICAO деңгейлерінің шкаласы'          : 'Шкала уровней ICAO',
    titleSpan:   lang === 'kz' ? 'ICAO'                                  : 'ICAO',
    subtitle:    lang === 'kz' ? 'Халықаралық азаматтық авиация ұйымы (ICAO) авиациялық ағылшын тілін меңгерудің 6 деңгейін белгіледі' : 'Международная организация гражданской авиации (ICAO) установила 6 уровней владения авиационным английским языком',
    infoTitle:   lang === 'kz' ? 'ICAO-ның ең төменгі талаптары'        : 'Минимальные требования ICAO',
    infoText:    lang === 'kz' ? 'ICAO талаптарына сәйкес халықаралық рейстер орындайтын ұшқыштар мен авиадиспетчерлер ағылшын тілін 4 (Operational) деңгейінен төмен емес деңгейде меңгеруі керек. 1-3 деңгейлер халықаралық рейстерге жол берілмейді.' : 'Согласно требованиям ICAO, пилоты и авиадиспетчеры, выполняющие международные полёты, должны владеть английским языком на уровне не ниже 4 (Operational). Уровни 1-3 не допускаются для выполнения международных рейсов.',
    colLevel:    lang === 'kz' ? 'Деңгей'             : 'Уровень',
    colName:     lang === 'kz' ? 'Атауы'              : 'Название',
    colPronun:   lang === 'kz' ? 'Айтылым'            : 'Произношение',
    colStruct:   lang === 'kz' ? 'Құрылым'            : 'Структура',
    colVocab:    lang === 'kz' ? 'Сөздік қор'         : 'Словарный запас',
    colFluency:  lang === 'kz' ? 'Шапшаңдық'          : 'Беглость',
    colCompr:    lang === 'kz' ? 'Түсіну'             : 'Понимание',
    colValidity: lang === 'kz' ? 'Жарамдылық мерзімі' : 'Срок действия',
    minimum:     lang === 'kz' ? 'Минимум'            : 'Минимум',
    minLevel:    lang === 'kz' ? 'Ең төменгі деңгей'  : 'Минимальный уровень',
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="py-12 lg:py-16 bg-gradient-to-b from-sky-light to-background">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
                {lang === 'kz' ? 'ICAO деңгейлерінің ' : 'Шкала уровней '}
                <span className="gradient-text">{T.titleSpan}</span>
              </h1>
              <p className="text-lg text-muted-foreground">{T.subtitle}</p>
            </div>
          </div>
        </section>

        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-start gap-4 p-6 rounded-xl bg-primary/5 border border-primary/20">
                <Info className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-foreground mb-1">{T.infoTitle}</h3>
                  <p className="text-muted-foreground" dangerouslySetInnerHTML={{ __html: T.infoText.replace('4 (Operational)', '<strong>4 (Operational)</strong>') }} />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-8 pb-20">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-muted/50">
                    {[T.colLevel, T.colName, T.colPronun, T.colStruct, T.colVocab, T.colFluency, T.colCompr, T.colValidity].map((col, i) => (
                      <th key={i} className={cn('p-4 text-left font-semibold text-foreground border border-border',
                        i >= 2 && i <= 3 ? 'hidden md:table-cell' : '',
                        i >= 4 && i <= 6 ? 'hidden lg:table-cell' : ''
                      )}>{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {icaoLevels.map(level => {
                    const colors = levelColors[level.level]
                    const isOperational = level.level === 4
                    const isAllowed = level.level >= 4
                    return (
                      <tr key={level.level} className={cn('transition-colors hover:bg-muted/30', isOperational && 'bg-primary/5 ring-2 ring-primary ring-inset')}>
                        <td className="p-4 border border-border">
                          <div className="flex items-center gap-3">
                            <div className={cn('flex h-10 w-10 items-center justify-center rounded-full font-bold text-lg', colors.bg, colors.text)}>{level.level}</div>
                            {isOperational && <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary text-primary-foreground">{T.minimum}</span>}
                          </div>
                        </td>
                        <td className="p-4 border border-border">
                          <div className="font-medium text-foreground">{level.name}</div>
                          <div className="text-sm text-muted-foreground md:hidden mt-1">{level.pronunciation}</div>
                        </td>
                        <td className="p-4 border border-border text-sm text-muted-foreground hidden md:table-cell">{level.pronunciation}</td>
                        <td className="p-4 border border-border text-sm text-muted-foreground hidden lg:table-cell">{level.structure}</td>
                        <td className="p-4 border border-border text-sm text-muted-foreground hidden md:table-cell">{level.vocabulary}</td>
                        <td className="p-4 border border-border text-sm text-muted-foreground hidden lg:table-cell">{level.fluency}</td>
                        <td className="p-4 border border-border text-sm text-muted-foreground hidden lg:table-cell">{level.comprehension}</td>
                        <td className="p-4 border border-border">
                          <div className="flex items-center gap-2">
                            {isAllowed ? <CheckCircle2 className="h-4 w-4 text-success flex-shrink-0" /> : <AlertCircle className="h-4 w-4 text-destructive flex-shrink-0" />}
                            <span className={cn('text-sm font-medium', isAllowed ? 'text-success' : 'text-destructive')}>{level.validityPeriod}</span>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="py-8 lg:hidden">
          <div className="container mx-auto px-4">
            <div className="space-y-4">
              {icaoLevels.map(level => {
                const colors = levelColors[level.level]
                const isOperational = level.level === 4
                const isAllowed = level.level >= 4
                return (
                  <div key={level.level} className={cn('p-5 rounded-xl border bg-card', isOperational ? 'border-primary ring-2 ring-primary/20' : 'border-border')}>
                    <div className="flex items-center gap-3 mb-4">
                      <div className={cn('flex h-12 w-12 items-center justify-center rounded-full font-bold text-xl', colors.bg, colors.text)}>{level.level}</div>
                      <div>
                        <div className="font-semibold text-foreground">{level.name}</div>
                        {isOperational && <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary text-primary-foreground mt-1">{T.minLevel}</span>}
                      </div>
                    </div>
                    <div className="space-y-3 text-sm">
                      {[
                        [T.colPronun,  level.pronunciation],
                        [T.colStruct,  level.structure],
                        [T.colVocab,   level.vocabulary],
                        [T.colFluency, level.fluency],
                        [T.colCompr,   level.comprehension],
                      ].map(([label, value]) => (
                        <div key={label as string}>
                          <span className="text-muted-foreground">{label}: </span>
                          <span className="text-foreground">{value}</span>
                        </div>
                      ))}
                      <div className="flex items-center gap-2 pt-2 border-t border-border">
                        {isAllowed ? <CheckCircle2 className="h-4 w-4 text-success" /> : <AlertCircle className="h-4 w-4 text-destructive" />}
                        <span className={cn('font-medium', isAllowed ? 'text-success' : 'text-destructive')}>
                          {T.colValidity}: {level.validityPeriod}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}