import { useEffect, useState } from "react";
import client from "../api/client";
import { Paper, Table, TableHead, TableRow, TableCell, TableBody, Stack, Typography, Button } from "@mui/material";

export default function CandidatesPage() {
  const [rows, setRows] = useState([]);

  const fetchCandidates = async () => {
    const res = await client.get("/candidates");
    setRows(res.data);
  };

  useEffect(() => { fetchCandidates(); }, []);

  return (
    <Stack spacing={2}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h5">Fake Candidates</Typography>
        <Button variant="outlined" onClick={fetchCandidates}>Refresh</Button>
      </Stack>

      <Paper>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>City</TableCell>
              <TableCell>Country</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((c) => (
              <TableRow key={c.id}>
                <TableCell>{c.name}</TableCell>
                <TableCell>{c.email}</TableCell>
                <TableCell>{c.city}</TableCell>
                <TableCell>{c.country}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Stack>
  );
}
