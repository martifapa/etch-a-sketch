// default values
const DEFAULT_COLOR = '#000';
const DEFAULT_BKG_COLOR = '#ffffff'
const DEFAULT_ROWS = 16;

// current values
let currentColor = DEFAULT_COLOR;
let currentSize = DEFAULT_ROWS;
let currentBkgColor = DEFAULT_BKG_COLOR
let mouseDown = false;
let eraserActive = false;
let gridActive = false;
let hoverActive = false;
let lightColorMode = false;

// page elements
const sketchContainer = document.querySelector('.sketch-container');
const colorPicker = document.querySelector('#brush-color');
const bkgColor = document.querySelector('#bkg-color');
const eraser = document.querySelector('#eraser');
const gridSizeRange = document.querySelector('#grid-size');
const eraseButton = document.querySelector('button');
const displayGridButton = document.querySelector('#show-grid');
const switchColorMode = document.querySelector('#switch-color');

// event listeners
gridSizeRange.addEventListener('input', setSize);
gridSizeRange.addEventListener('input', updateSizeLabel);
gridSizeRange.addEventListener('click', resizeGrid);
colorPicker.addEventListener('input', setColor);
bkgColor.addEventListener('change', setBkgColor);
eraser.addEventListener('change', toggleEraser);
eraser.addEventListener('change', toggleHoverEffect);
eraseButton.addEventListener('click', eraseCanvas);
displayGridButton.addEventListener('change', displayGrid);
switchColorMode.addEventListener('change', applyColorMode);

// manage mouseDown
sketchContainer.onmousedown = () => (mouseDown = true);
sketchContainer.onmouseup = () => (mouseDown = false);

// helper functions
function setColor(e) {
    currentColor = e.target.value;
}

function setSize(e) {
    currentSize = e.target.value;
}

function toggleEraser() {
    eraserActive = eraserActive? false : true;
}

function toggleDisplayGrid() {
    gridActive = gridActive? false : true;
}

function toggleColorMode() {
    lightColorMode = lightColorMode? false : true;
}

function convertRgb(rgb) {
    // This will choose the correct separator, if there is a "," in your value it will use a comma, otherwise, a separator will not be used.
    let separator = rgb.indexOf(",") > -1 ? "," : " ";
  
    // This will convert "rgb(r,g,b)" into [r,g,b] so we can use the "+" to convert them back to numbers before using toString 
    rgb = rgb.substr(4).split(")")[0].split(separator);
  
    // Here we will convert the decimal values to hexadecimal using toString(16)
    let r = (+rgb[0]).toString(16),
      g = (+rgb[1]).toString(16),
      b = (+rgb[2]).toString(16);
  
    if (r.length == 1)
      r = "0" + r;
    if (g.length == 1)
      g = "0" + g;
    if (b.length == 1)
      b = "0" + b;
  
    return "#" + r + g + b;
}

// main functions
function paintCanvas(e) {
    if (e.type === 'mouseover' && !mouseDown) return;
    if (eraserActive) {
        e.target.style.backgroundColor = currentBkgColor;
    } else {
        e.target.style.backgroundColor = currentColor;
    }
}

function displayGrid(toggle) {
    toggle? toggleDisplayGrid() : '';

    divs = sketchContainer.childNodes;

    if (gridActive) {
        divs.forEach(function(div) {
            div.style.border = '1px solid #f5f5f5';
        });
    } else {
        divs.forEach(function(div) {
            div.style.border = 'none';
        });
    }
}

function toggleHoverEffect() {
    divs = sketchContainer.childNodes;

    if (eraserActive) {
        divs.forEach(function(div) {
            div.classList.remove('disable');
        });
    } else {
        divs.forEach(function(div) {
            div.classList.add('disable');
        })
    }
}

function setBkgColor(e) {
    const divs = sketchContainer.childNodes;
    divs.forEach(function(div) {
        if (!div.style.backgroundColor || convertRgb(div.style.backgroundColor) === currentBkgColor) {
            div.style.backgroundColor = e.target.value;
        }
    });
    currentBkgColor = e.target.value;
}

function eraseCanvas() {
    const divs = sketchContainer.childNodes;
    divs.forEach(function(div) {
        div.style.backgroundColor = currentBkgColor;
    });
}

function resizeGrid() {
    sketchContainer.replaceChildren(); //destroy grid
    createGrid(currentSize);
    
    gridActive? displayGrid(false) : '';
}

function updateSizeLabel() {
    const label = document.querySelector('.grid-size-label');
    label.textContent = gridSizeRange.value + 'x' + gridSizeRange.value
}

function createGrid(numRows) {
    const divTotalWidth = sketchContainer.clientWidth / numRows + 'px';
    
    for (let i = 0; i < numRows**2; i++) {
        // create div
        const squareDiv = document.createElement('div');
        squareDiv.classList.add('square');
        eraserActive? squareDiv.classList.remove('disable') : squareDiv.classList.add('disable');

        // adjust width
        squareDiv.style.setProperty('--min', divTotalWidth);

        // add event listener to change its color
        squareDiv.addEventListener('mouseover', paintCanvas);
        squareDiv.addEventListener('mousedown', paintCanvas);

        //squareDiv.style.backgroundColor = "#" + Math.floor(Math.random()*16777215).toString(16);
        // add div to its container
        sketchContainer.appendChild(squareDiv);
    }
}

function applyColorMode() {
    if (lightColorMode) {
        document.documentElement.style.setProperty('--dark', '#000');
        document.documentElement.style.setProperty('--medium', '#2c2c2c');
        document.documentElement.style.setProperty('--light', '#f5f5f5');
        document.documentElement.style.setProperty('--clear', '#fff');
    } else {
        document.documentElement.style.setProperty('--dark', '#fff');
        document.documentElement.style.setProperty('--medium', '#eee');
        document.documentElement.style.setProperty('--light', '#343131');
        document.documentElement.style.setProperty('--clear', '#2c2c2c');
    }

    toggleColorMode();
}

// onload
window.onload = () => {
    createGrid(DEFAULT_ROWS);
}