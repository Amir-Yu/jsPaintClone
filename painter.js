const painter = {
  width: 500,
  height: 500,
  frontColor: "#000000",
  backColor: "#ffffff",
  brashWidth: 10,
  savedImages: localStorage.savedImages ? JSON.parse(localStorage.savedImages) : [],
  containerElm: document.querySelector(".container"),
  canvasElm: document.createElement("canvas"),
  initRender: function () {
    this.canvasElm.id = "painter";
    this.canvasElm.height = this.height;
    this.canvasElm.width = this.width;
    this.canvasElm.style.border = "1px solid black";

    this.containerElm.appendChild(this.canvasElm);

    this.context = this.canvasElm.getContext("2d");

    // init canvas
    this.context.fillStyle = this.backColor;
    this.context.fillRect(0, 0, this.width, this.height);

    // init brash
    this.context.lineWidth = this.brashWidth;
    this.context.strokeStyle = this.frontColor;
    this.registerCanvasEvents();

    // init buttons
    document.querySelector("#fgColor").value = painter.frontColor;
    document.querySelector("#bgColor").value = painter.backColor;
    document.querySelector("#brashWidth").value = painter.brashWidth;
  },
  registerCanvasEvents: function () {
    this.canvasElm.addEventListener("mousedown", function (e) {
      if (e.buttons) {
        // console.log(e);
        painter.isDrawing = true;
        painter.context.beginPath();
        painter.lastPosX = e.offsetX;
        painter.lastPosY = e.offsetY;
      }
    });
    this.canvasElm.addEventListener("mousemove", function (e) {
      if (painter.isDrawing) {
        painter.context.lineTo(painter.lastPosX, painter.lastPosY);
        painter.context.stroke();
        painter.lastPosX = e.offsetX;
        painter.lastPosY = e.offsetY;
      }
    });
    this.canvasElm.addEventListener("mouseup", function (e) {
      painter.isDrawing = false;
      painter.context.save();
    });
  },
};

const btnClear = () => {
  painter.context.fillStyle = painter.backColor;
  painter.context.fillRect(0, 0, painter.width, painter.height);

  //painter.context.clearRect(0, 0, painter.width, painter.height);
};

const btnBrashMode = self => {
  if (self.value.toLowerCase() === "brush") {
    //--> change to eraser...
    painter.context.strokeStyle = painter.backColor;
    self.value = "Eraser";
  } else {
    //-> change to brash
    painter.context.strokeStyle = painter.frontColor;
    self.value = "Brush";
  }
};

const btnSetFgColor = self => {
  //console.log(e.value);
  painter.frontColor = self.value;
  painter.context.strokeStyle = self.value;
  //-> change back to brash
  const eraserElm = document.querySelector('input[type="button"][value="Eraser"]');
  if (eraserElm) {
    eraserElm.value = "Brush";
  }
};

const btnSetBgColor = self => {
  painter.backColor = self.value;
  painter.context.fillStyle = self.value;
  painter.context.fillRect(0, 0, painter.width, painter.height);
};

const btnSetbrashWidth = self => {
  painter.brashWidth = self.value;
  painter.context.lineWidth = self.value;
};

const btnUndo = () => {
  painter.context.restore();
};

const btnSave = () => {
  const imgData = painter.canvasElm.toDataURL();
  painter.savedImages.push(imgData);
  localStorage.savedImages = JSON.stringify(painter.savedImages);
};

const btnLoad = () => {
  if (painter.savedImages.length) {
    let image = new Image();
    image.src = painter.savedImages.pop();
    setTimeout(() => {
      painter.context.drawImage(image, 0, 0);
    }, 0);

    localStorage.savedImages = JSON.stringify(painter.savedImages);
  }
};

painter.initRender();
