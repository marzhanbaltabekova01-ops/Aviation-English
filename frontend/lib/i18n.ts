// lib/i18n.ts

export type Language = "ru" | "kz" | "en";

export const LANGUAGES: { code: Language; label: string; flag: string }[] = [
  { code: "ru", label: "Русский", flag: "🇷🇺" },
  { code: "kz", label: "Қазақша", flag: "🇰🇿" },
  { code: "en", label: "English", flag: "🇬🇧" },
];

export const translations = {
  nav: {
    home: { ru: "Главная", kz: "Басты бет", en: "Home" },
    courses: { ru: "Курсы", kz: "Курстар", en: "Courses" },
    icao: { ru: "Уровни ICAO", kz: "ICAO деңгейлері", en: "ICAO Levels" },
    dashboard: { ru: "Дашборд", kz: "Басқару тақтасы", en: "Dashboard" },
    login: { ru: "Войти", kz: "Кіру", en: "Log in" },
    register: { ru: "Регистрация", kz: "Тіркелу", en: "Sign up" },
    logout: { ru: "Выйти", kz: "Шығу", en: "Log out" },
    admin: { ru: "Админ", kz: "Әкімші", en: "Admin" },
  },
  home: {
    badge: {
      ru: "Стандарты ICAO · Казахстан",
      kz: "ICAO стандарттары · Қазақстан",
      en: "ICAO Standards · Kazakhstan",
    },
    heroTitle1: { ru: "Авиационный", kz: "Авиациялық", en: "Aviation" },
    heroTitle2: { ru: "английский", kz: "ағылшын тілі", en: "English" },
    heroTitle3: {
      ru: "для профессионалов",
      kz: "мамандарға арналған",
      en: "for professionals",
    },
    heroDesc: {
      ru: "Подготовка к экзамену ICAO для пилотов и авиадиспетчеров. Интерактивные уроки, AI-помощник.",
      kz: "Ұшқыштар мен авиадиспетчерлер үшін ICAO емтиханына дайындық. Интерактивті сабақтар, AI-көмекші.",
      en: "ICAO exam preparation for pilots and ATC. Interactive lessons, AI assistant.",
    },
    startFree: {
      ru: "Начать бесплатно →",
      kz: "Тегін бастау →",
      en: "Start for free →",
    },
    allCourses: { ru: "Все курсы", kz: "Барлық курстар", en: "All courses" },
    statsStudents: { ru: "Студентов", kz: "Студенттер", en: "Students" },
    statsCourses: {
      ru: "Курсов ICAO",
      kz: "ICAO курстары",
      en: "ICAO Courses",
    },
    statsPass: {
      ru: "Сдают с 1-го раза",
      kz: "1-ші рет тапсырады",
      en: "Pass first try",
    },
    popularCourses: {
      ru: "Популярные курсы",
      kz: "Танымал курстар",
      en: "Popular courses",
    },
    programs: {
      ru: "Программы обучения",
      kz: "Оқу бағдарламалары",
      en: "Programs",
    },
    seeAll: {
      ru: "Все 6 курсов →",
      kz: "Барлық 6 курс →",
      en: "All 6 courses →",
    },
    platform: { ru: "Платформа", kz: "Платформа", en: "Platform" },
    platformTitle: {
      ru: "Всё для подготовки к ICAO",
      kz: "ICAO-ға дайындалу үшін барлығы",
      en: "Everything for ICAO prep",
    },
    ctaTitle: {
      ru: "Начни обучение сегодня",
      kz: "Бүгін оқуды бастаңыз",
      en: "Start learning today",
    },
    ctaDesc: {
      ru: "Первый курс — бесплатно. Регистрация за 30 секунд.",
      kz: "Бірінші курс — тегін. Тіркелу 30 секунд.",
      en: "First course is free. Sign up in 30 seconds.",
    },
    ctaBtn: {
      ru: "Зарегистрироваться бесплатно →",
      kz: "Тегін тіркелу →",
      en: "Register for free →",
    },
  },
  courses: {
    title: {
      ru: "Курсы авиационного английского",
      kz: "Авиациялық ағылшын тілі курстары",
      en: "Aviation English Courses",
    },
    subtitle: {
      ru: "От базового Pre-Aviation до уровня ICAO Expert",
      kz: "Pre-Aviation деңгейінен ICAO Expert деңгейіне дейін",
      en: "From Pre-Aviation to ICAO Expert",
    },
    search: {
      ru: "Поиск курсов...",
      kz: "Курстарды іздеу...",
      en: "Search courses...",
    },
    all: { ru: "Все", kz: "Барлығы", en: "All" },
    coursesCount: { ru: "курсов", kz: "курс", en: "courses" },
    lessons: { ru: "уроков", kz: "сабақ", en: "lessons" },
    enrolled: { ru: "✓ Записан", kz: "✓ Жазылған", en: "✓ Enrolled" },
    enroll: { ru: "Записаться →", kz: "Жазылу →", en: "Enroll →" },
    startFree: { ru: "Начать →", kz: "Бастау →", en: "Start →" },
    free: { ru: "Бесплатно", kz: "Тегін", en: "Free" },
    details: { ru: "Подробнее →", kz: "Толығырақ →", en: "Details →" },
    notFound: {
      ru: "Курсы не найдены",
      kz: "Курстар табылмады",
      en: "No courses found",
    },
    tryAnother: {
      ru: "Попробуй другой запрос или уровень",
      kz: "Басқа сұранымды қолданып көріңіз",
      en: "Try another query or level",
    },
  },
  lessons: {
    courseProgress: {
      ru: "Прогресс курса",
      kz: "Курс үлгерімі",
      en: "Course progress",
    },
    lesson: { ru: "Урок", kz: "Сабақ", en: "Lesson" },
    min: { ru: "мин", kz: "мин", en: "min" },
    complete: {
      ru: "Завершить урок",
      kz: "Сабақты аяқтау",
      en: "Complete lesson",
    },
    prev: { ru: "Назад", kz: "Артқа", en: "Back" },
    next: { ru: "Далее", kz: "Келесі", en: "Next" },
    notFound: {
      ru: "Урок не найден",
      kz: "Сабақ табылмады",
      en: "Lesson not found",
    },
    backToCourses: {
      ru: "Вернуться к курсам",
      kz: "Курстарға оралу",
      en: "Back to courses",
    },
    loading: {
      ru: "Загружаем урок...",
      kz: "Сабақ жүктелуде...",
      en: "Loading lesson...",
    },
    keyPoints: {
      ru: "Ключевые моменты",
      kz: "Негізгі тұстар",
      en: "Key points",
    },
    transcript: { ru: "Транскрипция", kz: "Транскрипция", en: "Transcript" },
    vocabulary: {
      ru: "Словарь урока",
      kz: "Сабақ сөздігі",
      en: "Lesson vocabulary",
    },
    clickToFlip: {
      ru: "🔄 Нажмите для перевода",
      kz: "🔄 Аудару үшін басыңыз",
      en: "🔄 Click to translate",
    },
    icaoRule: { ru: "Правило ICAO", kz: "ICAO ережесі", en: "ICAO Rule" },
    audioLesson: { ru: "Аудио урок", kz: "Аудио сабақ", en: "Audio lesson" },
    resetCards: {
      ru: "Сбросить все карточки",
      kz: "Барлық карточкаларды қалпына келтіру",
      en: "Reset all cards",
    },
    myVocab: { ru: "Мой словарь", kz: "Менің сөздігім", en: "My vocabulary" },
    words: { ru: "слов", kz: "сөз", en: "words" },
    addWord: {
      ru: "Добавить в мой словарь",
      kz: "Менің сөздігіме қосу",
      en: "Add to vocabulary",
    },
    wordEn: {
      ru: "Слово (английский)",
      kz: "Сөз (ағылшынша)",
      en: "Word (English)",
    },
    translation: { ru: "Перевод", kz: "Аударма", en: "Translation" },
    cancel: { ru: "Отмена", kz: "Болдырмау", en: "Cancel" },
    add: { ru: "Добавить", kz: "Қосу", en: "Add" },
    training: {
      ru: "Тренировка — соедини слово с переводом",
      kz: "Жаттығу — сөзді аудармамен байланыстыру",
      en: "Match word with translation",
    },
    reset: { ru: "Сбросить", kz: "Қалпына келтіру", en: "Reset" },
    allMatched: {
      ru: "🎉 Отлично! Все слова угаданы!",
      kz: "🎉 Керемет! Барлық сөздер табылды!",
      en: "🎉 All words matched!",
    },
  },
  quiz: {
    question: { ru: "Вопрос", kz: "Сұрақ", en: "Question" },
    of: { ru: "из", kz: "ден", en: "of" },
    passed: {
      ru: "✅ Тест пройден!",
      kz: "✅ Тест өтті!",
      en: "✅ Test passed!",
    },
    failed: {
      ru: "❌ Тест не пройден",
      kz: "❌ Тест өтпеді",
      en: "❌ Test failed",
    },
    retry: { ru: "Пройти снова", kz: "Қайта өту", en: "Try again" },
    finishLesson: {
      ru: "Завершить урок →",
      kz: "Сабақты аяқтау →",
      en: "Finish lesson →",
    },
    nextQuestion: {
      ru: "Следующий вопрос",
      kz: "Келесі сұрақ",
      en: "Next question",
    },
    finishTest: {
      ru: "Завершить тест",
      kz: "Тестті аяқтау",
      en: "Finish test",
    },
  },
  dashboard: {
    title: { ru: "Личный кабинет", kz: "Жеке кабинет", en: "My Dashboard" },
    streak: { ru: "Streak", kz: "Streak", en: "Streak" },
    daysRow: { ru: "дней подряд", kz: "күн қатарынан", en: "days in a row" },
    lessonsComp: {
      ru: "Уроков пройдено",
      kz: "Сабақ аяқталды",
      en: "Lessons done",
    },
    xpLevel: { ru: "Уровень XP", kz: "XP деңгейі", en: "XP Level" },
    icaoProgress: {
      ru: "Прогресс ICAO",
      kz: "ICAO үлгерімі",
      en: "ICAO Progress",
    },
    myCourses: { ru: "Мои курсы", kz: "Менің курстарым", en: "My courses" },
    achievements: { ru: "Достижения", kz: "Жетістіктер", en: "Achievements" },
  },
  auth: {
    loginTitle: {
      ru: "Добро пожаловать",
      kz: "Қош келдіңіз",
      en: "Welcome back",
    },
    email: { ru: "Email", kz: "Email", en: "Email" },
    password: { ru: "Пароль", kz: "Құпия сөз", en: "Password" },
    loginBtn: { ru: "Войти", kz: "Кіру", en: "Sign in" },
    noAccount: {
      ru: "Нет аккаунта?",
      kz: "Аккаунтыңыз жоқ па?",
      en: "No account?",
    },
    registerLink: { ru: "Зарегистрироваться", kz: "Тіркелу", en: "Sign up" },
    regTitle: {
      ru: "Создать аккаунт",
      kz: "Аккаунт жасау",
      en: "Create account",
    },
    firstName: { ru: "Имя", kz: "Аты", en: "First name" },
    lastName: { ru: "Фамилия", kz: "Тегі", en: "Last name" },
    spec: { ru: "Специализация", kz: "Мамандану", en: "Specialization" },
    regBtn: { ru: "Зарегистрироваться", kz: "Тіркелу", en: "Sign up" },
    haveAccount: {
      ru: "Уже есть аккаунт?",
      kz: "Аккаунтыңыз бар ма?",
      en: "Have an account?",
    },
    loginLink: { ru: "Войти", kz: "Кіру", en: "Sign in" },
  },
  common: {
    loading: { ru: "Загрузка...", kz: "Жүктелуде...", en: "Loading..." },
    error: { ru: "Ошибка", kz: "Қате", en: "Error" },
    save: { ru: "Сохранить", kz: "Сақтау", en: "Save" },
    cancel: { ru: "Отмена", kz: "Болдырмау", en: "Cancel" },
    delete: { ru: "Удалить", kz: "Жою", en: "Delete" },
    back: { ru: "Назад", kz: "Артқа", en: "Back" },
    free: { ru: "Бесплатно", kz: "Тегін", en: "Free" },
    minutes: { ru: "мин", kz: "мин", en: "min" },
  },
};
