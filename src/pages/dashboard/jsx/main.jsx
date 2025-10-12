import React, { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import { useNavigate } from "react-router-dom";
import { CircularProgressCard } from "@/components/ui/circular-progress-card";
import { Separator } from "@/components/ui/separator";
import Sidebar from "./Sidebar";
import "../css/main.css";
const Dashboard = () => {
  const navigate = useNavigate();
  return (
    <>
      <Sidebar />
      {/* <div className="dashboard">
        <div className="dash-content">
          <div className="flex min-h-[500px] w-full flex-wrap items-center justify-center gap-8 bg-background p-4">
            <CircularProgressCard
              title="Project Completion"
              description="Tasks completed for the new feature launch."
              currentValue={128}
              goalValue={200}
              currency=""
              progressColor="hsl(142.1 76.2% 41.2%)" // Custom green color
            />
          </div>
        </div>
      </div> */}
    </>
  );
};
export default Dashboard;
