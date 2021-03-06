var WIDTH = window.innerWidth,
    HEIGHT = window.innerHeight,
    VIEW_ANGLE = 75,
    BOX_SIZE = 1,
    Z = 0.01,
    GRID_WIDTH = 12,
    GRID_HEIGHT = 24,
    ASPECT = WIDTH / HEIGHT,
    OFFSET = BOX_SIZE / 2,
    NEAR = 0.1,
    FAR = 1000;

var gameOver = false;
var hardMode = false;
var speed = 1;
var counter = 0, lastTime = 0, interval = 1000;
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR );

var renderer = new THREE.WebGLRenderer({alpha: true});
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
document.addEventListener('keydown', event => {
    if(event.keyCode === 37){
        moveActor(-1);
    }else if(event.keyCode === 39){
        moveActor(1);
    }else if(event.keyCode === 40){
        dropShape();
    }else if(event.keyCode === 81){
        rotateActor(1);
    }else if(event.keyCode === 69){
        rotateActor(-1);
    }
});
const types = 'TIOJLSZ';
const actor = {
    shape: createShape(types[types.length * Math.random() | 0]),
    pos: {x: 6, y: -1},
    score: 0,
};

const board = createBoard(GRID_WIDTH, GRID_HEIGHT);
const colors = [0xb20de0,0x0963f4,0xef170b,0xefec15,0x0eef4e,0xe522d5,0x0dbbe2,0xb9f442,0xeabc02,0x9a15ed];

camera.position.x = 6;
camera.position.y = -12;
camera.position.z = 20;

function animate(time = 0) {
    const _time = time - lastTime;
    lastTime = time;
    counter += _time;
    while(scene.children.length > 0){
        scene.remove(scene.children[0]);
    }
    if(counter > interval / speed && hardMode === false) {
        dropShape();
    }

    if(counter > interval / speed && hardMode === true){
        dropShape();

    }

    drawBoard();
    drawShape(board, {x: 0, y: 0});
    drawShape(actor.shape, actor.pos);
    renderer.render( scene, camera );
    renderer.renderLists.dispose();
    if(!gameOver) window.requestAnimationFrame( animate );
}

animate();

function drawBoard() {
    renderer.clearColor();
    renderer.clearDepth(1.0);
    var gameboard = new THREE.Mesh(
        new THREE.PlaneGeometry(GRID_WIDTH, GRID_HEIGHT, Z
        ),
        new THREE.MeshBasicMaterial({color: 0x79818e})
    );
    gameboard.position.x = 6 - OFFSET;
    gameboard.position.y = -12 + OFFSET;
    scene.add(gameboard);
    renderer.dispose();
}

function setSpeedSlider(value) {
    document.getElementById('speedSlider').innerHTML = value;
    speed = document.getElementById('speedSlider').innerHTML;
}

function setHardModeOn(){
    if(hardMode === false) {
        hardMode = true;
        speed = 3;
        document.getElementById('speedSlider').innerHTML = speed;
        document.getElementById('button1').innerHTML = 'HARD MODE is ON';
        document.body.style.background = "url('res/b2.jpg')";
    }else{
        speed = 1;
        hardMode = false;
        document.getElementById('speedSlider').innerHTML = speed;
        document.getElementById('button1').innerHTML = 'HARD MODE is OFF';
        document.body.style.background = "url('res/b1.jpg')";
    }

}

function drawShape(shape, offset) {
    renderer.clearColor();
    renderer.clearDepth(1.0);
    shape.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                var cube = new THREE.Mesh(
                    new THREE.PlaneGeometry(BOX_SIZE, BOX_SIZE, Z
                    ),
                    new THREE.MeshBasicMaterial({color: colors[value]})
                );
                cube.position.x = x + offset.x;
                cube.position.y = - y - offset.y;
                scene.add(cube);
            }
        })
    });
    renderer.dispose();
}

function resetShape() {
    const types = 'TIOJLSZ';
    const supertypes = 'TIOJLSZFQP';
    if(hardMode === false) {
        actor.shape = createShape(types[types.length * Math.random() | 0]);
    }else if(hardMode === true){
        actor.shape = createShape(supertypes[supertypes.length * Math.random() | 0]);
    }
    actor.pos.y = -1;
    actor.pos.x = 6;
    if(collision(board,actor)){
        //board.forEach(row => row.fill(0));
        gameOver = true;
    }
}

function dropShape() {
    actor.pos.y++;
    if(collision(board,actor)){
        actor.pos.y--;
        join(board,actor);
        resetShape();
        collectRows();
        updateScore();
    }
    counter = 0;
}

function createBoard(width, height) {
    const board = [];
    while (height--){
        board.push(new Array(width).fill(0));
    }
    return board;
}

function join(board, actor){
    actor.shape.forEach((row, y) => {
        row.forEach((value, x) => {
            if(value !== 0){
                board[y +   actor.pos.y][x + actor.pos.x] = value;
            }
        })
    })
}

function collectRows() {
    let rowCount = 1;
    outer: for(let y = board.length - 1; y > 0; --y){
        for(let x = 0; x < board[y].length; ++x){
            if(board[y][x] === 0){
                continue outer;
            }
        }

        const row = board.splice(y, 1)[0].fill(0);
        board.unshift(row);
        ++y;

        actor.score += rowCount * 10;
    }
}

function collision(board, actor) {
    const [b, o] = [actor.shape, actor.pos];
    for(let y = 0; y < b.length; y++){
        for(let x = 0; x < b[y].length; ++x){
            if(b[y][x] !== 0 && (board[y + o.y] && board[y + o.y][x + o.x]) !== 0){
                return true;
            }
        }
    }
    return false;
}

function moveActor(direction) {
    actor.pos.x += direction;
    if(collision(board,actor)){
        actor.pos.x -= direction;
    }
}

function rotate(shape, direction) {
    for(let y = 0; y < shape.length; ++y){
        for(let x = 0; x < y; ++x){
            [   shape[x][y],
                shape[y][x],
            ] = [
                shape[y][x],
                shape[x][y]
            ];
        }
    }
    if(direction > 0) {
        shape.forEach(row => row.reverse())
    } else {
        shape.reverse();
    }
}

function rotateActor(direction) {
    let offset = 1;
    rotate(actor.shape, direction);
    while(collision(board, shape)){
        actor.pos.x += offset;
    }
}

function createShape(type){
    switch (type) {
        case 'T': return [
            [0, 0, 0],
            [0, 1, 0],
            [1, 1, 1],];
        case 'I': return [
            [0, 0, 0, 0],
            [2, 2, 2, 2],
            [0, 0, 0, 0],
            [0, 0, 0, 0],];
        case 'O': return [
            [0, 0, 0],
            [0, 3, 3],
            [0, 3, 3],];
        case 'J': return [
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [4, 0, 0, 0],
            [4, 4, 4, 4],];
        case 'L': return [
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 5],
            [5, 5, 5, 5],];
        case 'S': return [
            [0, 0, 0],
            [0, 6, 6],
            [6, 6, 0],];
        case 'Z': return [
            [0, 0, 0],
            [7, 7, 0],
            [0, 7, 7],];
        case 'F': return [
            [0, 0, 0, 0, 0],
            [8, 8, 8, 0, 0],
            [8, 0, 0, 0, 0],
            [8, 8, 0, 0, 0],
            [8, 0, 0, 0, 0],];
        case 'P': return [
            [0, 1, 0],
            [1, 1, 1],
            [0, 1, 0],];
        case 'Q': return [
            [0, 0, 0, 0],
            [9, 9, 9, 0],
            [9, 0, 9, 0],
            [9, 9, 9, 9],];
    }
}

function updateScore() {
    document.getElementById('score').innerText = "Score: " + actor.score;
}

updateScore();