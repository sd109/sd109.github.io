import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export function Home() {
    const navigate = useNavigate();
    return (
        <>
            <h1>This is a home page</h1>
            <Button onClick={() => navigate("/tetris")}>Play Tetris</Button>
        </>
    )
}