// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding...');

  // ── Users ───────────────────────────────────────────────────────────────────
  const adminHash = await bcrypt.hash('admin123456', 10);
  const userHash  = await bcrypt.hash('user123456',  10);

  await prisma.user.upsert({
    where:  { email: 'admin@aviationenglish.kz' },
    update: {},
    create: { email: 'admin@aviationenglish.kz', passwordHash: adminHash, firstName: 'Администратор', lastName: 'Платформы', role: 'ADMIN', specialization: 'STUDENT' },
  });

  const pilot = await prisma.user.upsert({
    where:  { email: 'pilot@test.kz' },
    update: {},
    create: { email: 'pilot@test.kz', passwordHash: userHash, firstName: 'Азамат', lastName: 'Сейткали', role: 'USER', specialization: 'PILOT_COMMERCIAL' },
  });

  console.log('✅ Users');

  // ── Courses ─────────────────────────────────────────────────────────────────
  const courses = [
    { id: 'course-1', thumbnailUrl: '/images/course-1.jpg', title: 'Основы авиационного английского',           description: 'Вводный курс для начинающих. Базовая лексика, фонетика и структура радиообмена.',                                          level: 'Pre-Aviation',   price: 0,      currency: 'KZT', lessonsCount: 12, duration: 8,  studentsCount: 847  },
    { id: 'course-2', thumbnailUrl: '/images/course-2.jpg', title: 'Подготовка к ICAO Level 3',                  description: 'Интенсивный курс для достижения предрабочего уровня владения авиационным английским.',                                    level: 'ICAO Level 3',   price: 75000,  currency: 'KZT', lessonsCount: 24, duration: 16, studentsCount: 523  },
    { id: 'course-3', thumbnailUrl: '/images/course-3.jpg', title: 'ICAO Level 4 для пилотов',                   description: 'Комплексная подготовка к экзамену ICAO Level 4. Все аспекты: аудирование, говорение, чтение.',                          level: 'ICAO Level 4',   price: 120000, currency: 'KZT', lessonsCount: 36, duration: 24, studentsCount: 1256 },
    { id: 'course-4', thumbnailUrl: '/images/course-4.jpg', title: 'ICAO Level 4 для диспетчеров',               description: 'Специализированный курс для авиадиспетчеров с фокусом на радиообмен и нестандартные ситуации.',                        level: 'ICAO Level 4',   price: 130000, currency: 'KZT', lessonsCount: 32, duration: 22, studentsCount: 412  },
    { id: 'course-5', thumbnailUrl: '/images/course-5.jpg', title: 'Продвинутый курс ICAO Level 5',              description: 'Для тех, кто хочет повысить уровень с 4 до 5. Сложные конструкции, идиомы, работа с акцентами.',                       level: 'ICAO Level 5-6', price: 180000, currency: 'KZT', lessonsCount: 28, duration: 20, studentsCount: 234  },
    { id: 'course-6', thumbnailUrl: '/images/course-6.jpg', title: 'Корпоративная программа',                    description: 'Индивидуальная программа обучения для авиакомпаний и учебных центров.',                                                 level: 'Corporate',      price: 0,      currency: 'KZT', lessonsCount: 0,  duration: 0,  studentsCount: 18   },
  ];

  for (const c of courses) {
    await prisma.course.upsert({ where: { id: c.id }, update: {}, create: c });
  }
  console.log('✅ Courses');

  // ── Lessons for course-1 ────────────────────────────────────────────────────
  const lessons = [
    {
      id: 'l-1', courseId: 'course-1', title: 'Введение в авиационный английский', type: 'READING' as const,
      duration: 15, order: 1, isFree: true,
      content: {
        article: {
          title: 'Введение в авиационный английский',
          paragraphs: [
            'Авиационный английский — это специализированная форма английского языка, используемая в гражданской авиации для обеспечения безопасной и эффективной коммуникации между пилотами и авиадиспетчерами.',
            'История стандартизации авиационного английского началась после серии авиакатастроф, причиной которых стало недопонимание между членами экипажа и диспетчерами. В 2003 году ICAO установила требования к уровню владения английским языком.',
            'Стандартная фразеология ICAO включает строго определённые фразы и выражения, которые должны использоваться в радиообмене. Это минимизирует риск неправильного толкования команд и инструкций.',
            'Фонетический алфавит ICAO (Alpha, Bravo, Charlie...) используется для чёткой передачи букв и чисел, особенно важных при передаче позывных, координат и метеоданных.',
          ],
          keyPoints: [
            'ICAO установила 6 уровней владения авиационным английским',
            'Минимальный уровень для международных полётов — Level 4 (Operational)',
            'Стандартная фразеология обязательна для всех радиопереговоров',
            'Фонетический алфавит ICAO исключает двусмысленность в передаче данных',
          ],
        },
      },
    },
    {
      id: 'l-2', courseId: 'course-1', title: 'Фонетический алфавит ICAO', type: 'LISTENING' as const,
      duration: 20, order: 2, isFree: true,
      content: {
        audioUrl: '/audio/icao-alphabet.mp3',
        transcript: 'Alpha - Bravo - Charlie - Delta - Echo - Foxtrot - Golf - Hotel - India - Juliet - Kilo - Lima - Mike - November - Oscar - Papa - Quebec - Romeo - Sierra - Tango - Uniform - Victor - Whiskey - X-ray - Yankee - Zulu.',
        keyPhrases: ['Alpha', 'Bravo', 'Charlie', 'Delta', 'Echo', 'Foxtrot'],
        vocabulary: [
          { word: 'Alpha', translation: 'А — первая буква фонетического алфавита', pronunciation: 'AL-fah' },
          { word: 'Bravo', translation: 'Б — вторая буква фонетического алфавита', pronunciation: 'BRAH-voh' },
          { word: 'Charlie', translation: 'В — третья буква фонетического алфавита', pronunciation: 'CHAR-lee' },
          { word: 'Delta', translation: 'Г — четвёртая буква фонетического алфавита', pronunciation: 'DELL-tah' },
        ],
        icaoRule: 'Фонетический алфавит ICAO обязателен при передаче позывных, идентификаторов маяков и другой алфавитно-цифровой информации.',
      },
    },
    {
      id: 'l-3', courseId: 'course-1', title: 'Базовые команды пилота', type: 'VOCABULARY' as const,
      duration: 25, order: 3, isFree: false,
      content: {
        vocabularyItems: [
          { word: 'Roger', translation: 'Получено и понято', example: 'Roger, KZ557' },
          { word: 'Wilco', translation: 'Понял, выполню', example: 'Wilco, descend to FL200' },
          { word: 'Affirm', translation: 'Да, подтверждаю', example: 'Affirm, cleared for takeoff' },
          { word: 'Negative', translation: 'Нет, отказываю', example: 'Negative, hold position' },
          { word: 'Stand by', translation: 'Подождите', example: 'Stand by, KZ557' },
          { word: 'Say again', translation: 'Повторите', example: 'Say again your altitude' },
        ],
        topic: 'Базовые команды и ответы',
      },
    },
    {
      id: 'l-4', courseId: 'course-1', title: 'Тест: Основы авиационного английского', type: 'QUIZ' as const,
      duration: 15, order: 4, isFree: false,
      content: {
        questions: [
          {
            id: 'q-1',
            question: 'Что означает фраза "Roger" в авиационном радиообмене?',
            options: ['Да, согласен', 'Получено и понято', 'Выполняю', 'Отказываю'],
            correctAnswer: 1,
            explanation: 'Roger означает "я получил ваше последнее сообщение". Это не означает согласия или выполнения.',
          },
          {
            id: 'q-2',
            question: 'Как произносится буква "W" в фонетическом алфавите ICAO?',
            options: ['William', 'Whiskey', 'Walter', 'Warsaw'],
            correctAnswer: 1,
            explanation: 'В фонетическом алфавите ICAO буква W обозначается словом "Whiskey" (WISS-key).',
          },
          {
            id: 'q-3',
            question: 'Какой минимальный уровень ICAO требуется для выполнения международных полётов?',
            options: ['Level 3', 'Level 4', 'Level 5', 'Level 6'],
            correctAnswer: 1,
            explanation: 'ICAO требует минимум Level 4 (Operational) для пилотов и диспетчеров, выполняющих международные полёты.',
          },
        ],
      },
    },
    {
      id: 'l-5', courseId: 'course-2', title: 'Стандартная фразеология вылета', type: 'LISTENING' as const,
      duration: 25, order: 1, isFree: true,
      content: {
        audioUrl: '/audio/departure-phraseology.mp3',
        transcript: 'KZ557: "Astana Delivery, KZ557, request IFR clearance to Almaty, information Bravo." Delivery: "KZ557, cleared to Almaty via KATEX departure, climb to FL200, squawk 2341."',
        keyPhrases: ['cleared to', 'climb to', 'squawk', 'departure', 'information'],
        vocabulary: [
          { word: 'Squawk', translation: 'Установить код транспондера', example: 'Squawk 2341' },
          { word: 'Cleared to', translation: 'Разрешён до (пункта назначения)', example: 'Cleared to Almaty' },
          { word: 'ATIS', translation: 'Автоматическая информационная служба аэродрома', pronunciation: 'AY-tis' },
        ],
        icaoRule: 'Readback обязателен для всех разрешений ATC.',
      },
    },
    {
      id: 'l-6', courseId: 'course-2', title: 'Phraseology: взлёт и посадка', type: 'VOCABULARY' as const,
      duration: 20, order: 2, isFree: false,
      content: {
        vocabularyItems: [
          { word: 'Cleared for takeoff', translation: 'Разрешён взлёт', example: 'KZ557, cleared for takeoff runway 05' },
          { word: 'Line up and wait', translation: 'Выруливайте и ждите', example: 'Line up and wait runway 23' },
          { word: 'Cleared to land', translation: 'Разрешена посадка', example: 'Cleared to land runway 23R' },
          { word: 'Go around', translation: 'Уход на второй круг', example: 'KZ557, go around' },
        ],
        topic: 'Взлёт и посадка',
      },
    },
    {
      id: 'l-7', courseId: 'course-3', title: 'Нестандартные ситуации: аварийный радиообмен', type: 'LISTENING' as const,
      duration: 30, order: 1, isFree: true,
      content: {
        audioUrl: '/audio/emergency-phraseology.mp3',
        transcript: 'KZ557: "MAYDAY, MAYDAY, MAYDAY, KZ557, engine failure, request immediate return to Astana, souls on board 186, fuel 12 tonnes." Astana: "KZ557, MAYDAY acknowledged, turn left heading 270, descend FL100, all traffic stand by."',
        keyPhrases: ['MAYDAY', 'PAN-PAN', 'souls on board', 'fuel endurance', 'request immediate'],
        vocabulary: [
          { word: 'MAYDAY', translation: 'Сигнал бедствия (угроза жизни)', pronunciation: 'MAY-day' },
          { word: 'PAN-PAN', translation: 'Сигнал срочности (серьёзная ситуация)', pronunciation: 'PAN-PAN' },
          { word: 'Souls on board', translation: 'Количество людей на борту', example: 'Souls on board 186' },
        ],
        icaoRule: 'MAYDAY произносится трижды и означает угрозу жизни. PAN-PAN произносится трижды и означает срочную ситуацию без угрозы жизни.',
      },
    },
    {
      id: 'l-8', courseId: 'course-3', title: 'Квиз: Аварийные ситуации', type: 'QUIZ' as const,
      duration: 15, order: 2, isFree: false,
      content: {
        questions: [
          {
            id: 'q-1',
            question: 'Сколько раз произносится слово "MAYDAY" при объявлении бедствия?',
            options: ['Один раз', 'Два раза', 'Три раза', 'Четыре раза'],
            correctAnswer: 2,
            explanation: 'Согласно ICAO, сигнал бедствия MAYDAY произносится трижды: "MAYDAY, MAYDAY, MAYDAY".',
          },
          {
            id: 'q-2',
            question: 'Что означает "PAN-PAN" в авиации?',
            options: ['Сигнал бедствия', 'Сигнал срочности без угрозы жизни', 'Запрос на посадку', 'Технический отказ'],
            correctAnswer: 1,
            explanation: 'PAN-PAN — международный сигнал срочности. Используется когда ситуация серьёзна, но нет непосредственной угрозы жизни.',
          },
          {
            id: 'q-3',
            question: 'Что включает стандартное сообщение MAYDAY?',
            options: [
              'Позывной, проблема, помощь, позиция',
              'Только позывной и проблема',
              'Позывной, проблема, позиция, топливо, количество людей',
              'Только сигнал бедствия',
            ],
            correctAnswer: 2,
            explanation: 'Полное MAYDAY сообщение: позывной (×3), тип аварии, намерения, позиция, топливо (в часах), число людей на борту, любая другая информация.',
          },
        ],
      },
    },
  ];

  for (const l of lessons) {
    await prisma.lesson.upsert({ where: { id: l.id }, update: {}, create: l });
  }
  console.log('✅ Lessons');

  // ── Enrollments ─────────────────────────────────────────────────────────────
  await prisma.enrollment.upsert({
    where:  { userId_courseId: { userId: pilot.id, courseId: 'course-1' } },
    update: {},
    create: { userId: pilot.id, courseId: 'course-1', progress: 100, completedAt: new Date('2024-02-01') },
  });
  await prisma.enrollment.upsert({
    where:  { userId_courseId: { userId: pilot.id, courseId: 'course-3' } },
    update: {},
    create: { userId: pilot.id, courseId: 'course-3', progress: 45 },
  });
  console.log('✅ Enrollments');

  console.log('\n🎉 Done!');
  console.log('  admin@aviationenglish.kz / admin123456');
  console.log('  pilot@test.kz / user123456');
}

main().catch(console.error).finally(() => prisma.$disconnect());
