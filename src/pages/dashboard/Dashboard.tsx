import DashboardTop from "./DashboardTop";
import DashboardNotification from "./DashboardNotification";
import DashboardPayment from "./DashboardPayment";
import RecentPayment from "./RecentPayment";
import UserTrends from "./UserTrends";
import UserOverview from "./UserOverview";
import PaymentGateway from "./PaymentGateway";

export default function Dashboard() {
  return (
    <div className="px-4 py-4">
      <DashboardTop />
      <div className="grid grid-cols-[35%_40%_25%] gap-2 my-4">
        <UserTrends />
        <DashboardPayment />
        <PaymentGateway />
      </div>
      <div className="grid grid-cols-3 gap-5">
        <UserOverview />
        <RecentPayment />
        <DashboardNotification />
      </div>
    </div>
  );
}
