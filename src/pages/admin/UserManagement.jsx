import { AdminLayout } from "@/components/layouts/AdminLayout";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { RoleBadge } from "@/components/shared/RoleBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserPlus, Search, MoreHorizontal, Mail, Edit, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";
import Register from "./Register";
import axios from "axios"
import { toast } from "sonner";
import api from "../../api/axiosInstance";


export default function UserManagement() {
    const [users, setUsers] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState("");
    const [selectedUser, setSelectedUser] = useState(null);
    const[totalUsers,setTotalUsers]=useState(0);

    const[ShowRegisterForm,setShowRegisterForm]=useState(false);

    //For Pagination making variables
    const pageSize = 6;
    const start = totalUsers === 0 ? 0 : (page - 1) * pageSize + 1;
    const end = Math.min(page * pageSize, totalUsers);

  const fetchUsers = async (pageNo = 1) => {
    try {
      const res = await api.get(
        `/auth/users?page=${pageNo}`,
        { withCredentials: true }
      );
      setUsers(res.data.users);
      setTotalPages(res.data.totalPages);
      setTotalUsers(res.data.totalUsers);
      setPage(pageNo);
    } catch (err) {
      toast.error("Failed to fetch users");
    }
  };

  useEffect(() => {
    fetchUsers(page);
  }, []);
  


   const columns = [
    {
      key: "name",
      header: "User",     
      render: (user) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-sm font-medium text-primary">{user.name.split(" ").map((n) => n[0]).join("")}</span>
          </div>
          <div>
            <p className="font-medium text-foreground">{user.name}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "role",
      header: "Role",
      render: (user) => <RoleBadge role={user.role} showIcon />,
    },
    { key: "department", header: "Department", className: "hidden md:table-cell" },

    {
      key: "status",
      header: "Status",
      className: "hidden sm:table-cell",
      render: (user) => (
            <span
              className={`inline-flex items-center gap-1.5 text-sm ${
                user.isActive ? "text-success" : "text-muted-foreground"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  user.isActive ? "bg-success" : "bg-muted-foreground"
                }`}
              />
              {user.isActive ? "Active" : "Inactive"}
            </span>
    )},


      {
      key: "lastActive",
      header: "Last Active",
      className: "hidden lg:table-cell text-muted-foreground",
      render: (user) =>
        new Date(user.createdAt).toLocaleDateString()
    },


    {
      key: "actions",
      header: "",
      render: (user) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
              <DropdownMenuItem
              onClick={() => window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${user.email}`,
                  "_blank")
              }>
              <Mail className="w-4 h-4 mr-2" /> Send Email
            </DropdownMenuItem>

           <DropdownMenuItem
          onClick={() => { setSelectedUser(user);
             setShowRegisterForm(true);
          }} >
          <Edit className="w-4 h-4 mr-2" /> Edit User
        </DropdownMenuItem>

          <DropdownMenuItem
          className="text-destructive"
          onClick={async () => {
            try {
              console.log(user._id)
              await api.delete(
                `/auth/delete/${user._id}`,
                { withCredentials: true }
              );
              toast.success("User deleted");
              fetchUsers(page);
            } catch {
              toast.error("Delete failed");
            }
          }}
        >
          <Trash2 className="w-4 h-4 mr-2" /> Delete
        </DropdownMenuItem>

          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <AdminLayout>
      <PageHeader
        title="User Management"
        subtitle="Manage system users and their permissions"
        action={
          <Button onClick={()=>setShowRegisterForm(true)}>
              <UserPlus className="w-4 h-4 mr-2" /> Add User
          </Button>
        }
      />
    {ShowRegisterForm && (
        <Register
          user={selectedUser}
          onClose={() => {
            setSelectedUser(null);
            setShowRegisterForm(false);
            fetchUsers(page);
          }}
        />
      )}

      {/* Search */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
              placeholder="Search users..."
              className="pl-10 text-foreground bg-background"
              value={search}
              onChange={async (e) => {
                const value = e.target.value;
                setSearch(value);

                if (!value) {
                  fetchUsers(1);
                  return;
                }
                try {
                  const res = await api.get(
                    `/auth/userById?name=${value}`,
                    { withCredentials: true }
                  );
                  setUsers(res.data.users);
                } catch {
                  toast.error("Search failed");
                }
              }}
            />
        </div>
      </div>

      {/* Users Table (Here Data is rendered) */}  
     <DataTable
        columns={columns}
        data={users}
        keyExtractor={(user) => user._id}
      />


      {/* Pagination */}
      <div className="mt-6 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {start}-{end} of {totalUsers} users        </p>
        <div className="flex gap-2">
          <Button
          variant="outline"
          size="sm"
          disabled={page === 1}
          onClick={() => fetchUsers(page - 1)}
        >
          Previous
        </Button>

        <Button
          variant="outline"
          size="sm"
          disabled={page === totalPages}
          onClick={() => fetchUsers(page + 1)}
        >
          Next
        </Button>
        </div>
      </div>
    </AdminLayout>
  );
}
