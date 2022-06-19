class Picker {
  constructor(target, width, height) {
    this.target = target;
    this.width = width;
    this.height = height;
    this.target.width = width;
    this.target.height = height;
    //Get context
    this.context = this.target.getContext("2d");
    //Circle (Color Selector Circle)
    this.pickerCircle = { x: 10, y: 10, width: 7, height: 7 };
    this.listenForEvents();
  }

  draw() {
    //Drawing Here
    this.build();
  }

  build() {
    //Create a Gradient Color (colors change on the width)
    let gradient = this.context.createLinearGradient(0, 0, this.width, 0);
    //Add Color Stops to the Gradient (from 0 to 1)
    gradient.addColorStop(0, "rgb(255, 0, 0)");
    gradient.addColorStop(0.15, "rgb(255, 0, 255)");
    gradient.addColorStop(0.33, "rgb(0, 0, 255)");
    gradient.addColorStop(0.49, "rgb(0, 255, 255)");
    gradient.addColorStop(0.67, "rgb(0, 255, 0)");
    gradient.addColorStop(0.84, "rgb(255, 255, 0)");
    gradient.addColorStop(1, "rgb(255, 0, 0)");
    //Add color picker colors (red, green, blue, yellow...)
    //Render the Color Gradient from the 0's position to the full width and height
    this.context.fillStyle = gradient; ///, set it's style to be the color gradient
    this.context.fillRect(0, 0, this.width, this.height); ///< render it
    //Apply black and white (on the height dimension instead of the width)
    gradient = this.context.createLinearGradient(0, 0, 0, this.height);
    //We have two colors so 0, 0.5 and 1 needs to be used.
    gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
    gradient.addColorStop(0.5, "rgba(255, 255, 255, 0)");
    gradient.addColorStop(0.5, "rgba(0, 0, 0, 0)");
    gradient.addColorStop(1, "rgba(0, 0, 0, 1)");
    //set style and render it.
    this.context.fillStyle = gradient;
    this.context.fillRect(0, 0, this.width, this.height);

    //Circle;
    this.context.beginPath();
    //Arc renders a circle depending on the position, radius and arc
    this.context.arc(
      this.pickerCircle.x,
      this.pickerCircle.y,
      this.pickerCircle.width,
      0,
      Math.PI * 2
    );
    //Render it in black but not fill (only stroke)
    this.context.strokeStyle = "black";
    //Render the circle stroke and close the rendering path
    this.context.stroke();
    this.context.closePath();
  }

  listenForEvents() {
    let isMouseDown = false;
    const onMouseDown = (e) => {
      let currentX = e.clientX - this.target.offsetLeft;
      let currentY = e.clientY - this.target.offsetTop;

      if (
        currentY > this.pickerCircle.y &&
        currentY < this.pickerCircle.y + this.pickerCircle.width &&
        currentX > this.pickerCircle.x &&
        currentX < this.pickerCircle.x + this.pickerCircle.width
      ) {
        isMouseDown = true;
      } else {
        this.pickerCircle.x = currentX;
        this.pickerCircle.y = currentY;
      }
    };
    const onMouseMove = (e) => {
      if (isMouseDown) {
        let currentX = e.clientX - this.target.offsetLeft;
        let currentY = e.clientY - this.target.offsetTop;
        this.pickerCircle.x = currentX;
        this.pickerCircle.y = currentY;
      }
    };
    const onMouseUp = () => {
      isMouseDown = false;
    };
    //Register
    this.target.addEventListener("mousedown", onMouseDown);
    this.target.addEventListener("mousemove", onMouseMove);
    this.target.addEventListener("mousemove", () =>
      this.onChangeCallback(this.getPickedColor())
    );
    //Mouse up on the Document
    document.addEventListener("mouseup", onMouseUp);
  }

  getPickedColor() {
    let pickedColor = this.context.getImageData(
      this.pickerCircle.x,
      this.pickerCircle.y,
      1,
      1
    );
    return {
      r: pickedColor.data[0],
      g: pickedColor.data[1],
      b: pickedColor.data[2],
    };
  }

  onChange(callback) {
    //call this when the coordinates are updated?
    this.onChangeCallback = callback;
  }
}

setInterval(() => picker.draw(), 1);

let picker = new Picker(document.getElementById("color-picker"), 290, 250);
const btns = document.querySelector(".btn-container");
const btn = document.querySelectorAll(".btn");
const pal = document.querySelector(".palette-container");
const sqr = document.querySelectorAll(".square");
var http = new XMLHttpRequest();
var url = "http://colormind.io/api/";
var data;
// var data = {
//   model: "default",
//   input: [[44, 43, 44], [90, 83, 82], "N", "N", "N"],
// };

////////////////////////////

picker.onChange((color) => {
  let selected = document.getElementsByClassName("selected")[0];
  selected.style.backgroundColor = `rgb(${color.r}, ${color.g}, ${color.b})`;
});

btns.addEventListener("click", function (e) {
  const id = e.target.dataset.id;
  btn.forEach(function (btn) {
    btn.classList.remove("btn-active");
  });
  e.target.classList.add("btn-active");

  if (id == "default" || id == "ui") {
    data = {
      model: id,
      input: [[44, 43, 44], [90, 83, 82], "N", "N", "N"],
    };
    // console.log(data);
    http.open("POST", url, true);
    http.send(JSON.stringify(data));
  }
});

// pal.addEventListener("click", function (e) {
//   // const id = e.target.dataset.id;
//   // if (id) {}
//   let copyText = "hi";
//   // navigator.clipboard.writeText(copyText);
//   try {
//     var retVal = document.execCommand("copy");
//     console.log('Copy to clipboard returns: ' + retVal);
//     alert("Copied the text: " + copyText.value);
// } catch (err) { console.log('Error while copying to clipboard: ' + err); }
// });

//   /* Alert the copied text */
//   alert("Copied the text: " + copyText.value);
// });

http.onreadystatechange = function () {
  if (http.readyState == 4 && http.status == 200) {
    // console.log(http.responseText);
    var palette = JSON.parse(http.responseText).result;
    console.log(palette);
    var squares = document.getElementsByClassName("square");
    // console.log(squares);
    for (var i = 0; i < squares.length; i++) {
      // console.log(squares[i].style.backgroundColor);
      squares[i].style.backgroundColor =
        "rgb(" +
        palette[i][0] +
        "," +
        palette[i][1] +
        "," +
        palette[i][2] +
        ")";
    }
    // square.style.backgroundColor = `rgb(${palette[0][0]})`);
  }
};
