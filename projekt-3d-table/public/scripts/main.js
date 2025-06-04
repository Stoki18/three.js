// main.js - Main script for the 3D Table Configurator

// For local development, you might install Three.js via npm:
// npm install three
// Then import modules like this:
// import * as THREE from 'three';
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// --- IMPORTS ---
// Import THREE from a CDN
import * as THREE from 'https://unpkg.com/three@latest/build/three.module.js';
// Import GLTFLoader for loading 3D models
import { GLTFLoader } from 'https://unpkg.com/three@latest/examples/jsm/loaders/GLTFLoader.js';
// Import OrbitControls for camera manipulation
import { OrbitControls } from 'https://unpkg.com/three@latest/examples/jsm/controls/OrbitControls.js';

// --- INITIALIZATION ---
// Get references to DOM elements
const canvas = document.getElementById('webgl-canvas');
const topSelect = document.getElementById('top-select');
const legsSelect = document.getElementById('legs-select');

// Create a new Three.js scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0f0f0f); // A light gray background

// Create a perspective camera
const camera = new THREE.PerspectiveCamera(
    75, // Field of View (FOV)
    window.innerWidth / window.innerHeight, // Aspect ratio
    0.1, // Near clipping plane
    1000 // Far clipping plane
);
camera.position.set(2, 2, 5); // Set initial camera position

// Create a WebGL renderer
const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
// Configure renderer for shadows
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Softer shadows

// Create OrbitControls for interactive camera movement
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Add damping for smoother camera movement
controls.dampingFactor = 0.05;
controls.screenSpacePanning = false;
controls.minDistance = 2; // Minimum zoom distance
controls.maxDistance = 10; // Maximum zoom distance
controls.maxPolarAngle = Math.PI / 2; // Prevent camera from going below ground

// --- LIGHTING ---
// Add hemisphere light for overall ambient illumination
const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1); // Sky color, ground color, intensity
scene.add(hemisphereLight);

// Add directional light for shadows and highlights
const directionalLight = new THREE.DirectionalLight(0xffffff, 1); // Color, intensity
directionalLight.position.set(5, 5, 5); // Position the light
directionalLight.castShadow = true; // Enable shadow casting for this light
// Configure shadow properties for the directional light
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;
directionalLight.shadow.camera.near = 0.5;
directionalLight.shadow.camera.far = 50;
scene.add(directionalLight);

// (Optional) Add a visual helper for the directional light's shadow camera
// const shadowHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
// scene.add(shadowHelper);

// --- MODEL LOADING ---
// Create an instance of GLTFLoader
const gltfLoader = new GLTFLoader();

// Store references to the currently loaded models
let currentTop = null;
let currentLegs = null;

/**
 * Loads a 3D model (GLTF format) into the scene.
 * @param {string} modelPath - The path to the .glb file (e.g., 'models/tops/wood.glb').
 * @param {string} type - The type of model being loaded ('top' or 'legs').
 */
function loadModel(modelPath, type) {
    // Determine which current model to update and its y-position
    let currentModelRef = type === 'top' ? currentTop : currentLegs;
    // Basic y-positioning; this might need adjustment based on your models' origins
    const yPosition = type === 'top' ? 0.5 : 0; // Example: top slightly above legs

    // If a model of this type already exists, remove it cleanly
    if (currentModelRef) {
        scene.remove(currentModelRef);
        currentModelRef.traverse(child => {
            if (child.isMesh) {
                child.geometry.dispose(); // Dispose of geometry
                child.material.dispose(); // Dispose of material
                if (child.material.map) child.material.map.dispose(); // Dispose textures
                if (child.material.metalnessMap) child.material.metalnessMap.dispose();
                if (child.material.normalMap) child.material.normalMap.dispose();
                if (child.material.roughnessMap) child.material.roughnessMap.dispose();
            }
        });
        if (type === 'top') currentTop = null;
        else currentLegs = null;
    }

    // Load the GLTF model
    gltfLoader.load(
        modelPath,
        // Called when the resource is loaded
        (gltf) => {
            const model = gltf.scene;
            model.position.y = yPosition; // Adjust y-position based on type

            // Enable shadow casting and receiving for all meshes in the model
            model.traverse(child => {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });

            scene.add(model); // Add the loaded model to the scene

            // Update the reference to the current model
            if (type === 'top') {
                currentTop = model;
            } else {
                currentLegs = model;
            }
            // Optional: Adjust model scale or position if needed
            // model.scale.set(0.5, 0.5, 0.5);
        },
        // Called while loading is progressing
        (xhr) => {
            console.log(`${type} model: ${(xhr.loaded / xhr.total * 100).toFixed(2)}% loaded`);
        },
        // Called when loading has errors
        (error) => {
            console.error(`Error loading ${type} model from ${modelPath}:`, error);
            // As a fallback, you could load a placeholder or show an error
            // For example, load a simple cube if a model fails:
            // const placeholder = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshStandardMaterial({ color: 0xff0000 }));
            // placeholder.position.y = yPosition;
            // scene.add(placeholder);
            // if (type === 'top') currentTop = placeholder; else currentLegs = placeholder;
        }
    );
}

// --- UI EVENT HANDLERS ---
// Event listener for table top selection changes
topSelect.addEventListener('change', (event) => {
    const selectedTop = event.target.value.toLowerCase();
    // Note: Actual .glb model files must exist at these paths
    const modelPath = `models/tops/${selectedTop}.glb`;
    loadModel(modelPath, 'top');
});

// Event listener for table legs selection changes
legsSelect.addEventListener('change', (event) => {
    const selectedLegs = event.target.value.toLowerCase();
    // Note: Actual .glb model files must exist at these paths
    const modelPath = `models/legs/${selectedLegs}.glb`;
    loadModel(modelPath, 'legs');
});

// --- INITIAL MODEL LOAD ---
// Function to load initial models based on default dropdown values
function loadInitialModels() {
    const initialTopValue = topSelect.value.toLowerCase();
    const initialLegsValue = legsSelect.value.toLowerCase();

    // Note: Ensure these .glb files exist in your models directory
    // For example, if default is 'Wood' and 'Classic':
    // models/tops/wood.glb
    // models/legs/classic.glb
    loadModel(`models/tops/${initialTopValue}.glb`, 'top');
    loadModel(`models/legs/${initialLegsValue}.glb`, 'legs');
}

// --- RESPONSIVENESS ---
// Function to handle window resize events
function onWindowResize() {
    // Update camera aspect ratio
    camera.aspect = window.innerWidth / window.innerHeight;
    // Update camera's projection matrix
    camera.updateProjectionMatrix();
    // Update renderer size
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Add event listener for window resize
window.addEventListener('resize', onWindowResize);

// --- ANIMATION LOOP ---
// Function to animate the scene
function animate() {
    // Request the next frame for smooth animation
    requestAnimationFrame(animate);

    // Update OrbitControls
    controls.update();

    // Render the scene with the camera
    renderer.render(scene, camera);
}

// --- SCRIPT EXECUTION ---
// Call onWindowResize initially to set the correct canvas size
onWindowResize();
// Load initial models when the script runs
loadInitialModels();
// Start the animation loop
animate();

console.log("3D Table Configurator script loaded and running.");
// Note: The actual .glb model files need to be present in the specified paths
// e.g., 'projekt-3d-table/public/models/tops/wood.glb'
// e.g., 'projekt-3d-table/public/models/legs/classic.glb'
// etc. for all options in the dropdowns.
// If models are not found, errors will be logged in the console by the GLTFLoader.
