import React, { useState, useEffect } from "react";
import api from "../../api/api";
import SidebarOrg from "./SidebarOrg";
import OrgHome from "./OrgHome";
import StaffForm from "../../components/staff/StaffForm";
import StaffTable from "../../components/staff/StaffTable";
import PostNeed from "./PostNeed";
import OrgNeeds from "./orgNeeds";
import ForgotPassword from "../ForgotPassword";
import ManageDonations from "./ManageDonations";
import NotificationBell from "../../components/NotificationBell";
import ProfileMenu from "../../components/Profile/ProfileMenu";
import ThemeToggle from "../../components/ThemeToggle";

export default function OrganizationDashboard() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  const [activeTab, setActiveTab] = useState("dashboard");
  const [orgData, setOrgData] = useState({ staff: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!user?.id) return;
    setLoading(true);
    api.get(`/organization/by-user/${user.id}`)
      .then((res) => setOrgData({ ...res.data, staff: res.data.staff || [] }))
      .catch(() => setError("Failed to load organization data"))
      .finally(() => setLoading(false));
  }, [user]);

  if (!user) return <div style={{textAlign:'center',padding:'50px'}}>Please log in to view this page.</div>;
  if (loading) return <div style={{display:'flex',justifyContent:'center',alignItems:'center',height:'100vh',background:'linear-gradient(135deg, #e0f2fe 0%, #f1f5f9 100%)'}}><div className="spinner-border text-primary" style={{width:'3rem',height:'3rem'}}></div></div>;
  if (error) return <div className="text-danger text-center p-5">{error}</div>;

  return (
    <div style={{ backgroundColor: "#f8fafc", minHeight: "100vh" }}>
      {/* TOP BAR */}
      <div style={{position:"fixed",top:0,left:0,right:0,zIndex:1000,height:"70px",background:"rgba(255,255,255,0.95)",backdropFilter:"blur(10px)",borderBottom:"1px solid rgba(226,232,240,0.8)",boxShadow:"0 1px 3px rgba(0,0,0,0.05)",padding:"0 24px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div style={{display:"flex",alignItems:"center",gap:"16px"}}>
          <button onClick={() => setSidebarOpen(true)} style={{background:"linear-gradient(135deg, #667eea 0%, #764ba2 100%)",border:"none",borderRadius:"12px",width:"44px",height:"44px",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",transition:"all 0.3s ease",boxShadow:"0 2px 8px rgba(102,126,234,0.25)",color:"white",fontSize:"20px"}} onMouseEnter={(e)=>{e.currentTarget.style.transform="scale(1.05)";}} onMouseLeave={(e)=>{e.currentTarget.style.transform="scale(1)";}}>☰</button>
          <div style={{background:"linear-gradient(135deg, #667eea 0%, #764ba2 100%)",backgroundClip:"text",WebkitBackgroundClip:"text",color:"transparent",fontSize:"20px",fontWeight:"700"}}>Organization Portal</div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:"16px"}}>
          {/* <div><ThemeToggle /></div> */}
          <div><NotificationBell user={user} /></div>
          <div><ProfileMenu user={user} onUpdate={(updated)=>{localStorage.setItem("user",JSON.stringify(updated));setUser(updated);}}/></div>
        </div>
      </div>

      {/* SIDEBAR */}
      {sidebarOpen && (
        <div style={{position:"fixed",top:0,left:0,bottom:0,zIndex:1050,animation:"slideIn 0.2s ease"}}>
          <SidebarOrg activeTab={activeTab} setActiveTab={setActiveTab} onClose={() => setSidebarOpen(false)} />
          <div onClick={() => setSidebarOpen(false)} style={{position:"fixed",top:0,left:0,right:0,bottom:0,backgroundColor:"rgba(0,0,0,0.5)",zIndex:-1,animation:"fadeIn 0.2s ease"}} />
        </div>
      )}

      {/* MAIN CONTENT */}
      <div style={{marginTop:"70px",padding:"28px 32px",maxWidth:"1400px",marginLeft:"auto",marginRight:"auto",animation:"fadeInUp 0.4s ease",background:'linear-gradient(135deg, #e0f2fe 0%, #f1f5f9 100%)',minHeight:'100vh'}}>
        {activeTab === "dashboard" && orgData?.id && <OrgHome org={orgData} />}
        {activeTab === "addStaff" && user?.role === "ORGANIZATION" && orgData?.id && (
          <div>
            <StaffForm organizationId={orgData.id} onStaffAdded={(newStaff) => setOrgData((prev) => ({...prev,staff: [...(prev.staff || []), newStaff]}))} />
          </div>
        )}
        {activeTab === "viewStaff" && user?.role === "ORGANIZATION" && orgData?.id && (
          <div>
            <StaffTable staffList={orgData.staff || []} organizationId={orgData.id} onDelete={(id) => setOrgData((prev) => ({...prev,staff: prev.staff.filter((u) => u.id !== id)}))} />
          </div>
        )}
        {activeTab === "postNeed" && orgData?.id && (
          <div>
            <PostNeed organizationId={orgData.id} />
          </div>
        )}
        {activeTab === "viewNeeds" && orgData?.id && (
          <div>
            <OrgNeeds organizationId={orgData.id} />
          </div>
        )}
        {activeTab === "donations" && orgData?.id && (
          <div>
            <ManageDonations organizationId={orgData.id} />
          </div>
        )}
        {activeTab === "forgotpassword" && <ForgotPassword />}
      </div>

      <style>{`
        @keyframes slideIn { from { transform: translateX(-100%); } to { transform: translateX(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        html { scroll-behavior: smooth; }
        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-track { background: #f1f5f9; border-radius: 10px; }
        ::-webkit-scrollbar-thumb { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: linear-gradient(135deg, #5a67d8 0%, #6b46a0 100%); }
        ::selection { background: rgba(102, 126, 234, 0.2); color: #4a5568; }
      `}</style>
    </div>
  );
}