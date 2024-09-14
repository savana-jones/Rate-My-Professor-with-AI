// src/app/api/run-python.js
import { spawn } from 'child_process';

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { query } = req.body; // Get the query from the request body

    const pythonProcess = spawn('python', ['src/app/data/data.py', query]);

    pythonProcess.stdout.on('data', (data) => {
      res.status(200).json({ result: data.toString() });
    });

    pythonProcess.stderr.on('data', (data) => {
      res.status(500).json({ error: data.toString() });
    });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}