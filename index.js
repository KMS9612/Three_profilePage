import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { FontLoader } from "./node_modules/three/examples/jsm/Addons.js";

// 1. Scene
const scene = new THREE.Scene();

// 배경 텍스쳐
const texture_loader = new THREE.TextureLoader();
// let bgPath = texture_loader.load("./3d_model/room_bg.jpg");
let bgColor = new THREE.Color(0x000000);

// scene.background = bgPath;
scene.background = bgColor;

// 좌표계
const axes = new THREE.AxesHelper(10);
// scene.add(axes);

// 2. Camera
const camera = new THREE.PerspectiveCamera(
  50,
  window.innerWidth / window.innerHeight,
  1,
  1000
);

// Geometry, material, mesh
let loader = new GLTFLoader();
let filePath = "./3d_model/my_profile_main.glb";
loader.load(
  filePath,
  (gltf) => {
    scene.add(gltf.scene);
    gltf.scene.traverse(function (node) {
      if (node instanceof THREE.Mesh) {
        node.castShadow = true; // 이 메시는 그림자를 생성합니다.
        console.log(node);

        if (node.name === "큐브") {
          node.receiveShadow = true; // 이 메시는 그림자를 받습니다.
        }
      }
    });
  },
  function (xhr) {
    // 로딩 중일 때 실행할 코드 작성
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  },
  function (error) {
    // 로딩 실패 시 실행할 코드 작성
    console.error("Error loading glTF model:", error);
  }
);
const fontLoader = new FontLoader();

fontLoader.load(
  "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/fonts/helvetiker_regular.typeface.json",
  function (font) {
    const shapes = font.generateShapes("Welcome!", 10);
    const geometry = new THREE.ShapeGeometry(shapes);

    const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const mesh = new THREE.Mesh(geometry, material);

    scene.add(mesh);
  }
);

// 3. Render & Event
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
// 광원 및 그림자
renderer.shadowMap.enabled = true; // 그림자 허용
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // 그림자 유형 설정
// 컨트롤
const control = new OrbitControls(camera, renderer.domElement);
control.enableDamping = true;
camera.position.set(3, 20, 20);
control.target.set(0, 50, 0);
// control.enabled = false;

const light = new THREE.SpotLight(0xffffff, 300);
light.castShadow = true;
light.shadow.mapSize = new THREE.Vector2(1024, 1024);
light.position.set(-5, 20, 5);
scene.add(light);

// 첫 진입시 카메라 이동좌표 (위치, 시점)
const targetPosition = new THREE.Vector3(7, 13.5, 9);
const targetLookAt = new THREE.Vector3(2, 12, 0);
// 애니메이션
function animate() {
  camera.position.lerp(targetPosition, 0.02);
  control.target.lerp(targetLookAt, 0.02);

  control.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
});

document.body.appendChild(renderer.domElement);
animate();
