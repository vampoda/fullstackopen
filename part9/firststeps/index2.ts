import express, { Request, Response } from 'express';

const app = express();
app.use(express.json()); 

app.get('/hello', (_req: Request, res: Response) => {
  res.send("Hello, TypeScript with Express!");
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
