import { TetrisBlock, Coord } from "./types";

export function can_move_horizontally(
        block: TetrisBlock, 
        dir: string, 
        fixedBlocks: TetrisBlock[], 
        n_rows: number,
        n_cols: number
    ) {
    
    /*
        Checks whether the current active block is blocked from moving horizontally
        due to other blocks or the board edges.
    */

    if (dir === "ArrowRight") {
        // At rightmost edge of board
        if (block.coords.some(c => c.x === n_cols-1)) {
            return false
        };
        // Stopped by another block
        for (let f of fixedBlocks) {
            for (let c1 of f.coords) {
                if (block.coords.some(c2 => (c1.y === c2.y) && (c1.x === c2.x + 1))) {
                    return false
                };
            };
        };
    }

    if (dir === "ArrowLeft") {
        // At leftmost edge
        if (block.coords.some(c => c.x === 0)) {
            return false
        }
        // Stopped by another block
        for (let f of fixedBlocks) {
            for (let c1 of f.coords) {
                if (block.coords.some(c2 => (c1.y === c2.y) && (c1.x === c2.x - 1))) {
                    return false
                };
            };
        };
    }

    if (dir === "ArrowUp" && block.coords.some(c => c.y === n_rows-1)) {
        return false
    }
    
    return true
}

export function move_block(block: TetrisBlock, dir: String) {
    for (let i = 0; i < block.coords.length; i++) {
        if (dir === "ArrowRight") {
            block.coords[i].x++;
        } else if (dir === "ArrowLeft") {
            block.coords[i].x--;
        } else if (dir === "ArrowDown") {
            block.coords[i].y--;
        // } else if (dir === "ArrowUp") {
        //     block.coords[i].y++;
        }
    }   
}

export function is_block_mobile(block: TetrisBlock, fixedBlocks: TetrisBlock[], n_rows: number, n_cols: number) {

    // Block has hit floor
    if (block.coords.some(c => c.y === 0)) {
        return false
    }
    // Block is resting on top of another
    for (let b of fixedBlocks) {
        for (let c1 of b.coords) {
            if (block.coords.some(c2 => (c1.x === c2.x) && (c2.y - 1 === c1.y))) {
                return false
            }
        }
    }

    return true
}

export function select_random_from_range(end: number, start: number = 0) {
    return Math.floor(start + Math.random() * (end-start))
}

export function select_random_element<T>(arr: T[]) {
    let idx = select_random_from_range(arr.length)
    return arr[idx]
}

function mat_mul(A: number[][], B: number[][]) {
    /* 2x2 matrix multiplication */
    return A.map((row, i) =>
    B[0].map((_, j) =>
      row.reduce((acc, _, n) =>
        acc + A[i][n] * B[n][j], 0
      )
    )
  )
}

export function try_rotate(
        block: TetrisBlock, 
        theta: number,
        fixedBlocks: TetrisBlock[], 
        n_cols: number
    ) {

    /* 
        Implement ability to rotate active block.
        Rotation is performed in three steps:
         -> shift coords to origin
         -> apply 2x2 rotation matrix
         -> shift back to original position
    */
    
    // Point about which block is rotated
    let {x: x0, y: y0} = block.coords[1]
    // 2x2 rotation matrix
    const R = [[Math.cos(theta), Math.sin(theta)], [-Math.sin(theta), Math.cos(theta)]]

    // Get new coords after rotation
    let new_coords = block.coords.map(coord => {
        // Shift
        let X = [[coord.x - x0], [coord.y - y0]];
        // Rotate
        let C = mat_mul(R, X);
        // Unshift
        let new_coord: Coord = {x: Math.round(C[0][0] + x0), y: Math.round(C[1][0] + y0)};
        return new_coord
    })

    // Check that rotation isn't blocked by other elements
    if (new_coords.some(c => (c.x < 0 || c.x > n_cols-1))) {
        // Return without rotating block since rotation
        // would cause collision with edge of board
        return
    } else {
        for (let block of fixedBlocks) {
            for (let f of block.coords) {
                if (new_coords.some(c => c.x === f.x && c.y === f.y)) {
                     // Return without rotating block since rotation
                     // would cause collision with another block
                     return
                }
            }
        }
    }

    // Update block's coords to rotated version
    // - only happens if above checks pass
    block.coords = new_coords;
}