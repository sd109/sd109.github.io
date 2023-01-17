import { CSSProperties } from "react";
import { select_random_element, select_random_from_range } from "./game_logic";

export type Coord = {
    x: number,
    y: number,
}

const colours = [
    {backgroundColor: "red", border: "red solid 1px"},
    {backgroundColor: "blue", border: "blue solid 1px"},
    {backgroundColor: "green", border: "green solid 1px"},
]

export class TetrisBlock {

    coords: Coord[];
    css: CSSProperties;

    constructor(n_rows: number, n_cols: number) {

        // Allowed block shapes
        let x0 = 5; // select_random_from_range(n_cols-2, 1);
        let y0 = n_rows;
        const shapes: Coord[][] = [
            // Second coord in list will be taken as CoM for rotations
            [{x: x0, y: y0}, {x: x0, y: y0+1}, {x: x0, y: y0+2}], // Linear block
            [{x: x0, y: y0}, {x: x0+1, y: y0}, {x: x0+2, y: y0}, {x: x0+1, y: y0+1}], // 'Podium' block
            [{x: x0, y: y0}, {x: x0+1, y: y0}, {x: x0+2, y: y0}, {x: x0+2, y: y0+1}], // L-shaped block
        ]
        // Select properties randomly
        this.css = select_random_element(colours);
        this.coords = select_random_element(shapes);
    }
}

export type BoardState = {
    board: JSX.Element[],
    blocks: TetrisBlock[],
}

export type Game = { 
    started: boolean,
    paused: boolean,
    step: number,
    // score: number,
    n_rows: number,
    n_cols: number,
}