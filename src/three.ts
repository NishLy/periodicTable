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
    angleX: number;
    angleY: number;
    speed: number;
    // orbitRing: THREE.Mesh;
    trail: THREE.Line;
    trailPositions: THREE.Vector3[];
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
    this.scene.background = new THREE.Color(0x354259);

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
      //   this.scene?.remove(e.orbitRing);
      this.scene?.remove(e.trail);
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

    const ringMaterial = new THREE.MeshBasicMaterial({
      color: 0x00ffff,
      transparent: true,
      opacity: 0.3,
      side: THREE.DoubleSide,
    });

    for (let i = 0; i < protons; i++) {
      const radius = 3 + (i % 3) * 1.5;
      const angleX = Math.random() * Math.PI * 2;
      const angleY = Math.random() * Math.PI * 2;
      const speed = 0.01 + Math.random() * 0.02;

      const electronGeometry = new THREE.SphereGeometry(0.3, 16, 16);
      const electron = new THREE.Mesh(electronGeometry, electronMaterial);
      this.scene!.add(electron);

      // //   // Electron Orbit Ring (Tilting with Electron Motion)
      // //   const ringGeometry = new THREE.RingGeometry(
      // //     radius - 0.1,
      // //     radius + 0.1,
      // //     64
      // //   );
      //   const orbitRing = new THREE.Mesh(ringGeometry, ringMaterial);
      //   this.scene!.add(orbitRing);

      // Create electron trail
      const trailPositions: THREE.Vector3[] = [];
      const trailGeometry = new THREE.BufferGeometry();
      const trailMaterial = new THREE.LineBasicMaterial({
        color: 0x00ffff,
        transparent: true,
        opacity: 0.5,
        blending: THREE.AdditiveBlending,
      });
      const trail = new THREE.Line(trailGeometry, trailMaterial);
      this.scene!.add(trail);

      this.electrons.push({
        mesh: electron,
        radius,
        angleX,
        angleY,
        speed,
        // orbitRing,
        trail,
        trailPositions,
      });
    }
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
      e.angleX += e.speed;
      e.angleY += e.speed * 0.7;

      const newPosition = new THREE.Vector3(
        e.radius * Math.cos(e.angleX),
        e.radius * Math.sin(e.angleY),
        e.radius * Math.sin(e.angleX) * Math.cos(e.angleY)
      );

      // Update electron position
      e.mesh.position.copy(newPosition);

      // Update trail
      e.trailPositions.push(newPosition.clone());

      // Limit trail length
      if (e.trailPositions.length > 150) {
        e.trailPositions.shift();
      }

      // Update trail geometry
      const trailGeometry = new THREE.BufferGeometry().setFromPoints(
        e.trailPositions
      );

      // Fade out trail points
      const positions = trailGeometry.getAttribute("position");
      const colors = new Float32Array(e.trailPositions.length * 3);

      e.trailPositions.forEach((pos, index) => {
        const fadeValue = index / e.trailPositions.length;
        colors[index * 3] = 0; // R
        colors[index * 3 + 1] = 1; // G
        colors[index * 3 + 2] = 1; // B
        trailGeometry.setAttribute(
          "color",
          new THREE.BufferAttribute(colors, 3)
        );
      });

      e.trail.geometry.dispose();
      e.trail.geometry = trailGeometry;
    });

    this.renderer.render(this.scene, this.camera);
  }
}

export default AtomicViewer;
