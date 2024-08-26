import "./Minesweeper.css";
import Mine from "./mine.png";

const Minesweeper = () => {
  const rowSize = 10;
  const colSize = 8;

  const checkSurroundingBombs = (board, row, col) => {
    const directions = [
      [-1, -1],
      [-1, 0],
      [-1, 1],
      [0, -1],
      [0, 1],
      [1, -1],
      [1, 0],
      [1, 1],
    ];

    let bombCount = 0;

    directions.forEach(([dx, dy]) => {
      const newRow = row + dx;
      const newCol = col + dy;

      if (
        newRow >= 0 &&
        newRow < board.length &&
        newCol >= 0 &&
        newCol < board[0].length
      ) {
        if (board[newRow][newCol] === "bomb") {
          bombCount++;
        }
      }
    });
    return bombCount;
  };

  const board = [
    [0, 0, "bomb", 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    ["bomb", 0, 0, 0, 0, "bomb", 0, 0],
    [0, "bomb", 0, 0, 0, 0, 0, 0],
    [0, 0, "bomb", 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, "bomb"],
    [0, 0, 0, 0, 0, "bomb", 0, 0],
    [0, 0, 0, 0, 0, 0, 0, "bomb"],
    [0, 0, "bomb", 0, 0, 0, 0, "bomb"],
    [0, 0, 0, 0, 0, "bomb", 0, "bomb"],
  ];

  const updateBoardWithBombCounts = (board) => {
    return board.map((row, rowIndex) =>
      row.map((cell, colIndex) => {
        if (cell === "bomb") {
          return "bomb";
        }
        return checkSurroundingBombs(board, rowIndex, colIndex);
      })
    );
  };

  const updatedBoard = updateBoardWithBombCounts(board);

  const revealSurroundingCells = (row, col) => {
    const directions = [
      [-1, -1],
      [-1, 0],
      [-1, 1],
      [0, -1],
      [0, 1],
      [1, -1],
      [1, 0],
      [1, 1],
    ];

    directions.forEach(([dx, dy]) => {
      const newRow = row + dx;
      const newCol = col + dy;

      if (
        newRow >= 0 &&
        newRow < updatedBoard.length &&
        newCol >= 0 &&
        newCol < updatedBoard[0].length
      ) {
        const cellElement = document.getElementById(`${newRow}-${newCol}`);
        if (cellElement && !cellElement.classList.contains("revealed")) {
          revealCounter();
          cellElement.classList.add("revealed");
          cellElement.textContent = updatedBoard[newRow][newCol];
          if (updatedBoard[newRow][newCol] === 0) {
            cellElement.classList.add("green");
            revealSurroundingCells(newRow, newCol);
          }
        }
      }
    });
  };

  let revealedCount = 0;
  const revealCounter = () => {
    revealedCount += 1;
    console.log("revealed" + revealedCount);
    // if (revealedCount === 72) {
    //   alert("Tebrikler Kazandınız !");
    // }
  };

  const handleClick = (row, col, event) => {
    const cell = event.target;

    if (!cell.classList.contains("revealed")) {
      revealCounter();
      cell.classList.add("revealed");

      if (updatedBoard[row][col] === "bomb") {
        cell.innerHTML = `<img src="${Mine}" alt="mine" />`;
        alert("Bombaya bastın!");
      } else {
        cell.textContent = updatedBoard[row][col];
        if (updatedBoard[row][col] === 0) {
          revealCounter();
          cell.classList.add("revealed");
          cell.classList.add("green");
          revealSurroundingCells(row, col);
        }
      }
    }
  };

  const handleRightClick = (row, col, event) => {
    event.preventDefault(); // Sağ tıklama menüsünü engellemek için

    const cell = event.target;

    if (!cell.classList.contains("revealed")) {
      cell.classList.toggle("flagged");
    }
  };

  return (
    <div className="center">
      <div
        className="table"
        style={{
          gridTemplateColumns: `repeat(${colSize}, 60px)`,
          gridTemplateRows: `repeat(${rowSize}, 60px)`,
        }}
      >
        {updatedBoard.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              id={`${rowIndex}-${colIndex}`}
              className="cell"
              onClick={(event) => handleClick(rowIndex, colIndex, event)}
              onContextMenu={(event) =>
                handleRightClick(rowIndex, colIndex, event)
              } // Sağ tıklama olayını ekleyin
            ></div>
          ))
        )}
      </div>
    </div>
  );
};

export default Minesweeper;
