// import * as THREE from '../node_modules/three/src/Three.js';
import * as THREE from 'https://unpkg.com/three/build/three.module.js';

// THREE.Cache.enabled = true;

let container, hex;

let camera, cameraTarget, scene, renderer;

let group, textMesh1, textMesh2, textGeo, materials, fontName, fontWeight, font;

let firstLetter = true;

const height = 20,
    size = 70,
    hover = 30,

    curveSegments = 4,

    bevelThickness = 2,
    bevelSize = 1.5;

const mirror = true;

const fontMap = {
    "optimer": 1,
};

const weightMap = {
    "bold": 1
};

const reverseFontMap = [];
const reverseWeightMap = [];

for ( const i in fontMap ) reverseFontMap[ fontMap[ i ] ] = i;
for ( const i in weightMap ) reverseWeightMap[ weightMap[ i ] ] = i;

let targetRotation = 0;
let targetRotationOnPointerDown = 0;

let pointerX = 0;
let pointerXOnPointerDown = 0;

let windowHalfX = window.innerWidth / 2;

let fontIndex = 1;

init();
animate();

function decimalToHex( d ) {

    let hex = Number( d ).toString( 16 );
    hex = "000000".substr( 0, 6 - hex.length ) + hex;
    return hex.toUpperCase();

}

function init() {
    container = document.createElement( 'div' );
    document.body.appendChild( container );

    // CAMERA

    camera = new THREE.PerspectiveCamera( 30, window.innerWidth / window.innerHeight, 1, 1500 );
    camera.position.set( 0, 400, 700 );

    cameraTarget = new THREE.Vector3( 0, 150, 0 );

    // SCENE

    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0x000013 );
    scene.fog = new THREE.Fog( 0x000000, 0, 1400 );

    // LIGHTS

    // const dirLight = new THREE.DirectionalLight( 0xffffff, 0.125 );
    // dirLight.position.set( 0, 0, 1 ).normalize();
    // scene.add( dirLight );

    const pointLight = new THREE.PointLight( 0xffffff, 1.5 );
    pointLight.position.set( 0, 100, 90 );
    scene.add( pointLight );

    // Get text from hash

    const hash = document.location.hash.substr( 1 );

    if ( hash.length !== 0 ) {

        const colorhash = hash.substring( 0, 6 );
        const fonthash = hash.substring( 6, 7 );
        const weighthash = hash.substring( 7, 8 );
        const bevelhash = hash.substring( 8, 9 );
        const texthash = hash.substring( 10 );

        hex = colorhash;
        pointLight.color.setHex( parseInt( colorhash, 16 ) );

        fontName = reverseFontMap[ parseInt( fonthash ) ];
        fontWeight = reverseWeightMap[ parseInt( weighthash ) ];

        bevelEnabled = parseInt( bevelhash );

        text = decodeURI( texthash );

    } else {

        pointLight.color.setHex(0xffff00);
        hex = decimalToHex( pointLight.color.getHex() );

    }

    materials = [
        new THREE.MeshPhongMaterial( { color: 0xffffff, flatShading: true } ), // front
        new THREE.MeshPhongMaterial( { color: 0xffffff } ) // side
    ];

    group = new THREE.Group();
    group.position.y = 100;

    scene.add( group );

    fontName = "optimer", // helvetiker, optimer, gentilis, droid sans, droid serif
    fontWeight = "bold"; // normal bold

    loadFont();
    // createText();

    const plane = new THREE.Mesh(
        new THREE.PlaneBufferGeometry( 10000, 10000 ),
        new THREE.MeshBasicMaterial( { color: 0xffffff, opacity: 0.5, transparent: true } )
    );
    plane.position.y = 100;
    plane.rotation.x = - Math.PI / 2;
    scene.add( plane );

    

    // RENDERER

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    container.appendChild( renderer.domElement );

    

    // EVENTS

    container.style.touchAction = 'none';
    container.addEventListener( 'pointerdown', onPointerDown, false );

    window.addEventListener( 'resize', onWindowResize, false );

}

function onWindowResize() {
    windowHalfX = window.innerWidth / 2;

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );
}

//

function boolToNum( b ) {
    return b ? 1 : 0;
}

function loadFont() {
    const loader = new THREE.FontLoader();
    loader.load( '../fonts/' + fontName + '_' + fontWeight + '.typeface.json', function ( response ) {
        font = response;
        createText();
        
    } );
}

function createText() {

    group.remove( textMesh1 );

    let text = "_hkstm",
    bevelEnabled = false,
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
    textGeo.computeVertexNormals();

    const triangle = new THREE.Triangle();

    // "fix" side normals by removing z-component of normals for side faces
    // (this doesn't work well for beveled geometry as then we lose nice curvature around z-axis)

    if ( ! bevelEnabled ) {

        const triangleAreaHeuristics = 0.1 * ( height * size );

        for ( let i = 0; i < textGeo.faces.length; i ++ ) {

            const face = textGeo.faces[ i ];

            if ( face.materialIndex == 1 ) {

                for ( let j = 0; j < face.vertexNormals.length; j ++ ) {

                    face.vertexNormals[ j ].z = 0;
                    face.vertexNormals[ j ].normalize();

                }

                const va = textGeo.vertices[ face.a ];
                const vb = textGeo.vertices[ face.b ];
                const vc = textGeo.vertices[ face.c ];

                const s = triangle.set( va, vb, vc ).getArea();

                if ( s > triangleAreaHeuristics ) {

                    for ( let j = 0; j < face.vertexNormals.length; j ++ ) {

                        face.vertexNormals[ j ].copy( face.normal );

                    }

                }

            }

        }

    }

    const centerOffset = - 0.5 * ( textGeo.boundingBox.max.x - textGeo.boundingBox.min.x );

    textGeo = new THREE.BufferGeometry().fromGeometry( textGeo );

    textMesh1 = new THREE.Mesh( textGeo, materials );

    textMesh1.position.x = centerOffset;
    textMesh1.position.y = hover;
    textMesh1.position.z = 0;

    textMesh1.rotation.x = 0;
    textMesh1.rotation.y = Math.PI * 2;

    group.add( textMesh1 );

}

function onPointerDown( event ) {

    if ( event.isPrimary === false ) return;

    pointerXOnPointerDown = event.clientX - windowHalfX;
    targetRotationOnPointerDown = targetRotation;

    document.addEventListener( 'pointermove', onPointerMove, false );
    document.addEventListener( 'pointerup', onPointerUp, false );

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

//

function animate() {

    requestAnimationFrame( animate );

    render();

}

function render() {

    group.rotation.y += ( targetRotation - group.rotation.y ) * 0.05;

    camera.lookAt( cameraTarget );

    renderer.clear();
    renderer.render( scene, camera );

}