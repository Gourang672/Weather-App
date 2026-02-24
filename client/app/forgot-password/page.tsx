import { ForgotPasswordForm } from "@/components/forgot-password-form"
const page = () => {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-md">
        <ForgotPasswordForm />
      </div>
    </div>
  )
}

export default page