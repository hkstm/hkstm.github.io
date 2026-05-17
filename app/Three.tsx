'use client';

import React, {MutableRefObject, useEffect, useRef, useState} from 'react'
// @ts-ignore
import {FontLoader} from 'three/addons/loaders/FontLoader.js';
// @ts-ignore
import {TextGeometry} from 'three/addons/geometries/TextGeometry.js';
import {ASCIIEffect, ASCIITexture, EffectComposer, EffectPass, RenderPass} from 'postprocessing';

import * as THREE from 'three'

const maxY = 100.1

const vertexShader = `
            varying vec3 positionVertex;
            void main() {
                positionVertex = position;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `

const fragmentShader = `
            uniform vec3 color1;
            uniform vec3 color2;
            varying vec3 positionVertex;
            void main() {
                gl_FragColor = vec4(mix(color1, color2, pow(positionVertex.y/${maxY}, 0.2)), 1.0);
            }
        `

const materialAHN2 = new THREE.ShaderMaterial({
    uniforms: {
        color1: {
            value: new THREE.Color(0x3e0466),
        },
        color2: {
            value: new THREE.Color(0xFFEF00)
        }
    },
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    side: THREE.DoubleSide
})


type RenderProps = {}

type TrackedObjects = {}

function Renderer(props: RenderProps) {
    const rendererDivRef = useRef() as MutableRefObject<HTMLDivElement>;
    const [trackedObjects, setTrackedObjects] = useState<TrackedObjects | null>(null)
    const [sceneLoaded, setSceneLoaded] = useState(false);


    useEffect(() => {
        const res = initScene(rendererDivRef)
        setSceneLoaded(true)
        setTrackedObjects(res.trackedObjects)


        return () => {
            res.cleanup()
        };
    }, []);

    const rendererDiv = <div ref={rendererDivRef}/>
    let spinnerImg = undefined
    if (!sceneLoaded) {
        spinnerImg = <img className={'my-8'} style={{
            display: "block",
            margin: "auto",
            width: "5%",
        }} src="/resources/spinner.svg" alt={"spinner"}/>
    }
    return (
        <div>
            {spinnerImg}
            {rendererDiv}
        </div>
    )
}

function initScene(ref: React.RefObject<HTMLElement>): { trackedObjects: TrackedObjects, cleanup: () => void } {
    const scene = new THREE.Scene()

    const fov = 35,
        aspect = window.innerWidth / window.innerHeight,
        near = 1,
        far = 1500

    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
    camera.position.set(0, 1300, 800)

    const group = new THREE.Group()
    group.position.y = 1000
    scene.add(group)

    const initialRotation = THREE.MathUtils.degToRad(60)
    let targetRotation = initialRotation

    const text = "H K S T M",
        height = 20,
        size = 60,
        hover = 30,
        curveSegments = 10,
        bevelThickness = 1,
        bevelSize = 0.5,
        bevelEnabled = true

    createText(text, bevelEnabled, height, size, hover, curveSegments, bevelThickness, bevelSize)
    group.rotation.y = initialRotation

    function createText(text: string, bevelEnabled: boolean, height: number, size: number, hover: number, curveSegments: number, bevelThickness: number, bevelSize: number) {
        THREE.Cache.enabled = true;
        const loader = new FontLoader(THREE.DefaultLoadingManager);
        loader.load('https://raw.githubusercontent.com/hkstm/hkstm.github.io/main/public/resources/optimer_bold.typeface.json',  // probably want to change this at some point and load font directly or at least cdn
// @ts-ignore
            function (font) {
                const textGeo = new TextGeometry(text, {
                    font: font,
                    size: size,
                    depth: height,
                    curveSegments: curveSegments,
                    bevelThickness: bevelThickness,
                    bevelSize: bevelSize,
                    bevelEnabled: bevelEnabled
                });

                textGeo.computeBoundingBox();

                const centerOffset = -0.5 * (textGeo.boundingBox.max.x - textGeo.boundingBox.min.x);

                const textMesh1 = new THREE.Mesh(textGeo, materialAHN2);

                textMesh1.position.x = centerOffset;
                textMesh1.position.y = hover + 80;
                textMesh1.position.z = 0;

                textMesh1.rotation.x = 0;
                textMesh1.rotation.y = Math.PI * 2;
                group.add(textMesh1);
            },
// @ts-ignore
            function (xhr) {
            },

// @ts-ignore
            function (err) {
            });
    }

    const htmlEl = ref.current
    if (htmlEl == null) {
        console.error("rendererDivRef is null; can't mount threejs renderer to it")
        return {
            trackedObjects: {},
            cleanup: () => {
            }
        }
    }

    function resize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        composer.setSize(window.innerWidth, window.innerHeight);
    }

    let animationFrameId = 0;
    let lastFrameTime = performance.now();
    function animate() {
        animationFrameId = requestAnimationFrame(animate);
        const currentFrameTime = performance.now();
        const delta = (currentFrameTime - lastFrameTime) / 1000;
        lastFrameTime = currentFrameTime;
        targetRotation -= 0.0025
        group.rotation.y += (targetRotation - group.rotation.y) * 0.02;
        camera.lookAt(new THREE.Vector3(0, 1000, 0))
        composer.render(delta);
    }

    const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: false,
        powerPreference: 'low-power',
    })
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.domElement.style.pointerEvents = 'none';
    htmlEl.appendChild(renderer.domElement)

    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));

    const asciiTexture = new ASCIITexture({
        characters: ".:,'-^=*+?!|0#X%WM@",
        font: 'Arial',
        fontSize: 64,
    });
    const asciiEffect = new ASCIIEffect({
        asciiTexture,
        cellSize: 16,
        color: '#FFEF00',
        inverted: false,
    });
    composer.addPass(new EffectPass(camera, asciiEffect));
    composer.setSize(window.innerWidth, window.innerHeight);

    window.addEventListener('resize', resize)
    animate()


    return {
        trackedObjects: {},
        cleanup: () => {
            cancelAnimationFrame(animationFrameId)
            window.removeEventListener('resize', resize)
            htmlEl.removeChild(renderer.domElement)
            composer.dispose()
            renderer.dispose()
        }
    }
}

export default Renderer