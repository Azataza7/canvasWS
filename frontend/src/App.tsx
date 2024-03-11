import {useEffect, useRef} from "react";

function App() {
    const ws = useRef<WebSocket | null>(null);

    useEffect(() => {
        ws.current = new WebSocket('ws://localhost:8000/draw');
        ws.current.onclose = () => console.log("ws closed");

        return () => {
            if (ws.current) {
                ws.current.close();
            }
        }
    }, []);

    return (
        <>

        </>
    )
}

export default App
