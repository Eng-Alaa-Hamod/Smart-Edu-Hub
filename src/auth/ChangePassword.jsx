import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { changePasswordSchema } from "./validation/zod";
import { changePassword, clearAuthMessages } from "@/store/slices/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { Spinner } from "@/components/ui/spinner";
import { ConfirmDialog } from "@/components/multi use/ConfirmDialog";

function ChangePassword() {
  const dispatch = useDispatch();

  const {
    loadingChangePassword,
    errorChangePassword,
    changePasswordMessage,
    user,
  } = useSelector((state) => state.user);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(changePasswordSchema),
    mode: "onChange",
  });

  useEffect(() => {
    dispatch(clearAuthMessages());
    return () => {
      dispatch(clearAuthMessages());
    };
  }, [dispatch]);

  const submit = ({ password }) => {
    dispatch(changePassword(password))
      .unwrap()
      .then(() => reset()) // مسح الحقول
      .catch(() => {});
  };

  const dashboardPath =
    user?.role === "teacher" ? "/teacher/dashboard" : "/student/dashboard";

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-teal-950 to-cyan-900 px-4 py-10">
      <Card className="w-full max-w-md border-white/20 bg-white/95 shadow-2xl">
        <CardHeader>
          <CardTitle>Change password</CardTitle>
          <CardDescription>Enter your new password below.</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            id="change-password-form"
            className="space-y-4"
            onSubmit={handleSubmit(submit)}
          >
            <div className="grid gap-2">
              <Label htmlFor="new-password">New password</Label>
              <Input
                id="new-password"
                type="password"
                autoComplete="new-password"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="confirm-password">Confirm new password</Label>
              <Input
                id="confirm-password"
                type="password"
                autoComplete="new-password"
                {...register("confirmPassword")}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-600">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {errorChangePassword && (
              <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">
                {errorChangePassword}
              </p>
            )}
            {changePasswordMessage && (
              <p className="rounded-md bg-emerald-50 p-3 text-sm text-emerald-700">
                {changePasswordMessage}
              </p>
            )}
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-3">
          <ConfirmDialog
            trigger={<Button type="button" disabled={loadingChangePassword} className="w-full bg-teal-700 text-white hover:bg-teal-800">{loadingChangePassword ? (
              <>
                <Spinner className="mr-2 text-white" />
                Saving...
              </>
            ) : (
              "Save new password"
            )}</Button>}
            title="Change your password?"
            description="You will use the new password the next time you sign in."
            confirmText="Change password"
            cancelText="Cancel"
            confirmClassName="bg-teal-700 text-white hover:bg-teal-800"
            onConfirm={() => handleSubmit(submit)()}
          />
          <Link
            className="text-sm font-semibold text-teal-700 hover:text-teal-900"
            to={dashboardPath}
          >
            Back to dashboard
          </Link>
        </CardFooter>
      </Card>
    </main>
  );
}

export default ChangePassword;