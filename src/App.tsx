import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import BaseLayout from "./layouts/BaseLayout";
import Login from "./pages/auth/login";
import AuthLayout from "./layouts/AuthLayout";
import Courses from "./pages/courses/Courses";
import CourseGroup from "./pages/coursegroup/CourseGroup";
import Subjects from "./pages/subjects/Subjects";
import Units from "./pages/units/Units";
import QuestionBank from "./pages/questionbank/QuestionBank";
import Question from "./pages/question/Question";
import Users from "./pages/users/Users";
import Instructor from "./pages/instructors/Instructor";
import ReferalCode from "./pages/referalcode/ReferalCode";
import Payment from "./pages/payment/Payment";
import Feedbacks from "./pages/feedbacks/Feedbacks";
import Chapters from "./pages/chapters/Chapters";
import Quiz from "./pages/quiz/Quiz";
import Notification from "./pages/notification/Notification";
import LiveGroup from "./pages/livegroup/LiveGroup";
import Live from "./pages/live/Live";
import Package from "./pages/package/Package";
import { useAuthStore } from "./store/useAuthStore";
import AddQuestionInQuestionBank from "./pages/questionbank/AddQuestionInQuestionBank";
import PreviewQuestionBank from "./pages/questionbank/PreviewQuestionBank";
import TestType from "./pages/testtype/TestType";
import TestSeries from "./pages/testseries/TestSeries";
import Dashboard from "./pages/dashboard/Dashboard";
import MyActions from "./pages/myactions/MyActions";
import RiskTable from "./pages/risktable/RiskTable";
import User from "./pages/user/User";
import Task from "./pages/task/Task";
import Settings from "./pages/settings/Settings";

function App() {
  const { user } = useAuthStore();

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
        </Route>

        <Route element={<BaseLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/user" element={<User />} />
          <Route path="/instructors" element={<Instructor />} />
          <Route path="/my-actions" element={<MyActions />} />
          <Route path="/risk" element={<RiskTable />} />
          <Route path="/task" element={<Task />} />
          <Route path="/reports" element={<Users />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/subjects" element={<Subjects />} />
          <Route path="/course-group" element={<CourseGroup />} />
          <Route path="/units" element={<Units />} />
          <Route path="/question-bank" element={<QuestionBank />} />
          <Route path="/question" element={<Question />} />
          <Route path="/referal-codes" element={<ReferalCode />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/feedbacks" element={<Feedbacks />} />
          <Route path="/chapters" element={<Chapters />} />
          <Route path="/test" element={<Quiz />} />
          <Route path="/test-type" element={<TestType />} />
          <Route path="/test-series" element={<TestSeries />} />
          <Route path="/notification" element={<Notification />} />
          <Route path="/live-group" element={<LiveGroup />} />
          <Route path="/live" element={<Live />} />
          <Route path="/package" element={<Package />} />
          <Route
            path="/question-bank/question"
            element={<AddQuestionInQuestionBank />}
          />
          <Route
            path="/question-bank/preview-questions"
            element={<PreviewQuestionBank />}
          />
        </Route>
        {/* {user && ( */}
        {/* )} */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
