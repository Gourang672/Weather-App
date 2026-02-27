"use client"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Eye, EyeOff } from "lucide-react"
import { useState } from "react"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { useRouter } from "next/navigation"
import { useLoginMutation, useVerifyOtpMutation } from "@/redux/apis/authApi/authApi"
import { toast } from "sonner"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [showPassword, setShowPassword] = useState(false)
  const [step, setStep] = useState<'credentials' | 'otp'>('credentials')
  const [otp, setOtp] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const [login, { isLoading: isLoginLoading }] = useLoginMutation()
  const [verifyOtp, { isLoading: isVerifyLoading }] = useVerifyOtpMutation()

  const getErrorMessage = (err: any): string => {
    // Handle string errors
    if (typeof err === 'string') return err

    // Handle RTK Query errors with status codes
    const status = err?.status
    
    if (status === 'FETCH_ERROR') {
      return 'Network error. Please check your connection.'
    }
    
    // Handle HTTP status codes
    const httpStatus = err?.originalStatus
    if (httpStatus === 400) {
      return err?.data?.message || 'Invalid input. Please check your details.'
    }
    if (httpStatus === 401) {
      return err?.data?.message || 'Invalid email or password'
    }
    if (httpStatus === 422) {
      return err?.data?.message || 'Validation error. Please check your input.'
    }
    if (httpStatus === 429) {
      return 'Too many attempts. Please try again later.'
    }
    if (httpStatus === 500) {
      return 'Server error. Please try again later.'
    }
    if (httpStatus && httpStatus >= 400 && httpStatus < 500) {
      return err?.data?.message || 'Request failed. Please try again.'
    }
    if (httpStatus && httpStatus >= 500) {
      return 'Server error. Please try again later.'
    }

    // Fallback to data.message or data.error
    if (err?.data?.message) return err.data.message
    if (err?.data?.error) return err.data.error
    
    return 'An error occurred. Please try again.'
  }

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validation
    if (!email || !password) {
      const msg = 'Please fill in all fields'
      setError(msg)
      toast.error(msg)
      return
    }

    if (!email.includes('@')) {
      const msg = 'Please enter a valid email'
      setError(msg)
      toast.error(msg)
      return
    }

    if (password.length < 6) {
      const msg = 'Password must be at least 6 characters'
      setError(msg)
      toast.error(msg)
      return
    }

    try {
      const result = await login({ email, password }).unwrap()
      setStep('otp')
      toast.success('OTP sent to your email')
    } catch (err: any) {
      const errorMsg = getErrorMessage(err)
      setError(errorMsg)
      toast.error(errorMsg)
    }
  }

  const handleOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (otp.length !== 6) {
      const msg = 'Please enter a valid 6-digit code'
      setError(msg)
      toast.error(msg)
      return
    }

    try {
      const result = await verifyOtp({ email, code: otp }).unwrap()
      
      if (!result.access_token) {
        throw new Error('No access token in response')
      }

      localStorage.setItem('access_token', result.access_token)
      document.cookie = `access_token=${result.access_token}; path=/; max-age=86400`
      
      toast.success('Login successful!')
      router.push('/dashboard')
    } catch (err: any) {
      const errorMsg = getErrorMessage(err)
      setError(errorMsg)
      toast.error(errorMsg)
    }
  }

  const handleBack = () => {
    setStep('credentials')
    setOtp('')
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form onSubmit={step === 'credentials' ? handleCredentialsSubmit : handleOTPSubmit} className="p-6 md:p-8">
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">
                  {step === 'credentials' ? 'Welcome back' : 'Enter OTP'}
                </h1>
                <p className="text-muted-foreground text-balance">
                  {step === 'credentials'
                    ? 'Login to your Weather App account'
                    : 'We\'ve sent a 6-digit code to your email. Enter it below.'
                  }
                </p>
              </div>

              {error && (
                <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive flex items-center justify-between">
                  <span>{error}</span>
                  <button onClick={() => setError(null)} className="ml-2 text-lg">×</button>
                </div>
              )}

              {step === 'credentials' ? (
                <>
                  <Field>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </Field>
                  <Field>
                    <div className="flex items-center">
                      <FieldLabel htmlFor="password">Password</FieldLabel>
                      <a
                        href="/forgot-password"
                        className="ml-auto text-sm underline-offset-2 hover:underline"
                      >
                        Forgot your password?
                      </a>
                    </div>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        required
                        className="pr-10"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </Field>
                  <Field>
                    <Button type="submit" disabled={isLoginLoading}>
                      {isLoginLoading ? 'Sending OTP...' : 'Continue'}
                    </Button>
                  </Field>
                </>
              ) : (
                <>
                  <Field>
                    <InputOTP
                      maxLength={6}
                      value={otp}
                      onChange={(value) => setOtp(value.replace(/\D/g, ''))}
                      containerClassName="justify-center"
                      inputMode="numeric"
                      pattern="[0-9]*"
                    >
                      <InputOTPGroup className="gap-2">
                        <InputOTPSlot index={0} className="w-12 h-12 rounded-lg" />
                        <InputOTPSlot index={1} className="w-12 h-12 rounded-lg" />
                        <InputOTPSlot index={2} className="w-12 h-12 rounded-lg" />
                        <InputOTPSlot index={3} className="w-12 h-12 rounded-lg" />
                        <InputOTPSlot index={4} className="w-12 h-12 rounded-lg" />
                        <InputOTPSlot index={5} className="w-12 h-12 rounded-lg" />
                      </InputOTPGroup>
                    </InputOTP>
                  </Field>
                  <Field>
                    <Button type="submit" disabled={isVerifyLoading || otp.length !== 6}>
                      {isVerifyLoading ? 'Verifying...' : 'Login'}
                    </Button>
                  </Field>
                  <Field>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={handleBack}
                      className="w-full"
                    >
                      Back
                    </Button>
                  </Field>
                </>
              )}

              <FieldDescription className="text-center">
                Don&apos;t have an account? <a href="/register">Sign up</a>
              </FieldDescription>
            </FieldGroup>
          </form>
          <div className="bg-muted relative hidden md:block">
            <img
              src="/auth.webp"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
