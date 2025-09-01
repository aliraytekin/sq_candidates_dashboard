// src/components/EditJobModal.jsx
import React, { useEffect, useState } from "react";
import client from "../api/client";
import { Dialog, DialogTitle, DialogContent, DialogActions,
        Button, TextField, Stack, Alert } from "@mui/material";

export default function EditJobModal({ open, job, onClose, onSuccess }) {
  const [form, setForm] = useState({
    title: "", category: "", employment_type: "", location: "",
    posted_at: "", status: "draft", description: ""
  });
  const [errors, setErrors] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (job) {
      setForm({
        title: job.title || "",
        category: job.category || "",
        employment_type: job.employment_type || "",
        location: job.location || "",
        posted_at: job.posted_at || "",
        status: job.status || "draft",
        description: job.description || ""
      });
    }
  }, [job]);

  const updateField = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async () => {
    setSaving(true);
    setErrors([]);
    try {
      const res = await client.patch(`/jobs/${job.id}`, { job: form });
      if (res.status === 200) onSuccess();
    } catch (err) {
      const apiErrors = err?.response?.data?.errors;
      setErrors(Array.isArray(apiErrors) ? apiErrors : ["Failed to update job."]);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Job</DialogTitle>
      <DialogContent dividers>
        {errors.length > 0 && <Alert severity="error" sx={{ mb: 2 }}>{errors.join(" ")}</Alert>}
        <Stack spacing={2}>
          <TextField label="Title" value={form.title} onChange={updateField("title")} />
          <TextField label="Category" value={form.category} onChange={updateField("category")} />
          <TextField label="Employment type" value={form.employment_type} onChange={updateField("employment_type")} />
          <TextField label="Location" value={form.location} onChange={updateField("location")} />
          <TextField label="Posted at (YYYY-MM-DD)" value={form.posted_at} onChange={updateField("posted_at")} />
          <TextField label="Status (draft/published/archived)" value={form.status} onChange={updateField("status")} />
          <TextField label="Description" multiline rows={4} value={form.description} onChange={updateField("description")} />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={submit} disabled={saving}>
          {saving ? "Saving…" : "Save changes"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
