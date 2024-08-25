import "./Minesweeper.css";

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
          cellElement.textContent = updatedBoard[newRow][newCol] || ""; // Hücredeki sayıyı göster
          if (updatedBoard[newRow][newCol] === 0) {
            revealSurroundingCells(newRow, newCol); // Eğer hücre 0 ise çevresindeki hücreleri aç
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
        cell.innerHTML = `<img src="mine.png" alt="mine" />`;
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
