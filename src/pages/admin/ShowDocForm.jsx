import { useState } from "react";
import api from "@/api/axiosInstance";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { X } from "lucide-react";
import {Select,SelectContent,  SelectItem,SelectTrigger,SelectValue,} from "@/components/ui/select";


export default function ShowDocForm({ onClose, onSuccess }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    type: "policy",
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const submitHandler = async () => {
    if (!file) return toast.error("Please select a PDF file");
    if (!form.title.trim()) return toast.error("Please enter document title");

    const fd = new FormData();
    fd.append("title", form.title);
    fd.append("description", form.description);
    fd.append("type", form.type);
    fd.append("file", file);

    try {
      setLoading(true);
      await api.post("/documents/create", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Document added successfully");
      onSuccess(); // refresh parent document list
      onClose();   // close form
    } catch (err) {
      toast.error(err.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-card p-6 rounded-xl border relative w-full max-w-md mx-auto space-y-4 mb-6">
      {/* Close X button */}
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-muted-foreground hover:text-destructive"
      >
        <X className="w-5 h-5" />
      </button>

      <h3 className="text-lg font-semibold text-foreground">Upload Document</h3>

      {/* Document title */}
      <Input
        placeholder="Document title"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
      />

      {/* Description */}
      <Input
        placeholder="Description"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
      />

      <Select value={form.type} onValueChange={(value) =>setForm({ ...form, type: value })}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select document type" />
      </SelectTrigger>

      <SelectContent>
        <SelectItem value="policy">Policy</SelectItem>
        <SelectItem value="procedure">Procedure</SelectItem>
        <SelectItem value="template">Template</SelectItem>
        <SelectItem value="form">Form</SelectItem>
        <SelectItem value="record">Record</SelectItem>
        <SelectItem value="audit">Audit</SelectItem>
      </SelectContent>
    </Select>



      {/* File input */}
      <Input
        type="file"
        accept="application/pdf"
        onChange={(e) => setFile(e.target.files[0])}
      />

      {/* Buttons */}
      <div className="flex gap-2 mt-4">
        <Button onClick={submitHandler} disabled={loading}>
          {loading ? "Uploading..." : "Upload"}
        </Button>
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
