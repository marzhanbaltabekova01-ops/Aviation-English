// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding...');

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

  const courses = [
    { id: 'course-1', thumbnailUrl: '/images/course-1.jpg', title: 'Основы авиационного английского',           description: 'Вводный курс для начинающих. Базовая лексика, фонетика и структура радиообмена.',                                          level: 'Pre-Aviation',   price: 0,      currency: 'KZT', lessonsCount: 12, duration: 8,  studentsCount: 847  },
    { id: 'course-2', thumbnailUrl: '/images/course-2.jpg', title: 'Подготовка к ICAO Level 3',                  description: 'Интенсивный курс для достижения предрабочего уровня владения авиационным английским.',                                    level: 'ICAO Level 3',   price: 75000,  currency: 'KZT', lessonsCount: 24, duration: 16, studentsCount: 523  },
    { id: 'course-3', thumbnailUrl: '/images/course-3.jpg', title: 'ICAO Level 4 для пилотов',                   description: 'Комплексная подготовка к экзамену ICAO Level 4. Все аспекты: аудирование, говорение, чтение.',                          level: 'ICAO Level 4',   price: 120000, currency: 'KZT', lessonsCount: 36, duration: 24, studentsCount: 1256 },
    { id: 'course-4', thumbnailUrl: '/images/course-4.jpg', title: 'ICAO Level 4 для диспетчеров',               description: 'Специализированный курс для авиадиспетчеров с фокусом на радиообмен и нестандартные ситуации.',                        level: 'ICAO Level 4',   price: 130000, currency: 'KZT', lessonsCount: 32, duration: 22, studentsCount: 412  },
    { id: 'course-5', thumbnailUrl: '/images/course-5.jpg', title: 'Продвинутый курс ICAO Level 5',              description: 'Для тех, кто хочет повысить уровень с 4 до 5. Сложные конструкции, идиомы, работа с акцентами.',                       level: 'ICAO Level 5-6', price: 180000, currency: 'KZT', lessonsCount: 28, duration: 20, studentsCount: 234  },
    { id: 'course-6', thumbnailUrl: '/images/course-6.jpg', title: 'Корпоративная программа',                    description: 'Индивидуальная программа обучения для авиакомпаний и учебных центров.',                                                 level: 'Corporate',      price: 0,      currency: 'KZT', lessonsCount: 0,  duration: 0,  studentsCount: 18   },
  ];

  for (const c of courses) {
    await prisma.course.upsert({ where: { id: c.id }, update: { thumbnailUrl: c.thumbnailUrl }, create: c });
  }
  console.log('✅ Courses');

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
          paragraphsKz: [
            'Авиациялық ағылшын тілі — бұл азаматтық авиацияда ұшқыштар мен авиадиспетчерлер арасындағы қауіпсіз және тиімді байланысты қамтамасыз ету үшін қолданылатын ағылшын тілінің мамандандырылған түрі.',
            'Авиациялық ағылшын тілін стандарттау тарихы экипаж мүшелері мен диспетчерлер арасындағы түсінбеушіліктен болған бірқатар авиаапаттардан кейін басталды. 2003 жылы ИКАО халықаралық рейстер орындайтын барлық ұшқыштар мен диспетчерлер үшін ағылшын тілін меңгеру деңгейіне қойылатын талаптар белгіледі.',
            'ИКАО стандартты фразеологиясы радиобайланыста қолданылуы тиіс нақты белгіленген фразалар мен өрнектерді қамтиды. Бұл командалар мен нұсқаулықтарды дұрыс түсінбеу қаупін азайтады.',
            'ИКАО фонетикалық алфавиті (Alpha, Bravo, Charlie...) әріптер мен сандарды, әсіресе шақыру белгілері, координаттар мен метеодеректерді беру кезінде анық жеткізу үшін қолданылады.',
          ],
          keyPointsKz: [
            'ИКАО авиациялық ағылшын тілін меңгерудің 6 деңгейін белгіледі',
            'Халықаралық рейстер үшін ең төменгі деңгей — Level 4 (Operational)',
            'Стандартты фразеология барлық радио келіссөздер үшін міндетті',
            'ИКАО фонетикалық алфавиті деректерді беруде екіұштылықты жояды',
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
          { word: 'Alpha',   translation: 'А — первая буква фонетического алфавита',   translationKz: 'А — фонетикалық алфавиттің бірінші әрпі',   pronunciation: 'AL-fah' },
          { word: 'Bravo',   translation: 'Б — вторая буква фонетического алфавита',   translationKz: 'Б — фонетикалық алфавиттің екінші әрпі',   pronunciation: 'BRAH-voh' },
          { word: 'Charlie', translation: 'В — третья буква фонетического алфавита',   translationKz: 'В — фонетикалық алфавиттің үшінші әрпі',   pronunciation: 'CHAR-lee' },
          { word: 'Delta',   translation: 'Г — четвёртая буква фонетического алфавита', translationKz: 'Г — фонетикалық алфавиттің төртінші әрпі', pronunciation: 'DELL-tah' },
        ],
        icaoRule: 'Фонетический алфавит ICAO обязателен при передаче позывных, идентификаторов маяков и другой алфавитно-цифровой информации.',
        icaoRuleKz: 'ИКАО фонетикалық алфавиті шақыру белгілерін, маяк идентификаторларын және басқа әріптік-цифрлық ақпаратты беру кезінде міндетті.',
      },
    },
    {
      id: 'l-3', courseId: 'course-1', title: 'Базовые команды пилота', type: 'VOCABULARY' as const,
      duration: 25, order: 3, isFree: false,
      content: {
        topic: 'Базовые команды и ответы',
        topicKz: 'Негізгі командалар мен жауаптар',
        vocabularyItems: [
          { word: 'Roger',     translation: 'Получено и понято',  translationKz: 'Қабылданды және түсінілді',  example: 'Roger, KZ557',               pronunciation: '/ˈrɒdʒə/' },
          { word: 'Wilco',     translation: 'Понял, выполню',     translationKz: 'Түсіндім, орындаймын',       example: 'Wilco, descend to FL200',     pronunciation: '/ˈwɪlkəʊ/' },
          { word: 'Affirm',    translation: 'Да, подтверждаю',    translationKz: 'Иә, растаймын',              example: 'Affirm, cleared for takeoff',  pronunciation: '/əˈfɜːm/' },
          { word: 'Negative',  translation: 'Нет, отказываю',     translationKz: 'Жоқ, теріске шығарамын',    example: 'Negative, hold position',     pronunciation: '/ˈneɡətɪv/' },
          { word: 'Stand by',  translation: 'Подождите',          translationKz: 'Күтіңіз',                    example: 'Stand by, KZ557',              pronunciation: '/stænd baɪ/' },
          { word: 'Say again', translation: 'Повторите',          translationKz: 'Қайталаңыз',                 example: 'Say again your altitude',      pronunciation: '/seɪ əˈɡen/' },
          { word: 'Mayday',    translation: 'Бедствие (сигнал)',  translationKz: 'Апат (сигналы)',             example: 'Mayday mayday mayday',         pronunciation: '/ˈmeɪdeɪ/' },
          { word: 'Pan-Pan',   translation: 'Срочность (сигнал)', translationKz: 'Шұғылдық (сигналы)',         example: 'Pan-pan pan-pan pan-pan',      pronunciation: '/pæn pæn/' },
        ],
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
            questionKz: '"Roger" фразасы авиациялық радиобайланыста не білдіреді?',
            options: ['Да, согласен', 'Получено и понято', 'Выполняю', 'Отказываю'],
            optionsKz: ['Иә, келісемін', 'Қабылданды және түсінілді', 'Орындаймын', 'Бас тартамын'],
            correctAnswer: 1,
            explanation: 'Roger означает "я получил ваше последнее сообщение". Это не означает согласия или выполнения.',
            explanationKz: 'Roger "соңғы хабарыңызды алдым" дегенді білдіреді. Бұл келісу немесе орындау дегенді білдірмейді.',
          },
          {
            id: 'q-2',
            question: 'Как произносится буква "W" в фонетическом алфавите ICAO?',
            questionKz: 'ИКАО фонетикалық алфавитінде "W" әрпі қалай айтылады?',
            options: ['William', 'Whiskey', 'Walter', 'Warsaw'],
            correctAnswer: 1,
            explanation: 'В фонетическом алфавите ICAO буква W обозначается словом "Whiskey" (WISS-key).',
            explanationKz: 'ИКАО фонетикалық алфавитінде W әрпі "Whiskey" (ВИСКЕЙ) сөзімен белгіленеді.',
          },
          {
            id: 'q-3',
            question: 'Какой минимальный уровень ICAO требуется для выполнения международных полётов?',
            questionKz: 'Халықаралық рейстерді орындау үшін қажетті ең төменгі ИКАО деңгейі қандай?',
            options: ['Level 3', 'Level 4', 'Level 5', 'Level 6'],
            correctAnswer: 1,
            explanation: 'ICAO требует минимум Level 4 (Operational) для пилотов и диспетчеров, выполняющих международные полёты.',
            explanationKz: 'ИКАО халықаралық рейстер орындайтын ұшқыштар мен диспетчерлер үшін кемінде Level 4 (Operational) талап етеді.',
          },
          {
            id: 'q-4',
            question: 'Какой сигнал используется при угрозе жизни на борту?',
            questionKz: 'Бортта өмірге қауіп төнгенде қандай сигнал қолданылады?',
            options: ['Pan-Pan', 'Mayday', 'Roger', 'Wilco'],
            correctAnswer: 1,
            explanation: 'Mayday — международный сигнал бедствия, произносится трижды при непосредственной угрозе жизни.',
            explanationKz: 'Mayday — халықаралық апат сигналы, өмірге тікелей қауіп төнгенде үш рет айтылады.',
          },
          {
            id: 'q-5',
            question: 'Что означает "Wilco" в авиационном радиообмене?',
            questionKz: '"Wilco" авиациялық радиобайланыста не білдіреді?',
            options: ['Получено и понято', 'Повторите сообщение', 'Понял, выполняю', 'Ожидайте'],
            optionsKz: ['Қабылданды және түсінілді', 'Хабарды қайталаңыз', 'Түсіндім, орындаймын', 'Күтіңіз'],
            correctAnswer: 2,
            explanation: '"Wilco" — сокращение от "Will comply". В отличие от "Roger", означает обязательство выполнить команду.',
            explanationKz: '"Wilco" — "Will comply" (орындаймын) қысқартылуы. "Roger"-ден айырмашылығы — команданы орындауға міндеттенеді.',
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
          { word: 'Squawk',     translation: 'Установить код транспондера',              translationKz: 'Транспондер кодын орнату',          example: 'Squawk 2341' },
          { word: 'Cleared to', translation: 'Разрешён до (пункта назначения)',          translationKz: 'Рұқсат етілді (баратын жерге)',    example: 'Cleared to Almaty' },
          { word: 'ATIS',       translation: 'Автоматическая информационная служба аэродрома', translationKz: 'Автоматтандырылған аэродром ақпарат қызметі', pronunciation: 'AY-tis' },
        ],
        icaoRule: 'Readback обязателен для всех разрешений ATC.',
        icaoRuleKz: 'Readback барлық ATC рұқсаттары үшін міндетті.',
      },
    },
    {
      id: 'l-6', courseId: 'course-2', title: 'Phraseology: взлёт и посадка', type: 'VOCABULARY' as const,
      duration: 20, order: 2, isFree: false,
      content: {
        topic: 'Взлёт и посадка',
        topicKz: 'Ұшу және қону',
        vocabularyItems: [
          { word: 'Cleared for takeoff', translation: 'Разрешён взлёт',          translationKz: 'Ұшуға рұқсат',          example: 'KZ557, cleared for takeoff runway 05' },
          { word: 'Line up and wait',    translation: 'Выруливайте и ждите',     translationKz: 'Шығыңыз және күтіңіз',   example: 'Line up and wait runway 23' },
          { word: 'Cleared to land',     translation: 'Разрешена посадка',       translationKz: 'Қонуға рұқсат',          example: 'Cleared to land runway 23R' },
          { word: 'Go around',           translation: 'Уход на второй круг',     translationKz: 'Екінші айналымға кету',  example: 'KZ557, go around' },
        ],
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
          { word: 'MAYDAY',         translation: 'Сигнал бедствия (угроза жизни)',          translationKz: 'Апат сигналы (өмірге қауіп)',       pronunciation: 'MAY-day' },
          { word: 'PAN-PAN',        translation: 'Сигнал срочности (серьёзная ситуация)',    translationKz: 'Шұғылдық сигналы (күрделі жағдай)', pronunciation: 'PAN-PAN' },
          { word: 'Souls on board', translation: 'Количество людей на борту',                translationKz: 'Бортта адамдар саны',                example: 'Souls on board 186' },
        ],
        icaoRule: 'MAYDAY произносится трижды и означает угрозу жизни. PAN-PAN произносится трижды и означает срочную ситуацию без угрозы жизни.',
        icaoRuleKz: 'MAYDAY үш рет айтылады және өмірге қауіпті білдіреді. PAN-PAN үш рет айтылады және өмірге қауіпсіз шұғыл жағдайды білдіреді.',
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
            questionKz: 'Апат жариялау кезінде "MAYDAY" сөзі қанша рет айтылады?',
            options: ['Один раз', 'Два раза', 'Три раза', 'Четыре раза'],
            optionsKz: ['Бір рет', 'Екі рет', 'Үш рет', 'Төрт рет'],
            correctAnswer: 2,
            explanation: 'Согласно ICAO, сигнал бедствия MAYDAY произносится трижды: "MAYDAY, MAYDAY, MAYDAY".',
            explanationKz: 'ИКАО бойынша апат сигналы MAYDAY үш рет айтылады: "MAYDAY, MAYDAY, MAYDAY".',
          },
          {
            id: 'q-2',
            question: 'Что означает "PAN-PAN" в авиации?',
            questionKz: 'Авиациядағы "PAN-PAN" не білдіреді?',
            options: ['Сигнал бедствия', 'Сигнал срочности без угрозы жизни', 'Запрос на посадку', 'Технический отказ'],
            optionsKz: ['Апат сигналы', 'Өмірге қауіпсіз шұғылдық сигналы', 'Қону сұранысы', 'Техникалық ақау'],
            correctAnswer: 1,
            explanation: 'PAN-PAN — международный сигнал срочности. Используется когда ситуация серьёзна, но нет непосредственной угрозы жизни.',
            explanationKz: 'PAN-PAN — халықаралық шұғылдық сигналы. Жағдай күрделі, бірақ өмірге тікелей қауіп жоқ кезде қолданылады.',
          },
          {
            id: 'q-3',
            question: 'Что включает стандартное сообщение MAYDAY?',
            questionKz: 'Стандартты MAYDAY хабары нені қамтиды?',
            options: [
              'Позывной, проблема, помощь, позиция',
              'Только позывной и проблема',
              'Позывной, проблема, позиция, топливо, количество людей',
              'Только сигнал бедствия',
            ],
            optionsKz: [
              'Шақыру белгісі, мәселе, көмек, позиция',
              'Тек шақыру белгісі мен мәселе',
              'Шақыру белгісі, мәселе, позиция, отын, адамдар саны',
              'Тек апат сигналы',
            ],
            correctAnswer: 2,
            explanation: 'Полное MAYDAY сообщение: позывной (×3), тип аварии, намерения, позиция, топливо (в часах), число людей на борту.',
            explanationKz: 'Толық MAYDAY хабары: шақыру белгісі (×3), апат түрі, ниеттер, позиция, отын (сағатпен), бортта адамдар саны.',
          },
        ],
      },
    },
  ];

  for (const l of lessons) {
    await prisma.lesson.upsert({ where: { id: l.id }, update: { content: l.content as any }, create: l as any });
  }
  console.log('✅ Lessons');

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