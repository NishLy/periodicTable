import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

interface AtomicElement {
  atomicNumber: number;
  atomicMass: string;
  cpkHexColor: string;
}

class AtomicViewer {
  private container: HTMLElement;
  private scene: THREE.Scene | null = null;
  private camera: THREE.PerspectiveCamera | null = null;
  private renderer: THREE.WebGLRenderer | null = null;
  private controls: OrbitControls | null = null;
  private nucleusGroup: THREE.Group | null = null;
  private electrons: {
    mesh: THREE.Mesh;
    radius: number;
    angle: number;
    speed: number;
    tiltAxis: THREE.Vector3;
    orbitRing: THREE.Object3D;
  }[] = [];

  constructor(containerId: string, modalId: string) {
    const containerElement = document.getElementById(containerId);
    if (!containerElement) {
      throw new Error(`Container element with ID "${containerId}" not found.`);
    }
    this.container = containerElement;
    this.init(modalId);
  }

  init(modalId: string) {
    const modal = document.getElementById(modalId);
    if (!modal) {
      throw new Error(`Modal element with ID "${modalId}" not found.`);
    }

    const observer = new MutationObserver(() => {
      if (getComputedStyle(modal).display !== "none") {
        observer.disconnect();
        this.setupScene();
        setTimeout(() => this.onResize(), 100);
      }
    });

    observer.observe(modal, {
      attributes: true,
      attributeFilter: ["style", "class"],
    });

    window.addEventListener("resize", () => this.onResize());
  }

  setupScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x222222);

    this.camera = new THREE.PerspectiveCamera(
      75,
      this.container.clientWidth / this.container.clientHeight,
      0.1,
      1000
    );
    this.camera.position.set(0, 0, 15);

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(
      this.container.clientWidth,
      this.container.clientHeight
    );
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.container.appendChild(this.renderer.domElement);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;

    const pointLight = new THREE.PointLight(0xffffff, 4);
    pointLight.position.set(10, 10, 10);
    this.scene.add(pointLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 2);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
    directionalLight.position.set(-5, 5, 5);
    this.scene.add(directionalLight);

    this.animate();
  }

  onResize() {
    if (!this.camera || !this.renderer) return;
    this.camera.aspect =
      this.container.clientWidth / this.container.clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(
      this.container.clientWidth,
      this.container.clientHeight
    );
  }

  createAtom(data: AtomicElement) {
    if (!this.scene) return;

    const protons = data.atomicNumber;
    const atomicMass = parseFloat(data.atomicMass);
    const neutrons = Math.round(atomicMass - protons);

    if (this.nucleusGroup) this.scene.remove(this.nucleusGroup);
    this.electrons.forEach((e) => {
      this.scene?.remove(e.mesh);
      this.scene?.remove(e.orbitRing);
    });
    this.electrons = [];

    this.nucleusGroup = new THREE.Group();
    this.scene.add(this.nucleusGroup);

    const nucleusSize = Math.cbrt(protons + neutrons) * 0.5;

    const protonMaterial = new THREE.MeshStandardMaterial({
      color: 0xff3333,
      metalness: 0.8,
      roughness: 0.2,
      emissive: 0xff4444,
      emissiveIntensity: 1.5,
    });

    const neutronMaterial = new THREE.MeshStandardMaterial({
      color: 0xaaaaaa,
      metalness: 0.8,
      roughness: 0.2,
      emissive: 0xbbbbbb,
      emissiveIntensity: 1.2,
    });

    for (let i = 0; i < protons + neutrons; i++) {
      const sphereGeometry = new THREE.SphereGeometry(0.3, 16, 16);
      const particle = new THREE.Mesh(
        sphereGeometry,
        i < protons ? protonMaterial : neutronMaterial
      );

      particle.position.set(
        (Math.random() - 0.5) * nucleusSize,
        (Math.random() - 0.5) * nucleusSize,
        (Math.random() - 0.5) * nucleusSize
      );

      this.nucleusGroup.add(particle);
    }

    const electronMaterial = new THREE.MeshStandardMaterial({
      color: 0x00aaff,
      metalness: 1,
      roughness: 0.1,
      emissive: 0x00ffff,
      emissiveIntensity: 2,
    });

    for (let i = 0; i < protons; i++) {
      const radius = 3 + (i % 3) * 1.5;
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.01 + Math.random() * 0.02;
      const tiltAxis = new THREE.Vector3(
        Math.random(),
        Math.random(),
        Math.random()
      ).normalize();

      const electronGeometry = new THREE.SphereGeometry(0.3, 16, 16);
      const electron = new THREE.Mesh(electronGeometry, electronMaterial);
      this.scene!.add(electron);

      const orbitRing = this.createOrbitRing(radius, tiltAxis);
      this.scene!.add(orbitRing);

      this.electrons.push({
        mesh: electron,
        radius,
        angle,
        speed,
        tiltAxis,
        orbitRing,
      });
    }
  }

  createOrbitRing(radius: number, tiltAxis: THREE.Vector3): THREE.Object3D {
    const ringSegments = 64;
    const ringGeometry = new THREE.BufferGeometry();
    const positions = [];

    for (let i = 0; i <= ringSegments; i++) {
      const theta = (i / ringSegments) * Math.PI * 2;
      positions.push(radius * Math.cos(theta), radius * Math.sin(theta), 0);
    }

    ringGeometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positions, 3)
    );

    const ringMaterial = new THREE.LineBasicMaterial({
      color: 0x00ffff,
      opacity: 0.5,
      transparent: true,
    });
    const orbitRing = new THREE.Line(ringGeometry, ringMaterial);

    const orbitGroup = new THREE.Object3D();
    orbitGroup.add(orbitRing);
    orbitGroup.rotation.set(
      Math.random() * Math.PI,
      Math.random() * Math.PI,
      Math.random() * Math.PI
    );

    return orbitGroup;
  }

  animate() {
    if (!this.renderer || !this.scene || !this.camera || !this.controls) return;
    requestAnimationFrame(() => this.animate());

    this.controls.update();

    if (this.nucleusGroup) {
      this.nucleusGroup.rotation.y += 0.005;
      this.nucleusGroup.rotation.x += 0.003;
    }

    this.electrons.forEach((e) => {
      e.angle += e.speed;
      e.mesh.position.set(
        e.radius * Math.cos(e.angle),
        e.radius * Math.sin(e.angle),
        0
      );
      e.mesh.position.applyAxisAngle(e.tiltAxis, Math.PI);
      e.orbitRing.rotation.copy(e.mesh.rotation);
    });

    this.renderer.render(this.scene, this.camera);
  }
}

export default AtomicViewer;
