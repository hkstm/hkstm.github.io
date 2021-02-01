// import * as THREE from './modules/three.module.js';
import * as THREE from 'https://unpkg.com/three@0.125.2/build/three.module.js'

THREE.Cache.enabled = true;

let container;
let camera, cameraTarget, scene, renderer, group;
let windowHalfX = window.innerWidth / 2;

container = document.createElement( 'div' );
document.body.appendChild( container );

camera = new THREE.PerspectiveCamera( 30, window.innerWidth / window.innerHeight, 1, 1000 );
camera.position.set( 0, 800, 800 );

cameraTarget = new THREE.Vector3( 0, window.innerHeight/2, 0 );

// SCENE
scene = new THREE.Scene();
scene.background = new THREE.Color( 0x000000 );
scene.fog = new THREE.Fog( 0xFFFF00, 250, 1000 );

group = new THREE.Group();
group.position.y = 700;
scene.add( group );

let targetRotation = 0;

// TEXT CONFIG

let text = "H K S T M",
    bevelEnabled = true;

const height = 20,
        size = 70,
        hover = 30,
        curveSegments = 10,
        bevelThickness = 1,
        bevelSize = 0.5;

group.add( createText(text, bevelEnabled, height, size, hover, curveSegments, bevelThickness, bevelSize) );

function createText(text, bevelEnabled, height, size, hover, curveSegments, bevelThickness, bevelSize) {

    const loader = new THREE.FontLoader();
    loader.load( 'fonts/optimer_bold.typeface.json', function ( font ) {
        let textMesh1, textGeo, materials;
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
        group.add(textMesh1);
    } );
}


function onWindowResize() {

    windowHalfX = window.innerWidth / 2;

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );
}
window.addEventListener( 'resize', onWindowResize );

function animate() {

    requestAnimationFrame( animate );
    targetRotation -= 0.01
    group.rotation.y += ( targetRotation - group.rotation.y ) * 0.02;

    // camera.lookAt( cameraTarget );

    renderer.clear();
    renderer.render( scene, camera );
}

renderer = new THREE.WebGLRenderer( { antialias: true } );
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight);
container.appendChild( renderer.domElement );

animate();