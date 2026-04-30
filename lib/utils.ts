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

export const gridToDataUrl = (
  grid: Grid,
  cellSize = 12,
  background = "#fdfbf7"
): string => {
  const size = GRID_SIZE * cellSize;
  const rects: string[] = [];

  rects.push(
    `<rect width="${size}" height="${size}" fill="${background}" />`
  );

  for (let row = 0; row < GRID_SIZE; row += 1) {
    for (let col = 0; col < GRID_SIZE; col += 1) {
      const color = grid[row]?.[col];
      if (!color) {
        continue;
      }
      rects.push(
        `<rect x="${col * cellSize}" y="${row * cellSize}" width="${cellSize}" height="${cellSize}" fill="${color}" />`
      );
    }
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" shape-rendering="crispEdges">${rects.join("")}</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

export const generateId = (): string => nanoid();
