/**
 * ---- Tiles -----------------------------------------------------------------
 */

import { ArrayList } from "./common";
import * as Tile from "./tile";

const list = ArrayList.create<Tile.Unit>(256);
const grid: Tile.Unit[][] = [];

export const reset = () => {
  ArrayList.clearReference(list);
  while (grid.length > 0) grid.pop();
};

export const add = (tile: Tile.Unit) => {
  const x = Math.floor(tile.x / Tile.size);
  const y = Math.floor(tile.y / Tile.size);
  if (grid[x] == undefined) grid[x] = [];

  const existingTile = grid[x][y];
  if (existingTile != undefined) existingTile.progressRate = 0.1;

  ArrayList.add(list, tile);
  grid[x][y] = tile;
};

export const update = () => ArrayList.removeSwapAll(list, Tile.update);

export const draw = () => ArrayList.loop(list, Tile.draw);
