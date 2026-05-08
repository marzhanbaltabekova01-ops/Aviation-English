'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { useAuth } from '@/lib/auth-context'
import { useLang } from '@/lib/lang-context'
import { Plane, Eye, EyeOff, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const loginSchema = z.object({
  email: z.string().email('Введите корректный email'),
  password: z.string().min(6, 'Минимум 6 символов'),
})

type LoginForm = z.infer<typeof loginSchema>

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const { t, lang } = useLang()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true)
    try {
      await login(data.email, data.password)
      toast.success(lang === 'kz' ? 'Жүйеге сәтті кірдіңіз!' : 'Вы успешно вошли в систему!')
      router.push('/dashboard')
    } catch (error: any) {
      const message = error?.response?.data?.message || (lang === 'kz' ? 'Қате. Деректерді тексеріңіз.' : 'Ошибка авторизации. Проверьте данные.')
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-navy-dark px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-2xl shadow-2xl p-8 animate-slide-up">
          <div className="flex flex-col items-center mb-8">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <Plane className="h-6 w-6" />
              </div>
            </Link>
            <h1 className="text-2xl font-bold text-foreground">
              {lang === 'kz' ? 'Кіру' : 'Вход'}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {lang === 'kz' ? 'AviationEnglish.kz аккаунтыңызға кіріңіз' : 'Войдите в свой аккаунт AviationEnglish.kz'}
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="pilot@test.kz"
                {...register('email')} className={errors.email ? 'border-destructive' : ''} />
              {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">{lang === 'kz' ? 'Құпия сөз' : 'Пароль'}</Label>
              <div className="relative">
                <Input id="password" type={showPassword ? 'text' : 'password'} placeholder="user123456"
                  {...register('password')} className={errors.password ? 'border-destructive pr-10' : 'pr-10'} />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
            </div>

            <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading}>
              {isLoading ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" />{lang === 'kz' ? 'Кіруде...' : 'Входим...'}</>
              ) : (lang === 'kz' ? 'Кіру' : 'Войти')}
            </Button>
          </form>

          <div className="mt-6 p-4 rounded-lg bg-muted/50 border border-border">
            <p className="text-xs text-muted-foreground text-center">
              <span className="font-medium">{lang === 'kz' ? 'Тест деректері:' : 'Тестовые данные:'}</span>
              <br />pilot@test.kz / user123456
            </p>
          </div>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {lang === 'kz' ? 'Аккаунтыңыз жоқ па? ' : 'Нет аккаунта? '}
            <Link href="/auth/register" className="font-medium text-primary hover:text-primary/80 transition-colors">
              {lang === 'kz' ? 'Тіркелу' : 'Зарегистрироваться'}
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}