import { AdminLayout } from "@/components/layouts/AdminLayout";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FolderOpen, FileText, File, FileSpreadsheet, Download, Upload, Search, MoreHorizontal, Eye, Trash2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const documents = [
  { id: 1, name: "Safety Policy Manual 2024", type: "pdf", size: "2.4 MB", category: "Policies", uploadedBy: "John Doe", uploadedDate: "Dec 15, 2024" },
  { id: 2, name: "Emergency Response Procedures", type: "pdf", size: "1.8 MB", category: "Procedures", uploadedBy: "Sarah Miller", uploadedDate: "Dec 10, 2024" },
  { id: 3, name: "Risk Assessment Template", type: "xlsx", size: "156 KB", category: "Templates", uploadedBy: "John Doe", uploadedDate: "Nov 28, 2024" },
  { id: 4, name: "Incident Report Form", type: "docx", size: "89 KB", category: "Forms", uploadedBy: "Emily Watson", uploadedDate: "Nov 20, 2024" },
  { id: 5, name: "Training Completion Records", type: "xlsx", size: "340 KB", category: "Records", uploadedBy: "Robert Chen", uploadedDate: "Nov 15, 2024" },
  { id: 6, name: "Safety Audit Checklist Q4", type: "pdf", size: "520 KB", category: "Audits", uploadedBy: "Lisa Brown", uploadedDate: "Nov 1, 2024" },
];

const getFileIcon = (type) => {
  switch (type) {
    case "pdf":
      return <FileText className="w-8 h-8 text-destructive" />;
    case "xlsx":
      return <FileSpreadsheet className="w-8 h-8 text-success" />;
    case "docx":
      return <File className="w-8 h-8 text-info" />;
    default:
      return <File className="w-8 h-8 text-muted-foreground" />;
  }
};

export default function Documents() {
  return (
    <AdminLayout>
      <PageHeader
        title="Documents"
        subtitle="Manage safety documents, policies, and procedures"
        action={
          <Button>
            <Upload className="w-4 h-4 mr-2" />
            Upload Document
          </Button>
        }
      />

      {/* Search */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search documents..." className="pl-10" />
        </div>
      </div>

      {/* Folder Categories */}
      <div className="mb-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {["Policies", "Procedures", "Templates", "Forms", "Records", "Audits"].map((category) => (
          <div key={category} className="flex flex-col items-center p-4 rounded-xl border border-border bg-card hover:bg-muted/50 cursor-pointer transition-colors">
            <FolderOpen className="w-8 h-8 text-warning mb-2" />
            <span className="text-sm font-medium text-foreground">{category}</span>
          </div>
        ))}
      </div>

      {/* Documents Grid */}
      <h3 className="text-lg font-semibold text-foreground mb-4">Recent Documents</h3>
      <div className="grid gap-4">
        {documents.map((doc) => (
          <div key={doc.id} className="bg-card rounded-xl border border-border p-4 hover:shadow-soft transition-shadow">
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-muted/50 flex items-center justify-center">{getFileIcon(doc.type)}</div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-foreground truncate">{doc.name}</h4>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground mt-1">
                  <span className="uppercase font-medium">{doc.type}</span>
                  <span>•</span>
                  <span>{doc.size}</span>
                  <span>•</span>
                  <span>{doc.category}</span>
                  <span className="hidden sm:inline">•</span>
                  <span className="hidden sm:inline">{doc.uploadedDate}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="hidden sm:flex">
                  <Download className="w-4 h-4" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Eye className="w-4 h-4 mr-2" /> View
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Download className="w-4 h-4 mr-2" /> Download
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">
                      <Trash2 className="w-4 h-4 mr-2" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
