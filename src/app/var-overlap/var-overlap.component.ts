import {
  Component,
  OnInit,
  HostListener,
  HostBinding,
  Input
} from "@angular/core";

@Component({
  selector: "app-var-overlap",
  templateUrl: "./var-overlap.component.html",
  styleUrls: ["./var-overlap.component.css"]
})
export class VarOverlapComponent implements OnInit {
  // Defaults
  constructor() {}

  // Variables - Constants
  readonly default_cell_size = 30;
  readonly default_row_count = 20;
  readonly default_column_count = 45;

  // Variables - Private
  private cell_height_: number = this.default_cell_size;
  private cell_width_: number = this.default_cell_size;
  private input_row_count_;
  private input_column_count_;

  // Variables - Class
  // Simple list of indices to iterate in the html template
  rows: number[] = [];
  columns: number[] = [];
  default_grid_data: number[] = [];
  // Currently focused row and column
  focused_row = -1;
  focused_column = -1;
  @Input("grid-padding") grid_padding = 20;
  // The increased size of the overlap box i.e. cell_size + 2 * over_lap padding
  @Input("overlap-padding") overlap_padding = 10;

  // This is the data that can be passed into this component to display in the gird cells
  @Input("grid-data") grid_data: number[]; //for region selection

  // Getter Setter

  get cell_width() {
    return this.cell_width_;
  }

  @Input("cell-width")
  set cell_width(value: number) {
    this.cell_width_ = value;
  }

  get cell_height() {
    return this.cell_height_;
  }

  @Input("cell-height")
  set cell_height(value: number) {
    this.cell_height_ = value;
  }

  get row_count() {
    return this.input_row_count_ || this.default_row_count;
  }

  @Input("row-count")
  set row_count(value) {
    this.input_row_count_ = value;
    this.setLines();
  }

  get column_count() {
    return this.input_column_count_ || this.default_column_count;
  }

  @Input("column-count")
  set column_count(value) {
    this.input_column_count_ = value;
    this.setLines();
  }

  // Functions

  ngOnInit() {
    this.setLines();
  }

  // Host bindings to change dimensions of the host component and parent svg element
  @HostBinding("style.width.px")
  get grid_width() {
    return 2 * this.grid_padding + this.column_count * this.cell_width_;
  }

  @HostBinding("style.height.px")
  get grid_height() {
    return 2 * this.grid_padding + this.row_count * this.cell_height_;
  }

  // Handle mouse move events to update the targeted grid cell
  setTargetCell(event: MouseEvent) {
    let tag = (<HTMLElement>event.target).tagName;
    if (tag !== "svg") return false;

    let x = Math.floor((event.offsetX - this.grid_padding) / this.cell_width_);
    let y = Math.floor((event.offsetY - this.grid_padding) / this.cell_height_);

    if (x < 0 || y < 0 || x >= this.column_count || y >= this.row_count) {
      this.clearFocusedCell(event);
    } else {
      // console.log("focused_row" + y);
      // console.log("focused_column" + x);
      this.focused_row = y;
      this.focused_column = x;
    }
    return false;
  }

  // Resets the cell that is targeted
  clearFocusedCell(event: MouseEvent) {
    this.focused_row = -1;
    this.focused_column = -1;
  }

  // Gets the data that is displayed in the focused cell
  getTargetCellData() {
    // let index = this.focused_column + this.focused_row * this.column_count;

    // if (!this.grid_data) {
    //   return index + 1;
    // } else {
    //   return this.grid_data[index];
    // }
    return this.default_grid_data[
      this.getDefaultGridIndex(this.focused_column, this.focused_row)
    ];
  }

  // Determines if a cell is focused
  showNumberPopup() {
    return this.focused_column > -1 && this.focused_row > -1;
  }

  // Set the row and column indices, these do no change
  setLines() {
    this.rows.length = 0;
    this.columns.length = 0;
    for (let i = 0; i < this.row_count; i++) {
      this.rows.push(i);
    }
    for (let i = 0; i < this.column_count; i++) {
      this.columns.push(i);
    }

    // prepare grid data
    this.columns.forEach(col => {
      this.rows.forEach(row => {
        this.default_grid_data[
          this.getDefaultGridIndex(col, row)
        ] = this.getNumaricPattern(col, row);
      });
    });

    console.log(this.default_grid_data);
  }

  getDefaultGridIndex(col: number, row: number) {
    return col + row * this.default_column_count;
  }
  getNumaricPattern(col: number, row: number) {
    return row + col * this.default_row_count + 1;
    // horizontal
    // return col + row * this.default_column_count + 1;
    // random
    // return Math.floor(Math.random() * 999 + 1);
    // odd
    // return row * 2 + col * this.default_row_count + 1;
    // odd
    // return (row + 1) * 2 + col * this.default_row_count;
  }
}
