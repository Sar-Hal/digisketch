import { customAlphabet } from "nanoid";
import { GRID_SIZE } from "./constants";
import type { Grid, Pixel } from "./types";

const nanoid = customAlphabet("0123456789abcdefghijklmnopqrstuvwxyz", 6);

export const createEmptyGrid = (): Grid =>
  Array.from({ length: GRID_SIZE }, () => Array<Pixel>(GRID_SIZE).fill(null));

export const updateGridCell = (
  grid: Grid,
  row: number,
  col: number,
  value: Pixel
): Grid => {
  if (!grid[row] || grid[row][col] === undefined) {
    return grid;
  }
  if (grid[row][col] === value) {
    return grid;
  }
  return grid.map((rowCells, rowIndex) =>
    rowIndex === row
      ? rowCells.map((cell, colIndex) => (colIndex === col ? value : cell))
      : rowCells.slice()
  );
};

export const isValidGrid = (grid: unknown): grid is Grid => {
  if (!Array.isArray(grid) || grid.length !== GRID_SIZE) {
    return false;
  }
  return grid.every(
    (row) =>
      Array.isArray(row) &&
      row.length === GRID_SIZE &&
      row.every((cell) => cell === null || typeof cell === "string")
  );
};

export const generateId = (): string => nanoid();
