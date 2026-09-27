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
import { loginSchema } from "./validation/zod";
import { loginUser, clearAuthMessages } from "@/store/slices/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { SpinnerCustom } from "@/components/ui/spinner";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loadingLogin, errorLogin } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(clearAuthMessages());
  }, [dispatch]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });

  const submit = (data) => {
    dispatch(loginUser(data))
      .unwrap()
      .then((loggedInUser) => {
        navigate(
          loggedInUser.role === "admin"
            ? "/admin/dashboard"
            : loggedInUser.role === "teacher"
              ? "/teacher/dashboard"
              : "/student/dashboard",
          {
            replace: true,
          },
        );
      })
      .catch(() => {});
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-teal-950 to-cyan-900 px-4 py-6 sm:py-8">
      <Card className="relative w-full max-w-md gap-2 border-white/20 bg-white/95 p-3 shadow-2xl">
        <CardHeader className="pb-4">
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
          <div className="absolute top-8 right-8 flex justify-end">
            <Link
              className="text-sm font-semibold text-teal-700 hover:text-teal-900"
              to="/signup"
            >
              Sign Up
            </Link>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <form id="login-form" onSubmit={handleSubmit(submit)}>
            <div className="flex flex-col gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  autoComplete="email"
                  required
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    to="/forgot-password"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-sm text-red-600">
                    {errors.password.message}
                  </p>
                )}
              </div>
            </div>
            {errorLogin && (
              <p className="mt-5 rounded-md bg-red-50 p-3 text-sm text-red-700">
                {errorLogin}
              </p>
            )}
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-2 pt-2">
          <Button
            form="login-form"
            type="submit"
            disabled={loadingLogin}
            className="w-full bg-teal-700 text-white hover:bg-teal-800"
          >
            {loadingLogin ? (
              <>
                <SpinnerCustom inline spinnerClassName="mr-2 inline-block text-white"  />
                Signing in...
              </>
            ) : (
              "Login"
            )}
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
}

export default Login;
