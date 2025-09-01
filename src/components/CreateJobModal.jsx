import { useState } from "react";
import client from "../api/client";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Stack, Alert, Typography, Divider } from "@mui/material";

export default function CreateJobModal({ open, onClose, onSuccess }) {
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);

  const [salaryRange, setSalaryRange] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");
  const [category, setCategory] = useState("");
  const [employmentType, setEmploymentType] = useState("");
  const [location, setLocation] = useState("");

  const [description, setDescription] = useState("");
  const [benefits, setBenefits] = useState("");

  const reset = () => {
    setStep(1);
    setErrors([]);
    setSalaryRange(""); setExperienceLevel(""); setCategory(""); setEmploymentType(""); setLocation("");
    setDescription(""); setBenefits("");
  };

  const closeAll = () => { reset(); onClose(); };

  const validateStep1 = () => {
    const e = [];
    if (!salaryRange.trim()) e.push("Please add a salary range.");
    if (!experienceLevel.trim()) e.push("Please add an experience level.");
    if (!category.trim()) e.push("Please add a category.");
    if (!employmentType.trim()) e.push("Please choose employment type.");
    if (!location.trim()) e.push("Please add a location.");
    return e;
  };

  const next = () => {
    const e = validateStep1();
    if (e.length) { setErrors(e); return; }
    setErrors([]);
    setStep(2);
  };

  const submit = async () => {
    setLoading(true);
    setErrors([]);

    try {
      const payload = {
        job: {
          title: `${category} role`,
          category: category,
          employment_type: employmentType,
          location: location,
          posted_at: new Date().toISOString().slice(0,10),
          status: "draft",
          description: description,
        }
      };

      const res = await client.post("/jobs", payload);
      if (res.status === 201) onSuccess();
    } catch (err) {
      const apiErrors = err?.response?.data?.errors;
      setErrors(Array.isArray(apiErrors) ? apiErrors : ["Could not create the job."]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={closeAll} maxWidth="sm" fullWidth>
      <DialogTitle>New Job</DialogTitle>
      <DialogContent dividers>
        {errors.length > 0 && <Alert severity="error" sx={{ mb: 2 }}>{errors.join(" ")}</Alert>}

        {step === 1 && (
          <Stack spacing={2}>
            <Typography variant="subtitle1">Let’s start!</Typography>
            <TextField label="Salary range" value={salaryRange} onChange={(e) => setSalaryRange(e.target.value)} placeholder="e.g. €40k–€55k" />
            <TextField label="Experience level" value={experienceLevel} onChange={(e) => setExperienceLevel(e.target.value)} placeholder="e.g. years of experience" />
            <TextField label="Category" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="e.g. Civil Engineer, Sales Liaison, etc..." />
            <TextField label="Employment type" value={employmentType} onChange={(e) => setEmploymentType(e.target.value)} placeholder="e.g. Full-time / Contract" />
            <TextField label="Location" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. Remote / Brussels" />
          </Stack>
        )}

        {step === 2 && (
          <Stack spacing={2}>
            <Typography variant="subtitle1">Add a bit more detail.</Typography>
            <TextField label="Full description" multiline rows={5} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What’s the role about?" />
            <TextField label="Benefits" multiline rows={3} value={benefits} onChange={(e) => setBenefits(e.target.value)} placeholder="Perks, benefits…" />
            <Divider />
            <Typography variant="body2" color="text.secondary">
              You can always edit later. We’ll save it as a draft for now.
            </Typography>
          </Stack>
        )}
      </DialogContent>
      <DialogActions>
        {step === 1 ? (
          <>
            <Button onClick={closeAll}>Cancel</Button>
            <Button variant="contained" onClick={next}>Next</Button>
          </>
        ) : (
          <>
            <Button onClick={() => setStep(1)}>Back</Button>
            <Button variant="contained" onClick={submit} disabled={loading}>
              {loading ? "Creating…" : "Create Job"}
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
}
