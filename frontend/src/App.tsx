import React, { useEffect, useRef, useState } from "react";

function App() {
    const [isDrawing, setIsDrawing] = useState(false);
    const ws = useRef<WebSocket | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const contextRef = useRef<CanvasRenderingContext2D | null>(null);

    useEffect(() => {
        ws.current = new WebSocket('ws://localhost:8000/draw');

        ws.current.onclose = () => console.log("WebSocket connection closed");

        const canvas = canvasRef.current;
        if (canvas) {
            const context = canvas.getContext('2d');
            if (context) {
                contextRef.current = context;
            }
        }

        if (ws.current) {
            ws.current.onmessage = (event) => {
                const pixels = JSON.parse(event.data);
                pixels.forEach((pixel: any) => {
                    if (contextRef.current) {
                        contextRef.current.fillStyle = 'black';
                        contextRef.current.beginPath();
                        contextRef.current.arc(pixel.x, pixel.y, 6, 0, Math.PI * 2);
                        contextRef.current.fill();
                    }
                });
            };
        }

        return () => {
            if (ws.current) {
                ws.current.close();
            }
        };
    }, []);

    const startDrawing = (event: React.MouseEvent<HTMLCanvasElement>) => {
        setIsDrawing(true);
        const x = event.nativeEvent.offsetX;
        const y = event.nativeEvent.offsetY;
        draw(x, y);
    };

    const draw = (x: number, y: number) => {
        if (!isDrawing || !contextRef.current) return;
        contextRef.current.fillStyle = 'black';
        contextRef.current.beginPath();
        contextRef.current.arc(x, y, 6, 0, Math.PI * 2);
        contextRef.current.fill();
        ws.current.send(JSON.stringify([{ x, y }]));
    };

    const endDrawing = () => {
        setIsDrawing(false);
    };

    const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
        const x = event.nativeEvent.offsetX;
        const y = event.nativeEvent.offsetY;
        draw(x, y);
    };

    return (
        <>
            <canvas
                ref={canvasRef}
                width={800}
                height={600}
                style={{ border: '1px solid black' }}
                onMouseDown={startDrawing}
                onMouseMove={handleMouseMove}
                onMouseUp={endDrawing}
                onMouseOut={endDrawing}
            />
        </>
    );
}

export default App;
