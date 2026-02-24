"use client"

import { useState } from "react"
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

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [step, setStep] = useState<'email' | 'otp' | 'reset'>('email')
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showNewPassword, setShowNewPassword] = useState(false)

  const handleSendOTP = () => {
    // Here you would send the OTP to the email
    console.log('Sending OTP to:', email)
    setStep('otp')
  }

  const handleVerifyOTP = () => {
    // Here you would verify the OTP
    console.log('Verifying OTP:', otp)
    setStep('reset')
  }

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match')
      return
    }
    // Here you would reset the password
    console.log('Resetting password for:', email)
    // Then redirect to login
  }

  const handleBack = () => {
    if (step === 'otp') {
      setStep('email')
      setOtp('')
    } else if (step === 'reset') {
      setStep('otp')
      setNewPassword('')
      setConfirmPassword('')
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

            {step === 'email' ? (
              <>
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
                <Field>
                  <Button type="button" onClick={handleSendOTP} className="w-full">
                    Send Reset Code
                  </Button>
                </Field>
              </>
            ) : step === 'otp' ? (
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
                  <Button type="button" onClick={handleVerifyOTP} className="w-full">
                    Verify Code
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
              </>
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
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </Field>
                <Field className="mt-6">
                  <Button type="submit" className="w-full">
                    Reset Password
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