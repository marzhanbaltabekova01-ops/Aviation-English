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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const specializationsRu = [
  { value: 'PILOT_COMMERCIAL', label: 'Пилот коммерческой авиации' },
  { value: 'PILOT_PRIVATE',    label: 'Пилот частной авиации' },
  { value: 'ATC_CONTROLLER',  label: 'Авиадиспетчер' },
  { value: 'CABIN_CREW',      label: 'Бортпроводник' },
  { value: 'STUDENT',         label: 'Курсант / Студент' },
  { value: 'ENGINEER',        label: 'Авиаинженер' },
]

const specializationsKz = [
  { value: 'PILOT_COMMERCIAL', label: 'Коммерциялық авиация ұшқышы' },
  { value: 'PILOT_PRIVATE',    label: 'Жеке авиация ұшқышы' },
  { value: 'ATC_CONTROLLER',  label: 'Авиадиспетчер' },
  { value: 'CABIN_CREW',      label: 'Бортсеріктес' },
  { value: 'STUDENT',         label: 'Курсант / Студент' },
  { value: 'ENGINEER',        label: 'Авиаинженер' },
]

const registerSchema = z.object({
  firstName:       z.string().min(2, 'Минимум 2 символа'),
  lastName:        z.string().min(2, 'Минимум 2 символа'),
  email:           z.string().email('Введите корректный email'),
  specialization:  z.string().min(1, 'Выберите специализацию'),
  password:        z.string().min(6, 'Минимум 6 символов'),
  passwordConfirm: z.string(),
}).refine(d => d.password === d.passwordConfirm, { message: 'Пароли не совпадают', path: ['passwordConfirm'] })

type RegisterForm = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const router = useRouter()
  const { register: registerUser } = useAuth()
  const { lang } = useLang()
  const [showPassword, setShowPassword] = useState(false)
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { firstName: '', lastName: '', email: '', specialization: '', password: '', passwordConfirm: '' },
  })

  const specialization = watch('specialization')
  const specializations = lang === 'kz' ? specializationsKz : specializationsRu

  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true)
    try {
      await registerUser(data)
      toast.success(lang === 'kz' ? 'Тіркелу сәтті! Қош келдіңіз!' : 'Регистрация успешна! Добро пожаловать!')
      router.push('/dashboard')
    } catch (error: any) {
      const message = error?.response?.data?.message || (lang === 'kz' ? 'Тіркелу қатесі. Кейінірек қайталаңыз.' : 'Ошибка регистрации. Попробуйте позже.')
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  const T = {
    title:        lang === 'kz' ? 'Тіркелу'                    : 'Регистрация',
    subtitle:     lang === 'kz' ? 'AviationEnglish.kz аккаунт жасаңыз' : 'Создайте аккаунт AviationEnglish.kz',
    firstName:    lang === 'kz' ? 'Аты'                         : 'Имя',
    lastName:     lang === 'kz' ? 'Тегі'                        : 'Фамилия',
    spec:         lang === 'kz' ? 'Мамандану'                   : 'Специализация',
    specPlaceholder: lang === 'kz' ? 'Мамандануды таңдаңыз'    : 'Выберите специализацию',
    password:     lang === 'kz' ? 'Құпия сөз'                  : 'Пароль',
    passwordMin:  lang === 'kz' ? 'Кемінде 6 таңба'            : 'Минимум 6 символов',
    passwordConfirm: lang === 'kz' ? 'Құпия сөзді растаңыз'    : 'Подтверждение пароля',
    passwordRepeat:  lang === 'kz' ? 'Құпия сөзді қайталаңыз'  : 'Повторите пароль',
    btn:          lang === 'kz' ? 'Тіркелу'                    : 'Зарегистрироваться',
    loading:      lang === 'kz' ? 'Тіркелуде...'               : 'Регистрация...',
    haveAccount:  lang === 'kz' ? 'Аккаунтыңыз бар ма?'        : 'Уже есть аккаунт?',
    login:        lang === 'kz' ? 'Кіру'                        : 'Войти',
    firstNamePh:  lang === 'kz' ? 'Азамат'                     : 'Иван',
    lastNamePh:   lang === 'kz' ? 'Сейткали'                   : 'Петров',
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
            <h1 className="text-2xl font-bold text-foreground">{T.title}</h1>
            <p className="text-sm text-muted-foreground mt-1">{T.subtitle}</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">{T.firstName}</Label>
                <Input id="firstName" placeholder={T.firstNamePh} {...register('firstName')} className={errors.firstName ? 'border-destructive' : ''} />
                {errors.firstName && <p className="text-xs text-destructive">{errors.firstName.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">{T.lastName}</Label>
                <Input id="lastName" placeholder={T.lastNamePh} {...register('lastName')} className={errors.lastName ? 'border-destructive' : ''} />
                {errors.lastName && <p className="text-xs text-destructive">{errors.lastName.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="pilot@example.com" {...register('email')} className={errors.email ? 'border-destructive' : ''} />
              {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <Label>{T.spec}</Label>
              <Select value={specialization} onValueChange={v => setValue('specialization', v)}>
                <SelectTrigger className={errors.specialization ? 'border-destructive' : ''}>
                  <SelectValue placeholder={T.specPlaceholder} />
                </SelectTrigger>
                <SelectContent>
                  {specializations.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                </SelectContent>
              </Select>
              {errors.specialization && <p className="text-xs text-destructive">{errors.specialization.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">{T.password}</Label>
              <div className="relative">
                <Input id="password" type={showPassword ? 'text' : 'password'} placeholder={T.passwordMin}
                  {...register('password')} className={errors.password ? 'border-destructive pr-10' : 'pr-10'} />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="passwordConfirm">{T.passwordConfirm}</Label>
              <div className="relative">
                <Input id="passwordConfirm" type={showPasswordConfirm ? 'text' : 'password'} placeholder={T.passwordRepeat}
                  {...register('passwordConfirm')} className={errors.passwordConfirm ? 'border-destructive pr-10' : 'pr-10'} />
                <button type="button" onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                  {showPasswordConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.passwordConfirm && <p className="text-xs text-destructive">{errors.passwordConfirm.message}</p>}
            </div>

            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 mt-2" disabled={isLoading}>
              {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />{T.loading}</> : T.btn}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {T.haveAccount}{' '}
            <Link href="/auth/login" className="font-medium text-primary hover:text-primary/80 transition-colors">{T.login}</Link>
          </p>
        </div>
      </div>
    </div>
  )
}