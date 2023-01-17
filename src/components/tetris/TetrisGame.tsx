import { useEffect, useState } from "react";

import { Button, Card } from "react-bootstrap";
import { TetrisBoard } from "./TetrisBoard";
import { Game } from "./types";

import "../../css/tetris.css"

export function TetrisGame() {

    let [game, setGame] = useState<Game>({
        started: false,
        paused: false,
        step: 0,
        n_rows: 20,
        n_cols: 30,
    });

    useEffect(() => {
        document.body.addEventListener('keydown', event => {
                if (event.key === "Escape") {
                    console.log("Pausing");
                    setGame(current => ({...current, paused: true}));
                }
            })
        },
        []
    )

    if (!game.started) {
        // return <Button className="btn-play" onClick={() => setGame({...game, started: true})} >Play Now</Button>
        return <Card className="tetris-game"> <Button className="btn-play" onClick={() => setGame({...game, started: true})}>Play Now</Button> </Card>
    } else {
        return (
            <Card className="tetris-game">
                <Button className="btn-danger btn-close" onClick={() => setGame({...game, started: false})} />
                <h1>Game On!</h1>
                <h2 className="tetris-score">Score: 0</h2>
                <TetrisBoard game={game} setGame={setGame}/>
            </Card>
        )
    }
}