import { Component, OnInit, HostListener, HostBinding, Input } from '@angular/core';

@Component({
  selector: 'app-var-openbox',
  templateUrl: './var-openbox.component.html',
  styleUrls: ['./var-openbox.component.css']
})
export class VarOpenboxComponent implements OnInit {

// Inputs
  @Input("grid-padding")
  grid_padding = 20;

  get cell_width() {
    return this.cell_width_;
  };

  @Input("cell-width")
  set cell_width(value: number) {
    this.cell_width_ = value;
  };

  get cell_height() {
    return this.cell_height_;
  };

  @Input("cell-height")
  set cell_height(value: number) {
    this.cell_height_ = value;
  };

  readonly default_cell_size = 30;
  private cell_height_: number = this.default_cell_size;
  private cell_width_: number = this.default_cell_size;

  get row_count() {
    return this.input_row_count_ || this.default_row_count;
  }

  @Input("row-count")
  set row_count(value) {
    this.input_row_count_ = value;
    this.setInitialNodes();
    this.setEdges();
  };

  readonly default_row_count = 10;
  private input_row_count_;

  get column_count() {
    return this.input_column_count_ || this.default_column_count;
  }

  @Input("column-count")
  set column_count(value) {
    this.input_column_count_ = value;
    this.setInitialNodes();
    this.setEdges();
  };

  readonly default_column_count = 20;
  private input_column_count_;

  // This is the data that can be passed into this component to display in the gird cells
  @Input("grid-data")
  grid_data: number[];

  // Currently focused row and column
  focused_row: number = -1;
  focused_column: number = -1;

  // These are lists of [index_0, index_1] indices to draw rows and columns, used to iterate when drawing gridlines
  rows: number[][];
  columns: number[][];

  // This is the list of [x, y] points that represent the grid, unaltered, initialised once
  nodes: number[][];

  // This is the list of [x, y] points that have been distorted, updated whenever focused cell changes
  distorted: number[][];

  // This distortion factor is used in effect calculation
  readonly distort_factor = 1.5;

  // Host bindings to change dimensions of the host component and parent svg element
  @HostBinding("style.width.px")
  get grid_width() {
    return 5 * this.grid_padding + this.column_count * this.cell_width_;
  };

  @HostBinding("style.height.px")
  get grid_height() {
    return 2 * this.grid_padding + this.row_count * this.cell_height_;
  };

  constructor() { };

  ngOnInit() {
    this.setInitialNodes();
    this.setEdges();
  };

  // Handle mouse move events to update the targeted grid cell
  setTargetCell(event: MouseEvent) {
    let tag = (<HTMLElement>event.target).tagName;
    if (tag !== "svg") return false;

    let x = Math.floor((event.offsetX - this.grid_padding) / this.cell_width_);
    let y = Math.floor((event.offsetY - this.grid_padding) / this.cell_height_);

    if (x < 0 || y < 0 || x >= this.column_count || y >= this.row_count) {
      this.clearFocusedCell(event);
      this.distorted = this.nodes.map(x => x);
    }
    else {
      let update_nodes = false;
      if (x !== this.focused_column || y !== this.focused_row) {
        update_nodes = true;
      }
      this.focused_row = y;
      this.focused_column = x;
      if (update_nodes) {
        this.distortNodes();
      }
    }
    return false;
  };

  // Resets the cell that is targeted
  clearFocusedCell(event: MouseEvent) {
    this.focused_row = -1;
    this.focused_column = -1;
  };

  // Gets the data that is displayed in the focused cell
  getTargetCellData() {
    let index = this.focused_column + (this.focused_row * this.column_count)
    if (!this.grid_data) {
      return index + 1;
    }
    else {
      return this.grid_data[index];
    }
  };

  // Gets the data that is displayed in cells adjacent to the target cell
  getOffCellData(offset: "up" | "down" | "left" | "right") {
    if (!this.grid_data) {
      switch(offset) {
        case "up":
          return this.focused_column + 1 + (this.focused_row - 1) * this.column_count;
        case "down":
          return this.focused_column + 1 + (this.focused_row + 1) * this.column_count;
        case "left":
          return this.focused_column + this.focused_row  * this.column_count;
        case "right":
          return this.focused_column + 2 + this.focused_row  * this.column_count;
        default:
          return -1;
      }
    }
    else {
      switch(offset) {
        case "up":
          return this.grid_data[this.focused_column + (this.focused_row - 1) * this.column_count];
        case "down":
          return this.grid_data[this.focused_column + (this.focused_row + 1) * this.column_count];
        case "left":
          return this.grid_data[this.focused_column - 1 + this.focused_row  * this.column_count];
        case "right":
          return this.grid_data[this.focused_column + 1 + this.focused_row  * this.column_count];
        default:
          return -1;
      }
    }
  };


  distortNodes() {
    // Calculate the middle point of the focused cell, Vector f
    let fx = this.grid_padding + this.cell_width_ * (this.focused_column + 0.5);
    let fy = this.grid_padding + this.cell_height_ * (this.focused_row + 0.5);

    // Apply effect to 3 cells
    const extent_x = 0.5 * 3 * this.cell_width_;
    const extent_y = 0.5 * 3 * this.cell_height_;

    // Test if the cell is inside the frame that the effect is applied
    const is_in_frame = (x, y) => {
      let dx = Math.abs(x - fx);
      if (dx > extent_x) return false;
      let dy = Math.abs(y - fy);
      if (dy > extent_y) return false;
      return true;
    };

    this.distorted = this.nodes.map(p => {
      if (!is_in_frame(p[0], p[1])) {
        // The point is outside frame and is return unchanged
        return p;
      }
      else {
        // Distortion calculation
        // Vector p
        let px = p[0];
        let py = p[1];

        // Vector fp = p - f;
        let fpx = px - fx;
        let fpy = py - fy;

        // Vector r (rx, ry) is fp scaled to a square with half width of 1
        let rx = Math.abs(fpx) / extent_x;
        let ry = Math.abs(fpy) / extent_y;

        // Vector i (ix, iy) is vector r that is extended until it collides with unit square (frame)
        let ix = 1;
        let iy = 1;

        if (rx > ry) { //=> r will extend to vertical edge
          iy = ry / rx;
        }
        else if (ry > rx) { //=> r will extend to horizontal edge
          ix = rx / ry;
        }

        // Calculate the ratio of length of vector r to vector i
        let d = Math.sqrt((rx * rx + ry * ry) / (ix * ix + iy * iy));
        // Calculate the new distorted ratio
        let n = (this.distort_factor + 1) * d / (this.distort_factor * d + 1);

        // Calculate the new distored points
        let nx = fx + n * Math.sign(fpx) * extent_x * ix;
        let ny = fy + n * Math.sign(fpy) * extent_y * iy;

        return [nx, ny];
      }
    });
  };

  // Determines if the a cell is focused
  showNumberPopup() {
    return this.focused_column > -1 && this.focused_row > -1;
  };

  // Initial setup for unaltered nodes, these do not change
  setInitialNodes() {
    this.nodes = [];
    for (let row = 0; row <= this.row_count; row++) {
      for (let column = 0; column <= this.column_count; column++) {
        this.nodes.push([this.grid_padding + column * this.cell_width_, this.grid_padding + row * this.cell_height_]);
      }
    }
    this.distorted = this.nodes.map(x => x);
  };

  // Set the row and column indices, these do no change
  setEdges() {
    this.rows = [];
    for (let row = 0; row <= this.row_count; row++) {
      for (let column = 0; column < this.column_count; column++) {
        let index_0 = (row * (this.column_count + 1)) + column;
        let index_1 = index_0 + 1;
        this.rows.push([index_0, index_1]);
      }
    }
    this.columns = [];
    for (let column = 0; column <= this.column_count; column++) {
      for (let row = 0; row < this.row_count; row++) {
        let index_0 = (row * (this.column_count + 1)) + column;
        let index_1 = index_0 + this.column_count + 1;
        this.columns.push([index_0, index_1]);
      }
    }
  };

}
