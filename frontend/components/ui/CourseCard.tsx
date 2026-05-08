'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Clock, Users, BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Course } from '@/types'

interface CourseCardProps {
  course: Course
  className?: string
}

const levelColors: Record<string, string> = {
  'Pre-Aviation': 'bg-emerald-100 text-emerald-700 border-emerald-200',
  'ICAO Level 3': 'bg-amber-100 text-amber-700 border-amber-200',
  'ICAO Level 4': 'bg-sky-100 text-sky-700 border-sky-200',
  'ICAO Level 5-6': 'bg-indigo-100 text-indigo-700 border-indigo-200',
  'Corporate': 'bg-slate-100 text-slate-700 border-slate-200',
}

export function CourseCard({ course, className }: CourseCardProps) {
  const formatPrice = (price: number, currency: string) => {
    if (price === 0) return 'Бесплатно'
    return new Intl.NumberFormat('ru-KZ', {
      style: 'currency',
      currency: currency,
      maximumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card card-hover',
        className
      )}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden bg-muted">
        {course.thumbnailUrl ? (
          <img
            src={course.thumbnailUrl}
            alt={course.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
            <BookOpen className="h-12 w-12 text-primary/40" />
          </div>
        )}
        {/* Level Badge */}
        <div className="absolute top-3 left-3">
          <span
            className={cn(
              'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border',
              levelColors[course.level] || levelColors['Pre-Aviation']
            )}
          >
            {course.level}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-semibold text-lg text-foreground line-clamp-2 group-hover:text-primary transition-colors">
          {course.title}
        </h3>
        <p className="mt-2 text-sm text-muted-foreground line-clamp-2 flex-1">
          {course.description}
        </p>

        {/* Meta */}
        <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <BookOpen className="h-3.5 w-3.5" />
            <span>{course.lessonsCount} уроков</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            <span>{course.duration} ч</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-3.5 w-3.5" />
            <span>{course.studentsCount}</span>
          </div>
        </div>

        {/* Price and CTA */}
        <div className="mt-4 flex items-center justify-between pt-4 border-t border-border">
          <span className="text-lg font-bold text-foreground">
            {formatPrice(course.price, course.currency)}
          </span>
          <Link href={`/courses/${course.id}`}>
            <Button size="sm" variant="outline" className="group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all">
              Подробнее
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
