import { Component, OnInit, HostListener, HostBinding } from '@angular/core';

@Component({
  selector: 'app-var-region',
  templateUrl: './var-region.component.html',
  styleUrls: ['./var-region.component.css']
})
export class VarRegionComponent implements OnInit {
  // Currently selected variant
  current_variant: "overlap" | "open box" | "perspective wall" = "overlap";
  // List of possible variants
  readonly variants = ["overlap", "open box",  "perspective wall"];

  // Grid dimensions
  readonly grid_padding = 20;
  readonly cell_size = 15;
  readonly row_count = 20;
  readonly column_count = 40;

  // Selected region dimensions
  select_half_height = 3;
  select_half_width = 5;

  get subgrid_rows() {
    return 2 * this.select_half_height;
  };

  get subgrid_columns() {
    return 2 * this.select_half_width;
  };

  get subgrid_offset_x() {
    return Math.ceil(this.focused_column - this.select_half_width);
  };

  get subgrid_offset_y() {
    return Math.ceil(this.focused_row  - this.select_half_height);
  };

  get subgrid_cell_width() {
    return 600 / this.subgrid_columns;
  };

  get subgrid_cell_height() {
    return 300 / this.subgrid_rows;
  };

  // The targeted cell, initialised to the upper left corner
  focused_row: number = this.select_half_height;
  focused_column: number = this.select_half_width;

  // For left click region select resizing
  click_start_x: number;
  click_start_y: number;
  click_end_x: number;
  click_end_y: number;
  is_resizing_region = false;

  get drag_offset_x() {
    return (this.click_start_x < this.click_end_x) ? this.click_start_x : this.click_end_x;
  };

  get drag_offset_y() {
    return (this.click_start_y < this.click_end_y) ? this.click_start_y : this.click_end_y;
  };

  get drag_width() {
    return Math.abs(this.click_start_x - this.click_end_x) + 1;
  };

  get drag_height() {
    return Math.abs(this.click_start_y - this.click_end_y) + 1;
  };

  // This is the data that is contained in the selected region, must be passed to the subgrids and
  // updated when the selected region changes
  region_data: number[] = [];

  // Dimensions of the svg element
  get grid_width() {
    return 2 * this.grid_padding + this.column_count * this.cell_size;
  };

  get grid_height() {
    return 2 * this.grid_padding + this.row_count * this.cell_size;
  };

  // Prevent context menu from showing on right click
  @HostListener("contextmenu")
  preventContextMenu() {
    return false;
  };

  // Simple list of indices to iterate in the html template
  rows: number[] = [];
  columns: number[] = [];

  constructor() { };

  ngOnInit() {
    this.setLines();
    this.setRegionData();
  };

  setClickStart(event: MouseEvent) {
    if (event.button === 0) {
      this.click_start_x = this.click_end_x = Math.floor((event.offsetX - this.grid_padding) / this.cell_size);
      this.click_start_y = this.click_end_y = Math.floor((event.offsetY - this.grid_padding) / this.cell_size);
      this.is_resizing_region = true;
    }
    return false;
  };

  handleClickEnd(event: MouseEvent) {
    if (event.button === 0) {
      let click_end_x = Math.floor((event.offsetX - this.grid_padding) / this.cell_size);
      let click_end_y = Math.floor((event.offsetY - this.grid_padding) / this.cell_size);

      let diff_x = Math.abs(this.click_start_x - click_end_x) + 1;
      if (diff_x < 3) {
        this.is_resizing_region = false;
        return;
      }
      let diff_y = Math.abs(this.click_start_y - click_end_y) + 1;
      if (diff_y < 3) {
        this.is_resizing_region = false;
        return;
      }

      this.select_half_width = diff_x / 2;
      this.select_half_height = diff_y / 2;

      let offset_x = (this.click_start_x < click_end_x) ? this.click_start_x : click_end_x;
      let offset_y = (this.click_start_y < click_end_y) ? this.click_start_y : click_end_y;

      this.focused_column = offset_x + this.select_half_width;
      this.focused_row = offset_y + this.select_half_height;

      this.updateRegion(this.focused_column, this.focused_row);
      this.is_resizing_region = false;
    }
    return false;
  };

  handleResizeRegion(event: WheelEvent, side: "w" | "h") {
    let increment = event.deltaY > 0 ? -0.5 : 0.5;
    if (side === "w") {
      this.select_half_width += increment;
      this.select_half_width = this.select_half_width < 1.5 ? 1.5 : this.select_half_width;
      this.select_half_width = this.select_half_width >= this.column_count / 2 ? this.column_count / 2 : this.select_half_width;
    }
    else if (side === "h") {
      this.select_half_height += increment;
      this.select_half_height = this.select_half_height < 1.5 ? 1.5 : this.select_half_height;
      this.select_half_height = this.select_half_height >= this.row_count / 2 ? this.row_count / 2 : this.select_half_height;
    }
    this.updateRegion(this.focused_column, this.focused_row);
    return false;
  };

  // Handle mouse move events to update the targeted grid cell
  setTargetCell(event: MouseEvent) {
    let tag = (<HTMLElement>event.target).tagName;
    if (tag !== "svg") return false;

    if (event.buttons === 1) {
      this.click_end_x = Math.floor((event.offsetX - this.grid_padding) / this.cell_size);
      this.click_end_y = Math.floor((event.offsetY - this.grid_padding) / this.cell_size);
    }
    else if (event.buttons === 2) { // Drag on right mouse button
      let x = Math.floor((event.offsetX - this.grid_padding) / this.cell_size);
      let y = Math.floor((event.offsetY - this.grid_padding) / this.cell_size);

      this.updateRegion(x, y);
    }
    return false;
  };

  updateRegion(x: number, y: number) {
    // Clamp the region to the grid)
    this.focused_row = y < this.select_half_height ?
      this.select_half_height :
      y > this.row_count - this.select_half_height ?
        this.row_count - this.select_half_height :
        y;

    this.focused_column = x < this.select_half_width ?
      this.select_half_width :
      x > this.column_count - this.select_half_width ?
        this.column_count - this.select_half_width :
        x;

    // Update the data contained in region
    this.setRegionData();
  };

  // Resets the cell that is targeted
  clearFocusedCell(event: MouseEvent) {
    this.focused_row = -1;
    this.focused_column = -1;
  };

  // Whenever the region changes, update the data
  setRegionData() {
    this.region_data.length = 0;
    const row_count = this.subgrid_rows;
    const column_count = this.subgrid_columns;
    const row_offset = this.subgrid_offset_y;
    const column_offset = this.subgrid_offset_x;
    for (let r = 0; r < row_count; r++) {
      for (let c = 0; c < column_count; c++) {
        let index = c + column_offset + (r + row_offset) * this.column_count;
        this.region_data.push(index + 1);
      }
    }
  };

  // Determines if a cell is focused
  showNumberPopup() {
    return this.focused_column > -1 && this.focused_row > -1;
  };

  // Set the row and column indices, these do no change
  setLines() {
    for (let i = 0; i < this.row_count; i++) {
      this.rows.push(i);
    }
    for (let i = 0; i < this.column_count; i++) {
      this.columns.push(i);
    }
  };

}
