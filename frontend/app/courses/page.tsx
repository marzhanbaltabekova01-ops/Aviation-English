"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { coursesApi, enrollmentsApi } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { useLang } from "@/lib/lang-context";
import type { Course } from "@/types";

type Lang = 'ru' | 'kz'
function tx(lang: Lang, ru: string, kz: string) { return lang === 'kz' ? kz : ru }

const MOCK_COURSES_RU: Omit<Course, 'titleKz' | 'descriptionKz'>[] = [
  { id: "course-1", title: "Основы авиационного английского",      description: "Фундамент авиационной коммуникации: ICAO-алфавит, базовая фразеология, сигналы бедствия.",                               level: "Pre-Aviation",   thumbnailUrl: "/images/course-1.jpg", price: 0,     currency: "KZT", lessonsCount: 8,  duration: 120, studentsCount: 847 },
  { id: "course-2", title: "Радиообмен и фразеология ATC",          description: "Стандарты ICAO для взаимодействия с диспетчерами. Разрешения, инструкции, readback.",                                    level: "ICAO Level 3",   thumbnailUrl: "/images/course-2.jpg", price: 24900, currency: "KZT", lessonsCount: 12, duration: 180, studentsCount: 612 },
  { id: "course-3", title: "Кабина пилота — техническая лексика",   description: "Терминология кабинного экипажа, приборы, процедуры и нештатные ситуации.",                                               level: "ICAO Level 4",   thumbnailUrl: "/images/course-3.jpg", price: 29900, currency: "KZT", lessonsCount: 10, duration: 160, studentsCount: 489 },
  { id: "course-4", title: "Навигация и авионика",                   description: "Чтение навигационных карт, работа с FMC/CDU, радиообмен в нестандартных условиях.",                                      level: "ICAO Level 4",   thumbnailUrl: "/images/course-4.jpg", price: 34900, currency: "KZT", lessonsCount: 14, duration: 210, studentsCount: 334 },
  { id: "course-5", title: "Крейсерский полёт и связь",              description: "Океанические переходы, SELCAL, CPDLC, связь на высоких эшелонах.",                                                       level: "ICAO Level 5-6", thumbnailUrl: "/images/course-5.jpg", price: 39900, currency: "KZT", lessonsCount: 16, duration: 240, studentsCount: 218 },
  { id: "course-6", title: "Корпоративная и бизнес-авиация",         description: "Специализированный язык деловой авиации, брифинги, переговоры с FBO.",                                                   level: "Corporate",      thumbnailUrl: "/images/course-6.jpg", price: 49900, currency: "KZT", lessonsCount: 10, duration: 150, studentsCount: 156 },
];

const MOCK_COURSES_KZ: Omit<Course, 'titleKz' | 'descriptionKz'>[] = [
  { id: "course-1", title: "Авиациялық ағылшын тілінің негіздері",  description: "Авиациялық байланыстың негізі: ICAO алфавиті, базалық фразеология, апат сигналдары.",                                 level: "Pre-Aviation",   thumbnailUrl: "/images/course-1.jpg", price: 0,     currency: "KZT", lessonsCount: 8,  duration: 120, studentsCount: 847 },
  { id: "course-2", title: "ATC радиобайланысы және фразеология",    description: "Диспетчерлермен өзара әрекеттесуге арналған ICAO стандарттары. Рұқсаттар, нұсқаулар, readback.",                        level: "ICAO Level 3",   thumbnailUrl: "/images/course-2.jpg", price: 24900, currency: "KZT", lessonsCount: 12, duration: 180, studentsCount: 612 },
  { id: "course-3", title: "Ұшқыш кабинасы — техникалық лексика",   description: "Кабина экипажының терминологиясы, аспаптар, процедуралар және стандартты емес жағдайлар.",                             level: "ICAO Level 4",   thumbnailUrl: "/images/course-3.jpg", price: 29900, currency: "KZT", lessonsCount: 10, duration: 160, studentsCount: 489 },
  { id: "course-4", title: "Навигация және авионика",                 description: "Навигациялық карталарды оқу, FMC/CDU жұмысы, стандартты емес жағдайлардағы радиобайланыс.",                             level: "ICAO Level 4",   thumbnailUrl: "/images/course-4.jpg", price: 34900, currency: "KZT", lessonsCount: 14, duration: 210, studentsCount: 334 },
  { id: "course-5", title: "Крейсерлік ұшу және байланыс",           description: "Мұхиттық өтулер, SELCAL, CPDLC, жоғары эшелондардағы байланыс.",                                                       level: "ICAO Level 5-6", thumbnailUrl: "/images/course-5.jpg", price: 39900, currency: "KZT", lessonsCount: 16, duration: 240, studentsCount: 218 },
  { id: "course-6", title: "Корпоративтік және бизнес-авиация",      description: "Іскери авиацияның мамандандырылған тілі, брифингтер, FBO-мен келіссөздер.",                                            level: "Corporate",      thumbnailUrl: "/images/course-6.jpg", price: 49900, currency: "KZT", lessonsCount: 10, duration: 150, studentsCount: 156 },
];

const LEVEL_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  "Pre-Aviation":   { bg: "#E6F1FB", text: "#0C447C", border: "#B5D4F4" },
  "ICAO Level 3":   { bg: "#EAF3DE", text: "#27500A", border: "#C0DD97" },
  "ICAO Level 4":   { bg: "#FAEEDA", text: "#633806", border: "#FAC775" },
  "ICAO Level 5-6": { bg: "#EEEDFE", text: "#3C3489", border: "#CECBF6" },
  "Corporate":      { bg: "#F1EFE8", text: "#444441", border: "#D3D1C7" },
};

export default function CoursesPage() {
  const { user } = useAuth();
  const { lang } = useLang();
  const [courses, setCourses] = useState<Course[]>(MOCK_COURSES_RU as Course[]);
  const [enrolledIds, setEnrolledIds] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState("all");
  const [enrolling, setEnrolling] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const LEVELS = ["all", "Pre-Aviation", "ICAO Level 3", "ICAO Level 4", "ICAO Level 5-6", "Corporate"];
  const allLabel = tx(lang as Lang, "Все", "Барлығы");

  // Update mock courses when language changes
  useEffect(() => {
    const mockData = lang === 'kz' ? MOCK_COURSES_KZ : MOCK_COURSES_RU;
    setCourses(prev => prev.map((c, i) => ({
      ...c,
      title: mockData[i]?.title ?? c.title,
      description: mockData[i]?.description ?? c.description,
    })));
  }, [lang]);

  useEffect(() => {
    coursesApi.getAll().then(data => {
      if (data && data.length > 0) {
        const mockBase = lang === 'kz' ? MOCK_COURSES_KZ : MOCK_COURSES_RU;
        const merged = data.map((course: Course, i: number) => ({
          ...course,
          thumbnailUrl: course.thumbnailUrl?.startsWith("/images/course-") ? course.thumbnailUrl : (mockBase[i]?.thumbnailUrl ?? course.thumbnailUrl),
        }));
        setCourses(merged);
      }
    }).catch(() => {});
    if (user) {
      enrollmentsApi.getMyEnrollments()
        .then(e => setEnrolledIds(new Set(e.map((en: any) => en.courseId))))
        .catch(() => {});
    }
  }, [user]);

  const filtered = courses.filter(c => {
    const matchSearch = !search || c.title.toLowerCase().includes(search.toLowerCase()) || c.description.toLowerCase().includes(search.toLowerCase());
    const matchLevel = levelFilter === "all" || c.level === levelFilter;
    return matchSearch && matchLevel;
  });

  const handleEnroll = async (courseId: string, e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) { window.location.href = "/auth/login"; return; }
    setEnrolling(courseId);
    try {
      await enrollmentsApi.enroll(courseId);
      setEnrolledIds(prev => new Set([...prev, courseId]));
    } catch {} finally { setEnrolling(null); }
  };

  const formatPrice = (price: number) => price.toLocaleString("ru-RU");
  const L = lang as Lang;

  return (
    <div style={{ minHeight: "100vh", background: "#F8F7F4", fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>
      <Navbar />

      {/* Header */}
      <div style={{ background: "#0A1628", padding: "56px 0 48px" }}>
        <div style={{ maxWidth: 1120, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <div style={{ width: 4, height: 20, background: "#C5A84B", borderRadius: 2 }} />
            <span style={{ fontSize: 12, fontWeight: 500, color: "#C5A84B", letterSpacing: "0.1em", textTransform: "uppercase" }}>
              {tx(L, "Учебные программы", "Оқу бағдарламалары")}
            </span>
          </div>
          <h1 style={{ fontSize: 40, fontWeight: 700, color: "#fff", margin: "0 0 12px", lineHeight: 1.15 }}>
            {tx(L, "Курсы авиационного", "Авиациялық ағылшын")}
            <br />
            <span style={{ color: "#C5A84B" }}>{tx(L, "английского языка", "тілі курстары")}</span>
          </h1>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.6)", margin: 0, maxWidth: 480 }}>
            {tx(L, "От базового Pre-Aviation до уровня ICAO Expert — все программы по стандартам ИКАО", "Pre-Aviation деңгейінен ICAO Expert деңгейіне дейін — ИКАО стандарттары бойынша барлық бағдарламалар")}
          </p>
        </div>
      </div>

      {/* Search & filter */}
      <div style={{ background: "#fff", borderBottom: "1px solid #E8E6E1", position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ maxWidth: 1120, margin: "0 auto", padding: "14px 24px", display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
            <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#A8A6A1", fontSize: 16 }}>⌕</span>
            <input
              placeholder={tx(L, "Поиск курсов...", "Курстарды іздеу...")}
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ width: "100%", padding: "9px 12px 9px 36px", border: "1px solid #E8E6E1", borderRadius: 8, fontSize: 14, background: "#F8F7F4", outline: "none", color: "#1a1a1a" }}
            />
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {LEVELS.map(lvl => (
              <button key={lvl} onClick={() => setLevelFilter(lvl)}
                style={{
                  padding: "7px 14px", borderRadius: 20, fontSize: 13, fontWeight: 500, cursor: "pointer", transition: "all .15s",
                  background: levelFilter === lvl ? "#0A1628" : "transparent",
                  color: levelFilter === lvl ? "#fff" : "#6B6967",
                  border: levelFilter === lvl ? "1px solid #0A1628" : "1px solid #E8E6E1",
                }}>
                {lvl === "all" ? allLabel : lvl}
              </button>
            ))}
          </div>
          <span style={{ fontSize: 13, color: "#A8A6A1", marginLeft: "auto" }}>
            {filtered.length} {tx(L, "курсов", "курс")}
          </span>
        </div>
      </div>

      {/* Courses grid */}
      <div style={{ maxWidth: 1120, margin: "0 auto", padding: "40px 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 24 }}>
          {filtered.map(course => {
            const levelStyle = LEVEL_COLORS[course.level] ?? LEVEL_COLORS["Pre-Aviation"];
            const isEnrolled = enrolledIds.has(course.id);
            const isHovered = hoveredId === course.id;
            return (
              <Link key={course.id} href={`/courses/${course.id}`} style={{ textDecoration: "none" }}>
                <div
                  onMouseEnter={() => setHoveredId(course.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  style={{
                    background: "#fff", borderRadius: 16, overflow: "hidden",
                    border: isHovered ? "1px solid #C5A84B" : "1px solid #E8E6E1",
                    transition: "all .25s cubic-bezier(.4,0,.2,1)",
                    transform: isHovered ? "translateY(-4px)" : "none",
                    boxShadow: isHovered ? "0 16px 40px rgba(10,22,40,0.12)" : "0 1px 4px rgba(0,0,0,0.04)",
                  }}>
                  <div style={{ position: "relative", height: 200, overflow: "hidden" }}>
                    <img src={course.thumbnailUrl} alt={course.title}
                      style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform .4s ease", transform: isHovered ? "scale(1.05)" : "scale(1)" }} />
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(10,22,40,0.7) 0%, rgba(10,22,40,0.1) 50%, transparent 100%)" }} />
                    <div style={{ position: "absolute", top: 14, left: 14, background: levelStyle.bg, color: levelStyle.text, border: `1px solid ${levelStyle.border}`, fontSize: 11, fontWeight: 600, padding: "4px 10px", borderRadius: 20, letterSpacing: "0.04em" }}>
                      {course.level}
                    </div>
                    {course.price === 0 && (
                      <div style={{ position: "absolute", top: 14, right: 14, background: "#C5A84B", color: "#fff", fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 20 }}>
                        {tx(L, "Бесплатно", "Тегін")}
                      </div>
                    )}
                    <div style={{ position: "absolute", bottom: 16, left: 16, right: 16 }}>
                      <h2 style={{ fontSize: 17, fontWeight: 700, color: "#fff", margin: 0, lineHeight: 1.3, textShadow: "0 1px 4px rgba(0,0,0,0.4)" }}>
                        {course.title}
                      </h2>
                    </div>
                  </div>

                  <div style={{ padding: "18px 20px 20px" }}>
                    <p style={{ fontSize: 13, color: "#6B6967", lineHeight: 1.55, margin: "0 0 16px", minHeight: 40 }}>
                      {course.description}
                    </p>
                    <div style={{ display: "flex", gap: 16, marginBottom: 18 }}>
                      {[
                        { icon: "📖", label: `${course.lessonsCount} ${tx(L, "уроков", "сабақ")}` },
                        { icon: "⏱",  label: `${course.duration} ${tx(L, "мин", "мин")}` },
                        { icon: "👥", label: formatPrice(course.studentsCount) },
                      ].map(s => (
                        <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                          <span style={{ fontSize: 13 }}>{s.icon}</span>
                          <span style={{ fontSize: 12, color: "#A8A6A1", fontWeight: 500 }}>{s.label}</span>
                        </div>
                      ))}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                      <div>
                        {course.price === 0 ? (
                          <span style={{ fontSize: 18, fontWeight: 700, color: "#0A1628" }}>{tx(L, "Бесплатно", "Тегін")}</span>
                        ) : (
                          <span style={{ fontSize: 18, fontWeight: 700, color: "#0A1628" }}>{formatPrice(course.price)} ₸</span>
                        )}
                      </div>
                      {isEnrolled ? (
                        <div style={{ padding: "9px 18px", borderRadius: 10, fontSize: 13, fontWeight: 600, background: "#EAF3DE", color: "#27500A", border: "1px solid #C0DD97" }}>
                          {tx(L, "✓ Записан", "✓ Жазылған")}
                        </div>
                      ) : (
                        <button onClick={e => handleEnroll(course.id, e)} disabled={enrolling === course.id}
                          style={{ padding: "9px 20px", borderRadius: 10, fontSize: 13, fontWeight: 600, border: "none", background: isHovered ? "#C5A84B" : "#0A1628", color: "#fff", cursor: "pointer", transition: "background .2s", opacity: enrolling === course.id ? 0.7 : 1 }}>
                          {enrolling === course.id ? "..." : course.price === 0 ? tx(L, "Начать →", "Бастау →") : tx(L, "Записаться →", "Жазылу →")}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "80px 0", color: "#A8A6A1" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
            <div style={{ fontSize: 16, fontWeight: 500 }}>{tx(L, "Курсы не найдены", "Курстар табылмады")}</div>
            <div style={{ fontSize: 14, marginTop: 6 }}>{tx(L, "Попробуй другой запрос или уровень", "Басқа сұранымды немесе деңгейді қолданып көріңіз")}</div>
          </div>
        )}
      </div>
    </div>
  );
}