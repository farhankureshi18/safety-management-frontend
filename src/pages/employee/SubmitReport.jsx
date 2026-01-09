import { EmployeeLayout } from "@/components/layouts/EmployeeLayout";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {toast} from "@/components/ui/sonner"
import { Upload, Send } from "lucide-react";
import { useState } from "react";
import axios from "axios";

export default function SubmitReport() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    reportTitle: "",
    category: "",
    priority: "",
    location: "",
    description: ""
  });
  const [attachment, setAttachment] = useState(null);
  const [preview, setPreview] = useState(null);


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
  const file = e.target.files[0];
  if (!file) return;
  setAttachment(file);
  setPreview(URL.createObjectURL(file));
  console.log("Selected file:", file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const data = new FormData();
      data.append("reportTitle", formData.reportTitle);
      data.append("category", formData.category);
      data.append("priority", formData.priority);
      data.append("location", formData.location);
      data.append("description", formData.description);

      if (attachment) {
        data.append("attachment", attachment);  
      }
      console.log(data);
      await axios.post("https://safety-management-system-backend.onrender.com/report/create",data,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );
      toast("Report Added successfully");
      setSubmitted(true);
      setAttachment(null);
      setPreview(null);

    } catch (error) {
      console.error("Error submitting report", error);
      toast("Failed to submit report");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <EmployeeLayout>
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mb-4">
            <Send className="w-8 h-8 text-success" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Report Submitted!</h2>
          <p className="text-muted-foreground mb-6">
            Your safety report has been submitted for review.
          </p>
          <Button onClick={() => setSubmitted(false)}>
            Submit Another Report
          </Button>
        </div>
      </EmployeeLayout>
    );
  }

  return (
    <EmployeeLayout>
      <PageHeader
        title="Submit Safety Report"
        subtitle="Report a safety concern or incident"
      />

      <div className="max-w-2xl">
        <form
          onSubmit={handleSubmit}
          className="bg-card rounded-xl border border-border p-6 space-y-5"
        >
          <div className="space-y-2">
            <Label>Report Title</Label>
            <Input
              name="reportTitle"
              value={formData.reportTitle}
              onChange={handleChange}
              placeholder="Brief description of the issue"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select
                onValueChange={(value) =>
                  setFormData({ ...formData, category: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Infrastructure">Infrastructure</SelectItem>
                  <SelectItem value="Safety">Safety</SelectItem>
                  <SelectItem value="Equipment">Equipment</SelectItem>
                  <SelectItem value="Security">Security</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Priority</Label>
              <Select
                onValueChange={(value) =>
                  setFormData({ ...formData, priority: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Location</Label>
            <Input
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Where did this occur?"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Provide detailed information..."
              rows={4}
              required
            />
          </div>

      <div className="space-y-2">
          <Label>Attachments</Label>

        <label className="border-2 border-dashed border-border rounded-lg p-4 text-center hover:border-accent transition-colors cursor-pointer block">
          {preview ? (
            <div className="relative">
              <img
                src={preview}
                alt="Preview"
                className="max-h-48 mx-auto rounded-lg object-contain"
              />
              <p className="text-xs text-muted-foreground mt-2">
                Click to change image
              </p>
            </div>
          ) : (
            <>
              <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">
                Click or drag files to upload
              </p>
            </>
          )}

          <input
            type="file"
            accept="image/*"
            hidden
            onChange={handleFileChange}
          />
        </label>
      </div>


          <Button type="submit" className="w-full" disabled={loading}>
            <Send className="w-4 h-4 mr-2" />
            {loading ? "Submitting..." : "Submit Report"}
          </Button>
        </form>
      </div>
    </EmployeeLayout>
  );
}
