"use client";

import Link from "next/link";
import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { useAuth } from "@/lib/auth-context";
import { useLang } from "@/lib/lang-context";

const COURSES_PREVIEW = [
  { id: "course-1", titleRu: "Основы авиационного английского", titleKz: "Авиациялық ағылшын тілінің негіздері", level: "Pre-Aviation", img: "/images/course-1.jpg", priceRu: "Бесплатно", priceKz: "Тегін" },
  { id: "course-2", titleRu: "Радиообмен и фразеология ATC",    titleKz: "ATC радиобайланысы және фразеология",   level: "ICAO Level 3", img: "/images/course-2.jpg", priceRu: "24 900 ₸", priceKz: "24 900 ₸" },
  { id: "course-3", titleRu: "Кабина пилота — техническая лексика", titleKz: "Ұшқыш кабинасы — техникалық лексика", level: "ICAO Level 4", img: "/images/course-3.jpg", priceRu: "29 900 ₸", priceKz: "29 900 ₸" },
];

const FEATURES_RU = [
  { icon: "🎙", title: "Web Speech API",        desc: "Реальная озвучка текстов транскрипций — слушай и повторяй" },
  { icon: "🧠", title: "AI-помощник",           desc: "Claude отвечает на вопросы по авиационному английскому 24/7" },
  { icon: "✈️", title: "Система XP и уровней",  desc: "От Beginner до Expert — 5 уровней мастерства с наградами" },
  { icon: "📊", title: "Тесты ICAO",            desc: "Порог 80% как на реальном экзамене с разбором ошибок" },
  { icon: "🔤", title: "Drag & Drop словарь",   desc: "Добавляй слова из транскрипций и тренируй их интерактивно" },
  { icon: "🏆", title: "Таблица лидеров",       desc: "Соревнуйся с другими пилотами и диспетчерами" },
];

const FEATURES_KZ = [
  { icon: "🎙", title: "Web Speech API",        desc: "Транскрипция мәтіндерінің нақты дыбысталуы — тыңда және қайтала" },
  { icon: "🧠", title: "AI-көмекші",            desc: "Claude авиациялық ағылшын тілі бойынша сұрақтарға 24/7 жауап береді" },
  { icon: "✈️", title: "XP және деңгей жүйесі", desc: "Beginner-ден Expert-ке дейін — марапатпен 5 шеберлік деңгейі" },
  { icon: "📊", title: "ICAO тесттері",         desc: "Нақты емтихандағыдай 80% шегі, қателерді талдаумен" },
  { icon: "🔤", title: "Drag & Drop сөздік",    desc: "Транскрипциялардан сөздер қосып, интерактивті жаттықтыр" },
  { icon: "🏆", title: "Көшбасшылар кестесі",   desc: "Басқа ұшқыштар мен диспетчерлермен бәсекелес" },
];

export default function HomePage() {
  const { user } = useAuth();
  const { t, lang } = useLang();
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const features = lang === 'kz' ? FEATURES_KZ : FEATURES_RU;

  return (
    <div style={{ minHeight: "100vh", fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif", background: "#F8F7F4" }}>
      <Navbar />

      {/* HERO */}
      <section style={{ position: "relative", height: 600, overflow: "hidden" }}>
        <img src="/images/course-5.jpg" alt="Aviation"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 40%" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(10,22,40,0.92) 0%, rgba(10,22,40,0.65) 60%, rgba(10,22,40,0.3) 100%)" }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 120, background: "linear-gradient(to top, #F8F7F4, transparent)" }} />

        <div style={{ position: "relative", maxWidth: 1120, margin: "0 auto", padding: "0 24px", height: "100%", display: "flex", alignItems: "center" }}>
          <div style={{ maxWidth: 580 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(197,168,75,0.15)", border: "1px solid rgba(197,168,75,0.4)", borderRadius: 20, padding: "6px 14px", marginBottom: 24 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#C5A84B" }} />
              <span style={{ fontSize: 12, fontWeight: 600, color: "#C5A84B", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                {t('home', 'badge')}
              </span>
            </div>

            <h1 style={{ fontSize: 52, fontWeight: 800, color: "#fff", margin: "0 0 20px", lineHeight: 1.1, letterSpacing: "-0.02em" }}>
              {t('home', 'heroTitle1')}
              <br />
              <span style={{ color: "#C5A84B" }}>{t('home', 'heroTitle2')}</span>
              <br />
              {t('home', 'heroTitle3')}
            </h1>

            <p style={{ fontSize: 17, color: "rgba(255,255,255,0.7)", margin: "0 0 36px", lineHeight: 1.65 }}>
              {t('home', 'heroDesc')}
            </p>

            <div style={{ display: "flex", gap: 12 }}>
              <Link href={user ? "/courses" : "/auth/register"} style={{ textDecoration: "none" }}>
                <button style={{ padding: "14px 28px", borderRadius: 12, fontSize: 15, fontWeight: 700, background: "#C5A84B", color: "#0A1628", border: "none", cursor: "pointer" }}>
                  {t('home', 'startFree')}
                </button>
              </Link>
              <Link href="/courses" style={{ textDecoration: "none" }}>
                <button style={{ padding: "14px 28px", borderRadius: 12, fontSize: 15, fontWeight: 600, background: "rgba(255,255,255,0.1)", color: "#fff", border: "1px solid rgba(255,255,255,0.25)", cursor: "pointer" }}>
                  {t('home', 'allCourses')}
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section style={{ background: "#0A1628" }}>
        <div style={{ maxWidth: 1120, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)" }}>
            {[
              { value: "2 400+", label: t('home', 'statsStudents') },
              { value: "6",      label: t('home', 'statsCourses')  },
              { value: "94%",    label: t('home', 'statsPass')     },
              { value: "ICAO",   label: t('home', 'statsCert')     },
            ].map((s, i) => (
              <div key={i} style={{ padding: "28px 24px", textAlign: "center", borderRight: i < 3 ? "1px solid rgba(255,255,255,0.08)" : "none" }}>
                <div style={{ fontSize: 30, fontWeight: 800, color: "#C5A84B" }}>{s.value}</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginTop: 4, fontWeight: 500 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COURSES PREVIEW */}
      <section style={{ padding: "72px 0 64px" }}>
        <div style={{ maxWidth: 1120, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 36 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <div style={{ width: 4, height: 18, background: "#C5A84B", borderRadius: 2 }} />
                <span style={{ fontSize: 12, fontWeight: 600, color: "#C5A84B", letterSpacing: "0.08em", textTransform: "uppercase" }}>{t('home', 'programs')}</span>
              </div>
              <h2 style={{ fontSize: 34, fontWeight: 800, color: "#0A1628", margin: 0 }}>{t('home', 'popularCourses')}</h2>
            </div>
            <Link href="/courses" style={{ fontSize: 14, fontWeight: 600, color: "#185FA5", textDecoration: "none" }}>
              {t('home', 'seeAll')}
            </Link>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
            {COURSES_PREVIEW.map(course => (
              <Link key={course.id} href={`/courses/${course.id}`} style={{ textDecoration: "none" }}>
                <div
                  onMouseEnter={() => setHoveredCard(course.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                  style={{
                    borderRadius: 16, overflow: "hidden",
                    border: hoveredCard === course.id ? "1px solid #C5A84B" : "1px solid #E8E6E1",
                    background: "#fff", transition: "all .25s ease",
                    transform: hoveredCard === course.id ? "translateY(-4px)" : "none",
                    boxShadow: hoveredCard === course.id ? "0 16px 40px rgba(10,22,40,0.1)" : "none",
                  }}
                >
                  <div style={{ position: "relative", height: 180, overflow: "hidden" }}>
                    <img src={course.img} alt={lang === 'kz' ? course.titleKz : course.titleRu}
                      style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform .4s ease", transform: hoveredCard === course.id ? "scale(1.06)" : "scale(1)" }} />
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(10,22,40,0.7), transparent 60%)" }} />
                    <div style={{ position: "absolute", top: 12, left: 12, background: "rgba(10,22,40,0.7)", backdropFilter: "blur(4px)", color: "#fff", fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 12 }}>
                      {course.level}
                    </div>
                    <div style={{ position: "absolute", bottom: 12, left: 14, right: 14 }}>
                      <div style={{ fontSize: 15, fontWeight: 700, color: "#fff", lineHeight: 1.3 }}>
                        {lang === 'kz' ? course.titleKz : course.titleRu}
                      </div>
                    </div>
                  </div>
                  <div style={{ padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 16, fontWeight: 700, color: "#0A1628" }}>
                      {lang === 'kz' ? course.priceKz : course.priceRu}
                    </span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: hoveredCard === course.id ? "#C5A84B" : "#185FA5" }}>
                      {t('home', 'details')}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ background: "#0A1628", padding: "72px 0" }}>
        <div style={{ maxWidth: 1120, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
              <div style={{ width: 4, height: 18, background: "#C5A84B", borderRadius: 2 }} />
              <span style={{ fontSize: 12, fontWeight: 600, color: "#C5A84B", letterSpacing: "0.08em", textTransform: "uppercase" }}>{t('home', 'platform')}</span>
              <div style={{ width: 4, height: 18, background: "#C5A84B", borderRadius: 2 }} />
            </div>
            <h2 style={{ fontSize: 34, fontWeight: 800, color: "#fff", margin: 0 }}>{t('home', 'platformTitle')}</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
            {features.map((f, i) => (
              <div key={i} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "24px" }}>
                <div style={{ fontSize: 28, marginBottom: 14 }}>{f.icon}</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 8 }}>{f.title}</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", lineHeight: 1.6 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ position: "relative", overflow: "hidden" }}>
        <img src="/images/course-2.jpg" alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 60%" }} />
        <div style={{ position: "absolute", inset: 0, background: "rgba(10,22,40,0.88)" }} />
        <div style={{ position: "relative", maxWidth: 1120, margin: "0 auto", padding: "72px 24px", textAlign: "center" }}>
          <h2 style={{ fontSize: 38, fontWeight: 800, color: "#fff", margin: "0 0 16px" }}>{t('home', 'ctaTitle')}</h2>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.65)", margin: "0 0 36px" }}>{t('home', 'ctaDesc')}</p>
          <Link href={user ? "/courses" : "/auth/register"} style={{ textDecoration: "none" }}>
            <button style={{ padding: "15px 36px", borderRadius: 12, fontSize: 16, fontWeight: 700, background: "#C5A84B", color: "#0A1628", border: "none", cursor: "pointer" }}>
              {t('home', 'ctaBtn')}
            </button>
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: "#060E1A", padding: "32px 24px" }}>
        <div style={{ maxWidth: 1120, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 28, height: 28, background: "#C5A84B", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>✈</div>
            <span style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>AviationEnglish.kz</span>
          </div>
          <span style={{ fontSize: 13, color: "rgba(255,255,255,0.35)" }}>© 2025 · {lang === 'kz' ? 'Барлық құқықтар қорғалған' : 'Все права защищены'}</span>
          <div style={{ display: "flex", gap: 20 }}>
            {lang === 'kz'
              ? ["Курстар", "ICAO деңгейлері", "Байланыс"].map(l => <span key={l} style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", cursor: "pointer" }}>{l}</span>)
              : ["Курсы", "Уровни ICAO", "Контакты"].map(l => <span key={l} style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", cursor: "pointer" }}>{l}</span>)
            }
          </div>
        </div>
      </footer>
    </div>
  );
}