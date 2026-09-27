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
import { Link, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { SignUpSchema } from "./validation/zod";
import { SignUp as signUpUser , clearAuthMessages} from "@/store/slices/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { SpinnerCustom } from "@/components/ui/spinner";

function SignUp() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loadingSignUp, errorSignUp } = useSelector((state) => state.user);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(SignUpSchema),
    mode: "onChange",
  });

  const submit = (data) => {
    dispatch(signUpUser(data))
      .unwrap()
      .then(() => {
        navigate("/verify-email", { replace: true });
      })
      .catch(() => {});
  };

    useEffect(() => {
    dispatch(clearAuthMessages());
  }, [dispatch]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-teal-950 to-cyan-900 px-4 py-6 sm:py-8">
      <Card className="w-full max-w-md border-white/20 bg-white/95 shadow-2xl">
        <CardHeader className="pb-4">
          <CardTitle>Create your account</CardTitle>
          <CardDescription>
            Join Smart Edu Hub and start learning.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <form
            id="signup-form"
            className="space-y-3"
            onSubmit={handleSubmit(submit)}
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <Label htmlFor="firstName">First name</Label>
                <Input id="firstName" {...register("firstName")} />
                {errors.firstName && (
                  <p className="text-sm text-red-600">
                    {errors.firstName.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="secondName">Last name</Label>
                <Input id="secondName" {...register("secondName")} />
                {errors.secondName && (
                  <p className="text-sm text-red-600">
                    {errors.secondName.message}
                  </p>
                )}
              </div>
            </div>
            <div>
              <Label htmlFor="signup-email">Email</Label>
              <Input id="signup-email" autoComplete="email" type="email" {...register("email")} />
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>
            <fieldset className="grid gap-2">
              <legend className="text-sm font-medium">
                I am signing up as
              </legend>
              <div className="grid grid-cols-2 gap-3">
                <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 p-3 transition hover:border-teal-600 has-[:checked]:border-teal-600 has-[:checked]:bg-teal-50">
                  <input type="radio" value="student" {...register("role")} />
                  <span className="text-sm font-medium">Student</span>
                </label>
                <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 p-3 transition hover:border-teal-600 has-[:checked]:border-teal-600 has-[:checked]:bg-teal-50">
                  <input type="radio" value="teacher" {...register("role")} />
                  <span className="text-sm font-medium">Teacher</span>
                </label>
              </div>
              {errors.role && (
                <p className="text-sm text-red-600">{errors.role.message}</p>
              )}
            </fieldset>
            <div>
              <Label htmlFor="signup-password">Password</Label>
              <Input
                id="signup-password"
                type="password"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="confirmPassword">Confirm password</Label>
              <Input
                id="confirmPassword"
                type="password"
                {...register("confirmPassword")}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-600">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
            {errorSignUp && (
              <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">
                {errorSignUp}
              </p>
            )}
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-2 pt-2">
          <Button
            form="signup-form"
            type="submit"
            disabled={loadingSignUp}
            className="w-full bg-teal-700 text-white hover:bg-teal-800"
          >
            {loadingSignUp ? (
              <>
                <SpinnerCustom inline spinnerClassName="mr-2 inline-block text-white"  />
                Creating account...
              </>
            ) : (
              "Create account"
            )}
          </Button>
          <p className="text-sm text-slate-500">
            Already registered?{" "}
            <Link className="font-semibold text-teal-700" to="/">
              Login
            </Link>
          </p>
        </CardFooter>
      </Card>
    </main>
  );
}

export default SignUp;
