// import * as THREE from '../node_modules/three/src/Three.js';
import * as THREE from 'https://unpkg.com/three/build/three.module.js';

let container;
let camera, cameraTarget, scene, renderer;
let group, textMesh1, textGeo, materials;
let windowHalfX = window.innerWidth / 2;

container = document.createElement( 'div' );
document.body.appendChild( container );

camera = new THREE.PerspectiveCamera( 30, window.innerWidth / window.innerHeight, 1, 1500 );
camera.position.set( 0, 400, 700 );

cameraTarget = new THREE.Vector3( 0, 150, 0 );

// SCENE

scene = new THREE.Scene();
scene.background = new THREE.Color( 0x000000 );
scene.fog = new THREE.Fog( 0xFFFF00, 250, 1400 );

renderer = new THREE.WebGLRenderer( { antialias: true } );
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
container.appendChild( renderer.domElement );

group = new THREE.Group();
group.position.y = 100;

let text = "HKSTM",
    bevelEnabled = true;

const height = 20,
        size = 70,
        hover = 30,
        curveSegments = 4,
        bevelThickness = 2,
        bevelSize = 1.5;

let targetRotation = 0;


const loader = new THREE.FontLoader();

loader.load( 'fonts/optimer_bold.typeface.json', function ( font ) {

    textGeo = new THREE.TextGeometry( text, {

        font: font,

        size: size,
        height: height,
        curveSegments: curveSegments,

        bevelThickness: bevelThickness,
        bevelSize: bevelSize,
        bevelEnabled: bevelEnabled

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



function animate() {

    requestAnimationFrame( animate );
    group.rotation.y += ( targetRotation - group.rotation.y ) * 0.05;

    camera.lookAt( cameraTarget );

    renderer.clear();
    renderer.render( scene, camera );
}
animate();