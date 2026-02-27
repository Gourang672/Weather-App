"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
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
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { toast } from "sonner"
import { 
  useRequestPasswordResetMutation, 
  useVerifyPasswordResetOtpMutation, 
  useResetPasswordMutation 
} from "@/redux/apis/passwordResetApi/passwordResetApi"

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter()
  const [step, setStep] = useState<'email' | 'otp' | 'reset'>('email')
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [requestReset, { isLoading: isRequestLoading }] = useRequestPasswordResetMutation()
  const [verifyOtp, { isLoading: isVerifyLoading }] = useVerifyPasswordResetOtpMutation()
  const [resetPassword, { isLoading: isResetLoading }] = useResetPasswordMutation()

  const getErrorMessage = (err: any): string => {
    if (typeof err === 'string') return err
    const httpStatus = err?.originalStatus
    if (httpStatus === 400) return err?.data?.message || 'Invalid input'
    if (httpStatus === 401) return err?.data?.message || 'Unauthorized'
    if (httpStatus === 404) return 'User not found'
    if (httpStatus === 422) return err?.data?.message || 'Validation error'
    if (httpStatus === 500) return 'Server error. Please try again later.'
    if (err?.status === 'FETCH_ERROR') return 'Network error. Please check your connection.'
    if (err?.data?.message) return err.data.message
    if (err?.data?.error) return err.data.error
    return 'An error occurred. Please try again.'
  }

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!email) {
      const msg = 'Please enter your email'
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

    try {
      await requestReset({ email }).unwrap()
      setStep('otp')
      toast.success('OTP sent to your email')
    } catch (err) {
      const errorMsg = getErrorMessage(err)
      setError(errorMsg)
      toast.error(errorMsg)
    }
  }

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (otp.length !== 6) {
      const msg = 'Please enter a valid 6-digit code'
      setError(msg)
      toast.error(msg)
      return
    }

    try {
      await verifyOtp({ email, code: otp }).unwrap()
      setStep('reset')
      toast.success('OTP verified successfully')
    } catch (err) {
      const errorMsg = getErrorMessage(err)
      setError(errorMsg)
      toast.error(errorMsg)
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validation
    if (!newPassword) {
      const msg = 'Please enter a new password'
      setError(msg)
      toast.error(msg)
      return
    }

    if (newPassword.length < 6) {
      const msg = 'Password must be at least 6 characters'
      setError(msg)
      toast.error(msg)
      return
    }

    if (!confirmPassword) {
      const msg = 'Please confirm your password'
      setError(msg)
      toast.error(msg)
      return
    }

    if (newPassword !== confirmPassword) {
      const msg = 'Passwords do not match'
      setError(msg)
      toast.error(msg)
      return
    }

    try {
      await resetPassword({ email, newPassword }).unwrap()
      toast.success('Password reset successfully!')
      router.push('/login')
    } catch (err) {
      const errorMsg = getErrorMessage(err)
      setError(errorMsg)
      toast.error(errorMsg)
    }
  }

  const handleBack = () => {
    if (step === 'otp') {
      setStep('email')
      setOtp('')
      setError(null)
    } else if (step === 'reset') {
      setStep('otp')
      setNewPassword('')
      setConfirmPassword('')
      setError(null)
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="p-6 md:p-8">
          <FieldGroup>
            <div className="flex flex-col items-center gap-2 text-center">
              <h1 className="text-2xl font-bold">
                {step === 'email' ? 'Forgot Password' : step === 'otp' ? 'Enter OTP' : 'Reset Password'}
              </h1>
              <p className="text-muted-foreground text-balance">
                {step === 'email'
                  ? 'Enter your email address and we\'ll send you a code to reset your password.'
                  : step === 'otp'
                  ? 'We\'ve sent a 6-digit code to your email. Enter it below.'
                  : 'Enter your new password below.'
                }
              </p>
            </div>

            {error && (
              <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive flex items-center justify-between">
                <span>{error}</span>
                <button onClick={() => setError(null)} className="ml-2 text-lg">×</button>
              </div>
            )}

            {step === 'email' ? (
              <form onSubmit={handleSendOTP}>
                <Field>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Field>
                <Field className="mt-6">
                  <Button type="submit" className="w-full" disabled={isRequestLoading}>
                    {isRequestLoading ? 'Sending OTP...' : 'Send Reset Code'}
                  </Button>
                </Field>
              </form>
            ) : step === 'otp' ? (
              <form onSubmit={handleVerifyOTP}>
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
                <Field className="mt-6">
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isVerifyLoading || otp.length !== 6}
                  >
                    {isVerifyLoading ? 'Verifying...' : 'Verify Code'}
                  </Button>
                </Field>
                <Field>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={handleBack}
                    className="w-full"
                  >
                    Back to Email
                  </Button>
                </Field>
              </form>
            ) : (
              <form onSubmit={handleResetPassword}>
                <Field>
                  <FieldLabel htmlFor="newPassword">New Password</FieldLabel>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      className="pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </Field>
                <Field>
                  <FieldLabel htmlFor="confirmPassword">Confirm Password</FieldLabel>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </Field>
                <Field className="mt-6">
                  <Button type="submit" className="w-full" disabled={isResetLoading}>
                    {isResetLoading ? 'Resetting...' : 'Reset Password'}
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
              </form>
            )}

            <FieldDescription className="text-center">
              Remember your password? <a href="/login" className="underline">Sign in</a>
            </FieldDescription>
          </FieldGroup>
        </CardContent>
      </Card>
    </div>
  )
}