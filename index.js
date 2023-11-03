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

// click event
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// 마우스 클릭 시의 동작 정의
window.addEventListener("click", (event) => {
  // Normalize device coordinates (-1 to +1)
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  // calculate objects intersecting the picking ray
  const intersects = raycaster.intersectObjects(scene.children);

  for (let i = 0; i < intersects.length; i++) {
    let name = intersects[i].object.name;
    let target = intersects[i];
    if (name === "텍스트" || name === "큐브017") {
      lightOn(-2.6, 15, 0);
      window.open(
        "https://kimdev9612.notion.site/Front-End-ed91ed0ec9e44ac49e8f93ac975bb00f?pvs=4"
      );
    }
    if (name === "텍스트018" || name === "큐브018") {
      lightOn(3.8, 15, 0);
      window.open(
        "https://www.notion.so/kimdev9612/WorkOut-2fba2a6edc954cfe8670454f0f7ffaf6"
      );
    }
  }
});

function lightOn(x, y, z) {
  const light1 = new THREE.PointLight(0xfefd48, 50);
  light1.position.set(x, y, z);
  scene.add(light1);
  setTimeout(() => {
    scene.remove(light1);
  }, 1000);
}

// Geometry, material, mesh
let loader = new GLTFLoader();
let filePath = "/my_profile_main.glb";
loader.load(
  filePath,
  (gltf) => {
    scene.add(gltf.scene);
    gltf.scene.traverse(function (node) {
      if (node instanceof THREE.Mesh) {
        node.castShadow = true; // 이 메시는 그림자를 생성합니다.
        node.receiveShadow = true; // 이 메시는 그림자를 받습니다.
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
// 첫 진입 welcome (추후 로딩으로 변경)
const fontLoader = new FontLoader();
fontLoader.load(
  "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/fonts/helvetiker_regular.typeface.json",
  function (font) {
    const shapes = font.generateShapes("Welcome To My Personal Page", 10);
    const geometry = new THREE.ShapeGeometry(shapes);
    const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const mesh = new THREE.Mesh(geometry, material);

    mesh.scale.set(0.1, 0.1);
    mesh.position.set(-10, 50, 0);
    mesh.rotation.x = THREE.MathUtils.degToRad(45);
    mesh.rotation.z = THREE.MathUtils.degToRad(-7.2);
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
  setTimeout(() => {
    camera.position.lerp(targetPosition, 0.02);
    control.target.lerp(targetLookAt, 0.02);
  }, 2000);

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
