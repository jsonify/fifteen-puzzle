// src/lib/NPuzzleSolver.ts
export class NPuzzleSolver {
    private grid: (number | null)[][];
    private fixed: boolean[][];
    private numbers: Record<string, { x: number; y: number }>;
    private solution: { empty: { x: number; y: number }, piece: { x: number; y: number }, number: number }[];
    private originalGrid: (number | null)[][];
  
    constructor(toSolve: (number | null)[][]) {
      this.grid = [];
      this.fixed = [];
      this.numbers = {};
      this.solution = [];
      this.originalGrid = toSolve;
    }
  
    private setupSolver() {
      this.numbers = {};
      this.fixed = [];
      this.grid = [];
      
      for (let i = 0; i < this.originalGrid.length; i++) {
        this.fixed[i] = [];
        this.grid[i] = [];
        for (let j = 0; j < this.originalGrid.length; j++) {
          const num = this.originalGrid[i][j];
          this.grid[i][j] = num;
          this.fixed[i][j] = false;
          if (num !== null) {
            this.numbers[num] = { x: j, y: i };
          } else {
            this.numbers['empty'] = { x: j, y: i };
          }
        }
      }
    }
  
    solve() {
      this.setupSolver();
      try {
        this.solveGrid(this.grid.length);
      } catch (err) {
        console.error(err);
        return null;
      }
      return this.solution;
    }
  
    private solveGrid(size: number) {
      if (size > 2) {
        this.solveRow(size);
        this.solveColumn(size);  
        this.solveGrid(size - 1);
      } else if (size === 2) {
        this.solveRow(size);
        if (this.grid[this.grid.length - 1][this.grid.length - size] === null) {
          this.moveEmpty({ x: this.grid.length - 1, y: this.grid.length - 1 });
        }
      }
    }
    private solveRow(size: number) {
        const rowNumber = this.grid.length - size;
        
        // Solve all but last two numbers in row
        for (let i = rowNumber; i < this.grid.length - 2; i++) {
          const number = rowNumber * this.grid.length + (i + 1);
          this.moveNumberTowards(number, { x: i, y: rowNumber });
          this.fixed[rowNumber][i] = true;
        }
    
        // Handle last two numbers in row
        const secondToLast = rowNumber * this.grid.length + this.grid.length - 1;
        const last = secondToLast + 1;
        
        this.moveNumberTowards(secondToLast, { x: this.grid.length - 1, y: rowNumber });
        this.moveNumberTowards(last, { x: this.grid.length - 1, y: rowNumber + 1 });
        
        if (this.numbers[secondToLast].x !== this.grid.length - 1 || 
            this.numbers[secondToLast].y !== rowNumber ||
            this.numbers[last].x !== this.grid.length - 1 || 
            this.numbers[last].y !== rowNumber + 1) {
          
          this.moveNumberTowards(secondToLast, { x: this.grid.length - 1, y: rowNumber });
          this.moveNumberTowards(last, { x: this.grid.length - 2, y: rowNumber });
          this.moveEmpty({ x: this.grid.length - 2, y: rowNumber + 1 });
          
          const pos = { x: this.grid.length - 1, y: rowNumber + 1 };
          const moveList = ["ul", "u", "", "l", "dl", "d", "", "l", "ul", "u", "", "l", "ul", "u", "", "d"];
          this.applyRelativeMoveList(pos, moveList);
        }
        
        this.specialTopRightRotation(rowNumber);
      }
    
      private solveColumn(size: number) {
        const colNumber = this.grid.length - size;
        
        for (let i = colNumber; i < this.grid.length - 2; i++) {
          const number = i * this.grid.length + 1 + colNumber;
          this.moveNumberTowards(number, { x: colNumber, y: i });
          this.fixed[i][colNumber] = true;
        }
    
        const secondToLast = (this.grid.length - 2) * this.grid.length + 1 + colNumber;
        const last = secondToLast + this.grid.length;
        
        this.moveNumberTowards(secondToLast, { x: colNumber, y: this.grid.length - 1 });
        this.moveNumberTowards(last, { x: colNumber + 1, y: this.grid.length - 1 });
        
        if (this.numbers[secondToLast].x !== colNumber || 
            this.numbers[secondToLast].y !== this.grid.length - 1 ||
            this.numbers[last].x !== colNumber + 1 || 
            this.numbers[last].y !== this.grid.length - 1) {
          
          this.moveNumberTowards(secondToLast, { x: colNumber, y: this.grid.length - 1 });
          this.moveNumberTowards(last, { x: colNumber, y: this.grid.length - 2 });
          this.moveEmpty({ x: colNumber + 1, y: this.grid.length - 2 });
          
          const pos = { x: colNumber + 1, y: this.grid.length - 1 };
          const moveList = ["ul", "l", "", "u", "ur", "r", "", "u", "ul", "l", "", "u", "ul", "l", "", "r"];
          this.applyRelativeMoveList(pos, moveList);
        }
        
        this.specialLeftBottomRotation(colNumber);
      }
    
      private moveEmpty(pos: { x: number; y: number }) {
        while (this.numbers['empty'].x !== pos.x || this.numbers['empty'].y !== pos.y) {
          const empty = this.numbers['empty'];
          const diffx = empty.x - pos.x;
          const diffy = empty.y - pos.y;
          
          if (diffx < 0 && this.canMove({ x: empty.x + 1, y: empty.y })) {
            this.swap(empty, { x: empty.x + 1, y: empty.y });
          } else if (diffx > 0 && this.canMove({ x: empty.x - 1, y: empty.y })) {
            this.swap(empty, { x: empty.x - 1, y: empty.y });
          } else if (diffy < 0 && this.canMove({ x: empty.x, y: empty.y + 1 })) {
            this.swap(empty, { x: empty.x, y: empty.y + 1 });
          } else if (diffy > 0 && this.canMove({ x: empty.x, y: empty.y - 1 })) {
            this.swap(empty, { x: empty.x, y: empty.y - 1 });
          }
        }
      }
    
      private moveNumberTowards(number: number, dest: { x: number; y: number }) {
        if (!this.numbers[number]) return;
        
        while (this.numbers[number].x !== dest.x || this.numbers[number].y !== dest.y) {
          const current = this.numbers[number];
          const empty = this.numbers['empty'];
          
          // Move empty space next to number if it isn't already
          if (!this.areAdjacent(current, empty)) {
            this.moveEmpty(current);
          }
          
          // Move number towards destination
          if (current.x < dest.x) {
            this.swap(current, { x: current.x + 1, y: current.y });
          } else if (current.x > dest.x) {
            this.swap(current, { x: current.x - 1, y: current.y });
          } else if (current.y < dest.y) {
            this.swap(current, { x: current.x, y: current.y + 1 });
          } else if (current.y > dest.y) {
            this.swap(current, { x: current.x, y: current.y - 1 });
          }
        }
      }
    
      private canMove(pos: { x: number; y: number }): boolean {
        return pos.x >= 0 && pos.x < this.grid.length && 
               pos.y >= 0 && pos.y < this.grid.length && 
               !this.fixed[pos.y][pos.x];
      }
    
      private swap(pos1: { x: number; y: number }, pos2: { x: number; y: number }) {
        const num1 = this.grid[pos1.y][pos1.x];
        const num2 = this.grid[pos2.y][pos2.x];
        
        this.grid[pos1.y][pos1.x] = num2;
        this.grid[pos2.y][pos2.x] = num1;
        
        if (num1 !== null) this.numbers[num1] = { ...pos2 };
        if (num2 !== null) this.numbers[num2] = { ...pos1 };
        
        this.solution.push({
          empty: num1 === null ? pos1 : pos2,
          piece: num1 === null ? pos2 : pos1,
          number: num1 === null ? num2! : num1
        });
      }
    
      private areAdjacent(pos1: { x: number; y: number }, pos2: { x: number; y: number }): boolean {
        return (Math.abs(pos1.x - pos2.x) === 1 && pos1.y === pos2.y) ||
               (Math.abs(pos1.y - pos2.y) === 1 && pos1.x === pos2.x);
      }
    
      private specialTopRightRotation(rowNumber: number) {
        this.fixed[rowNumber][this.grid.length - 1] = true;
        this.fixed[rowNumber + 1][this.grid.length - 1] = true;
      }
    
      private specialLeftBottomRotation(colNumber: number) {
        this.fixed[this.grid.length - 1][colNumber] = true;
        this.fixed[this.grid.length - 1][colNumber + 1] = true;
      }
    
      private applyRelativeMoveList(pos: { x: number; y: number }, moves: string[]) {
        for (const move of moves) {
          if (move === "") {
            this.swap(this.numbers['empty'], pos);
          } else {
            const newPos = this.getRelativePosition(pos, move);
            this.swap(this.numbers['empty'], newPos);
          }
        }
      }
    
      private getRelativePosition(pos: { x: number; y: number }, direction: string): { x: number; y: number } {
        const moves: Record<string, { dx: number; dy: number }> = {
          'u': { dx: 0, dy: -1 },
          'd': { dx: 0, dy: 1 },
          'l': { dx: -1, dy: 0 },
          'r': { dx: 1, dy: 0 },
          'ul': { dx: -1, dy: -1 },
          'ur': { dx: 1, dy: -1 },
          'dl': { dx: -1, dy: 1 },
          'dr': { dx: 1, dy: 1 }
        };
        
        const move = moves[direction];
        return {
          x: pos.x + move.dx,
          y: pos.y + move.dy
        };
      }
    }
    