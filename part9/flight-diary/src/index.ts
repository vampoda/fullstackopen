const express=require("express")
const cors=require("cors")
const app = express();
import diaryRouter from './routes/diaries';
app.use(express.json());
app.use(cors())

const PORT = 80;

app.get('/ping', (_req, res) => {
  console.log('someone pinged here');
  res.send('pong');
});

app.use('/api/diaries', diaryRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});