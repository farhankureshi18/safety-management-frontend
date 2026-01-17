import { AdminLayout } from "@/components/layouts/AdminLayout";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { FolderOpen, FileText, File, FileSpreadsheet, Download, Upload, MoreHorizontal, Trash2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";
import ShowDocForm from "./ShowDocForm";
import api from "@/api/axiosInstance";


const CATEGORIES = [
  { label: "Policies", value: "policy" },
  { label: "Procedures", value: "procedure" },
  { label: "Templates", value: "template" },
  { label: "Forms", value: "form" },
  { label: "Records", value: "record" },
  { label: "Audits", value: "audit" },
];

const TYPE_LABEL = {
  policy: "Policy",
  procedure: "Procedure",
  template: "Template",
  form: "Form",
  record: "Record",
  audit: "Audit",
};


const getFileIcon = (type) => {
  switch (type) {
    case "pdf":
      return <FileText className="w-8 h-8 text-destructive" />;
    case "xlsx":
      return <FileSpreadsheet className="w-8 h-8 text-success" />;
    default:
      return <File className="w-8 h-8 text-muted-foreground" />;
  }
};


export default function Documents() {
  const [documents, setDocuments] = useState([]);
  const [activeType, setActiveType] = useState("");
  const [docForm, setDocForm] = useState(false);
  const [counts, setCounts] = useState({});
  const [allDocuments, setAllDocuments] = useState([]);
  const [notifications, setNotifications] = useState([]);


  const fetchCounts = async () => {
    try {
      const results = await Promise.all(
        CATEGORIES.map((cat) =>
          api.get(`/documents/type/${cat.value}`)
        )
      );

      const countMap = {};
      results.forEach((res, idx) => {
        countMap[CATEGORIES[idx].value] = res.data.data.length;
      });

      setCounts(countMap);
    } catch (err) {
      console.error(err);
    }
  };

 const fetchByType = async (type) => {
  try {
    setActiveType(type);
    const res = await api.get(`/documents/type/${type}`);
    setDocuments(res.data.data || []);
  } catch (err) {
    console.error(err);
    setDocuments([]);
  }
};


const deleteDocument = async (id) => {
  try {
    await api.delete(`/documents/delete/${id}`);
    const updated = allDocuments.filter(doc => doc._id !== id);
    setAllDocuments(updated);
    if (activeType) {
      fetchByType(activeType);
    } else {
      setDocuments(updated);
    }
    fetchCounts();
  } catch (err) {
    console.error(err);
  }
};

const fetchNotifications = async () => {
    try {
      const res = await api.get(
        "/notifications/Admin",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setNotifications(res.data || []);
      console.log(res.data,'sss')
    } catch (err) {
      console.error("Error fetching notifications:", err.response?.data);
    }
  };


const fetchAllDocuments = async () => {
  try {
    const res = await api.get("/documents/fetchAll");
    const docs = res.data.data || [];

    setAllDocuments(docs);
    setDocuments(docs);   
    setActiveType("");
  } catch (err) {
    console.error(err);
    setAllDocuments([]);
    setDocuments([]);
  }
};




  useEffect(() => {
    fetchAllDocuments();
    fetchCounts();
    fetchNotifications();
  }, []);


  return (
    <AdminLayout>
      <PageHeader
        title="Documents"
        subtitle="Manage safety documents, policies, and procedures"
        action={
          <Button onClick={() => setDocForm(true)}>
            <Upload className="w-4 h-4 mr-2" />
            Upload Document
          </Button>
        }
      />

      {docForm && (
        <ShowDocForm
          onClose={() => setDocForm(false)}
          onSuccess={() => {
            fetchCounts();
            if (activeType) fetchByType(activeType);
          }}
        />
      )}

      <div className="mb-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {CATEGORIES.map((cat) => (
          <div
            key={cat.value}
            onClick={() => fetchByType(cat.value)}
            className={`relative flex flex-col items-center p-4 rounded-xl border cursor-pointer transition
              ${activeType === cat.value ? "border-blue-500 border-2" : "border-border"}
            `}
          >
            <FolderOpen className="w-8 h-8 text-warning mb-2" />

            {/* COUNT BADGE */}
            <span className="absolute top-2 right-2 bg-muted text-xs px-2 py-0.5 rounded-full">
              {counts[cat.value] ?? 0}
            </span>

            <span className="text-sm font-medium">{cat.label}</span>
          </div>
        ))}
      </div>

        <h3 className="text-lg font-semibold mb-4">
      {activeType
        ? `${TYPE_LABEL[activeType]} Documents`
        : "All Documents"}
    </h3>


      {activeType && documents.length === 0 && (
        <div className="text-center py-10 text-muted-foreground">
          No {TYPE_LABEL[activeType]} files found
        </div>
      )}

      <div className="grid gap-4">
        {documents.map((doc) => (
          <div
            key={doc._id}
            className="bg-card rounded-xl border p-4 hover:shadow-soft transition"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                {getFileIcon(doc.type)}
              </div>

                <div className="flex-1 min-w-0">
                 <h4 className="font-medium text-foreground truncate">{doc.title}</h4>
                 <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground mt-1">
                   <span className="uppercase font-medium">{doc.type}</span>
                   <span>•</span>
                   <span>{(doc.file.size / 1024).toFixed(2)} KB</span>
                   {/* <span>•</span> */}
                  {/* <span>{doc.uploadedBy.name}</span> */}
                   <span className="hidden sm:inline">•</span>
                   <span className="hidden sm:inline">{new Date(doc.createdAt).toLocaleDateString()}</span>
                 </div>
               </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() =>window.open(  `${import.meta.env.VITE_API_BASE_ADDRESS}/documents/download/${doc._id}`,  "_blank") } >
                <Download className="w-4 h-4" />
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    className="text-destructive"
                    onClick={() => deleteDocument(doc._id)}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
