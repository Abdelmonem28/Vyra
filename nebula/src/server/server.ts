import express from 'express';
import path from 'path';
import listFiles from '../cli/ListFiles';
const app = express();
const PORT = 3000;

listFiles('./pages').then((files) => console.log(files));

app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
 
//  Now, let's create a simple React component to display on the browser. 
 // Path: src/client/App.tsx