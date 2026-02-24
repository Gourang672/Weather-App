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

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [showPassword, setShowPassword] = useState(false)
  const [step, setStep] = useState<'credentials' | 'otp'>('credentials')
  const [otp, setOtp] = useState('')

  const handleCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would verify credentials and send OTP
    console.log('Verifying credentials and sending OTP')
    setStep('otp')
  }

  const handleOTPSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would verify OTP
    console.log('Verifying OTP:', otp)
    // Then login
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

              {step === 'credentials' ? (
                <>
                  <Field>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      required
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
                    <Button type="submit">Continue</Button>
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
                    <Button type="submit">Login</Button>
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
