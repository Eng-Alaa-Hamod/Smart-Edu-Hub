import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { resetPasswordSchema } from "./validation/zod";
import { resetPassword } from "@/store/slices/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { Spinner } from "@/components/ui/spinner";

function ForgotPassword() {
  const dispatch = useDispatch();
  const { loadingResetPassword, errorResetPassword, resetPasswordMessage } = useSelector((state) => state.user);
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onChange",
  });

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-teal-950 to-cyan-900 px-4 py-10">
      <Card className="w-full max-w-md border-white/20 bg-white/95 shadow-2xl">
        <CardHeader><CardTitle>Reset your password</CardTitle><CardDescription>Enter your email and we will send you a reset link.</CardDescription></CardHeader>
        <CardContent>
          <form id="reset-form" onSubmit={handleSubmit(({ email }) => dispatch(resetPassword(email)))}>
            <Label htmlFor="reset-email">Email</Label>
            <Input id="reset-email" type="email" className="mt-2" {...register("email")} />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
            {errorResetPassword && <p className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-700">{errorResetPassword}</p>}
            {resetPasswordMessage && <p className="mt-4 rounded-md bg-emerald-50 p-3 text-sm text-emerald-700">{resetPasswordMessage}</p>}
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-3">
          <Button form="reset-form" type="submit" disabled={loadingResetPassword} className="w-full bg-teal-700 text-white hover:bg-teal-800">
            {loadingResetPassword ? (
              <>
                <Spinner className="mr-2 text-white" />
                Sending...
              </>
            ) : (
              "Send reset link"
            )}
          </Button>
          <Link className="text-sm font-semibold text-teal-700" to="/">Back to login</Link>
        </CardFooter>
      </Card>
    </main>
  );
}

export default ForgotPassword