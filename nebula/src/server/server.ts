import express from 'express';
import path from 'path';
import listFiles from '../cli/ListFiles';
const app = express();
const PORT = 3000;



app.get('/*', (req, res) => {
    res.send("bika");
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});