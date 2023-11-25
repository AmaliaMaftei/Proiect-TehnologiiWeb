import express from 'express';

const PORT = 8080;

const app = express();
app.use(express.json());

app.use("/", (req, res) => { res.send({}); });

app.listen(PORT, () => console.log(`Server started on http://localhost:${PORT}`));
