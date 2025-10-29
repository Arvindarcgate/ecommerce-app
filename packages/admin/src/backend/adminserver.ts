
import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 5001; // or any port you prefer

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('✅ Admin backend is running successfully!');
});

app.listen(PORT, () => {
    console.log(`🚀 Admin backend running on http://localhost:${PORT}`);
});
