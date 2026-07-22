import Header from "@/components/Header";
import { Outlet } from "react-router-dom";

const AppLayout = () => {
  return (
    <div>
      <main className=" min-h-screen container mx-auto px-4 py-10">
        <Header />
        <Outlet />
      </main>

      <div className=" p-10 text-center bg-gray-800 mt-10">
        By Alan Derwin{" "}
        <span className=" text-blue-500">@{new Date().getFullYear()}</span>
      </div>
    </div>
  );
};

export default AppLayout;
