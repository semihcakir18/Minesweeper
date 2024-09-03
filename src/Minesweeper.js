import "./Minesweeper.css";
import { useState, useEffect } from "react";
import Mine from "./mine.png";
import defaultSound from "./default.mp3";
import bombSound from "./bomb.mp3";
import Popup from "./Popup";

const Minesweeper = () => {
  const [backgroundMusic] = useState(new Audio(defaultSound));
  const [bombMusic] = useState(new Audio(bombSound));
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  useEffect(() => {
    console.log("Use Effect Calisti");
    backgroundMusic.loop = true;
    backgroundMusic.play().catch((error) => {
      console.error("Background music play error:", error);
    });

    return () => {
      backgroundMusic.pause();
      backgroundMusic.currentTime = 0;
    };
  }, [backgroundMusic]);

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
  const revealCounter = (row, col) => {
    revealedCount += 1;
    console.log(
      "revealed : ",
      row,
      col + " /// current count : ",
      revealedCount,
      "oyunun biteceği sayı : ",
      rowSize * colSize - numberOfBombs
    );
    if (revealedCount === rowSize * colSize - numberOfBombs) {
      setPopupMessage("Tebrikler Kazandınız!");
      setShowPopup(true);
    }
  };

  const handleClick = (row, col, event) => {
    const cell = event.target;

    if (!cell.classList.contains("revealed")) {
      if (updatedBoard[row][col] === "bomb") {
        if (cell.classList.contains("flagged")) {
          cell.classList.remove("flagged");
        }

        backgroundMusic.pause();
        backgroundMusic.currentTime = 0;

        bombMusic.play();
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
        setPopupMessage("Bombaya bastın!");
        setShowPopup(true);
      } else if (updatedBoard[row][col] === 0) {
        cell.textContent = updatedBoard[row][col];
        if (cell.classList.contains("flagged")) {
          cell.classList.remove("flagged");
        }
        cell.classList.add("revealed");
        cell.classList.add("green");
        revealCounter(row, col);
        revealSurroundingCells(row, col);
      } else {
        cell.textContent = updatedBoard[row][col];
        cell.classList.add("revealed");
        revealCounter(row, col);
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
        {showPopup && <Popup message={popupMessage} />}
      </div>
    </>
  );
};

export default Minesweeper;
