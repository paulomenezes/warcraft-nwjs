function Pathfinding(sprite, manageTiles) {
	this.position = [sprite.tilePosition.x, sprite.tilePosition.y];
	this.goal = [0, 0];

	this.manageTiles = manageTiles;

	this.openList = [];
	this.closeList = [];

	this.aux = [
		[0, -1], [-1, 0], [1, 0], [0, 1]
	];

	this.path = [];

	var empty = {
		parent: null,
		point: this.position
	};

	this.openList.push(empty);
	this.closeList.push(empty);

	for (var i = 0; i < this.aux.length; i++) {
		if (!this.findWall([this.position[0] + this.aux[i][0], this.position[1] + this.aux[i][1]]) &&
			 this.calcBoundaries(this.position[0] + this.aux[i][0], this.position[1] + this.aux[i][1])) {
			
			this.openList.push({
				parent: {
					point: this.position
				},
				point: [this.position[0] + this.aux[i][0], this.position[1] + this.aux[i][1]]
			});
		}
	};

	this.openList.splice(0, 1);
}

Pathfinding.prototype.setGoal = function(goalX, goalY) {
	this.goal = [goalX, goalY];
};

Pathfinding.prototype.findPath = function() {
	while (this.openList.length > 0) {
		console.log(this.position);

		if (this.position[0] == this.goal[0] && this.position[1] == this.goal[1]) {
			PLAY = false;
			console.log('FIND');

			var parent = null;
			for (var i = this.closeList.length - 1; i >= 0; i--) {
				if (!parent) {
					parent = this.closeList[i].parent.point;
					this.path.push(this.closeList[i].point);
				} else {
					if (this.closeList[i].point[0] == parent[0] && this.closeList[i].point[1] == parent[1]) {
						if (this.closeList[i].parent && this.closeList[i].parent.point) {
							parent = this.closeList[i].parent.point;
							this.path.push(this.closeList[i].point);
						} else {
							this.path.push(this.closeList[i].point);
							break;
						}
					}
				}
			};

			return this.path;
		} else if (this.openList.length > 0) {
			for (var i = 0; i < this.openList.length; i++) {
				var v = [this.openList[i].point[0] - this.goal[0], this.openList[i].point[1] - this.goal[1]];
				var r = [this.openList[i].point[0] - this.openList[i].parent.point[0], this.openList[i].point[1] - this.openList[i].parent.point[1]];

				var g = 0;

				var h = (Math.abs(v[0]) + Math.abs(v[1])) * 10;

				if (r[0] == 0 && r[1] == -1 || r[0] == -1 && r[1] == 0 || 
					r[0] == 1 && r[1] == 0 || r[0] == 0 && r[1] == 1) {
		    		g = 10;
		    	}

		    	var F = h + g;

		    	this.openList[i].F = F;
			};

			var lessF = 9999;
			var index = 0;
			for (var i = 0; i < this.openList.length; i++) {
				if (this.openList[i].F <= lessF) {
					lessF = this.openList[i].F;
					index = i;
				}
			}

			var nextPoint = this.openList[index];

			this.position = nextPoint.point;

			this.closeList.push(this.openList[index]);
			this.openList.splice(index, 1);

			var opcoes = [];
			for (var i = 0; i < this.aux.length; i++) {
				var add = false;

				if (!this.findOpen([nextPoint.point[0] + this.aux[i][0], nextPoint.point[1] + this.aux[i][1]])) {
					add = true;
				}

				if (this.findClose([nextPoint.point[0] + this.aux[i][0], nextPoint.point[1] + this.aux[i][1]]) ||
					this.findWall([nextPoint.point[0] + this.aux[i][0], nextPoint.point[1] + this.aux[i][1]])) {
					add = false;
				}

				if (add)
					opcoes.push(this.aux[i]);
			};

			for (var i = 0; i < opcoes.length; i++) {
				if (this.calcBoundaries(nextPoint.point[0] + opcoes[i][0], nextPoint.point[1] + opcoes[i][1])) {
					this.openList.push({
						parent: {
							G: nextPoint.G,
							point: [nextPoint.point[0], nextPoint.point[1]]
						},
						point: [nextPoint.point[0] + opcoes[i][0], nextPoint.point[1] + opcoes[i][1]]
					});
				}
			};
		} else {
			console.log('NO PATH');
			PLAY = false;
			return null;
		}
	}
};

Pathfinding.prototype.findOpen = function(item) {
	for (var i = 0; i < this.openList.length; i++) {
		if (this.openList[i].wall) {
			return false;
		} else {
			if (this.openList[i].point[0] == item[0] && this.openList[i].point[1] == item[1]) {
				return [item[0] - this.openList[i].parent.point[0], item[1] - this.openList[i].parent.point[1], i];
			}
		}
	};

	return false;
};

Pathfinding.prototype.findClose = function(item) {
	for (var i = 0; i < this.closeList.length; i++) {
		if (this.closeList[i].point[0] == item[0] && this.closeList[i].point[1] == item[1]) {
			return true;
		}
	};

	return false;
};

Pathfinding.prototype.findWall = function(item) {
	for (var i = 0; i < this.manageTiles.layerTwo.length; i++) {
		if (this.manageTiles.layerTwo[i].position.x == item[0] && 
			this.manageTiles.layerTwo[i].position.y == item[1]) {
			return true;
		}
	};

	return false;
};

Pathfinding.prototype.calcBoundaries = function(value1, value2) {
	if (value1 >= 0 &&  value2 >= 0 && value1 < this.manageTiles.lengthX && value2 < this.manageTiles.lengthY) {
		return true;
	}

	return false;
};

module.exports = Pathfinding;