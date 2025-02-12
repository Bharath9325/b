import * as THREE from 'https://cdn.skypack.dev/three@0.129.0/build/three.module.js';
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js';
import { gsap } from 'https://cdn.skypack.dev/gsap';

const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.z = 5;

const scene = new THREE.Scene();
let bee;
let mixer;
const loader = new GLTFLoader();
loader.load('/demon_bee_full_texture.glb',
    function (gltf) {
        bee = gltf.scene;
        
        scene.add(bee);

        if (gltf.animations.length) {
            mixer = new THREE.AnimationMixer(bee);
            mixer.clipAction(gltf.animations[0]).play();
        }
        modelMove();
    },
    function (xhr) {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    function (error) {
        console.error("Error loading model:", error);
    }
);

const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('container3D').appendChild(renderer.domElement);

// Light
const ambientLight = new THREE.AmbientLight(0xffffff, 1.3);
scene.add(ambientLight);

const topLight = new THREE.DirectionalLight(0xffffff, 1);
topLight.position.set(10, 10, 10); // Adjusted position
scene.add(topLight);

const reRender3D = () => {
    requestAnimationFrame(reRender3D);
    renderer.render(scene, camera);
    if (mixer) mixer.update(0.02);
};
reRender3D();

let arrPositionModel = [
    {
        id: 'banner',
        position: { x: 2, y: -4, z: -6 }, // Adjusted position
        rotation: { x: 0, y: 1.5, z: 0 }
    },
    {
        id: "intro",
        position: { x: 1, y: -3, z: -5 }, // Adjusted position
        rotation: { x: 0.5, y: -0.5, z: 0 }
    },
    {
        id: "description",
        position: { x: -1.5, y: -1, z: -4 }, // Adjusted position
        rotation: { x: 0, y: 0.5, z: 0 }
    },
    {
        id: "contact",
        position: { x: 1, y: -1, z: -2 }, // Adjusted position
        rotation: { x: 0.3, y: -0.5, z: 0 }
    },
];

const modelMove = () => {
    const sections = document.querySelectorAll('.section');
    let currentSection;
    sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= window.innerHeight / 3) {
            currentSection = section.id;
        }
    });

    let position_active = arrPositionModel.findIndex(
        (val) => val.id === currentSection
    );
    if (position_active >= 0) {
        let new_coordinates = arrPositionModel[position_active];
        gsap.to(bee.position, {
            x: new_coordinates.position.x,
            y: new_coordinates.position.y,
            z: new_coordinates.position.z,
            duration: 3,
            ease: "power1.out"
        });
        gsap.to(bee.rotation, {
            x: new_coordinates.rotation.x,
            y: new_coordinates.rotation.y,
            z: new_coordinates.rotation.z,
            duration: 3,
            ease: "power1.out"
        });
    }
};

window.addEventListener('scroll', () => {
    if (bee) {
        modelMove();
    }
});

window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});
