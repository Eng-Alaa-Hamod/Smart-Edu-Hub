import { useEffect, useState } from "react";
import { BookOpen, Globe2, MessageCircle, Search } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import Chat from "@/components/chat/Chat";
import { fetchAllCourses } from "@/store/slices/adminSlice";

function Chats() {
  const dispatch = useDispatch();
  const [selectedChatId, setSelectedChatId] = useState("global");
  const [search, setSearch] = useState("");
  const courses = useSelector((state) => state.admin.courses || []);

  useEffect(() => {
    dispatch(fetchAllCourses());
  }, [dispatch]);

  const filteredCourses = courses.filter((course) =>
    `${course.title} ${course.teacherName || ""}`.toLowerCase().includes(search.toLowerCase()),
  );
  const selectedCourse = courses.find((course) => `course_${course.id}` === selectedChatId);

  return (
    <main className="min-h-[calc(100vh-5rem)] bg-slate-50/70 p-4 sm:p-6">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 lg:flex-row">
        <aside className="w-full rounded-2xl border border-sky-100 bg-white p-4 shadow-sm lg:w-80 lg:shrink-0">
          <div className="mb-4 flex items-center gap-3 border-b border-sky-100 pb-4">
            <MessageCircle className="h-6 w-6 text-teal-700" />
            <div>
              <h1 className="font-bold text-teal-800">Chat moderation</h1>
              <p className="text-xs text-slate-500">Choose a conversation</p>
            </div>
          </div>
          <button type="button" onClick={() => setSelectedChatId("global")} className={`mb-2 flex w-full items-center gap-3 rounded-xl p-3 text-left ${selectedChatId === "global" ? "bg-sky-100 font-semibold text-teal-800" : "text-slate-600 hover:bg-sky-50"}`}>
            <Globe2 className="h-5 w-5 text-sky-600" /> Global chat
          </button>
          <label className="mb-3 flex items-center gap-2 rounded-xl border border-sky-100 px-3 py-2">
            <Search className="h-4 w-4 text-sky-600" />
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search courses..." className="min-w-0 w-full bg-transparent text-sm outline-none" />
          </label>
          <div className="space-y-2">
            {filteredCourses.map((course) => {
              const chatId = `course_${course.id}`;
              return <button key={course.id} type="button" onClick={() => setSelectedChatId(chatId)} className={`flex w-full items-center gap-3 rounded-xl p-3 text-left ${selectedChatId === chatId ? "bg-sky-100 font-semibold text-teal-800" : "text-slate-600 hover:bg-sky-50"}`}><BookOpen className="h-5 w-5 shrink-0 text-sky-600" /><span className="line-clamp-2">{course.title}</span></button>;
            })}
          </div>
        </aside>
        <Chat
          chatId={selectedChatId}
          title={selectedCourse?.title || "Global chat moderation"}
          subtitle="Delete messages, block senders, or disable this chat input"
        />
      </div>
    </main>
  );
}

export default Chats;