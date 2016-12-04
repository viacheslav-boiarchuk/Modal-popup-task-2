document.addEventListener("DOMContentLoaded", function(){

	let timer;
	const timeValue = 800;
	let listener = function (e) {
		window.clearTimeout(timer);
		popup.determineDirection(e);
		timer = window.setTimeout(function () {
			popup.narrowModel();
		}, timeValue);
	};
	document.addEventListener("mousemove",listener);

	class Modal {

		constructor(block) {
			this.block = block;
			this.checkRender();
			this.onClickEvent();
			this.flagAnimation = false;
			this.lastCursorSector = null;
			this.currentCursorSector = null;
		}

		checkRender() {
			if (this.block === null) {
				throw new Error("Sorry but this block wasn't render");
			}
		}

		onClickEvent() {
			this.block.addEventListener("click", (e) => {
				window.clearTimeout(timer);
				this.destroyModal();
			})
		}

		destroyModal() {
			document.removeEventListener("mousemove",listener);
			this.block.classList.remove("animation");
			this.block.parentNode.classList.add("hide-sub-container");
			this.block.parentNode.setAttribute("style", "top:0; left:0; right:0; bottom:0;");
			this.block.setAttribute("style", "top:0; left:0; right:0; bottom:0; height: 100%");
			setTimeout(() => {this.block.classList += " hide-popup";},timeValue);
		}

		setModalPosition() {
			let {top, left, right, bottom, width, height} = this.block.getBoundingClientRect();
			this.top = top;
			this.left = left;
			this.right = right;
			this.bottom = bottom;
			this.width = width;
			this.height = height;
			this.center = Modal.point((width / 2) + left, (height / 2) + top);
		}

		get cursorY() {
			return this._cursorY;
		}

		set cursorY(value) {
			this._cursorY = value;
		}

		get cursorX() {
			return this._cursorX;
		}

		set cursorX(value) {
			this._cursorX = value;
		}

		static point(x, y) {
			return [x, y];
		}

		static vectorLength(vector) {
			return Math.sqrt((vector[0] * vector[0]) + (vector[1] * vector[1]));
		}

		static vectorNormalize(vector) {
			const v_length = Modal.vectorLength(vector);
			const [x, y] = vector;
			return [x / v_length, y / v_length];
		}

		static vectorCoordinate(a, b) {
			return [a[0] - b[0], a[1] - b[1]];
		}

		static getDirection(angle) {
			if (angle <= -45 && angle > -130) {
				return "TOP";
			} else if ((angle > -180 && angle <= -130) || (angle <= 180 && angle > 130)) {
				return "LEFT";
			} else if (angle > 45 && angle <= 130) {
				return "BOTTOM";
			} else if (angle <= 45 && angle > -45) {
				return "RIGHT";
			}
			return "NONE";
		}

		setCursorPosition(e) {
			this.cursorX = e.pageX;
			this.cursorY = e.pageY;
		}

		determineDirection(e) {
			this.setCursorPosition(e);
			this.setModalPosition();
			this.lastCursorSector = this.currentCursorSector;
			const coordinates = Modal.point(this.cursorX, this.cursorY);
			const vector = Modal.vectorCoordinate(coordinates, this.center);
			const vectorDirection = Modal.vectorNormalize(vector);
			const vectorAngle = Math.atan2(vectorDirection[1], vectorDirection[0]) * (180 / Math.PI);
			this.angle = Modal.getDirection(vectorAngle);
			this.currentCursorSector = this.angle;
			this.moveModal();
		}

		moveModal() {
			if (!this.flagAnimation) {
				switch(this.angle) {
					case "TOP":
						if (this.bottom + this.cursorY + 10 < window.innerHeight){
							this.block.style.height = this.height + this.cursorY + "px";
						}
						break;
					case "RIGHT":
						const tempRightValue = window.innerWidth - this.cursorX;
						if (this.left - tempRightValue - 10 > 0) {
							this.block.style.left = this.cursorX - window.innerWidth + "px";
							this.block.style.width = "auto";
						}
						break;
					case "LEFT":
						if (this.right + this.cursorX + 10 < window.innerWidth) {
							this.block.style.width = this.width + this.cursorX + "px";
						}
						break;
					case "BOTTOM":
						const tempLeftValue = window.innerHeight - this.cursorY;
						if (this.top - tempLeftValue - 10 > 0) {
							this.block.style.top = this.cursorY - window.innerHeight + "px";
							this.block.style.height = "auto";
						}
						break;
				}
			}
			if (this.lastCursorSector !== this.currentCursorSector && this.lastCursorSector !== null) {
				this.narrowModel(this.lastCursorSector);
			}
		}

		narrowModel(prevSide) {
			let angle = (prevSide !== undefined) ? prevSide : this.angle;
			let {height, width} = this.block.parentNode.getBoundingClientRect();
			this.flagAnimation = true;
			this.setModalPosition();
			switch(angle) {
				case "TOP":
					this.block.parentNode.style.top = (this.bottom - height / 2) * 100 / window.innerHeight + "%";
					this.block.style.height = "100%";
					break;
				case "BOTTOM":
					this.block.parentNode.style.top = (this.top + height / 2) * 100 / window.innerHeight  + "%";
					this.block.style.top = 0 + "px";
					break;
				case "LEFT":
					this.block.parentNode.style.left = (this.right - width / 2) * 100 / window.innerWidth + "%";
					this.block.style.width = "100%";
					break;
				case "RIGHT":
					this.block.parentNode.style.left = (this.left + width / 2) * 100 / window.innerWidth + "%";
					this.block.style.left = 0 + "px";
					break;
			}
			setTimeout(() => {this.flagAnimation = false;},timeValue);
		}

	}

	let popup = new Modal(document.querySelector(".popup"));
});