// import * as THREE from '../node_modules/three/src/Three.js';
import * as THREE from 'https://unpkg.com/three/build/three.module.js';

THREE.Cache.enabled = true;

let container;
let camera, cameraTarget, scene, renderer;
let group, textMesh1, textGeo, materials;
let windowHalfX = window.innerWidth / 2;

container = document.createElement( 'div' );
document.body.appendChild( container );

camera = new THREE.PerspectiveCamera( 30, window.innerWidth / window.innerHeight, 1, 1500 );
camera.position.set( 0, 400, 700 );

cameraTarget = new THREE.Vector3( 0, window.innerHeight/5, 0 );

// SCENE
console.log(window.innerHeight);
scene = new THREE.Scene();
scene.background = new THREE.Color( 0x000000 );
scene.fog = new THREE.Fog( 0xFFFF00, 250, 1400 );

// const dirLight = new THREE.DirectionalLight( 0xFFFF00, 0.125 );
// dirLight.position.set( 0, 0, 1 ).normalize();
// scene.add( dirLight );

// const pointLight = new THREE.PointLight( 0xFFFF00, 1.5 );
// pointLight.position.set( 0, 100, 90 );
// scene.add( pointLight );

renderer = new THREE.WebGLRenderer( { antialias: true } );
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
container.appendChild( renderer.domElement );

group = new THREE.Group();
group.position.y = 100;

let text = "H K S T M",
    bevelEnabled = true;

const height = 20,
        size = 70,
        hover = 30,
        curveSegments = 10,
        bevelThickness = 15,
        bevelSize = 1;

let targetRotation = 0;
let targetRotationOnPointerDown = 0;

let pointerX = 0;
let pointerXOnPointerDown = 0;


const loader = new THREE.FontLoader();

loader.load( 'fonts/optimer_bold.typeface.json', function ( font ) {

    textGeo = new THREE.TextGeometry( text, {

        font: font,

        size: size,
        height: height,
        curveSegments: curveSegments,

        bevelThickness: bevelThickness,
        bevelSize: bevelSize,
        bevelEnabled: true

    } );

    textGeo.computeBoundingBox();

    const centerOffset = - 0.5 * ( textGeo.boundingBox.max.x - textGeo.boundingBox.min.x );

    textMesh1 = new THREE.Mesh( textGeo, materials );

    textMesh1.position.x = centerOffset;
    textMesh1.position.y = hover+80;
    textMesh1.position.z = 0;

    textMesh1.rotation.x = 0;
    textMesh1.rotation.y = Math.PI * 2;

    group.add( textMesh1 );

} );

scene.add( group );



function onWindowResize() {

    windowHalfX = window.innerWidth / 2;

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );
}
window.addEventListener( 'resize', onWindowResize );

function onPointerDown( event ) {

    if ( event.isPrimary === false ) return;

    pointerXOnPointerDown = event.clientX - windowHalfX;
    targetRotationOnPointerDown = targetRotation;

    document.addEventListener( 'pointermove', onPointerMove );
    document.addEventListener( 'pointerup', onPointerUp );

}

function onPointerMove( event ) {

    if ( event.isPrimary === false ) return;

    pointerX = event.clientX - windowHalfX;

    targetRotation = targetRotationOnPointerDown + ( pointerX - pointerXOnPointerDown ) * 0.02;

}

function onPointerUp() {

    if ( event.isPrimary === false ) return;

    document.removeEventListener( 'pointermove', onPointerMove );
    document.removeEventListener( 'pointerup', onPointerUp );

}

// container.addEventListener( 'pointerdown', onPointerDown );

function animate() {

    requestAnimationFrame( animate );
    targetRotation -= 0.01
    group.rotation.y += ( targetRotation - group.rotation.y ) * 0.05;

    camera.lookAt( cameraTarget );

    renderer.clear();
    renderer.render( scene, camera );
}
animate();