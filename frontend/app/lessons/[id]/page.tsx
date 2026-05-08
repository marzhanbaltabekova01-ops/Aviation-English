"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Button } from "@/components/ui/button";
import { lessonsApi } from "@/lib/api";
import { useLang } from "@/lib/lang-context";
import { cn } from "@/lib/utils";
import {
  ChevronLeft,
  ChevronRight,
  Headphones,
  FileText,
  HelpCircle,
  Book,
  Play,
  Pause,
  CheckCircle2,
  X,
  RotateCcw,
  Volume2,
  Award,
  Lock,
  Loader2,
} from "lucide-react";
import type { Lesson, LessonType, VocabularyItem, QuizQuestion } from "@/types";
import { useXpToast } from "@/components/ui/XpToast";

// ── Mock fallback data ───────────────────────────────────────────────────────
const mockLessons: Record<string, any> = {
  "l-1": {
    id: "l-1",
    courseId: "course-1",
    courseTitle: "Основы авиационного английского",
    courseTitleKz: "Авиациялық ағылшын тілінің негіздері",
    titleKz: "Авиациялық ағылшын тіліне кіріспе",
    title: "Введение в авиационный английский",
    type: "READING",
    duration: 15,
    order: 1,
    isFree: true,
    content: {
      article: {
        title: "Введение в авиационный английский",
        paragraphs: [
          "Авиационный английский — это специализированная форма английского языка, используемая в гражданской авиации для обеспечения безопасной и эффективной коммуникации между пилотами и авиадиспетчерами.",
          "История стандартизации авиационного английского началась после серии авиакатастроф, причиной которых стало недопонимание между членами экипажа и диспетчерами. В 2003 году ICAO установила требования к уровню владения английским языком для всех пилотов и диспетчеров, выполняющих международные полёты.",
          "Стандартная фразеология ICAO включает строго определённые фразы и выражения, которые должны использоваться в радиообмене. Это минимизирует риск неправильного толкования команд и инструкций.",
          "Фонетический алфавит ICAO (Alpha, Bravo, Charlie...) используется для чёткой передачи букв и чисел, особенно важных при передаче позывных, координат и метеоданных.",
        ],
        keyPoints: [
          "ICAO установила 6 уровней владения авиационным английским",
          "Минимальный уровень для международных полётов — Level 4 (Operational)",
          "Стандартная фразеология обязательна для всех радиопереговоров",
          "Фонетический алфавит ICAO исключает двусмысленность в передаче данных",
        ],
        paragraphsKz: [
          "Авиациялық ағылшын тілі — бұл азаматтық авиацияда ұшқыштар мен авиадиспетчерлер арасындағы қауіпсіз және тиімді байланысты қамтамасыз ету үшін қолданылатын ағылшын тілінің мамандандырылған түрі.",
          "Авиациялық ағылшын тілін стандарттау тарихы экипаж мүшелері мен диспетчерлер арасындағы түсінбеушіліктен болған бірқатар авиаапаттардан кейін басталды. 2003 жылы ИКАО халықаралық рейстер орындайтын барлық ұшқыштар мен диспетчерлер үшін ағылшын тілін меңгеру деңгейіне қойылатын талаптар белгіледі.",
          "ИКАО стандартты фразеологиясы радиобайланыста қолданылуы тиіс нақты белгіленген фразалар мен өрнектерді қамтиды. Бұл командалар мен нұсқаулықтарды дұрыс түсінбеу қаупін азайтады.",
          "ИКАО фонетикалық алфавиті (Alpha, Bravo, Charlie...) әріптер мен сандарды, әсіресе шақыру белгілері, координаттар мен метеодеректерді беру кезінде анық жеткізу үшін қолданылады.",
        ],
        keyPointsKz: [
          "ИКАО авиациялық ағылшын тілін меңгерудің 6 деңгейін белгіледі",
          "Халықаралық рейстер үшін ең төменгі деңгей — Level 4 (Operational)",
          "Стандартты фразеология барлық радио келіссөздер үшін міндетті",
          "ИКАО фонетикалық алфавиті деректерді беруде екіұштылықты жояды",
        ],
      },
    },
    courseLessons: [
      {
        id: "l-1",
        title: "Введение в авиационный английский",
        titleKz: "Авиациялық ағылшын тіліне кіріспе",
        type: "READING",
        isCompleted: false,
        order: 1,
        isFree: true,
        duration: 15,
      },
      {
        id: "l-2",
        title: "Фонетический алфавит ICAO",
        type: "LISTENING",
        isCompleted: false,
        order: 2,
        isFree: true,
        duration: 20,
      },
      {
        id: "l-3",
        title: "Базовые команды пилота",
        type: "VOCABULARY",
        isCompleted: false,
        order: 3,
        isFree: false,
        duration: 25,
      },
      {
        id: "l-4",
        title: "Тест: Основы",
        type: "QUIZ",
        isCompleted: false,
        order: 4,
        isFree: false,
        duration: 15,
      },
    ],
  },
  "l-2": {
    id: "l-2",
    courseId: "course-1",
    courseTitle: "Основы авиационного английского",
    courseTitleKz: "Авиациялық ағылшын тілінің негіздері",
    titleKz: "ICAO фонетикалық алфавиті",
    title: "Фонетический алфавит ICAO",
    type: "LISTENING",
    duration: 20,
    order: 2,
    isFree: true,
    content: {
      audioUrl: "/audio/icao-alphabet.mp3",
      transcript: `This is the ICAO phonetic alphabet used in aviation communications.\n\nAlpha - Bravo - Charlie - Delta - Echo - Foxtrot - Golf - Hotel - India - Juliet - Kilo - Lima - Mike - November - Oscar - Papa - Quebec - Romeo - Sierra - Tango - Uniform - Victor - Whiskey - X-ray - Yankee - Zulu.\n\nPractice: "Cleared for takeoff runway two-seven, climb flight level three-five-zero."`,
      keyPhrases: [
        "Cleared for takeoff",
        "Climb flight level",
        "Runway two-seven",
        "Standard phraseology",
      ],
      vocabulary: [
        {
          word: "Cleared",
          translation: "Разрешено",
          translationKz: "Рұқсат етілді",
          example: "Cleared for takeoff",
        },
        {
          word: "Runway",
          translation: "Взлётно-посадочная полоса",
          translationKz: "Ұшу-қону жолағы",
          example: "Runway 27",
        },
        {
          word: "Flight level",
          translation: "Эшелон полёта",
          translationKz: "Ұшу эшелоны",
          example: "Flight level 350",
        },
        {
          word: "Climb",
          translation: "Набор высоты",
          translationKz: "Биіктікке өрлеу",
          example: "Climb to FL350",
        },
      ],
      icaoRule:
        "ICAO Doc 9835: Все пилоты и диспетчеры должны использовать стандартный фонетический алфавит ICAO.",
      icaoRuleKz:
        "ИКАО Doc 9835: Барлық ұшқыштар мен диспетчерлер ИКАО стандартты фонетикалық алфавитін қолдануы тиіс.",
    },
    courseLessons: [
      {
        id: "l-1",
        title: "Введение в авиационный английский",
        titleKz: "Авиациялық ағылшын тіліне кіріспе",
        type: "READING",
        isCompleted: true,
        order: 1,
        isFree: true,
        duration: 15,
      },
      {
        id: "l-2",
        title: "Фонетический алфавит ICAO",
        type: "LISTENING",
        isCompleted: false,
        order: 2,
        isFree: true,
        duration: 20,
      },
      {
        id: "l-3",
        title: "Базовые команды пилота",
        type: "VOCABULARY",
        isCompleted: false,
        order: 3,
        isFree: false,
        duration: 25,
      },
      {
        id: "l-4",
        title: "Тест: Основы",
        type: "QUIZ",
        isCompleted: false,
        order: 4,
        isFree: false,
        duration: 15,
      },
    ],
  },
  "l-3": {
    id: "l-3",
    courseId: "course-1",
    courseTitle: "Основы авиационного английского",
    courseTitleKz: "Авиациялық ағылшын тілінің негіздері",
    titleKz: "Ұшқыштың негізгі командалары",
    title: "Базовые команды пилота",
    type: "VOCABULARY",
    duration: 25,
    order: 3,
    isFree: false,
    content: {
      topic: "Основные команды и фразы пилота",
      topicKz: "Ұшқыштың негізгі командалары мен фразалары",
      vocabularyItems: [
        {
          word: "Mayday",
          translation: "Бедствие (сигнал)",
          translationKz: "Апат (сигнал)",
          example: "Mayday, mayday, mayday, engine fire",
          pronunciation: "/ˈmeɪdeɪ/",
        },
        {
          word: "Pan-Pan",
          translation: "Срочность (сигнал)",
          translationKz: "Шұғылдық (сигнал)",
          example: "Pan-pan, pan-pan, medical emergency",
          pronunciation: "/pæn pæn/",
        },
        {
          word: "Roger",
          translation: "Понял, принял",
          translationKz: "Түсіндім, қабылдадым",
          example: "Roger, descending to FL200",
          pronunciation: "/ˈrɒdʒə/",
        },
        {
          word: "Wilco",
          translation: "Понял, выполняю",
          translationKz: "Түсіндім, орындаймын",
          example: "Wilco, turning left heading 270",
          pronunciation: "/ˈwɪlkəʊ/",
        },
        {
          word: "Affirm",
          translation: "Да, подтверждаю",
          translationKz: "Иә, растаймын",
          example: "Affirm, we have the traffic in sight",
          pronunciation: "/əˈfɜːm/",
        },
        {
          word: "Negative",
          translation: "Нет, отрицаю",
          translationKz: "Жоқ, теріске шығарамын",
          example: "Negative, unable to comply",
          pronunciation: "/ˈneɡətɪv/",
        },
        {
          word: "Stand by",
          translation: "Ожидайте",
          translationKz: "Күтіңіз",
          example: "Stand by for clearance",
          pronunciation: "/stænd baɪ/",
        },
        {
          word: "Say again",
          translation: "Повторите",
          translationKz: "Қайталаңыз",
          example: "Say again your callsign",
          pronunciation: "/seɪ əˈɡen/",
        },
      ],
    },
    courseLessons: [
      {
        id: "l-1",
        title: "Введение в авиационный английский",
        titleKz: "Авиациялық ағылшын тіліне кіріспе",
        type: "READING",
        isCompleted: true,
        order: 1,
        isFree: true,
        duration: 15,
      },
      {
        id: "l-2",
        title: "Фонетический алфавит ICAO",
        type: "LISTENING",
        isCompleted: true,
        order: 2,
        isFree: true,
        duration: 20,
      },
      {
        id: "l-3",
        title: "Базовые команды пилота",
        type: "VOCABULARY",
        isCompleted: false,
        order: 3,
        isFree: false,
        duration: 25,
      },
      {
        id: "l-4",
        title: "Тест: Основы",
        type: "QUIZ",
        isCompleted: false,
        order: 4,
        isFree: false,
        duration: 15,
      },
    ],
  },
  "l-4": {
    id: "l-4",
    courseId: "course-1",
    courseTitle: "Основы авиационного английского",
    courseTitleKz: "Авиациялық ағылшын тілінің негіздері",
    titleKz: "Тест: Негіздер",
    title: "Тест: Основы",
    type: "QUIZ",
    duration: 15,
    order: 4,
    isFree: false,
    content: {
      questions: [
        {
          id: "q1",
          question: "Какой сигнал используется для обозначения бедствия?",
          questionKz: "Апат белгісі ретінде қандай сигнал қолданылады?",
          options: ["Pan-Pan", "Mayday", "Roger", "Wilco"],
          correctAnswer: 1,
          explanation:
            'Mayday — международный сигнал бедствия от французского "m\'aidez" (помогите мне). Произносится трижды.',
          explanationKz:
            'Mayday — французша "m\'aidez" (маған көмектесіңіз) сөзінен шыққан апат сигналы. Үш рет айтылады.',
        },
        {
          id: "q2",
          question: 'Что означает фраза "Roger" в авиационном радиообмене?',
          questionKz:
            '"Roger" фразасы авиациялық радиобайланыста не білдіреді?',
          options: [
            "Выполняю команду",
            "Понял, принял сообщение",
            "Повторите запрос",
            "Ожидайте ответа",
          ],
          optionsKz: [
            "Командаңызды орындаймын",
            "Түсіндім, хабарды қабылдадым",
            "Сұрауды қайталаңыз",
            "Жауапты күтіңіз",
          ],
          correctAnswer: 1,
          explanation:
            'Roger — подтверждение получения, НЕ обязательство выполнить. Для выполнения используется "Wilco".',
          explanationKz:
            'Roger "хабарыңызды алдым" дегенді білдіреді. Орындауды растау үшін "Wilco" қолданылады.',
        },
        {
          id: "q3",
          question:
            "Какой минимальный уровень ICAO требуется для международных полётов?",
          questionKz:
            "Халықаралық рейстер үшін қажетті ең төменгі ИКАО деңгейі қандай?",
          options: [
            "Level 3 (Pre-Operational)",
            "Level 4 (Operational)",
            "Level 5 (Extended)",
            "Level 6 (Expert)",
          ],
          correctAnswer: 1,
          explanation:
            "ICAO Level 4 — обязательный минимум для пилотов и диспетчеров.",
          explanationKz:
            "ИКАО Level 4 (Operational) — халықаралық рейстер орындайтын ұшқыштар мен диспетчерлер үшін міндетті минимум.",
        },
        {
          id: "q4",
          question: 'Как произносится буква "W" в фонетическом алфавите ICAO?',
          questionKz: 'ИКАО фонетикалық алфавитінде "W" әрпі қалай айтылады?',
          options: ["William", "Whiskey", "Warsaw", "Walter"],
          correctAnswer: 1,
          explanation: 'W = "Whiskey" (ВИСКЕЙ).',
          explanationKz:
            'ИКАО алфавитінде W әрпі "Whiskey" (ВИСКЕЙ) сөзімен белгіленеді.',
        },
        {
          id: "q5",
          question: 'Что означает "Wilco" в авиационном радиообмене?',
          questionKz:
            '"Wilco" фразасы авиациялық радиобайланыста не білдіреді?',
          options: [
            "Понял, принял сообщение",
            "Повторите последнее сообщение",
            "Понял, выполняю",
            "Ожидайте разрешения",
          ],
          optionsKz: [
            "Түсіндім, хабарды қабылдадым",
            "Соңғы хабарды қайталаңыз",
            "Түсіндім, орындаймын",
            "Рұқсатты күтіңіз",
          ],
          correctAnswer: 2,
          explanation:
            '"Wilco" = Will comply (выполню). В отличие от Roger, означает обязательство выполнить.',
          explanationKz:
            '"Wilco" — "Will comply" (орындаймын) қысқартылуы. "Roger"-ден айырмашылығы — орындауға міндеттенеді.',
        },
      ],
    },
    courseLessons: [
      {
        id: "l-1",
        title: "Введение в авиационный английский",
        titleKz: "Авиациялық ағылшын тіліне кіріспе",
        type: "READING",
        isCompleted: true,
        order: 1,
        isFree: true,
        duration: 15,
      },
      {
        id: "l-2",
        title: "Фонетический алфавит ICAO",
        type: "LISTENING",
        isCompleted: true,
        order: 2,
        isFree: true,
        duration: 20,
      },
      {
        id: "l-3",
        title: "Базовые команды пилота",
        type: "VOCABULARY",
        isCompleted: true,
        order: 3,
        isFree: false,
        duration: 25,
      },
      {
        id: "l-4",
        title: "Тест: Основы",
        type: "QUIZ",
        isCompleted: false,
        order: 4,
        isFree: false,
        duration: 15,
      },
    ],
  },
};
for (let i = 5; i <= 8; i++) {
  mockLessons[`l-${i}`] = {
    ...mockLessons["l-1"],
    id: `l-${i}`,
    title: `Урок ${i}`,
    order: i,
    isFree: false,
  };
}

// ── XP config ────────────────────────────────────────────────────────────────
const XP_BY_TYPE: Record<string, number> = {
  READING: 10,
  LISTENING: 15,
  VOCABULARY: 12,
};
const LEVELS = [
  { name: "Beginner", minXp: 0, icon: "🎓" },
  { name: "Student", minXp: 100, icon: "📚" },
  { name: "Pilot", minXp: 300, icon: "✈️" },
  { name: "Captain", minXp: 700, icon: "🎖️" },
  { name: "Expert", minXp: 1500, icon: "⭐" },
];
function getLevelForXp(xp: number) {
  let level = LEVELS[0];
  for (const l of LEVELS) {
    if (xp >= l.minXp) level = l;
  }
  return level;
}
const lessonTypeIcons: Record<string, any> = {
  LISTENING: Headphones,
  QUIZ: HelpCircle,
  VOCABULARY: Book,
  READING: FileText,
};

// ── Translation helper ───────────────────────────────────────────────────────
type Lang = "ru" | "kz";
function tx(lang: Lang, ru: string, kz: string) {
  return lang === "kz" ? kz : ru;
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function LessonPage() {
  const params = useParams();
  const router = useRouter();
  const lessonId = params.id as string;
  const { lang } = useLang();

  const [lesson, setLesson] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isCompleting, setIsCompleting] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  const [totalXp, setTotalXp] = useState<number>(() => {
    if (typeof window !== "undefined")
      return parseInt(localStorage.getItem("aviation_xp") ?? "0", 10);
    return 0;
  });
  const { showXpToast, ToastComponent } = useXpToast();

  useEffect(() => {
    const fetchLesson = async () => {
      setLoading(true);
      try {
        const res = await lessonsApi.getById(lessonId);
        const data = res;
        const normalised = {
          ...data,
          courseTitle: data.course?.title ?? data.courseTitle ?? "",
          courseLessons: (data.courseLessons ?? []).map((l: any) => ({
            id: l.id,
            title: l.title,
            type: l.type,
            order: l.order,
            isFree: l.isFree,
            duration: l.duration,
            isCompleted: l.isCompleted ?? false,
          })),
        };
        setLesson(normalised);
      } catch {
        const mock = mockLessons[lessonId];
        setLesson(mock ?? null);
      } finally {
        setLoading(false);
      }
    };
    fetchLesson();
  }, [lessonId]);

  if (loading)
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">
              {tx(lang, "Загружаем урок...", "Сабақ жүктелуде...")}
            </p>
          </div>
        </main>
      </div>
    );

  if (!lesson)
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">
              {tx(lang, "Урок не найден", "Сабақ табылмады")}
            </h1>
            <Link href="/courses">
              <Button>
                {tx(lang, "Вернуться к курсам", "Курстарға оралу")}
              </Button>
            </Link>
          </div>
        </main>
      </div>
    );

  const completedCount = lesson.courseLessons.filter(
    (l: any) => l.isCompleted,
  ).length;
  const progress =
    lesson.courseLessons.length > 0
      ? (completedCount / lesson.courseLessons.length) * 100
      : 0;
  const currentIndex = lesson.courseLessons.findIndex(
    (l: any) => l.id === lessonId,
  );
  const prevLesson =
    currentIndex > 0 ? lesson.courseLessons[currentIndex - 1] : null;
  const nextLesson =
    currentIndex < lesson.courseLessons.length - 1
      ? lesson.courseLessons[currentIndex + 1]
      : null;

  const awardXp = (gained: number) => {
    const newXp = totalXp + gained;
    const oldLevel = getLevelForXp(totalXp);
    const newLevel = getLevelForXp(newXp);
    const leveledUp = newLevel.name !== oldLevel.name;
    setTotalXp(newXp);
    localStorage.setItem("aviation_xp", String(newXp));
    showXpToast({
      gained,
      leveledUp,
      newLevel: leveledUp ? newLevel.name : undefined,
      levelIcon: leveledUp ? newLevel.icon : undefined,
    });
  };

  const handleComplete = async () => {
    setIsCompleting(true);
    try {
      const res = await lessonsApi.complete(lessonId);
      const data = res as any;
      if (data?.gained > 0) {
        const newXp = data.xp ?? totalXp + data.gained;
        const oldLevel = getLevelForXp(totalXp);
        const newLevel = getLevelForXp(newXp);
        const leveledUp = newLevel.name !== oldLevel.name;
        setTotalXp(newXp);
        localStorage.setItem("aviation_xp", String(newXp));
        showXpToast({
          gained: data.gained,
          leveledUp,
          newLevel: leveledUp ? newLevel.name : undefined,
          levelIcon: leveledUp ? newLevel.icon : undefined,
        });
      }
    } catch {
      awardXp(XP_BY_TYPE[lesson.type] ?? 10);
    } finally {
      setIsCompleting(false);
      if (nextLesson)
        setTimeout(() => router.push(`/lessons/${nextLesson.id}`), 1800);
    }
  };

  const handleQuizComplete = async (score: number) => {
    setIsCompleting(true);
    try {
      const res = await lessonsApi.complete(lessonId);
      const data = res as any;
      if (data?.gained > 0) {
        const newXp = data.xp ?? totalXp + data.gained;
        const oldLevel = getLevelForXp(totalXp);
        const newLevel = getLevelForXp(newXp);
        const leveledUp = newLevel.name !== oldLevel.name;
        setTotalXp(newXp);
        localStorage.setItem("aviation_xp", String(newXp));
        showXpToast({
          gained: data.gained,
          leveledUp,
          newLevel: leveledUp ? newLevel.name : undefined,
          levelIcon: leveledUp ? newLevel.icon : undefined,
        });
      }
    } catch {
      awardXp(score === 100 ? 50 : 30);
    } finally {
      setIsCompleting(false);
      if (nextLesson)
        setTimeout(() => router.push(`/lessons/${nextLesson.id}`), 2200);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      {ToastComponent}
      <div className="flex-1 flex">
        {/* Sidebar */}
        <aside className="hidden lg:flex w-80 flex-col border-r border-border bg-card">
          <div className="p-4 border-b border-border">
            <Link
              href={`/courses/${lesson.courseId}`}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {lang === "kz" && lesson.courseTitleKz
                ? lesson.courseTitleKz
                : lesson.courseTitle}
            </Link>
            <div className="mt-4">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-muted-foreground">
                  {tx(lang, "Прогресс курса", "Курс үлгерімі")}
                </span>
                <span className="font-medium text-foreground">
                  {Math.round(progress)}%
                </span>
              </div>
              <ProgressBar value={progress} size="sm" />
            </div>
            <div className="mt-4 flex items-center justify-between px-3 py-2 bg-primary/5 border border-primary/15 rounded-lg">
              <div className="flex items-center gap-2">
                <span className="text-base">{getLevelForXp(totalXp).icon}</span>
                <span className="text-xs font-medium text-foreground">
                  {getLevelForXp(totalXp).name}
                </span>
              </div>
              <span className="text-xs font-bold text-primary">
                {totalXp} XP
              </span>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-2">
              {lesson.courseLessons.map((l: any, index: number) => {
                const Icon = lessonTypeIcons[l.type] ?? FileText;
                const isActive = l.id === lessonId;
                const isLocked =
                  !l.isCompleted &&
                  index > 0 &&
                  !lesson.courseLessons[index - 1]?.isCompleted &&
                  l.id !== lessonId;
                return (
                  <Link
                    key={l.id}
                    href={isLocked ? "#" : `/lessons/${l.id}`}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-lg transition-colors",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : isLocked
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:bg-muted text-muted-foreground hover:text-foreground",
                    )}
                  >
                    <div
                      className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-full text-sm",
                        l.isCompleted
                          ? "bg-success text-white"
                          : isActive
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground",
                      )}
                    >
                      {l.isCompleted ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : isLocked ? (
                        <Lock className="h-4 w-4" />
                      ) : (
                        index + 1
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">
                        {lang === "kz" && l.titleKz ? l.titleKz : l.title}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto p-6 lg:p-8">
            <div className="mb-8">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <span>
                  {tx(lang, "Урок", "Сабақ")} {lesson.order}
                </span>
                <span>•</span>
                <span>
                  {lesson.duration} {tx(lang, "мин", "мин")}
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                {lang === "kz" && lesson.titleKz
                  ? lesson.titleKz
                  : lesson.title}
              </h1>
            </div>

            {(lesson.type as string) === "READING" && (
              <ReadingLesson content={lesson.content} lang={lang} />
            )}
            {(lesson.type as string) === "LISTENING" && (
              <ListeningLesson content={lesson.content} lang={lang} />
            )}
            {(lesson.type as string) === "VOCABULARY" && (
              <VocabularyLesson content={lesson.content} lang={lang} />
            )}
            {(lesson.type as string) === "QUIZ" && (
              <QuizLesson
                content={lesson.content}
                onComplete={handleQuizComplete}
                lang={lang}
              />
            )}

            {(lesson.type as string) !== "QUIZ" && (
              <div className="mt-12 flex items-center justify-between pt-8 border-t border-border">
                {prevLesson ? (
                  <Link href={`/lessons/${prevLesson.id}`}>
                    <Button variant="outline" className="gap-2">
                      <ChevronLeft className="h-4 w-4" />
                      {tx(lang, "Назад", "Артқа")}
                    </Button>
                  </Link>
                ) : (
                  <div />
                )}
                <Button
                  onClick={handleComplete}
                  disabled={isCompleting}
                  className="bg-primary hover:bg-primary/90 gap-2"
                >
                  {isCompleting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4" />
                  )}
                  {tx(lang, "Завершить урок", "Сабақты аяқтау")}
                </Button>
                {nextLesson ? (
                  <Link href={`/lessons/${nextLesson.id}`}>
                    <Button variant="outline" className="gap-2">
                      {tx(lang, "Далее", "Келесі")}
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </Link>
                ) : (
                  <div />
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

// ── ReadingLesson ─────────────────────────────────────────────────────────────
function ReadingLesson({ content, lang }: { content: any; lang: Lang }) {
  const article = content?.article;
  if (!article) return null;
  const paragraphs =
    lang === "kz" && article.paragraphsKz
      ? article.paragraphsKz
      : article.paragraphs;
  const keyPoints =
    lang === "kz" && article.keyPointsKz
      ? article.keyPointsKz
      : article.keyPoints;
  return (
    <div className="space-y-8">
      <article className="prose prose-lg max-w-none">
        {paragraphs.map((p: string, i: number) => (
          <p key={i} className="text-foreground leading-relaxed mb-4">
            {p}
          </p>
        ))}
      </article>
      {keyPoints && (
        <div className="bg-primary/5 rounded-xl p-6 border border-primary/20">
          <h3 className="font-semibold text-foreground mb-4">
            {tx(lang, "Ключевые моменты", "Негізгі тұстар")}
          </h3>
          <ul className="space-y-3">
            {keyPoints.map((point: string, i: number) => (
              <li key={i} className="flex items-start gap-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium flex-shrink-0">
                  {i + 1}
                </span>
                <span className="text-muted-foreground">{point}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// ── ListeningLesson ───────────────────────────────────────────────────────────
function ListeningLesson({ content, lang }: { content: any; lang: Lang }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set());
  const [currentWord, setCurrentWord] = useState(-1);
  const [myVocab, setMyVocab] = useState<
    { word: string; translation: string }[]
  >([]);
  const [editWord, setEditWord] = useState<{
    word: string;
    translation: string;
  } | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const addToVocab = (clean: string, original: string) => {
    if (myVocab.some((v) => v.word.toLowerCase() === clean)) return;
    setEditWord({
      word: original.replace(/[^a-zA-Z\-\s]/g, "").trim() || clean,
      translation: "",
    });
  };
  const confirmAdd = () => {
    if (!editWord) return;
    setMyVocab((prev) => [
      ...prev,
      { word: editWord.word, translation: editWord.translation || "—" },
    ]);
    setEditWord(null);
  };
  const removeFromVocab = (word: string) =>
    setMyVocab((prev) => prev.filter((v) => v.word !== word));

  useEffect(() => {
    return () => {
      window.speechSynthesis?.cancel();
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const speak = (text: string) => {
    window.speechSynthesis.cancel();
    setProgress(0);
    setCurrentWord(-1);
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 0.85;
    const voices = window.speechSynthesis.getVoices();
    const voice =
      voices.find((v) => v.lang === "en-US" && v.name.includes("Google")) ||
      voices.find((v) => v.lang === "en-US") ||
      voices.find((v) => v.lang.startsWith("en")) ||
      voices[0];
    if (voice) utterance.voice = voice;
    const words = text.split(" ");
    utterance.onboundary = (e) => {
      if (e.name === "word") {
        let count = 0;
        for (let i = 0; i < words.length; i++) {
          count += words[i].length + 1;
          if (count > e.charIndex) {
            setCurrentWord(i);
            break;
          }
        }
      }
    };
    utterance.onend = () => {
      setIsPlaying(false);
      setProgress(100);
      setCurrentWord(-1);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
    utterance.onerror = () => {
      setIsPlaying(false);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setProgress((p) => {
        if (p >= 99) {
          clearInterval(intervalRef.current!);
          return p;
        }
        return p + 0.4;
      });
    }, 200);
    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
  };

  const handlePlay = () => {
    if (isPlaying) {
      window.speechSynthesis.pause();
      setIsPlaying(false);
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      setIsPlaying(true);
      intervalRef.current = setInterval(() => {
        setProgress((p) => {
          if (p >= 99) {
            clearInterval(intervalRef.current!);
            return p;
          }
          return p + 0.4;
        });
      }, 200);
      return;
    }
    const text =
      content?.transcript ||
      content?.vocabulary
        ?.map((v: any) => `${v.word}. ${v.translation}`)
        .join(". ") ||
      "";
    speak(text);
  };

  const handleStop = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setProgress(0);
    setCurrentWord(-1);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };
  const speakPhrase = (phrase: string) => {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(phrase);
    u.lang = "en-US";
    u.rate = 0.8;
    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find((v) => v.lang.startsWith("en")) || voices[0];
    if (voice) u.voice = voice;
    window.speechSynthesis.speak(u);
  };
  const toggleCard = (i: number) =>
    setFlippedCards((prev) => {
      const s = new Set(prev);
      s.has(i) ? s.delete(i) : s.add(i);
      return s;
    });
  const words = content?.transcript?.split(" ") ?? [];

  return (
    <div className="space-y-8">
      {/* Audio Player */}
      <div className="bg-card rounded-xl border border-border p-6">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={handlePlay}
            className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            {isPlaying ? (
              <Pause className="h-6 w-6" />
            ) : (
              <Play className="h-6 w-6 ml-1" />
            )}
          </button>
          {(isPlaying || progress > 0) && (
            <button
              onClick={handleStop}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border hover:bg-muted transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">
                {isPlaying
                  ? tx(lang, "🔊 Воспроизведение...", "🔊 Ойнатылуда...")
                  : progress === 100
                    ? tx(lang, "✅ Завершено", "✅ Аяқталды")
                    : tx(lang, "Аудио урок", "Аудио сабақ")}
              </span>
              <span className="text-xs text-muted-foreground">
                {Math.round(progress)}%
              </span>
            </div>
            <ProgressBar value={progress} size="md" />
          </div>
          <Volume2 className="h-5 w-5 text-muted-foreground" />
        </div>
        <div className="flex items-end justify-center gap-1 h-16">
          {[...Array(40)].map((_, i) => (
            <div
              key={i}
              className={cn(
                "w-1 rounded-full transition-all duration-300",
                isPlaying ? "bg-primary waveform-bar" : "bg-primary/30",
              )}
              style={{
                height: `${Math.sin(i * 0.4) * 30 + 40}%`,
                animationDelay: `${i * 0.04}s`,
              }}
            />
          ))}
        </div>
        <p className="text-xs text-muted-foreground text-center mt-3">
          {tx(
            lang,
            "💡 Скорость 0.85x. Нажми на фразу ниже чтобы прослушать отдельно.",
            "💡 Жылдамдық 0.85x. Жеке тыңдау үшін төмендегі фразаны басыңыз.",
          )}
        </p>
      </div>

      {/* Transcript */}
      {content?.transcript && (
        <div className="bg-muted/30 rounded-xl p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-foreground">
              {tx(lang, "Транскрипция", "Транскрипция")}
            </h3>
            <span className="text-xs text-muted-foreground">
              {tx(
                lang,
                "Нажми на слово чтобы добавить в словарь",
                "Сөздікке қосу үшін сөзді басыңыз",
              )}
            </span>
          </div>
          <div className="leading-relaxed">
            {words.map((word: string, i: number) => {
              const clean = word.replace(/[^a-zA-Z\-]/g, "").toLowerCase();
              const inDict = myVocab.some(
                (v) => v.word.toLowerCase() === clean,
              );
              return (
                <span
                  key={i}
                  onClick={() => clean.length > 2 && addToVocab(clean, word)}
                  className={cn(
                    "transition-all duration-150 rounded px-0.5 cursor-pointer",
                    currentWord === i
                      ? "bg-primary text-primary-foreground font-medium"
                      : inDict
                        ? "bg-green-100 text-green-800 font-medium"
                        : currentWord > i
                          ? "text-foreground hover:bg-primary/10"
                          : "text-muted-foreground hover:bg-primary/10",
                  )}
                  title={
                    clean.length > 2
                      ? inDict
                        ? tx(lang, "Уже в словаре", "Сөздікте бар")
                        : tx(lang, "Добавить в словарь", "Сөздікке қосу")
                      : ""
                  }
                >
                  {word}{" "}
                </span>
              );
            })}
          </div>
          {content.keyPhrases && (
            <div className="mt-4 flex flex-wrap gap-2">
              {content.keyPhrases.map((phrase: string, i: number) => (
                <button
                  key={i}
                  onClick={() => speakPhrase(phrase)}
                  className="px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium hover:bg-primary/20 transition-colors flex items-center gap-1"
                >
                  🔊 {phrase}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Vocabulary Cards */}
      {content?.vocabulary && (
        <div>
          <h3 className="font-semibold text-foreground mb-4">
            {tx(lang, "Словарь урока", "Сабақ сөздігі")}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {content.vocabulary.map((item: VocabularyItem, i: number) => (
              <div
                key={i}
                onClick={() => toggleCard(i)}
                className={cn(
                  "flip-card cursor-pointer",
                  flippedCards.has(i) && "flipped",
                )}
              >
                <div className="flip-card-inner">
                  <div className="flip-card-front bg-card rounded-xl border border-border p-4 flex flex-col justify-between">
                    <div className="flex items-center justify-between gap-2">
                      <div className="font-semibold text-base text-foreground">
                        {item.word}
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          speakPhrase(item.word);
                        }}
                        className="p-1.5 rounded-full hover:bg-primary/10 transition-colors flex-shrink-0"
                      >
                        <Volume2 className="h-4 w-4 text-primary" />
                      </button>
                    </div>
                    {item.example && (
                      <div className="text-sm text-muted-foreground mt-1">
                        {item.example}
                      </div>
                    )}
                    <div className="text-xs text-primary mt-2">
                      {tx(
                        lang,
                        "🔄 Нажмите для перевода",
                        "🔄 Аудару үшін басыңыз",
                      )}
                    </div>
                  </div>
                  <div className="flip-card-back bg-primary text-primary-foreground rounded-xl p-4 flex flex-col justify-center">
                    <div className="font-semibold text-sm leading-snug break-words">
                      {lang === "kz" && (item as any).translationKz
                        ? (item as any).translationKz
                        : item.translation}
                    </div>
                    <div className="text-xs opacity-80 mt-1 break-words">
                      {item.word}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {content?.icaoRule && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <Award className="h-5 w-5 text-amber-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-amber-800 mb-1">
                {tx(lang, "Правило ICAO", "ICAO ережесі")}
              </h4>
              <p className="text-amber-700 text-sm">
                {lang === "kz" && content.icaoRuleKz
                  ? content.icaoRuleKz
                  : content.icaoRule}
              </p>
            </div>
          </div>
        </div>
      )}

      {content?.vocabulary && content.vocabulary.length > 0 && (
        <div className="border border-border rounded-xl p-5">
          <h3 className="font-semibold text-foreground mb-4">
            {tx(
              lang,
              "Тренировка — соедини слово с переводом",
              "Жаттығу — сөзді аудармамен байланыстыру",
            )}
          </h3>
          <DragDropVocab items={content.vocabulary} lang={lang} />
        </div>
      )}

      {/* Edit word modal */}
      {editWord && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          onClick={() => setEditWord(null)}
        >
          <div
            className="bg-card border border-border rounded-xl p-6 w-80 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-semibold text-foreground mb-4">
              {tx(lang, "Добавить в мой словарь", "Менің сөздігіме қосу")}
            </h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">
                  {tx(lang, "Слово (английский)", "Сөз (ағылшынша)")}
                </label>
                <input
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:border-primary"
                  value={editWord.word}
                  onChange={(e) =>
                    setEditWord((v) => (v ? { ...v, word: e.target.value } : v))
                  }
                  autoFocus
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">
                  {tx(lang, "Перевод (русский)", "Аударма (қазақша)")}
                </label>
                <input
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:border-primary"
                  placeholder={tx(
                    lang,
                    "Введите перевод...",
                    "Аударманы енгізіңіз...",
                  )}
                  value={editWord.translation}
                  onChange={(e) =>
                    setEditWord((v) =>
                      v ? { ...v, translation: e.target.value } : v,
                    )
                  }
                  onKeyDown={(e) => e.key === "Enter" && confirmAdd()}
                />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setEditWord(null)}
              >
                {tx(lang, "Отмена", "Болдырмау")}
              </Button>
              <Button className="flex-1" onClick={confirmAdd}>
                {tx(lang, "Добавить", "Қосу")}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* My vocabulary */}
      {myVocab.length > 0 && (
        <div className="border border-border rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 bg-muted/30 border-b border-border">
            <h3 className="font-semibold text-foreground">
              {tx(lang, "Мой словарь", "Менің сөздігім")}
            </h3>
            <span className="text-xs text-muted-foreground bg-primary/10 text-primary px-2 py-0.5 rounded-full">
              {myVocab.length} {tx(lang, "слов", "сөз")}
            </span>
          </div>
          <div className="divide-y divide-border">
            {myVocab.map((item, i) => (
              <div key={i} className="flex items-center gap-3 px-5 py-3">
                <button
                  onClick={() => speakPhrase(item.word)}
                  className="p-1 rounded hover:bg-muted transition-colors flex-shrink-0"
                >
                  <Volume2 className="h-3.5 w-3.5 text-primary" />
                </button>
                <span className="font-medium text-foreground text-sm flex-1">
                  {item.word}
                </span>
                <span className="text-muted-foreground text-sm flex-1">
                  {item.translation}
                </span>
                <button
                  onClick={() => removeFromVocab(item.word)}
                  className="p-1 rounded hover:bg-red-50 transition-colors flex-shrink-0"
                >
                  <X className="h-3.5 w-3.5 text-muted-foreground hover:text-red-500" />
                </button>
              </div>
            ))}
          </div>
          {myVocab.length >= 3 && (
            <div className="px-5 py-3 border-t border-border">
              <h4 className="font-medium text-foreground text-sm mb-3">
                {tx(lang, "Тренировка словаря", "Сөздік жаттығуы")}
              </h4>
              <DragDropVocab items={myVocab} lang={lang} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── DragDropVocab ─────────────────────────────────────────────────────────────
function DragDropVocab({
  items,
  lang,
}: {
  items: VocabularyItem[];
  lang: Lang;
}) {
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [wrong, setWrong] = useState<string | null>(null);
  const [dragging, setDragging] = useState<string | null>(null);
  const [transOrder, setTransOrder] = useState<VocabularyItem[]>([]);

  useEffect(() => {
    setTransOrder([...items].sort(() => Math.random() - 0.5));
    setMatched(new Set());
    setWrong(null);
  }, [items]);

  const handleDrop = (targetWord: string) => {
    if (!dragging) return;
    if (dragging === targetWord) {
      setMatched((prev) => new Set([...prev, targetWord]));
      setWrong(null);
    } else {
      setWrong(targetWord);
      setTimeout(() => setWrong(null), 700);
    }
    setDragging(null);
  };

  const allDone = matched.size === items.length;

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-muted-foreground">
          {tx(
            lang,
            "Перетащи слово к правильному переводу",
            "Сөзді дұрыс аудармаға апарыңыз",
          )}
        </p>
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-foreground">
            {matched.size} / {items.length}
          </span>
          <button
            onClick={() => {
              setMatched(new Set());
              setWrong(null);
              setTransOrder([...items].sort(() => Math.random() - 0.5));
            }}
            className="text-xs px-3 py-1.5 rounded-md border border-border hover:bg-muted transition-colors text-muted-foreground"
          >
            {tx(lang, "Сбросить", "Қалпына келтіру")}
          </button>
        </div>
      </div>
      {allDone && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl text-sm text-green-700 text-center font-medium">
          {tx(
            lang,
            "🎉 Отлично! Все слова угаданы!",
            "🎉 Керемет! Барлық сөздер табылды!",
          )}
        </div>
      )}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">
            {tx(lang, "Английский", "Ағылшын тілі")}
          </div>
          {items.map((item) => (
            <div
              key={item.word}
              draggable={!matched.has(item.word)}
              onDragStart={() => setDragging(item.word)}
              onDragEnd={() => setDragging(null)}
              className={cn(
                "px-3 py-2.5 rounded-lg border text-sm font-medium transition-all select-none",
                matched.has(item.word)
                  ? "bg-green-50 border-green-200 text-green-700 cursor-default"
                  : dragging === item.word
                    ? "opacity-40 border-dashed border-border cursor-grabbing"
                    : "bg-card border-border cursor-grab hover:border-primary/50 hover:bg-primary/5 text-foreground",
              )}
            >
              <div className="flex items-center justify-between">
                <span>{item.word}</span>
                {matched.has(item.word) && (
                  <span className="text-green-600 text-xs">✓</span>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="space-y-2">
          <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">
            {tx(lang, "Перевод", "Аударма")}
          </div>
          {transOrder.map((item) => (
            <div
              key={item.word}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(item.word)}
              className={cn(
                "px-3 py-2.5 rounded-lg border text-sm transition-all min-h-[42px] flex items-center gap-2",
                matched.has(item.word)
                  ? "bg-green-50 border-green-200 text-green-700"
                  : wrong === item.word
                    ? "bg-red-50 border-red-300 text-red-600"
                    : "bg-muted/40 border-dashed border-border text-muted-foreground",
              )}
            >
              {matched.has(item.word) ? (
                <>
                  <span className="font-medium text-green-700">
                    {item.word}
                  </span>
                  <span className="text-muted-foreground text-xs ml-auto">
                    {lang === "kz" && (item as any).translationKz
                      ? (item as any).translationKz
                      : item.translation}
                  </span>
                </>
              ) : (
                <span>
                  {lang === "kz" && (item as any).translationKz
                    ? (item as any).translationKz
                    : item.translation}
                </span>
              )}
              {wrong === item.word && (
                <span className="ml-auto text-red-500 text-xs">✗</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── VocabularyLesson ──────────────────────────────────────────────────────────
function VocabularyLesson({ content, lang }: { content: any; lang: Lang }) {
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set());
  const toggleCard = (i: number) =>
    setFlippedCards((prev) => {
      const s = new Set(prev);
      s.has(i) ? s.delete(i) : s.add(i);
      return s;
    });
  if (!content?.vocabularyItems) return null;

  const speakPhrase = (phrase: string) => {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(phrase);
    u.lang = "en-US";
    u.rate = 0.8;
    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find((v) => v.lang.startsWith("en")) || voices[0];
    if (voice) u.voice = voice;
    window.speechSynthesis.speak(u);
  };

  return (
    <div className="space-y-8">
      {content.topic && (
        <div className="text-lg text-muted-foreground">
          {tx(lang, "Тема", "Тақырып")}:{" "}
          <span className="font-medium text-foreground">
            {lang === "kz" && content.topicKz ? content.topicKz : content.topic}
          </span>
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {content.vocabularyItems.map((item: VocabularyItem, i: number) => (
          <div
            key={i}
            onClick={() => toggleCard(i)}
            className={cn(
              "flip-card cursor-pointer",
              flippedCards.has(i) && "flipped",
            )}
          >
            <div
              className="flip-card-inner"
              style={{ transformStyle: "preserve-3d" }}
            >
              <div className="flip-card-front bg-card rounded-xl border border-border p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <div className="font-bold text-xl text-foreground">
                      {item.word}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        speakPhrase(item.word);
                      }}
                      className="p-1.5 rounded-full hover:bg-primary/10 transition-colors"
                    >
                      <Volume2 className="h-4 w-4 text-primary" />
                    </button>
                  </div>
                  {item.pronunciation && (
                    <div className="text-sm text-muted-foreground mt-1">
                      {item.pronunciation}
                    </div>
                  )}
                </div>
                {item.example && (
                  <div className="text-sm text-muted-foreground italic">
                    &ldquo;{item.example}&rdquo;
                  </div>
                )}
                <div className="text-xs text-primary">
                  {tx(
                    lang,
                    "🔄 Нажмите для перевода",
                    "🔄 Аудару үшін басыңыз",
                  )}
                </div>
              </div>
              <div
                className="flip-card-back bg-primary text-primary-foreground rounded-xl p-5 flex flex-col justify-center items-center"
                style={{ transform: "rotateY(180deg)" }}
              >
                <div className="font-bold text-sm text-center leading-snug break-words w-full">
                  {lang === "kz" && (item as any).translationKz
                    ? (item as any).translationKz
                    : item.translation}
                </div>
                <div className="text-xs opacity-70 mt-2 text-center break-words w-full">
                  {item.word}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center">
        <Button
          variant="outline"
          onClick={() => setFlippedCards(new Set())}
          className="gap-2"
        >
          <RotateCcw className="h-4 w-4" />
          {tx(
            lang,
            "Сбросить все карточки",
            "Барлық карточкаларды қалпына келтіру",
          )}
        </Button>
      </div>
      <div className="border border-border rounded-xl p-5">
        <h3 className="font-semibold text-foreground mb-4">
          {tx(
            lang,
            "Тренировка — соедини слово с переводом",
            "Жаттығу — сөзді аудармамен байланыстыру",
          )}
        </h3>
        <DragDropVocab items={content.vocabularyItems} lang={lang} />
      </div>
    </div>
  );
}

// ── QuizLesson ────────────────────────────────────────────────────────────────
function QuizLesson({
  content,
  onComplete,
  lang,
}: {
  content: any;
  onComplete: (score: number) => void;
  lang: Lang;
}) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [answers, setAnswers] = useState<number[]>([]);
  const [isFinished, setIsFinished] = useState(false);

  const questions: QuizQuestion[] = content?.questions || [];
  const question = questions[currentQuestion];

  const handleAnswer = (idx: number) => {
    if (showResult) return;
    setSelectedAnswer(idx);
    setShowResult(true);
    setAnswers([...answers, idx]);
  };
  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((q) => q + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else setIsFinished(true);
  };

  const correctAnswers = answers.filter(
    (a, i) => a === questions[i]?.correctAnswer,
  ).length;
  const score =
    questions.length > 0
      ? Math.round((correctAnswers / questions.length) * 100)
      : 0;
  const xp = score === 100 ? 50 : 30;
  const PASS = 80;

  if (isFinished) {
    const passed = score >= PASS;
    return (
      <div className="text-center py-12">
        <div
          className={`inline-flex items-center justify-center h-24 w-24 rounded-full mb-6 ${passed ? "bg-green-100" : "bg-red-100"}`}
        >
          {passed ? (
            <Award className="h-12 w-12 text-green-600" />
          ) : (
            <X className="h-12 w-12 text-red-500" />
          )}
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">
          {passed
            ? tx(lang, "✅ Тест пройден!", "✅ Тест өтті!")
            : tx(lang, "❌ Тест не пройден", "❌ Тест өтпеді")}
        </h2>
        <p className="text-muted-foreground mb-6">
          {tx(lang, "Вы ответили правильно на", "Дұрыс жауап бердіңіз")}{" "}
          {correctAnswers} {tx(lang, "из", "ден")} {questions.length}{" "}
          {tx(lang, "вопросов", "сұрақтан")}
        </p>
        <div
          className={`inline-flex items-center justify-center w-28 h-28 rounded-full border-4 mb-4 ${passed ? "border-green-500 text-green-600" : "border-red-400 text-red-500"}`}
        >
          <span className="text-4xl font-bold">{score}%</span>
        </div>
        <div
          className={`mx-auto max-w-sm rounded-xl p-4 mb-8 text-sm ${passed ? "bg-green-50 border border-green-200 text-green-700" : "bg-red-50 border border-red-200 text-red-600"}`}
        >
          {passed ? (
            <p>
              🎉 {tx(lang, "Минимальный проходной балл", "Ең төменгі өту балы")}{" "}
              <strong>{PASS}%</strong> {tx(lang, "достигнут!", "жетті!")} +{xp}{" "}
              {tx(lang, "XP заработано.", "XP тапсырылды.")}
            </p>
          ) : (
            <p>
              {tx(
                lang,
                "Для прохождения необходимо набрать минимум",
                "Өту үшін кемінде қажет",
              )}{" "}
              <strong>{PASS}%</strong>.{" "}
              {tx(lang, "Вы набрали", "Сіз жинадыңыз")}{" "}
              <strong>{score}%</strong>.{" "}
              {tx(
                lang,
                "Повторите материал и попробуйте снова.",
                "Материалды қайталаңыз және қайталап көріңіз.",
              )}
            </p>
          )}
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            variant="outline"
            onClick={() => {
              setCurrentQuestion(0);
              setSelectedAnswer(null);
              setShowResult(false);
              setAnswers([]);
              setIsFinished(false);
            }}
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            {tx(lang, "Пройти снова", "Қайта өту")}
          </Button>
          {passed && (
            <Button
              onClick={() => onComplete(score)}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <CheckCircle2 className="h-4 w-4 mr-2" />
              {tx(lang, "Завершить урок →", "Сабақты аяқтау →")}
            </Button>
          )}
        </div>
      </div>
    );
  }

  if (!question) return null;

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
          <span>
            {tx(lang, "Вопрос", "Сұрақ")} {currentQuestion + 1}{" "}
            {tx(lang, "из", "ден")} {questions.length}
          </span>
          <span>{Math.round((currentQuestion / questions.length) * 100)}%</span>
        </div>
        <ProgressBar
          value={(currentQuestion / questions.length) * 100}
          size="sm"
        />
      </div>
      <div className="bg-card rounded-xl border border-border p-6">
        <h2 className="text-xl font-semibold text-foreground mb-6">
          {lang === "kz" && question.questionKz
            ? question.questionKz
            : question.question}
        </h2>
        <div className="space-y-3">
          {question.options.map((option: string, index: number) => {
            const isSelected = selectedAnswer === index;
            const isCorrect = index === question.correctAnswer;
            const showCorrect = showResult && isCorrect;
            const showWrong = showResult && isSelected && !isCorrect;
            return (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                disabled={showResult}
                className={cn(
                  "w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all",
                  showCorrect
                    ? "border-success bg-success/10"
                    : showWrong
                      ? "border-destructive bg-destructive/10"
                      : isSelected
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50",
                )}
              >
                <span
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full font-medium text-sm",
                    showCorrect
                      ? "bg-success text-white"
                      : showWrong
                        ? "bg-destructive text-white"
                        : "bg-muted text-muted-foreground",
                  )}
                >
                  {showCorrect ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : showWrong ? (
                    <X className="h-4 w-4" />
                  ) : (
                    String.fromCharCode(65 + index)
                  )}
                </span>
                <span className="flex-1 font-medium text-foreground">
                  {lang === "kz" && question.optionsKz
                    ? question.optionsKz[index]
                    : option}
                </span>
              </button>
            );
          })}
        </div>
        {showResult && (
          <div
            className={cn(
              "mt-6 p-4 rounded-lg",
              selectedAnswer === question.correctAnswer
                ? "bg-success/10 border border-success/20"
                : "bg-amber-50 border border-amber-200",
            )}
          >
            <p className="text-sm text-foreground">
              {lang === "kz" && question.explanationKz
                ? question.explanationKz
                : question.explanation}
            </p>
          </div>
        )}
      </div>
      {showResult && (
        <div className="flex justify-end">
          <Button
            onClick={handleNext}
            className="bg-primary hover:bg-primary/90 gap-2"
          >
            {currentQuestion < questions.length - 1 ? (
              <>
                {tx(lang, "Следующий вопрос", "Келесі сұрақ")}{" "}
                <ChevronRight className="h-4 w-4" />
              </>
            ) : (
              tx(lang, "Завершить тест", "Тестті аяқтау")
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
