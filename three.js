class AtomicViewer {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.init();
    }

    init() {
        // Clear previous content
        this.container.innerHTML = "";

        // Create scene, camera, and renderer
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, this.container.clientWidth / this.container.clientHeight, 0.1, 1000);
        this.camera.position.set(0, 0, 20);

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.container.appendChild(this.renderer.domElement);

        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.screenSpacePanning = false;
        this.controls.minDistance = 5;
        this.controls.maxDistance = 50;

        // this.createAtom();
        // this.animate();
    }

    createAtom(data) {
        // Clear previous objects
        while (this.scene.children.length > 0) {
            this.scene.remove(this.scene.children[0]);
        }

        // Create nucleus based on atomic data
        const nucleusSize = Math.cbrt(data.atomicNumber) * 0.5; // Approximate size scaling
        const nucleusGeometry = new THREE.SphereGeometry(nucleusSize, 32, 32);
        const nucleusMaterial = new THREE.MeshBasicMaterial({ color: `#${data.cpkHexColor}`, wireframe: true });
        this.nucleus = new THREE.Mesh(nucleusGeometry, nucleusMaterial);
        this.scene.add(this.nucleus);

        // Create electrons based on electronic configuration
        this.electrons = [];
        const electronMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff });

        const createElectron = (radius, angle, speed) => {
            const electronGeometry = new THREE.SphereGeometry(0.3, 16, 16);
            const electron = new THREE.Mesh(electronGeometry, electronMaterial);
            this.scene.add(electron);
            this.electrons.push({ mesh: electron, radius, angle, speed });
        };

        // Approximate electron placement using atomic number
        for (let i = 0; i < data.atomicNumber; i++) {
            createElectron(3 + i % 3 * 2, Math.random() * Math.PI * 2, 0.01 + Math.random() * 0.02);
        }
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        this.controls.update();

        // Move electrons
        this.electrons.forEach(e => {
            e.angle += e.speed;
            e.mesh.position.x = e.radius * Math.cos(e.angle);
            e.mesh.position.y = e.radius * Math.sin(e.angle);
        });

        this.renderer.render(this.scene, this.camera);
    }
}

window.AtomicViewer = AtomicViewer;