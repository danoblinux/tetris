var WIDTH = window.innerWidth,
    HEIGHT = window.innerHeight,
    VIEW_ANGLE = 75,
    BOX_SIZE = 10,
    Z = 0.01,
    GRID_WIDTH = 10,
    GRID_HEIGHT = 24,
    ASPECT = WIDTH / HEIGHT,
    NEAR = 0.1,
    FAR = 1000,
    OFFSET = BOX_SIZE / 2,
    SPEED = 0.8;

var gameOver = false;

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR );

var renderer = new THREE.WebGLRenderer({alpha: true});
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

/*var fillBoard = function () {
    for(var i = 0; i <= CUBE_SIZE * GRID_WIDTH; i+=CUBE_SIZE){
        for(var j = 0; j <= CUBE_SIZE * GRID_HEIGHT; j+=CUBE_SIZE){
            var cube = new THREE.Mesh( new THREE.CubeGeometry( CUBE_SIZE + i , CUBE_SIZE + j, Z ), new THREE.MeshBasicMaterial( { color: 0xffffff , wireframe: false} ));
            scene.add( cube );
        }
    }
};*/

//render grid board
var board = new THREE.Mesh(
    new THREE.CubeGeometry(
        GRID_WIDTH * BOX_SIZE, GRID_HEIGHT * BOX_SIZE, Z,
        GRID_WIDTH, GRID_HEIGHT, Z),
    new THREE.MeshBasicMaterial( { color: 0xffffff, wireframe: false } )
);
scene.add(board);

//test cube
var cube = new THREE.Mesh(
    new THREE.BoxGeometry(BOX_SIZE, BOX_SIZE, Z
        ),
    new THREE.MeshBasicMaterial( { color: 0x000000, wireframe: false } )
);
cube.position.y = 120 - BOX_SIZE / 2;
scene.add(cube);
var cube2 = new THREE.Mesh(
    new THREE.BoxGeometry(BOX_SIZE, BOX_SIZE, Z
    ),
    new THREE.MeshBasicMaterial( { color: 0x000000, wireframe: false } )
);
cube2.position.y = 120 - BOX_SIZE / 2;
cube2.position.x = 10;
var cube3 = new THREE.Mesh(
    new THREE.BoxGeometry(BOX_SIZE, BOX_SIZE, Z
    ),
    new THREE.MeshBasicMaterial( { color: 0x000000, wireframe: false } )
);
cube3.position.y = 120 - BOX_SIZE / 2;
cube3.position.x = 20;
scene.add(cube2);
scene.add(cube3);
camera.position.z = 180;

var animate = function () {

    cube.position.y -= SPEED;
    cube2.position.y -= SPEED;
    cube3.position.y -= SPEED;
    if(cube.position.y < -120 + OFFSET){
        cube.position.y = -120 + BOX_SIZE / 2;
    }
    if(cube2.position.y < -120 + OFFSET){
        cube2.position.y = -120 + BOX_SIZE / 2;
    }
    if(cube3.position.y < -120 + OFFSET){
        cube3.position.y = -120 + BOX_SIZE / 2;
    }
    renderer.render( scene, camera );
    if(!gameOver) window.requestAnimationFrame( animate );
};

animate();

if ( !window.requestAnimationFrame ) {
    window.requestAnimationFrame = ( function() {
        return window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function( /* function FrameRequestCallback */ callback, /* DOMElement Element */ element ) {
                window.setTimeout( callback, 1000 / 60 );
            };
    })();
}
