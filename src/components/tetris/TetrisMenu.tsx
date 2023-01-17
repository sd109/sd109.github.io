import React from "react";
import { Card } from "react-bootstrap";

type MenuProps = { children: JSX.Element[] }
export function TetrisMenu(props: MenuProps) {
        return (
        <Card className="tetris-pause-menu">
            {props.children}
        </Card>
    )
}

export function TetrisPauseMenu() {
    return (
        <TetrisMenu>
            <h2 style={{marginTop: "0.5em"}}>Game Paused</h2>
            <p>Press <code>Escape</code> to resume</p>
        </TetrisMenu>
    )
}

export function TetrisGameOverMenu() {
    return (
        <TetrisMenu>
            <h2 style={{marginTop: "0.5em"}}>Game Over</h2>
            <p>Score: 0</p>
        </TetrisMenu>
    )
}