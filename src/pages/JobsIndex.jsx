import { useEffect, useState } from "react";
import client from "../api/client";
import { Paper, Table, TableHead, TableRow, TableCell, TableBody, Stack, Button, TextField, Typography } from "@mui/material";
import CreateJobModal from "../components/CreateJobModal";
import EditJobModal from "../components/EditJobModal"

export default function JobsIndex() {
  const [jobs, setJobs] = useState([]);
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);

  const [openEdit, setOpenEdit] = useState(false);
  const [editing, setEditing] = useState(null);


  const fetchJobs = async () => {
    const res = await client.get("/jobs", { params: { q } });
    setJobs(res.data);
  };

  useEffect(() => { fetchJobs(); }, []);

  useEffect(() => {
    const id = setTimeout(() => fetchJobs(), 300)
    return () => clearTimeout(id);
  }, [q]);

  return (
    <Stack spacing={2}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h5">Jobs</Typography>
        <Button variant="contained" onClick={() => setOpen(true)}>Create Job</Button>
      </Stack>

      <Stack direction="row" spacing={1}>
        <TextField size="small" placeholder="Search title/location…" value={q} onChange={(e) => setQ(e.target.value)} />
        <Button variant="outlined" onClick={fetchJobs}>Search</Button>
      </Stack>

      <Paper elevation={3}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Employment Type</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Posted At</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {jobs.map((j) => (
              <TableRow key={j.id}>
                <TableCell>{j.title}</TableCell>
                <TableCell>{j.category || "-"}</TableCell>
                <TableCell>{j.employment_type || "-"}</TableCell>
                <TableCell>{j.location || "-"}</TableCell>
                <TableCell>{j.posted_at || "-"}</TableCell>
                <TableCell>{j.status}</TableCell>
                <TableCell>
                  <Button size="small" onClick={() => { setEditing(j); setOpenEdit(true); }}>
                    Edit
                  </Button>
                  <Button
                    color="error"
                    size="small"
                    onClick={async () => {
                      if (window.confirm("Are you sure you want to delete this job?")) {
                        try {
                          await client.delete(`/jobs/${j.id}`);
                          setJobs((prev) => prev.filter((job) => job.id !== j.id));
                        } catch (err) {
                          console.error("Delete failed", err);
                        }
                      }
                    }}
                  >
                  Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      <CreateJobModal
        open={open}
        onClose={() => setOpen(false)}
        onSuccess={() => { setOpen(false); fetchJobs(); }}
      />
      {editing && (
      <EditJobModal
        open={openEdit}
        job={editing}
        onClose={() => setOpenEdit(false)}
        onSuccess={() => { setOpenEdit(false); setEditing(null); fetchJobs(); }}
      />
    )}
    </Stack>
  );
}
