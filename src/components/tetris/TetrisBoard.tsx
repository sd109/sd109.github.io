import React, { useEffect, useState, useRef } from "react";
import { Table } from "react-bootstrap";
import { can_move_horizontally, is_block_mobile, move_block, try_rotate } from "./game_logic";
import { TetrisPauseMenu, TetrisGameOverMenu } from "./TetrisMenu";
import { Game, TetrisBlock } from "./types";

type BoardProps = {game: Game, setGame: React.Dispatch<React.SetStateAction<Game>>}

export function TetrisBoard(props: BoardProps) {

    // Unpack props
    let {n_rows, n_cols} = props.game;
    // let setGame = props.setGame;

    // Define state variables
    const [activeBlock, setActiveBlock] = useState(new TetrisBlock(n_rows, n_cols));
    const fixedBlocks = useRef<TetrisBlock[]>([]); 
    const gameStep = useRef(0);
    const timerID = useRef<NodeJS.Timer>();
    const paused = useRef(false);
    const [gameOver, setGameOver] = useState(false);

    // Listen for keyboard input by adding an event listener on first render
    // then use it to update position of activeBlock
    useEffect(() => {
        document.body.addEventListener('keydown', (event) => {
            if (event.key == "Escape") {
                paused.current = !paused.current;
                // Trigger re-render to remove pause menu 
                // - is there a better way to achieve this?
                setActiveBlock(current => ({...current}));
            } else if (!paused.current) {
                setActiveBlock(current => {
                    if (event.key === " ") {
                        // Use space bar for 90 degree rotations
                        try_rotate(current, Math.PI/2, fixedBlocks.current, n_cols);
                    } else if (can_move_horizontally(current, event.key, fixedBlocks.current, n_rows, n_cols)) {
                        // Use arrow keys for movement if not obstructed
                        move_block(current, event.key)
                    }
                    return {...current, coords: current.coords}
                })}
            }
        )},
        [n_rows, n_cols]
    )

    // Start game loop which causes active block to fall downwards
    useEffect(() => {
            if (!paused.current) {
                // Start block falling when game is unpaused
                timerID.current = setInterval(() => {
                        setActiveBlock(current => {
                            for (let i = 0; i < current.coords.length; i++) {
                                current.coords[i].y--
                            }
                            return {...current, coords: current.coords}
                        });    
                        gameStep.current++;
                    },
                    500, // in ms
                );
            } else {
                // Stop block from falling when game is paused
                clearInterval(timerID.current);
            }
        },
        [paused.current]
    )

    // Check if activeBlock is still mobile, otherwise, 
    // move it to fixedBlocks and create a new block
    if (!gameOver && !is_block_mobile(activeBlock, fixedBlocks.current, n_rows, n_cols)) {
        fixedBlocks.current.push(activeBlock);
        setActiveBlock(new TetrisBlock(n_rows, n_cols));
    }

    // Check if any fixed blocks are stacked higher than
    // board height and end game if so
    fixedBlocks.current.map(block => {
        if (!gameOver && block.coords.some(c => c.y >= n_rows-1)) {
            clearInterval(timerID.current)
            setGameOver(true);
        }
    })

    // Check if any rows are completely filled and
    // make row disappear (somehow...?) if so
    

    // Construct HTML table to represent game UI
    let rows: JSX.Element[][] = [];
    for (let i = 0; i < n_rows; i++) {
        let elements: JSX.Element[] = [];
        for (let j = 0; j < n_cols; j++) {
            elements.push(<td key={"base"+i+j}></td>)
        }
        rows.push(elements)
    }
    let board: JSX.Element[] = [];
    for (let i = 0; i < n_rows; i++) {
        board.push(<tr key={i}>{rows[i]}</tr>)
    }

    // Render stationary tetris blocks on board by setting table element colours
    for (let block of fixedBlocks.current) {
        for (let coord of block.coords) {
            if (coord.y < n_rows) {
                rows[n_rows-coord.y-1][coord.x] = <td key={coord.x + coord.y  } style={block.css}></td>
            }
        }
    }
    // Render active block on board
    for (let coord of activeBlock.coords) {
        if (coord.y < n_rows) {
            rows[n_rows-coord.y-1][coord.x] = <td key={coord.x + coord.y} style={activeBlock.css}></td>
        }
    }
    
    return (
        <>
            { paused.current && <TetrisPauseMenu /> }
            { gameOver && <TetrisGameOverMenu />}
            <Table className="tetris-board table-bordered">
                <tbody>
                    {board}
                </tbody>
            </Table>
        </>
    )
}