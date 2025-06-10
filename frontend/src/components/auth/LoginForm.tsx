'use client'

import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { useLoginMutation } from '@/redux/services/auth.service'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

const formSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export function LoginForm() {
  const [login, {data, isLoading, error}] = useLoginMutation()
  const router = useRouter()
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // console.log('Login data:', values)
    login(values)
  }

  useEffect(() => {
    if (data) {
      console.log(data)
      localStorage.setItem('userId', data.user.id)

      alert('Login successful!')
      if(data.user.role==='ADMIN'){
         router.push('/admin')
      } else {
        router.push('/dashboard')
      }
    }
    if (error) {
      alert('Login failed!')
    }
  }, [error,data,isLoading, router]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="you@example.com" type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input placeholder="********" type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={isLoading} type="submit" className="w-full">{isLoading ? 'Loading...' : 'Login'}</Button>
      </form>
    </Form>
  )
}
