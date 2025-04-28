import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import BaseLayout from "./layouts/BaseLayout";
import Login from "./pages/auth/login";
import AuthLayout from "./layouts/AuthLayout";
import Users from "./pages/users/Users";
import { useAuthStore } from "./store/useAuthStore";
import Dashboard from "./pages/dashboard/Dashboard";
import MyActions from "./pages/myactions/MyActions";
import RiskTable from "./pages/risktable/RiskTable";
import User from "./pages/user/User";
import Task from "./pages/task/Task";
import Settings from "./pages/settings/Settings";
import Notification from "./pages/notification/Notification";

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
          <Route path="/my-actions" element={<MyActions />} />
          <Route path="/risk" element={<RiskTable />} />
          <Route path="/task" element={<Task />} />
          <Route path="/risk-details" element={<Users />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/notification" element={<Notification />} />
        </Route>
        {/* {user && ( */}
        {/* )} */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
