import "./Minesweeper.css";
import Mine from "./mine.png";

const Minesweeper = () => {
  const rowSize = 10;
  const colSize = 8;
  const numberOfBombs = 10;
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

  const checkSurroundingBombs = (board, row, col) => {
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
  var bombLocations = [];
  const bombPlacer = (board) => {
    const newRow = Math.floor(Math.random() * board.length);
    const newCol = Math.floor(Math.random() * board[0].length);
    if (board[newRow][newCol] === "bomb") {
      bombPlacer(board);
    }
    if (board[newRow][newCol] === 0) {
      board[newRow][newCol] = "bomb";
      bombLocations.push([newRow, newCol]);
    }
  };

  const board = new Array(rowSize).fill().map(() => new Array(colSize).fill(0));

  for (let i = 0; i < numberOfBombs; i++) {
    bombPlacer(board);
  }

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
    if (revealedCount === 73) {
      alert("Tebrikler Kazandınız !");
    }
  };

  const handleClick = (row, col, event) => {
    const cell = event.target;

    if (!cell.classList.contains("revealed")) {
      cell.classList.add("revealed");
      revealCounter();

      if (updatedBoard[row][col] === "bomb") {
        if (cell.classList.contains("flagged")) {
          cell.classList.remove("flagged");
        }
        cell.innerHTML = `<img src="${Mine}" alt="mine" />`;
        bombLocations.forEach(([dx, dy], index) => {
          setTimeout(() => {
            const bombCell = document.getElementById(`${dx}-${dy}`);
            if (bombCell.classList.contains("flagged")) {
              bombCell.classList.remove("flagged");
            }
            bombCell.innerHTML = `<img src="${Mine}" alt="mine" />`;
          }, index * 300);
        });
        alert("Bombaya bastın!");
      } else {
        cell.textContent = updatedBoard[row][col];
        if (updatedBoard[row][col] === 0) {
          if (cell.classList.contains("flagged")) {
            cell.classList.remove("flagged");
          }
          cell.classList.add("revealed");
          cell.classList.add("green");
          revealCounter();
          revealSurroundingCells(row, col);
        }
      }
    }
  };

  const handleRightClick = (row, col, event) => {
    event.preventDefault();

    const cell = event.target;

    if (!cell.classList.contains("revealed")) {
      cell.classList.toggle("flagged");
    }
  };

  return (
    <>
      <h1>Minesweeper</h1>
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
                }
              ></div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default Minesweeper;
