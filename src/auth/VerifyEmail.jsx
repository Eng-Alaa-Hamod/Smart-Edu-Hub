import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import {
  resendEmailVerification,
  refreshEmailVerification,
  logoutUser,
  clearAuthMessages,
} from "@/store/slices/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { Spinner } from "@/components/ui/spinner";

function VerifyEmail() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    user,
    loadingEmailVerification,
    errorEmailVerification,
    emailVerificationMessage,
    loadingVerificationRefresh,
    loadingLogout,
  } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(clearAuthMessages());
    return () => {
      dispatch(clearAuthMessages());
    };
  }, [dispatch]);

  useEffect(() => {
    if (!user) {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  useEffect(() => {
    if (user?.emailVerified) {
      const path =
        user.role === "teacher" ? "/teacher/dashboard" : "/student/dashboard";
      navigate(path, { replace: true });
    }
  }, [user, navigate]);

  const handleResend = () => {
    dispatch(resendEmailVerification());
  };

  const handleRefresh = () => {
    dispatch(refreshEmailVerification())
      .unwrap()
      .then((result) => {
        if (result.emailVerified) {
          const path =
            user?.role === "teacher"
              ? "/teacher/dashboard"
              : "/student/dashboard";
          navigate(path, { replace: true });
        }
      })
      .catch(() => {});
  };

  const handleUseAnotherEmail = () => {
    dispatch(logoutUser())
      .unwrap()
      .then(() => navigate("/signup", { replace: true }))
      .catch(() => {});
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-teal-950 to-cyan-900 px-4 py-10">
      <Card className="w-full max-w-md border-white/20 bg-white/95 shadow-2xl">
        <CardHeader>
          <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-teal-100">
            <Mail className="h-7 w-7 text-teal-700" />
          </div>
          <CardTitle className="text-center">Verify your email</CardTitle>
          <CardDescription className="text-center">
            We sent a verification link to
            {user?.email ? (
              <>
                {" "}
                <span className="font-semibold text-teal-700">
                  {user.email}
                </span>
                .
              </>
            ) : (
              " your email."
            )}{" "}
            Click the link to activate your account.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-3">
          {emailVerificationMessage && (
            <p className="rounded-md bg-emerald-50 p-3 text-sm text-emerald-700">
              {emailVerificationMessage}
            </p>
          )}

          {errorEmailVerification && (
            <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">
              {errorEmailVerification}
            </p>
          )}

          <div className="rounded-md bg-slate-50 p-3 text-xs text-slate-600">
            <p className="font-medium text-slate-700">Didn't get the email?</p>
            <ul className="mt-1 list-inside list-disc space-y-0.5">
              <li>Check your spam / junk folder.</li>
              <li>Make sure the address above is correct.</li>
              <li>Wait a minute before requesting a new link.</li>
            </ul>
          </div>
        </CardContent>

        <CardFooter className="flex-col gap-3">

          <Button
            type="button"
            onClick={handleRefresh}
            disabled={loadingVerificationRefresh || loadingLogout}
            className="w-full bg-teal-700 text-white hover:bg-teal-800"
          >
            {loadingVerificationRefresh ? (
              <>
                <Spinner className="mr-2 text-white" />
                Checking...
              </>
            ) : (
              "I've verified my email"
            )}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={handleResend}
            disabled={
              loadingEmailVerification ||
              loadingVerificationRefresh ||
              loadingLogout
            }
            className="w-full border-teal-700 text-teal-700 hover:bg-teal-50"
          >
            {loadingEmailVerification ? (
              <>
                <Spinner className="mr-2 text-teal-700" />
                Sending...
              </>
            ) : (
              "Resend verification email"
            )}
          </Button>

          <button
            type="button"
            onClick={handleUseAnotherEmail}
            disabled={loadingLogout}
            className="text-sm font-semibold text-slate-500 hover:text-teal-700 disabled:opacity-50"
          >
            {loadingLogout ? (
              <>
                <Spinner className="mr-2 text-teal-700" />
                Signing out...
              </>
            ) : (
              "Use another email"
            )}
          </button>

          <Link className="text-xs text-slate-400 hover:text-teal-700" to="/">
            Back to login
          </Link>
        </CardFooter>
      </Card>
    </main>
  );
}

export default VerifyEmail;
