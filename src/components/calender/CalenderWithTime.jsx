import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Clock2Icon } from "lucide-react";

import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { SpinnerCustom } from "@/components/ui/spinner";
import { submitBookLesson } from "@/store/slices/BookLessonSlice";
import { ConfirmDialog } from "@/components/multi use/ConfirmDialog";
import { toast } from "sonner";

export function CalendarWithTime({ teacher }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const { loading, error } = useSelector(
    (state) => state.bookLesson,
  );
  const [date, setDate] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()),
  );

  const [startTime, setStartTime] = useState('00:00');
  const [endTime, setEndTime] = useState('00:00');

  const submitRequest = async () => {
    try {
      await dispatch(
      submitBookLesson({
        teacherUID: teacher?.uid || teacher?.id,
        teacherName: `${teacher?.firstName || ""} ${teacher?.secondName || ""}`.trim(),
        teacherEmail: teacher?.email,
        teacherPhotoURL: teacher?.photoURL,
        studentId: user?.uid,
        studentName:
          `${user?.firstName || ""} ${user?.secondName || ""}`.trim(),
        studentEmail: user?.email,
        date,
        startTime,
        endTime,
        }),
      ).unwrap();
      toast.success("Your lesson request was sent successfully!");
    } catch {
      return;
    }
  };

  return (
    <form onSubmit={(event) => event.preventDefault()}>
      <Card
        size="sm"
        className="mx-auto w-full overflow-hidden rounded-3xl border-sky-100 shadow-xl shadow-sky-100/50"
      >
        <CardContent className="flex justify-center bg-white p-5 sm:p-8">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            disabled={{ before: new Date() }}
            className="w-full p-2 [--cell-size:2.75rem]"
          />
        </CardContent>
        <CardFooter className="border-t border-sky-100 bg-slate-50/70 p-5 sm:p-8">
          <FieldGroup className="w-full gap-4 sm:grid sm:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="time-from">Start Time</FieldLabel>
              <InputGroup>
                <InputGroupInput
                  id="time-from"
                  type="time"
                  step="1"
                  value={startTime}
                  onChange={(event) => setStartTime(event.target.value)}
                  className="appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                />
                <InputGroupAddon>
                  <Clock2Icon className="text-muted-foreground" />
                </InputGroupAddon>
              </InputGroup>
            </Field>
            <Field>
              <FieldLabel htmlFor="time-to">End Time</FieldLabel>
              <InputGroup>
                <InputGroupInput
                  id="time-to"
                  type="time"
                  step="1"
                  value={endTime}
                  onChange={(event) => setEndTime(event.target.value)}
                  className="appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                />
                <InputGroupAddon>
                  <Clock2Icon className="text-muted-foreground" />
                </InputGroupAddon>
              </InputGroup>
            </Field>
          </FieldGroup>
        </CardFooter>
      </Card>
      <div className="mx-auto w-full overflow-hidden rounded-3xl border-sky-100 shadow-xl shadow-sky-100/50">
        
        {error && (
          <p className="mt-5 rounded-md bg-red-50 p-3 text-sm text-red-700">
            {error}
          </p>
        )}
        <div className="mt-5 w-full">
          <ConfirmDialog
            trigger={<button type="button" disabled={loading} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-teal-500 px-5 py-3 font-semibold text-white shadow-md shadow-sky-200 transition hover:from-sky-600 hover:to-teal-600 disabled:cursor-not-allowed disabled:opacity-60">{loading && <SpinnerCustom inline spinnerClassName="text-white"  />}{loading ? "Sending request..." : "Submit request"}</button>}
            title="Send this lesson request?"
            description="Please confirm the selected date and time before sending your request."
            confirmText="Send request"
            cancelText="Cancel"
            confirmClassName="bg-teal-700 text-white hover:bg-teal-800"
            onConfirm={submitRequest}
          />
        </div>
      </div>
    </form>
  );
}
