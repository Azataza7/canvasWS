import express from 'express';
import expressWs from 'express-ws';
import cors from 'cors';
import WebSocket from 'ws';


const app = express();
expressWs(app);

const router = express.Router();
const port = 8000;


app.use(cors());

interface DrawData {
    x: number;
    y: number;
}

const drawingData: DrawData[] = [];
let clients: WebSocket[] = [];


router.ws('/draw', (ws, req) => {
    console.log('Client connected');

    ws.send(JSON.stringify(drawingData));

    ws.on('message', (msg: string) => {
        const data: DrawData = JSON.parse(msg);
        drawingData.push(data);

        clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(data));
            }
        });

    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });

    clients.push(ws);
});

app.use(router);

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
