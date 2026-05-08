'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type Language = 'ru' | 'kz'

const LangContext = createContext<{
  lang: Language
  setLang: (l: Language) => void
  t: (section: string, key: string) => string
}>({
  lang: 'ru',
  setLang: () => {},
  t: (_s, k) => k,
})

const translations: Record<string, Record<string, Record<Language, string>>> = {
  nav: {
    home:      { ru: 'Главная',        kz: 'Басты бет'           },
    courses:   { ru: 'Курсы',          kz: 'Курстар'             },
    icao:      { ru: 'Уровни ICAO',    kz: 'ICAO деңгейлері'     },
    dashboard: { ru: 'Дашборд',        kz: 'Басқару тақтасы'     },
    login:     { ru: 'Войти',          kz: 'Кіру'                },
    register:  { ru: 'Регистрация',    kz: 'Тіркелу'             },
    logout:    { ru: 'Выйти',          kz: 'Шығу'                },
    admin:     { ru: 'Админ',          kz: 'Әкімші'              },
  },
  home: {
    badge:          { ru: 'Стандарты ICAO · Казахстан',   kz: 'ICAO стандарттары · Қазақстан'      },
    heroTitle1:     { ru: 'Авиационный',                  kz: 'Авиациялық'                          },
    heroTitle2:     { ru: 'английский',                   kz: 'ағылшын тілі'                        },
    heroTitle3:     { ru: 'для профессионалов',            kz: 'мамандарға арналған'                 },
    heroDesc:       { ru: 'Подготовка к экзамену ICAO для пилотов и авиадиспетчеров. Интерактивные уроки, AI-помощник, реальная фразеология.', kz: 'Ұшқыштар мен авиадиспетчерлер үшін ICAO емтиханына дайындық. Интерактивті сабақтар, AI-көмекші, нақты фразеология.' },
    startFree:      { ru: 'Начать бесплатно →',           kz: 'Тегін бастау →'                      },
    allCourses:     { ru: 'Все курсы',                    kz: 'Барлық курстар'                      },
    statsStudents:  { ru: 'Студентов',                    kz: 'Студенттер'                          },
    statsCourses:   { ru: 'Курсов ICAO',                  kz: 'ICAO курстары'                       },
    statsPass:      { ru: 'Сдают с 1-го раза',            kz: '1-ші рет тапсырады'                  },
    statsCert:      { ru: 'Сертификация',                 kz: 'Сертификаттау'                       },
    programs:       { ru: 'Программы обучения',           kz: 'Оқу бағдарламалары'                  },
    popularCourses: { ru: 'Популярные курсы',             kz: 'Танымал курстар'                     },
    seeAll:         { ru: 'Все 6 курсов →',               kz: 'Барлық 6 курс →'                     },
    platform:       { ru: 'Платформа',                    kz: 'Платформа'                           },
    platformTitle:  { ru: 'Всё для подготовки к ICAO',   kz: 'ICAO-ға дайындалу үшін барлығы'      },
    ctaTitle:       { ru: 'Начни обучение сегодня',       kz: 'Бүгін оқуды бастаңыз'               },
    ctaDesc:        { ru: 'Первый курс — бесплатно. Регистрация за 30 секунд.', kz: 'Бірінші курс — тегін. Тіркелу 30 секунд.' },
    ctaBtn:         { ru: 'Зарегистрироваться бесплатно →', kz: 'Тегін тіркелу →'                  },
    details:        { ru: 'Подробнее →',                  kz: 'Толығырақ →'                         },
  },
  courses: {
    title:        { ru: 'Курсы авиационного английского', kz: 'Авиациялық ағылшын тілі курстары'   },
    subtitle:     { ru: 'Учебные программы',              kz: 'Оқу бағдарламалары'                 },
    search:       { ru: 'Поиск курсов...',                kz: 'Курстарды іздеу...'                  },
    all:          { ru: 'Все',                            kz: 'Барлығы'                             },
    coursesCount: { ru: 'курсов',                         kz: 'курс'                                },
    free:         { ru: 'Бесплатно',                      kz: 'Тегін'                               },
    enrolled:     { ru: '✓ Записан',                      kz: '✓ Жазылған'                          },
    enroll:       { ru: 'Записаться →',                   kz: 'Жазылу →'                            },
    startFree:    { ru: 'Начать →',                       kz: 'Бастау →'                            },
    notFound:     { ru: 'Курсы не найдены',               kz: 'Курстар табылмады'                   },
    tryAnother:   { ru: 'Попробуй другой запрос или уровень', kz: 'Басқа сұранымды қолданып көріңіз' },
  },
  lessons: {
    loading:     { ru: 'Загружаем урок...',    kz: 'Сабақ жүктелуде...'   },
    notFound:    { ru: 'Урок не найден',       kz: 'Сабақ табылмады'       },
    complete:    { ru: 'Завершить урок',       kz: 'Сабақты аяқтау'        },
    prev:        { ru: 'Назад',               kz: 'Артқа'                 },
    next:        { ru: 'Далее',               kz: 'Келесі'                },
    transcript:  { ru: 'Транскрипция',        kz: 'Транскрипция'           },
    vocabulary:  { ru: 'Словарь урока',       kz: 'Сабақ сөздігі'         },
    myVocab:     { ru: 'Мой словарь',         kz: 'Менің сөздігім'        },
    training:    { ru: 'Тренировка',          kz: 'Жаттығу'               },
    reset:       { ru: 'Сбросить',            kz: 'Қалпына келтіру'       },
    add:         { ru: 'Добавить',            kz: 'Қосу'                  },
    cancel:      { ru: 'Отмена',              kz: 'Болдырмау'             },
  },
  quiz: {
    passed:       { ru: '✅ Тест пройден!',    kz: '✅ Тест өтті!'          },
    failed:       { ru: '❌ Тест не пройден',  kz: '❌ Тест өтпеді'         },
    retry:        { ru: 'Пройти снова',        kz: 'Қайта өту'             },
    finishLesson: { ru: 'Завершить урок →',    kz: 'Сабақты аяқтау →'      },
    nextQuestion: { ru: 'Следующий вопрос',    kz: 'Келесі сұрақ'          },
    finishTest:   { ru: 'Завершить тест',      kz: 'Тестті аяқтау'         },
  },
  dashboard: {
    title:        { ru: 'Личный кабинет',      kz: 'Жеке кабинет'          },
    streak:       { ru: 'Streak',              kz: 'Streak'                },
    daysRow:      { ru: 'дней подряд',         kz: 'күн қатарынан'         },
    lessonsComp:  { ru: 'Уроков пройдено',     kz: 'Сабақ аяқталды'        },
    xpLevel:      { ru: 'Уровень XP',          kz: 'XP деңгейі'            },
    myCourses:    { ru: 'Мои курсы',           kz: 'Менің курстарым'       },
    achievements: { ru: 'Достижения',          kz: 'Жетістіктер'           },
  },
  auth: {
    loginTitle:   { ru: 'Добро пожаловать',    kz: 'Қош келдіңіз'          },
    email:        { ru: 'Email',               kz: 'Email'                 },
    password:     { ru: 'Пароль',              kz: 'Құпия сөз'             },
    loginBtn:     { ru: 'Войти',               kz: 'Кіру'                  },
    noAccount:    { ru: 'Нет аккаунта?',       kz: 'Аккаунтыңыз жоқ па?'  },
    registerLink: { ru: 'Зарегистрироваться',  kz: 'Тіркелу'               },
    regTitle:     { ru: 'Создать аккаунт',     kz: 'Аккаунт жасау'         },
    firstName:    { ru: 'Имя',                 kz: 'Аты'                   },
    lastName:     { ru: 'Фамилия',             kz: 'Тегі'                  },
    spec:         { ru: 'Специализация',       kz: 'Мамандану'             },
    regBtn:       { ru: 'Зарегистрироваться',  kz: 'Тіркелу'               },
    haveAccount:  { ru: 'Уже есть аккаунт?',   kz: 'Аккаунтыңыз бар ма?'  },
    loginLink:    { ru: 'Войти',               kz: 'Кіру'                  },
  },
  common: {
    loading:  { ru: 'Загрузка...',    kz: 'Жүктелуде...' },
    error:    { ru: 'Ошибка',         kz: 'Қате'          },
    save:     { ru: 'Сохранить',      kz: 'Сақтау'        },
    cancel:   { ru: 'Отмена',         kz: 'Болдырмау'     },
    free:     { ru: 'Бесплатно',      kz: 'Тегін'         },
    back:     { ru: 'Назад',          kz: 'Артқа'         },
  },
}

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>('ru')

  useEffect(() => {
    const saved = localStorage.getItem('lang') as Language
    if (saved && ['ru', 'kz'].includes(saved)) setLangState(saved)
  }, [])

  const setLang = (l: Language) => {
    setLangState(l)
    localStorage.setItem('lang', l)
  }

  const t = (section: string, key: string): string => {
    return translations[section]?.[key]?.[lang]
      ?? translations[section]?.[key]?.['ru']
      ?? key
  }

  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LangContext.Provider>
  )
}

export const useLang = () => useContext(LangContext)