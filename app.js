const canvas = document.querySelector("#canvas");
canvas.height = window.innerHeight - 100;
canvas.width = window.innerWidth - 200;
const context = canvas.getContext("2d");

var generateBarsButton = document.getElementById("generateBars");
var runButton = document.getElementById("run");

var slider = document.getElementById("slider");
var speed = document.getElementById("speed");
var sliderValue = document.getElementById("sliderValue");
var speedValue = document.getElementById("speedValue");
var n = slider.value;
var s = speed.value;
sliderValue.innerHTML = n;
speedValue.innerHTML = s;
var barWidth = canvas.width/n;
var currentNum = 0;
var datos = [];
var pivotes = [];
var frames = [];
var animationTicks = 0;
var lastThrow = 0;
var flag = 0;

generateBars();
redrawCanvas();

// -------------------- Event Listeners --------------------

slider.addEventListener('input', () => {
    n = slider.value; 
    barWidth = canvas.width/n;
    sliderValue.innerHTML = n;

    generateBars();
    redrawCanvas();
});

speed.addEventListener('input', () => {
    s = speed.value;
    speedValue.innerHTML = s;
});

window.addEventListener('resize', () => {
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
    barWidth = canvas.width/n;
    generateBars();
    redrawCanvas();
});

generateBarsButton.addEventListener('click', () => {
    generateBars();
    redrawCanvas();
});

runButton.addEventListener('click', () => {
    if (flag === 1) {
        console.log("Wait until the animation ends.");
        return;
    }
    flag = 1;

    switch(document.getElementById("algorithms").value) {
        case "bubbleSort":
            bubbleSortCall();
            break;
        case "selectSort":
            selectSortCall();
            break;
        case "cocktailSort":
            cocktailSortCall();
            break;
        case "insertionSort":
            insertionSortCall();
            break;
        case "quickSort":
            quickSortCall();
            break;
        case "mergeSort":
            mergeSortCall();
            break;
        case "heapSort":
            heapSortCall();
            break;
        case "binaryTreeSort":
            binaryTreeSortCall();
            break;
    }

    setTimeout(() => {
        flag = 0;
    }, lastThrow-Date.now()+s*animationTicks);
});

// ---------------------------------------------------------

// ------------------- Algorithm Starters ------------------

function bubbleSortCall() {
    bubbleSort();
    animateFrames(drawBubbleSort);
}

function selectSortCall() {
    selectSort();
    animateFrames(drawSelectSort);
}

function cocktailSortCall() {
    lastThrow = Date.now();
    animationTicks = 0;
    cocktailSort();
    endWithGreen();
}

function insertionSortCall() {
    lastThrow = Date.now();
    animationTicks = 0;
    insertionSort();
    endWithGreen();
}

function quickSortCall() {
    pivotes = [];
    quickSort(datos,0,datos.length - 1);
    // Adds a final frame that paints the last few bars
    todoPivotes = [];
    for (let i=0; i<datos.length; i++) {
        todoPivotes.push(i);
    }
    frames.push([datos.slice(),todoPivotes])
    animateFrames(drawQuickSort);
}

function mergeSortCall() {
    lastThrow = Date.now();
    animationTicks = 0;
    datos = mergeSort(datos,0,datos.length-1);
    endWithGreen();
}

function heapSortCall() {
    lastThrow = Date.now();
    animationTicks = 0;
    heapSort(datos.slice());
    endWithGreen();
}

function binaryTreeSortCall() {
    lastThrow = Date.now();
    animationTicks = 0;
    binaryTreeSort(datos.slice());
    endWithGreen();
}

// ---------------------------------------------------------

function drawBar(x,width,height,color) {
    context.fillStyle = color;
    context.fillRect(x, canvas.height, width, -height);
    //context.strokeStyle = 'DarkSlateGray';
    //context.strokeRect(x, y, width, height);
}

//Used for merge animations
function drawIndex(datos, args) {
    let index = args[0];
    let color = args[1];
    context.clearRect(barWidth*index,canvas.height,barWidth,-canvas.height);
    context.fillStyle = color;
    context.fillRect(barWidth*index,canvas.height,barWidth,-datos[index]);
}

//Used for merge animations
function drawMergePoints(datos,args) {
    redrawDataImage(datos);
    drawIndex(datos,[args[2],'blue']);
    drawIndex(datos,[args[0],'green']);
    drawIndex(datos,[args[1],'green']);
}

function redrawCanvas(color) {
    var color = color || 'silver'

    context.clearRect(0,0,canvas.width,canvas.height);

    var currentX = 0;
    datos.forEach((bar) => {
        drawBar(currentX,barWidth,bar,color);
        currentX += barWidth;
    })
}

function endWithGreen() {
    setTimeout(() => {
        redrawCanvas('green');
    }, lastThrow-Date.now()+s*animationTicks);
}

//Used for merge animations
function redrawDataImage(data,args) {
    if (Array.isArray(args)) {
        var color = args[0] || 'silver';
        var index = args[1] || data.lenght-1;
    } else {
        var color = args || 'silver';
    }
    
    context.clearRect(0,0,canvas.width,canvas.height);

    var currentX = 0;
    for (let i=0; i<data.length; i++) {
        if (i <= index) {
            drawBar(currentX,barWidth,data[i],color);
        } else {
            drawBar(currentX,barWidth,data[i],'silver');
        }
        currentX += barWidth;
    }
}

function redrawCocktailSort(data,args) {
    var color = args[0];
    var index = args[1];
    var left = args[2];
    var right = args[3]; 

    context.clearRect(0,0,canvas.width,canvas.height);

    var currentX = 0;
    for (let i=0; i<data.length; i++) {
        if (i == index) {
            drawBar(currentX,barWidth,data[i],color);
        } else if (i < left || i > right) {
            drawBar(currentX,barWidth,data[i],'green');
        } else {
            drawBar(currentX,barWidth,data[i],'silver');
        }
        currentX += barWidth;
    }
}

//Used for merge animations
function throwPaint(datos, action, ...args) {
    let currentTime = Date.now();
    animationTicks++;
    setTimeout(() => {
        action(datos, args);
    }, lastThrow-currentTime+s*animationTicks);
    lastThrow = currentTime;
}

function animateFrames(animation) {
    lastThrow = Date.now();
    animationTicks = 0;

    frames.forEach((frame) => {
        var currentTime = Date.now();
        animationTicks ++;
        setTimeout(() => {
            animation(frame);
        }, lastThrow-currentTime+s*animationTicks);
        lastThrow = currentTime;
    })
    frames = [];
    pivotes = [];
}

function drawBubbleSort(frame) {
    var imagen = frame[0];
    var l = imagen.length;
    var j = frame[1];
    var i = frame[2];

    context.clearRect(0,0,canvas.width,canvas.height);

    var currentX = 0;
    for (let k=0; k<l; k++) {
        if (k == j) { //Dibujamos las barras que estan siendo comparadas
            if (imagen[j] > imagen[j+1]) { //El indice actual es mayor que el siguiente (ROJO)
                drawBar(currentX,barWidth,imagen[j],'red');
                currentX += barWidth;
                drawBar(currentX,barWidth,imagen[j+1],'red');
                k++;
            } else { //El indice actual es menos o igual al siguiente (AZUL)
                if (i == l-2) { //No queremos que la ultima comparacion se quede de color azul
                    drawBar(0,barWidth,imagen[0],'green');
                    drawBar(currentX,barWidth,imagen[j],'green');
                    drawBar(currentX,barWidth,imagen[j+1],'green');
                } else {
                    drawBar(currentX,barWidth,imagen[j],'blue');
                    currentX += barWidth;
                    drawBar(currentX,barWidth,imagen[j+1],'blue');
                    k++;
                }
            }
        } else if (k>l-i-1) { //Barras que ya han sido ordenadas
            drawBar(currentX,barWidth,imagen[k],'green');
        } else { //Barras que aun estan desordenadas
            drawBar(currentX,barWidth,imagen[k],'silver');
        }
        // Se encarga de que al final de la animacion todos queden verdess
        if (k === l-1 && i === l-2) {
            redrawCanvas('green');
        }
        currentX += barWidth;
    }
}

function drawSelectSort(frame) {
    var imagen = frame[0];
    var l = imagen.length;
    var small = frame[1];
    var cmp = frame[2];
    var origin = frame[3];

    context.clearRect(0,0,canvas.width,canvas.height);

    var currentX = 0;
    for (let k=0; k<l; k++) {
        if (k === cmp) {
            drawBar(currentX,barWidth,imagen[cmp],'blue');
        } else if (k === small) {
            drawBar(currentX,barWidth,imagen[small], 'red');
        } else if (k < origin) {
            drawBar(currentX,barWidth,imagen[k],'green');
        } else {
            drawBar(currentX,barWidth,imagen[k],'silver');
        }
        currentX += barWidth;
    }

    if (origin === l) {
        drawBar((canvas.width-barWidth),barWidth,imagen[l-1],'green');
        drawBar((canvas.width-2*barWidth),barWidth,imagen[l-2],'green');
    }
}

function drawInsertionSort(datos,args) {
    redrawDataImage(datos,['green',args[2]]);
    drawIndex(datos,[args[0],args[1]]); //args: index,color
}

// Posible error - pinta de azul la barra siguiente?
function drawQuickSort(frame) {
    var imagen = frame[0];
    var l = imagen.length;
    var pivotes = frame[1];
    var i = frame[2];
    var j = frame[3];

    context.clearRect(0,0,canvas.width,canvas.height);

    var currentX = 0;
    for (let k=0; k<l; k++) {
        if (pivotes.includes(k)) {
            drawBar(currentX,barWidth,imagen[k],'green');
        } else  if  (k === i || k === j) {
            drawBar(currentX,barWidth,imagen[k], 'blue');
        } else {
            drawBar(currentX,barWidth,imagen[k],'silver');
        }
        currentX += barWidth;
    }
}

function generateBars() {
    var barWidth = canvas.width/n;
    var newData = [];
    var randomHeight = 0;
    for (let i=0; i<parseInt(n); i++) {
        randomHeight = Math.ceil(Math.random()*canvas.height);
        newData.push(randomHeight);
    }
    datos = newData;
}

function bubbleSort() {
    var l = datos.length;

    for (let i=0; i<l;i++) {
        for (let j=0; j<l-i-1; j++) {
            frames.push([datos.slice(),j,i]);
            if (datos[j] > datos[j+1]) {
                var temp = datos[j];
                datos[j] = datos[j+1];
                datos[j+1] = temp;
            }
        }
    }
}

function insertionSort() {
    var l = datos.length;
    
    for (let i=0; i<l; i++) {
        let j=i;
        while (j>0 && datos[j] < datos[j-1]) {
            throwPaint(datos.slice(), drawInsertionSort,j,'red',i);
            let temp = datos[j];
            datos[j] = datos[j-1];
            datos[j-1] = temp;
            j--;
        }
        throwPaint(datos.slice(), drawInsertionSort,j,'blue',i);
    }
}

function cocktailSort() {
    var left = 0;
    var right = datos.length - 2; // We want the penultimate index
    var temp = 0;

    while (left < right) {

        for (var i = left; i <= right; i++) {
            throwPaint(datos.slice(), redrawCocktailSort, 'blue', i, left, right+1);
            if (datos[i] > datos[i+1]) {
                temp = datos[i];
                datos[i] = datos[i+1];
                datos[i+1] = temp;
            }
        }

        left++;

        for (var j = right; j >= left; j--) {
            throwPaint(datos.slice(), redrawCocktailSort, 'blue', j, left-1, right);
            if (datos[j] < datos[j-1]) {
                temp = datos[j];
                datos[j] = datos[j-1];
                datos[j-1] = temp;
            }
        }

        right--;
    }
}

function selectSort() {
    var l = datos.length;

    var currentSmallest = 0;

    for (var i=0; i<l; i++) {
        currentSmallest = i;
        frames.push([datos.slice(),currentSmallest,i,i]);
        for (var j=i+1; j<l; j++) {
            if (datos[currentSmallest] > datos[j]) {
                currentSmallest = j;
            }
            frames.push([datos.slice(),currentSmallest,j,i]);
        }
        var temp = datos[i];
        datos[i] = datos[currentSmallest];
        datos[currentSmallest] = temp;
    }
    frames.push([datos.slice(),currentSmallest,j,i]);
}

// Funciones para Quick Sort
function quickSortIterative(array) {
    if (array.length <= 1) {
        return array;
    }

    var left = [];
    var right = [];
    var p = array.pop() //El pivote sera el ultimo elemento de la lista
    var l = array.length;

    for (let i=0; i<l; i++) {
        if (array[i] <= p) {
            left.push(array[i]);
        } else {
            right.push(array[i]);
        }
    }
    
    return [].concat(quickSort(left), p, quickSort(right));
}

function quickSort(A, left, right) {
    if (left < right) {
      const p = partition(A, left, right)
      pivotes.push(p);
      quickSort(A, left, p)
      quickSort(A, p + 1, right)
    }
}
  
function partition(A, left, right) {
    const pivot = A[Math.floor((left + right) / 2)]; 
    let i = left - 1
    let j = right + 1
    while (true) {
        do {
        i += 1
        frames.push([datos.slice(),pivotes.slice(),i,j]);
        } while (A[i] < pivot)
        do {
        j -= 1
        frames.push([datos.slice(),pivotes.slice(),i,j]);
        } while (A[j] > pivot)
        if (i >= j) {
            return j;
        }
        [A[i], A[j]] = [A[j], A[i]];
        frames.push([datos.slice(),pivotes.slice(),i,j]);
    }
}
// ---------------------------------------

// Funciones para Merge Sort
function mergeSort(A,i,o) {
    if (A.length <= 1) return A;
    var midIndex  = i + Math.ceil((o-i)/2);
    var mid = Math.floor(A.length / 2);
    var left = mergeSort(A.slice(0, mid),i,midIndex-1);
    var right = mergeSort(A.slice(mid),midIndex,o);
  
    return merge(left, i, right, midIndex, o);
}

function merge(A1, i1, A2, i2, o2) {
    let sorted = [];

    var currentA1 = 0;
    var currentA2 = 0;
  
    while (A1.length && A2.length) {
        throwPaint(datos.slice(),drawMergePoints,i1,o2,i2)
        if (A1[0] < A2[0]) {
            sorted.push(A1.shift());
            throwPaint(datos.slice(),drawIndex,i1+currentA1,'red')
            currentA1++;
        } else {
            sorted.push(A2.shift());
            throwPaint(datos.slice(),drawIndex,i2+currentA2,'red');
            currentA2++;
        }
    };

    // Concat doesnt allow for a proper live animation.
    while (A1.length > 0) {
        throwPaint(datos.slice(),drawMergePoints,i1,o2,i2)
        sorted.push(A1.shift());
        throwPaint(datos.slice(),drawIndex,i1+currentA1,'red') //-------
        currentA1++;
    }
    while (A2.length > 0) {
        throwPaint(datos.slice(),drawMergePoints,i1,o2,i2)
        sorted.push(A2.shift());
        throwPaint(datos.slice(),drawIndex,i2+currentA2,'red');
        currentA2++;
    }
    
    for (let i=i1; i<=o2; i++) {
        datos[i] = sorted[i-i1];
        if (o2-i1 === datos.length-1) {
            throwPaint(datos.slice(),redrawDataImage,'green',i);
        } else {
            throwPaint(datos.slice(),redrawDataImage,'silver');
        }
    }

    throwPaint(datos.slice(),redrawDataImage,'silver');
    return sorted;
}
// ---------------------------------------

// Funciones para Heap Sort
function buildMaxHeap(data) {
    
    let indexFirstParent = Math.floor(data.length/2 - 1);

    for (let i=indexFirstParent; i >= 0; i--) {
        heapify(data,data.length,i);
    }

    for (let i=0; i<data.length; i++) {
        datos[i] = data[i];
    }
}

function heapify(data, length, index) {
    var largest = index;
    var left = 2 * index + 1;
    var right = 2 * index + 2;

    if (datos.length == data.length) {
        throwPaint(data.slice(),drawHeapify,index,'red');
    }

    if (left < length && data[left] > data[largest]) {
        largest = left;
    }

    if (right < length && data[right] > data[largest]) {
        largest = right;
    }

    if (largest != index) {
        // Node being heapifyed.
        throwPaint(data.slice(),drawHeapify,index,'red');
        
        let temp = data[index];
        data[index] = data[largest];
        data[largest] = temp;
        heapify(data,length,largest);
    }

}

function heapSort() {
    var l = datos.length

    for (let i=0; i < l; i++) {
        // Build the max heap:
        buildMaxHeap(datos.slice(0,l-i))
        // Swap root with last leaf. (Extract root/maxNumber)
        let temp = datos[0];
        datos[0] = datos[l-i-1];
        datos[l-i-1] = temp;
        
        throwPaint(datos.slice(),drawHeapSort,l-i-1,'green');
    }
}

function drawHeapSort(data,args) {
    redrawDataImage(data);
    for (let i=args[0]; i<data.length; i++) {
        drawIndex(data,[i,args[1]]);
    }
}

function drawHeapify(data, args) {
    let index = args[0];
    let color = args[1];
    for (let i=0; i<data.length; i++) {
        switch (i) {
            case index:
                drawIndex(data,[i,color]);
                break;
            default:
                drawIndex(data,[i,'silver']);
        }
    }
}
// ---------------------------------------


/*
binary tree sort
*/
