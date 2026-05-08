"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import { cn } from "@/lib/utils";
import {
  Users, BookOpen, GraduationCap, TrendingUp, ChevronRight,
  Search, ArrowLeft, CheckCircle2, Clock, Loader2, AlertCircle,
  Plus, Pencil, Trash2, Shield, ShieldOff, X, Save, BookMarked,
} from "lucide-react";

interface Stats {
  totalUsers: number; totalCourses: number; totalLessons: number;
  totalEnrollments: number; completedLessons: number;
  newUsersThisWeek: number; activeUsersThisWeek: number;
}
interface UserRow {
  id: string; email: string; firstName: string; lastName: string;
  specialization: string; createdAt: string; role: string; blocked?: boolean;
  coursesEnrolled: number; lessonsCompleted: number; lastActivity: string | null; avgProgress: number;
}
interface CourseRow {
  id: string; title: string; level: string; price: number;
  lessonsCount: number; studentsCount: number; avgProgress: number; completedCount: number;
}
interface LessonRow {
  id: string; title: string; type: string; order: number; isFree: boolean;
  course: { id: string; title: string }; completions: number; completionRate: number;
}
interface UserDetail {
  id: string; email: string; firstName: string; lastName: string;
  specialization: string; createdAt: string; role: string;
  courseProgress: {
    course: { id: string; title: string; level: string };
    progress: number; completed: boolean;
    lessons: { id: string; title: string; type: string; order: number; isCompleted: boolean; completedAt: string | null }[];
  }[];
  recentActivity: { lessonTitle: string; lessonType: string; completedAt: string | null }[];
}

const SPEC_LABELS: Record<string, string> = {
  PILOT_COMMERCIAL: 'Пилот (ком.)', PILOT_PRIVATE: 'Пилот (частный)',
  ATC_CONTROLLER: 'Диспетчер', CABIN_CREW: 'Кабинный экипаж',
  STUDENT: 'Курсант', ENGINEER: 'Инженер',
};
const TYPE_ICON: Record<string, string> = {
  READING: '📄', LISTENING: '🎙', VOCABULARY: '📖', QUIZ: '✅',
};
const LEVELS = ['Pre-Aviation','ICAO Level 3','ICAO Level 4','ICAO Level 5-6','Corporate'];
const LESSON_TYPES = ['READING','LISTENING','VOCABULARY','QUIZ'];

// ── Modal ─────────────────────────────────────────────────────────────────────
function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-xl w-full max-w-lg shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="font-semibold text-foreground">{title}</h2>
          <button onClick={onClose} className="p-1 rounded hover:bg-muted transition-colors">
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

// ── Confirm Dialog ────────────────────────────────────────────────────────────
function ConfirmDialog({ message, onConfirm, onCancel }: { message: string; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-xl w-full max-w-sm shadow-2xl p-6">
        <p className="text-foreground mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={onCancel}>Отмена</Button>
          <Button onClick={onConfirm} className="bg-destructive hover:bg-destructive/90 text-white">Удалить</Button>
        </div>
      </div>
    </div>
  );
}

export default function AdminPage() {
  const router = useRouter();
  const [tab, setTab] = useState<'overview'|'users'|'courses'|'lessons'>('overview');
  const [stats, setStats] = useState<Stats | null>(null);
  const [users, setUsers] = useState<UserRow[]>([]);
  const [courses, setCourses] = useState<CourseRow[]>([]);
  const [lessons, setLessons] = useState<LessonRow[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<UserDetail | null>(null);
  const [loadingUser, setLoadingUser] = useState(false);
  const [error, setError] = useState('');

  // Modals
  const [courseModal, setCourseModal] = useState<{mode:'create'|'edit'; data?: CourseRow} | null>(null);
  const [lessonModal, setLessonModal] = useState<{mode:'create'|'edit'; data?: LessonRow} | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{type:'user'|'course'|'lesson'; id: string; name: string} | null>(null);
  const [saving, setSaving] = useState(false);

  // Form state
  const [courseForm, setCourseForm] = useState({ title:'', description:'', level:'Pre-Aviation', price:0, thumbnailUrl:'', duration:0 });
  const [lessonForm, setLessonForm] = useState({ title:'', type:'READING', duration:15, order:1, isFree:false, courseId:'' });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') ?? '{}');
    if (user?.role !== 'ADMIN') { router.push('/'); return; }
    loadAll();
  }, []);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes, coursesRes, lessonsRes] = await Promise.all([
        api.get('/api/admin/stats'),
        api.get('/api/admin/users'),
        api.get('/api/admin/courses'),
        api.get('/api/admin/lessons'),
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data.users);
      setCourses(coursesRes.data);
      setLessons(lessonsRes.data);
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Ошибка загрузки данных');
    } finally {
      setLoading(false);
    }
  };

  const openUser = async (id: string) => {
    setLoadingUser(true);
    try {
      const res = await api.get(`/api/admin/users/${id}`);
      setSelectedUser(res.data);
    } finally { setLoadingUser(false); }
  };

  // ── User actions ───────────────────────────────────────────────────────────
  const changeRole = async (userId: string, role: 'USER'|'ADMIN') => {
    await api.patch(`/api/admin/users/${userId}/role`, { role });
    setUsers(prev => prev.map(u => u.id === userId ? {...u, role} : u));
    if (selectedUser?.id === userId) setSelectedUser(prev => prev ? {...prev, role} : prev);
  };

  const toggleBlock = async (userId: string, blocked: boolean) => {
    await api.patch(`/api/admin/users/${userId}/block`, { blocked });
    setUsers(prev => prev.map(u => u.id === userId ? {...u, blocked} : u));
  };

  // ── Course actions ─────────────────────────────────────────────────────────
  const openCreateCourse = () => {
    setCourseForm({ title:'', description:'', level:'Pre-Aviation', price:0, thumbnailUrl:'', duration:0 });
    setCourseModal({ mode: 'create' });
  };
  const openEditCourse = (c: CourseRow) => {
    setCourseForm({ title: c.title, description:'', level: c.level, price: c.price, thumbnailUrl:'', duration:0 });
    setCourseModal({ mode: 'edit', data: c });
  };
  const saveCourse = async () => {
    setSaving(true);
    try {
      if (courseModal?.mode === 'create') {
        const res = await api.post('/api/admin/courses', courseForm);
        setCourses(prev => [...prev, { ...res.data, lessonsCount:0, studentsCount:0, avgProgress:0, completedCount:0 }]);
      } else if (courseModal?.data) {
        await api.put(`/api/admin/courses/${courseModal.data.id}`, courseForm);
        setCourses(prev => prev.map(c => c.id === courseModal.data!.id ? {...c, ...courseForm} : c));
      }
      setCourseModal(null);
    } catch (e: any) {
      alert(e?.response?.data?.message || 'Ошибка сохранения');
    } finally { setSaving(false); }
  };

  // ── Lesson actions ─────────────────────────────────────────────────────────
  const openCreateLesson = () => {
    setLessonForm({ title:'', type:'READING', duration:15, order:1, isFree:false, courseId: courses[0]?.id ?? '' });
    setLessonModal({ mode: 'create' });
  };
  const openEditLesson = (l: LessonRow) => {
    setLessonForm({ title: l.title, type: l.type, duration:0, order: l.order, isFree: l.isFree, courseId: l.course.id });
    setLessonModal({ mode: 'edit', data: l });
  };
  const saveLesson = async () => {
    setSaving(true);
    try {
      if (lessonModal?.mode === 'create') {
        const res = await api.post('/api/admin/lessons', lessonForm);
        setLessons(prev => [...prev, { ...res.data, course: courses.find(c=>c.id===lessonForm.courseId) ?? {id:'',title:''}, completions:0, completionRate:0 }]);
      } else if (lessonModal?.data) {
        await api.put(`/api/admin/lessons/${lessonModal.data.id}`, lessonForm);
        setLessons(prev => prev.map(l => l.id === lessonModal.data!.id ? {...l, ...lessonForm} : l));
      }
      setLessonModal(null);
    } catch (e: any) {
      alert(e?.response?.data?.message || 'Ошибка сохранения');
    } finally { setSaving(false); }
  };

  // ── Delete ─────────────────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!confirmDelete) return;
    try {
      const { type, id } = confirmDelete;
      if (type === 'user')   { await api.delete(`/api/admin/users/${id}`);   setUsers(prev => prev.filter(u => u.id !== id)); }
      if (type === 'course') { await api.delete(`/api/admin/courses/${id}`); setCourses(prev => prev.filter(c => c.id !== id)); }
      if (type === 'lesson') { await api.delete(`/api/admin/lessons/${id}`); setLessons(prev => prev.filter(l => l.id !== id)); }
      setConfirmDelete(null);
    } catch (e: any) {
      alert(e?.response?.data?.message || 'Ошибка удаления');
    }
  };

  const filteredUsers = users.filter(u =>
    !search || `${u.firstName} ${u.lastName} ${u.email}`.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </main>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-10 w-10 text-destructive mx-auto mb-3" />
          <p className="text-foreground font-medium">{error}</p>
          <Button className="mt-4" onClick={loadAll}>Попробовать снова</Button>
        </div>
      </main>
    </div>
  );

  // ── User detail view ───────────────────────────────────────────────────────
  if (selectedUser) return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8">
        <button onClick={() => setSelectedUser(null)}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Назад к списку
        </button>
        {loadingUser ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg flex-shrink-0">
                    {selectedUser.firstName[0]}{selectedUser.lastName[0]}
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-foreground">{selectedUser.firstName} {selectedUser.lastName}</h1>
                    <p className="text-muted-foreground text-sm">{selectedUser.email}</p>
                    <div className="flex gap-2 mt-2 flex-wrap">
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                        {SPEC_LABELS[selectedUser.specialization] ?? selectedUser.specialization}
                      </span>
                      <span className={cn("text-xs px-2 py-1 rounded-full", selectedUser.role === 'ADMIN' ? "bg-amber-100 text-amber-700" : "bg-muted text-muted-foreground")}>
                        {selectedUser.role}
                      </span>
                      <span className="text-xs text-muted-foreground py-1">
                        Рег: {new Date(selectedUser.createdAt).toLocaleDateString('ru-RU')}
                      </span>
                    </div>
                  </div>
                </div>
                {/* Actions */}
                <div className="flex gap-2 flex-shrink-0">
                  <Button size="sm" variant="outline"
                    onClick={() => changeRole(selectedUser.id, selectedUser.role === 'ADMIN' ? 'USER' : 'ADMIN')}
                    className="gap-1.5">
                    {selectedUser.role === 'ADMIN' ? <ShieldOff className="h-3.5 w-3.5" /> : <Shield className="h-3.5 w-3.5" />}
                    {selectedUser.role === 'ADMIN' ? 'Снять ADMIN' : 'Дать ADMIN'}
                  </Button>
                  <Button size="sm" variant="outline"
                    onClick={() => setConfirmDelete({ type:'user', id: selectedUser.id, name: `${selectedUser.firstName} ${selectedUser.lastName}` })}
                    className="gap-1.5 text-destructive border-destructive/30 hover:bg-destructive/10">
                    <Trash2 className="h-3.5 w-3.5" /> Удалить
                  </Button>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-border">
                <h2 className="font-semibold text-foreground">Прогресс по курсам</h2>
              </div>
              {selectedUser.courseProgress.length === 0 ? (
                <p className="text-muted-foreground text-sm p-6">Студент не записан ни на один курс</p>
              ) : selectedUser.courseProgress.map(cp => (
                <div key={cp.course.id} className="border-b border-border last:border-0">
                  <div className="px-6 py-4">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <span className="font-medium text-foreground text-sm">{cp.course.title}</span>
                        <span className="ml-2 text-xs text-muted-foreground">{cp.course.level}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {cp.completed && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">✓ Завершён</span>}
                        <span className="text-sm font-medium text-foreground">{cp.progress}%</span>
                      </div>
                    </div>
                    <ProgressBar value={cp.progress} size="sm" />
                    <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                      {cp.lessons.map(l => (
                        <div key={l.id} className={cn("flex items-center gap-2 px-3 py-2 rounded-lg text-xs",
                          l.isCompleted ? "bg-green-50 text-green-700" : "bg-muted/40 text-muted-foreground")}>
                          <span>{TYPE_ICON[l.type]}</span>
                          <span className="flex-1 truncate">{l.title}</span>
                          {l.isCompleted ? <CheckCircle2 className="h-3 w-3 text-green-600 flex-shrink-0" /> : <Clock className="h-3 w-3 flex-shrink-0" />}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {selectedUser.recentActivity.length > 0 && (
              <div className="bg-card border border-border rounded-xl overflow-hidden">
                <div className="px-6 py-4 border-b border-border">
                  <h2 className="font-semibold text-foreground">Последняя активность</h2>
                </div>
                <div className="divide-y divide-border">
                  {selectedUser.recentActivity.map((a, i) => (
                    <div key={i} className="px-6 py-3 flex items-center gap-3">
                      <span className="text-base">{TYPE_ICON[a.lessonType]}</span>
                      <span className="flex-1 text-sm text-foreground">{a.lessonTitle}</span>
                      <span className="text-xs text-muted-foreground">
                        {a.completedAt ? new Date(a.completedAt).toLocaleDateString('ru-RU') : '—'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
      {confirmDelete && <ConfirmDialog message={`Удалить пользователя "${confirmDelete.name}"? Это действие нельзя отменить.`} onConfirm={handleDelete} onCancel={() => setConfirmDelete(null)} />}
    </div>
  );

  // ── Main admin view ────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8">

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Панель администратора</h1>
            <p className="text-muted-foreground text-sm mt-1">AviationEnglish.kz</p>
          </div>
          <Button variant="outline" onClick={loadAll} className="gap-2">
            <TrendingUp className="h-4 w-4" />Обновить
          </Button>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { icon: Users,         label: 'Студентов',        value: stats.totalUsers,       sub: `+${stats.newUsersThisWeek} за неделю` },
              { icon: BookOpen,      label: 'Курсов',           value: stats.totalCourses,     sub: `${stats.totalLessons} уроков` },
              { icon: GraduationCap, label: 'Записей на курсы', value: stats.totalEnrollments, sub: 'всего' },
              { icon: CheckCircle2,  label: 'Уроков пройдено',  value: stats.completedLessons, sub: `${stats.activeUsersThisWeek} активных` },
            ].map((s, i) => (
              <div key={i} className="bg-card border border-border rounded-xl p-5">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <s.icon className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-xs text-muted-foreground">{s.label}</span>
                </div>
                <div className="text-2xl font-bold text-foreground">{s.value.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground mt-1">{s.sub}</div>
              </div>
            ))}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 border-b border-border mb-6">
          {([
            { key: 'overview', label: 'Обзор' },
            { key: 'users',    label: `Студенты (${users.length})` },
            { key: 'courses',  label: `Курсы (${courses.length})` },
            { key: 'lessons',  label: `Уроки (${lessons.length})` },
          ] as const).map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={cn("px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px",
                tab === t.key ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground")}>
              {t.label}
            </button>
          ))}
        </div>

        {/* ── Tab: Overview ── */}
        {tab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="px-5 py-4 border-b border-border font-semibold text-foreground text-sm">Топ студентов по прогрессу</div>
              <div className="divide-y divide-border">
                {[...users].sort((a,b) => b.lessonsCompleted - a.lessonsCompleted).slice(0,5).map((u,i) => (
                  <div key={u.id} className="px-5 py-3 flex items-center gap-3 cursor-pointer hover:bg-muted/30 transition-colors" onClick={() => openUser(u.id)}>
                    <span className="text-xs font-medium text-muted-foreground w-4">{i+1}</span>
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold flex-shrink-0">
                      {u.firstName[0]}{u.lastName[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-foreground truncate">{u.firstName} {u.lastName}</div>
                      <div className="text-xs text-muted-foreground">{u.lessonsCompleted} уроков</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-foreground">{u.avgProgress}%</div>
                      <div className="text-xs text-muted-foreground">avg</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="px-5 py-4 border-b border-border font-semibold text-foreground text-sm">Прогресс по курсам</div>
              <div className="divide-y divide-border">
                {courses.map(c => (
                  <div key={c.id} className="px-5 py-3">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm text-foreground truncate flex-1 mr-2">{c.title}</span>
                      <span className="text-xs text-muted-foreground flex-shrink-0">{c.studentsCount} студ.</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ProgressBar value={c.avgProgress} size="sm" />
                      <span className="text-xs font-medium text-foreground w-8 text-right">{c.avgProgress}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Tab: Users ── */}
        {tab === 'users' && (
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input placeholder="Поиск по имени или email..." value={search} onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-border rounded-xl bg-background text-foreground text-sm focus:outline-none focus:border-primary" />
            </div>
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Студент</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground hidden md:table-cell">Роль</th>
                    <th className="text-center px-4 py-3 text-xs font-medium text-muted-foreground">Курсы</th>
                    <th className="text-center px-4 py-3 text-xs font-medium text-muted-foreground">Уроки</th>
                    <th className="text-center px-4 py-3 text-xs font-medium text-muted-foreground">Прогресс</th>
                    <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground">Действия</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredUsers.map(u => (
                    <tr key={u.id} className="hover:bg-muted/20 transition-colors">
                      <td className="px-4 py-3 cursor-pointer" onClick={() => openUser(u.id)}>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold flex-shrink-0">
                            {u.firstName[0]}{u.lastName[0]}
                          </div>
                          <div>
                            <div className="font-medium text-foreground">{u.firstName} {u.lastName}</div>
                            <div className="text-xs text-muted-foreground">{u.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span className={cn("text-xs px-2 py-0.5 rounded-full", u.role === 'ADMIN' ? "bg-amber-100 text-amber-700" : "bg-muted text-muted-foreground")}>
                          {u.role}
                        </span>
                        {u.blocked && <span className="ml-1 text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">Заблокирован</span>}
                      </td>
                      <td className="px-4 py-3 text-center"><span className="text-foreground font-medium">{u.coursesEnrolled}</span></td>
                      <td className="px-4 py-3 text-center"><span className="text-foreground font-medium">{u.lessonsCompleted}</span></td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2 justify-center">
                          <div className="w-16"><ProgressBar value={u.avgProgress} size="sm" /></div>
                          <span className="text-xs text-foreground w-8">{u.avgProgress}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 justify-end">
                          <button onClick={() => changeRole(u.id, u.role === 'ADMIN' ? 'USER' : 'ADMIN')}
                            className="p-1.5 rounded hover:bg-muted transition-colors" title={u.role === 'ADMIN' ? 'Снять ADMIN' : 'Дать ADMIN'}>
                            {u.role === 'ADMIN' ? <ShieldOff className="h-3.5 w-3.5 text-amber-600" /> : <Shield className="h-3.5 w-3.5 text-muted-foreground" />}
                          </button>
                          <button onClick={() => toggleBlock(u.id, !u.blocked)}
                            className="p-1.5 rounded hover:bg-muted transition-colors" title={u.blocked ? 'Разблокировать' : 'Заблокировать'}>
                            {u.blocked
                              ? <span className="text-xs text-green-600 font-medium">▶</span>
                              : <span className="text-xs text-red-500 font-medium">⊘</span>}
                          </button>
                          <button onClick={() => setConfirmDelete({ type:'user', id: u.id, name: `${u.firstName} ${u.lastName}` })}
                            className="p-1.5 rounded hover:bg-red-50 transition-colors">
                            <Trash2 className="h-3.5 w-3.5 text-muted-foreground hover:text-red-500" />
                          </button>
                          <ChevronRight className="h-4 w-4 text-muted-foreground cursor-pointer" onClick={() => openUser(u.id)} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredUsers.length === 0 && <p className="text-center text-muted-foreground py-8 text-sm">Студенты не найдены</p>}
            </div>
          </div>
        )}

        {/* ── Tab: Courses ── */}
        {tab === 'courses' && (
          <div className="space-y-4">
            <div className="flex justify-end">
              <Button onClick={openCreateCourse} className="gap-2">
                <Plus className="h-4 w-4" /> Новый курс
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {courses.map(c => (
                <div key={c.id} className="bg-card border border-border rounded-xl p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0 mr-2">
                      <h3 className="font-semibold text-foreground text-sm truncate">{c.title}</h3>
                      <span className="text-xs text-muted-foreground">{c.level}</span>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <span className={cn("text-xs px-2 py-0.5 rounded-full", c.price === 0 ? "bg-green-100 text-green-700" : "bg-primary/10 text-primary")}>
                        {c.price === 0 ? 'Бесплатно' : `${c.price.toLocaleString()} ₸`}
                      </span>
                      <button onClick={() => openEditCourse(c)} className="p-1.5 rounded hover:bg-muted transition-colors ml-1">
                        <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                      </button>
                      <button onClick={() => setConfirmDelete({ type:'course', id: c.id, name: c.title })}
                        className="p-1.5 rounded hover:bg-red-50 transition-colors">
                        <Trash2 className="h-3.5 w-3.5 text-muted-foreground hover:text-red-500" />
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    {[
                      { label: 'Студентов', value: c.studentsCount },
                      { label: 'Уроков',    value: c.lessonsCount },
                      { label: 'Завершили', value: c.completedCount },
                    ].map(s => (
                      <div key={s.label} className="bg-muted/40 rounded-lg p-2.5 text-center">
                        <div className="text-lg font-bold text-foreground">{s.value}</div>
                        <div className="text-xs text-muted-foreground">{s.label}</div>
                      </div>
                    ))}
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
                      <span>Средний прогресс</span>
                      <span className="font-medium text-foreground">{c.avgProgress}%</span>
                    </div>
                    <ProgressBar value={c.avgProgress} size="sm" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Tab: Lessons ── */}
        {tab === 'lessons' && (
          <div className="space-y-4">
            <div className="flex justify-end">
              <Button onClick={openCreateLesson} className="gap-2">
                <Plus className="h-4 w-4" /> Новый урок
              </Button>
            </div>
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Урок</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground hidden md:table-cell">Курс</th>
                    <th className="text-center px-4 py-3 text-xs font-medium text-muted-foreground">Тип</th>
                    <th className="text-center px-4 py-3 text-xs font-medium text-muted-foreground">Прохождений</th>
                    <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground">Действия</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {lessons.map(l => (
                    <tr key={l.id} className="hover:bg-muted/20 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="text-base">{TYPE_ICON[l.type]}</span>
                          <div>
                            <div className="font-medium text-foreground">{l.title}</div>
                            <div className="text-xs text-muted-foreground">#{l.order} {l.isFree ? '· Бесплатно' : ''}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground hidden md:table-cell text-xs">{l.course.title}</td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground">{l.type}</span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-foreground font-medium">{l.completions}</span>
                        <span className="text-muted-foreground text-xs ml-1">({l.completionRate}%)</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 justify-end">
                          <button onClick={() => openEditLesson(l)} className="p-1.5 rounded hover:bg-muted transition-colors">
                            <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                          </button>
                          <button onClick={() => setConfirmDelete({ type:'lesson', id: l.id, name: l.title })}
                            className="p-1.5 rounded hover:bg-red-50 transition-colors">
                            <Trash2 className="h-3.5 w-3.5 text-muted-foreground hover:text-red-500" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {lessons.length === 0 && <p className="text-center text-muted-foreground py-8 text-sm">Уроки не найдены</p>}
            </div>
          </div>
        )}
      </main>

      {/* ── Course Modal ── */}
      {courseModal && (
        <Modal title={courseModal.mode === 'create' ? 'Создать курс' : 'Редактировать курс'} onClose={() => setCourseModal(null)}>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-muted-foreground block mb-1">Название *</label>
              <input value={courseForm.title} onChange={e => setCourseForm(p => ({...p, title: e.target.value}))}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:border-primary" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground block mb-1">Описание</label>
              <textarea value={courseForm.description} onChange={e => setCourseForm(p => ({...p, description: e.target.value}))} rows={3}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:border-primary resize-none" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-muted-foreground block mb-1">Уровень</label>
                <select value={courseForm.level} onChange={e => setCourseForm(p => ({...p, level: e.target.value}))}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:border-primary">
                  {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground block mb-1">Цена (₸)</label>
                <input type="number" value={courseForm.price} onChange={e => setCourseForm(p => ({...p, price: +e.target.value}))}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:border-primary" />
              </div>
            </div>
            <div>
              <label className="text-xs text-muted-foreground block mb-1">URL изображения</label>
              <input value={courseForm.thumbnailUrl} onChange={e => setCourseForm(p => ({...p, thumbnailUrl: e.target.value}))}
                placeholder="/images/course-1.jpg"
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:border-primary" />
            </div>
            <div className="flex gap-3 justify-end pt-2">
              <Button variant="outline" onClick={() => setCourseModal(null)}>Отмена</Button>
              <Button onClick={saveCourse} disabled={saving || !courseForm.title} className="gap-2">
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Сохранить
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* ── Lesson Modal ── */}
      {lessonModal && (
        <Modal title={lessonModal.mode === 'create' ? 'Создать урок' : 'Редактировать урок'} onClose={() => setLessonModal(null)}>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-muted-foreground block mb-1">Название *</label>
              <input value={lessonForm.title} onChange={e => setLessonForm(p => ({...p, title: e.target.value}))}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:border-primary" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground block mb-1">Курс *</label>
              <select value={lessonForm.courseId} onChange={e => setLessonForm(p => ({...p, courseId: e.target.value}))}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:border-primary">
                {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-muted-foreground block mb-1">Тип</label>
                <select value={lessonForm.type} onChange={e => setLessonForm(p => ({...p, type: e.target.value}))}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:border-primary">
                  {LESSON_TYPES.map(t => <option key={t} value={t}>{TYPE_ICON[t]} {t}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground block mb-1">Длительность (мин)</label>
                <input type="number" value={lessonForm.duration} onChange={e => setLessonForm(p => ({...p, duration: +e.target.value}))}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:border-primary" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-muted-foreground block mb-1">Порядок</label>
                <input type="number" value={lessonForm.order} onChange={e => setLessonForm(p => ({...p, order: +e.target.value}))}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:border-primary" />
              </div>
              <div className="flex items-center gap-2 pt-5">
                <input type="checkbox" id="isFree" checked={lessonForm.isFree} onChange={e => setLessonForm(p => ({...p, isFree: e.target.checked}))}
                  className="w-4 h-4 accent-primary" />
                <label htmlFor="isFree" className="text-sm text-foreground">Бесплатный урок</label>
              </div>
            </div>
            <div className="flex gap-3 justify-end pt-2">
              <Button variant="outline" onClick={() => setLessonModal(null)}>Отмена</Button>
              <Button onClick={saveLesson} disabled={saving || !lessonForm.title} className="gap-2">
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Сохранить
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* ── Confirm Delete ── */}
      {confirmDelete && (
        <ConfirmDialog
          message={`Удалить "${confirmDelete.name}"? Это действие нельзя отменить.`}
          onConfirm={handleDelete}
          onCancel={() => setConfirmDelete(null)}
        />
      )}
    </div>
  );
}