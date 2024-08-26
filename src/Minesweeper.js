import "./Minesweeper.css";
import Mine from "./mine.png";

const Minesweeper = () => {
  const size = 8;

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
    [0, "bomb", 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, "bomb", 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, "bomb", 0, 0, 0, "bomb", 0],
    [0, 0, "bomb", 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
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

  const handleClick = (row, col, event) => {
    const cell = event.target;

    if (!cell.classList.contains("revealed")) {
      cell.classList.add("revealed");

      if (updatedBoard[row][col] === "bomb") {
        cell.innerHTML = `<img src="${Mine}" alt="mine" />`;
        alert("Bombaya bastın!");
      } else {
        cell.textContent = updatedBoard[row][col];
        if (updatedBoard[row][col] === 0) {
          cell.classList.add("revealed");
          cell.classList.add("green");
          revealSurroundingCells(row, col);

          cell.classList.add("revealed");
          // Eğer hücre 0 ise çevresindeki hücreleri aç
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
        style={{ gridTemplateColumns: `repeat(${size}, 40px)` }}
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
            >
              {cell}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Minesweeper;
