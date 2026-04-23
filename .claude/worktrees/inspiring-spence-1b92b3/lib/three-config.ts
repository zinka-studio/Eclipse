import * as THREE from 'three';

/**
 * Create a Three.js scene with standard setup
 * @param container DOM element to attach renderer to
 * @param width Container width
 * @param height Container height
 */
export function createScene(container: HTMLElement, width: number, height: number) {
  // Scene
  const scene = new THREE.Scene();

  // Camera
  const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
  camera.position.z = 5;

  // Renderer
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(window.devicePixelRatio);
  container.appendChild(renderer.domElement);

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(5, 10, 7);
  scene.add(directionalLight);

  const fillLight = new THREE.DirectionalLight(0xffffff, 0.3);
  fillLight.position.set(-5, -10, -7);
  scene.add(fillLight);

  return { scene, camera, renderer };
}

/**
 * Handle window resize for Three.js renderer
 */
export function handleResize(
  camera: THREE.PerspectiveCamera,
  renderer: THREE.WebGLRenderer,
  container: HTMLElement
) {
  const width = container.clientWidth;
  const height = container.clientHeight;

  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
}

/**
 * Create a basic glass material (for cocktail glass)
 */
export function createGlassMaterial() {
  return new THREE.MeshPhysicalMaterial({
    color: 0x88ccff,
    metalness: 0.1,
    roughness: 0.1,
    transmission: 0.9,
    thickness: 2,
    envMapIntensity: 1,
  });
}

/**
 * Create a metallic material (for accents)
 */
export function createMetallicMaterial() {
  return new THREE.MeshStandardMaterial({
    color: 0xcccccc,
    metalness: 0.9,
    roughness: 0.1,
  });
}

/**
 * Animate a Three.js object with rotation
 */
export function animateRotation(object: THREE.Object3D, speed: number = 0.01) {
  object.rotation.x += speed;
  object.rotation.y += speed * 1.5;
  object.rotation.z += speed * 0.5;
}

