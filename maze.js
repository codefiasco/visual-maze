// Get width and height
var width = 10; // document.getElementById('width').value;
var height = 10; // document.getElementById('height').value;
var speed = 2;

var maze = new Maze(width, height);

// Create new maze path
var timer = setInterval(function() {
	var notSolved = maze.move();

	// Check if all maze path is complete
	if (!notSolved) {
		clearInterval(timer);

		document.getElementById('solve').disabled = false;
	}
}, 50 * speed);

// Solve maze on button click
document.getElementById('solve').addEventListener('click', function() {
	maze.startPoint.html.className += ' path';

	// Search for path
	var solving = setInterval(function() {
		var finished = maze.solve();

		// Check if the end point has been reached
		if (finished) {
			clearInterval(solving);

			document.getElementById('solve').disabled = true;
		}

	}, 50 * speed);
});

function Maze(w, h) {
	this.html = document.getElementById('maze');

	// Returns a matrix with h by w cells
	this.createMaze = function(width, height) {
		var finalMatrix = [];

	    for(var i=0; i < height; i++) {
	        var auxMatrix = [];

	        for(var j=0; j < width; j++) {
	            auxMatrix.push(new Cell(j, i, this.html));	// Create new Cell and store it
							this.html.appendChild(auxMatrix[j].html);		// Append new Cell to maze container
	        }

	        finalMatrix.push(auxMatrix);
	    }

	    return finalMatrix;
	}

	// Create matrix to represent maze cells
	this.cells = this.createMaze(w, h);

	// Select a random starting point
	this.startPoint = this.cells[getRandomInt(0, h - 1)][getRandomInt(0, w - 1)];
	this.startPoint.html.className += ' start highlight';
	this.startPoint.visited = true;
	this.currentCell = this.startPoint;

	// Initialize stack
	this.stack = [this.currentCell];
	this.maxStack = 0;

	this.move = function() {
		var next = this.next();

		if(next) {
			next.visited = true;
			next.html.className += ' highlight';
			this.stack.push(next);
			this.currentCell = next;
		}
		else{
			if(this.maxStack < this.stack.length){
				this.endPoint = this.currentCell;
				this.maxStack = this.stack.length;
			}

			this.currentCell.html.className = this.currentCell.html.className.replace(' highlight', '');
			this.stack.pop();
			this.currentCell = this.stack[this.stack.length - 1]

			if (this.stack.length == 1) {
				this.currentCell.html.className = this.currentCell.html.className.replace(' highlight', '');

				this.endPoint.html.className += ' end';

				return false;
			}
		}

		return true;
	}

	this.solve = function() {
		var next = this.makePath();

		if(next) {
			next.visited = false;
			next.html.className += ' path';
			this.stack.push(next);
			this.currentCell = next;

			if (this.currentCell == this.endPoint)
				return true;
		}
		else{
			this.currentCell.html.className = this.currentCell.html.className.replace(' path', '');
			this.stack.pop();
			this.currentCell = this.stack[this.stack.length - 1];
		}
	}

	this.makePath = function() {
		if (this.currentCell.top && this.cells[this.currentCell.y - 1][this.currentCell.x].visited)
			return this.cells[this.currentCell.y - 1][this.currentCell.x];

		if (this.currentCell.right && this.cells[this.currentCell.y][this.currentCell.x + 1].visited)
			return this.cells[this.currentCell.y][this.currentCell.x + 1];

		if (this.currentCell.bottom && this.cells[this.currentCell.y + 1][this.currentCell.x].visited)
			return this.cells[this.currentCell.y + 1][this.currentCell.x];

		if (this.currentCell.left && this.cells[this.currentCell.y][this.currentCell.x - 1].visited)
			return this.cells[this.currentCell.y][this.currentCell.x - 1];

		return false;
	}

	this.next = function() {
		var rand = ['top', 'right', 'bottom', 'left'];

		while(rand.length > 0) {
			var n = getRandomInt(0, rand.length - 1);	// Pick a random direction

			switch(rand[n]) {
				case 'top':
					if(this.currentCell.y - 1 >= 0 &&
					this.cells[this.currentCell.y - 1][this.currentCell.x].visited === false) {
						var aux = this.cells[this.currentCell.y - 1][this.currentCell.x];

						aux.bottom = true;
						aux.html.className += ' bottom';

						this.currentCell.top = true;
						this.currentCell.html.className += ' top';

						return aux; // Return next this.currentCell
					}
					break;
				case 'right':
					if(this.currentCell.x + 1 < width &&
					this.cells[this.currentCell.y][this.currentCell.x + 1].visited === false) {
						var aux = this.cells[this.currentCell.y][this.currentCell.x + 1];

						this.currentCell.right = true;
						this.currentCell.html.className += ' right';

						aux.left = true;
						aux.html.className += ' left'

						return aux;
					}
					break;
				case 'bottom':
					if(this.currentCell.y + 1 < height &&
					this.cells[this.currentCell.y + 1][this.currentCell.x].visited === false) {
						var aux = this.cells[this.currentCell.y + 1][this.currentCell.x];

						this.currentCell.bottom = true;
						this.currentCell.html.className += ' bottom';

						aux.top = true;
						aux.html.className += ' top';

						return aux;
					}
					break;
				case 'left':
					if(this.currentCell.x - 1 >= 0 && this.cells[this.currentCell.y][this.currentCell.x - 1].visited === false) {
						var aux = this.cells[this.currentCell.y][this.currentCell.x - 1];

						aux.right = true;
						aux.html.className += ' right';

						this.currentCell.left = true;
						this.currentCell.html.className += ' left';

						return aux;
					}
					break;
			}

			rand.splice(n,1); // Remove direction if cell is already visited
		}

		return false; // In case all around are visited
	}
}

function Cell(x, y) {
	this.visited = false;

	this.x = x;
	this.y = y;

	this.right = false;
	this.bottom = false;

	this.left = false;
	this.top = false;

	this.html = document.createElement('div');
	this.html.className = 'cell';

}

// Returns a random Integer between 2 values (inclusive)
function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}
