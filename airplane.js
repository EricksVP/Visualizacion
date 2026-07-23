// airplane.js - Three.js Low-Poly Geometric Airplane (BufferGeometry, r125+)
document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('threejs-container-ANIMATION_2');
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    function syncSize() {
        const w = container.clientWidth || window.innerWidth;
        const h = container.clientHeight || window.innerHeight;
        if (w && h) {
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);
        }
    }
    if (typeof ResizeObserver !== 'undefined') {
        new ResizeObserver(syncSize).observe(container);
    }
    syncSize();

    // ─── Lighting ───
    scene.add(new THREE.AmbientLight(0xffffff, 0.5));
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(8, 12, 10);
    scene.add(dirLight);
    const rimLight = new THREE.DirectionalLight(0x7bd0ff, 0.8);
    rimLight.position.set(-5, -3, -8);
    scene.add(rimLight);
    const underLight = new THREE.PointLight(0x7bd0ff, 1.5, 30);
    underLight.position.set(0, -4, 0);
    scene.add(underLight);

    // ─── Helper: build a BufferGeometry from triangles (flat-shaded) ───
    // verts = [[x,y,z], ...], faces = [[i0,i1,i2], ...]
    function buildGeo(verts, faces) {
        const positions = [];
        faces.forEach(f => {
            for (let i = 0; i < 3; i++) {
                const v = verts[f[i]];
                positions.push(v[0], v[1], v[2]);
            }
        });
        const geom = new THREE.BufferGeometry();
        geom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geom.computeVertexNormals();
        return geom;
    }

    // ─── Materials: flatShading gives the faceted polygon look ───
    const bodyMat = new THREE.MeshStandardMaterial({
        color: 0xE2E8F0, metalness: 0.55, roughness: 0.25, flatShading: true
    });
    const darkMat = new THREE.MeshStandardMaterial({
        color: 0x1E293B, metalness: 0.7, roughness: 0.15, flatShading: true
    });
    const accentMat = new THREE.MeshStandardMaterial({
        color: 0x7bd0ff, metalness: 0.6, roughness: 0.2, flatShading: true
    });
    const glowMat = new THREE.MeshStandardMaterial({
        color: 0x7bd0ff, emissive: 0x7bd0ff, emissiveIntensity: 3,
        toneMapped: false, flatShading: true
    });

    const airplane = new THREE.Group();

    // ─── Fuselage: octagonal prism ───
    const fuse = new THREE.CylinderBufferGeometry(0.45, 0.35, 5.0, 8);
    fuse.rotateZ(Math.PI / 2);
    airplane.add(new THREE.Mesh(fuse, bodyMat));

    // ─── Nose cone: 8-sided pyramid ───
    const noseG = new THREE.ConeBufferGeometry(0.45, 2.0, 8);
    noseG.rotateZ(-Math.PI / 2);
    noseG.translate(3.5, 0, 0);
    airplane.add(new THREE.Mesh(noseG, bodyMat));

    // ─── Tail cone ───
    const tcG = new THREE.ConeBufferGeometry(0.35, 1.2, 8);
    tcG.rotateZ(Math.PI / 2);
    tcG.translate(-3.1, 0, 0);
    airplane.add(new THREE.Mesh(tcG, bodyMat));

    // ─── Cockpit canopy (faceted dark) ───
    const cockpitV = [
        [2.8, 0.38, -0.28], [2.8, 0.38, 0.28],
        [3.6, 0.22, -0.14], [3.6, 0.22, 0.14],
        [3.0, 0.65, 0.0],   [3.5, 0.50, 0.0],
    ];
    const cockpitF = [
        [0,1,4],[1,5,4],[1,3,5],[0,4,2],[4,5,2],[2,5,3],[0,2,3],[0,3,1]
    ];
    airplane.add(new THREE.Mesh(buildGeo(cockpitV, cockpitF), darkMat));

    // ─── Main Wings: swept delta (polygon mesh) ───
    function makeWing(s) { // s = 1 right, -1 left
        const v = [
            [1.2, 0, 0.1*s],       // 0 root front
            [-1.0, 0, 0.1*s],      // 1 root back
            [-0.4, 0, 3.8*s],      // 2 tip back
            [0.4, 0, 3.5*s],       // 3 tip front
            [0.1, 0.14, 1.6*s],    // 4 upper mid
            [-0.2, -0.10, 2.0*s],  // 5 lower mid
        ];
        const f = [
            [0,3,4],[4,3,2],[4,2,1],[0,4,1],   // upper
            [0,5,3],[5,2,3],[5,1,2],[0,1,5],   // lower
        ];
        return new THREE.Mesh(buildGeo(v, f), bodyMat);
    }
    airplane.add(makeWing(1));
    airplane.add(makeWing(-1));

    // ─── Wing accent stripes ───
    function makeStripe(s) {
        const v = [
            [0.7, 0.15*s, 0.9*s],
            [-0.1, 0.15*s, 0.9*s],
            [-0.0, 0.15*s, 2.6*s],
            [0.3, 0.15*s, 2.4*s],
        ];
        const f = [[0,1,2],[0,2,3]];
        return new THREE.Mesh(buildGeo(v, f), accentMat);
    }
    airplane.add(makeStripe(1));
    airplane.add(makeStripe(-1));

    // ─── Vertical Tail Fin ───
    const tvV = [
        [-1.8, 0.35, -0.08], [-1.8, 0.35, 0.08],
        [-2.5, 0.35, -0.08], [-2.5, 0.35, 0.08],
        [-2.2, 2.1, -0.04],  [-2.2, 2.1, 0.04],
        [-2.8, 2.0, -0.04],  [-2.8, 2.0, 0.04],
    ];
    const tvF = [
        [0,1,5],[0,5,4],  // front
        [2,7,3],[2,6,7],  // back
        [0,4,6],[0,6,2],  // left
        [1,3,7],[1,7,5],  // right
        [4,5,7],[4,7,6],  // top
        [0,2,3],[0,3,1],  // bottom
    ];
    airplane.add(new THREE.Mesh(buildGeo(tvV, tvF), bodyMat));

    // Tail accent stripe
    const taV = [
        [-2.3, 1.2, 0.09], [-2.7, 1.2, 0.09],
        [-2.75, 2.0, 0.06], [-2.35, 1.9, 0.06],
    ];
    airplane.add(new THREE.Mesh(buildGeo(taV, [[0,1,2],[0,2,3]]), accentMat));

    // ─── Horizontal Stabilizers ───
    function makeHStab(s) {
        const v = [
            [-1.8, 0.3, 0.1*s],
            [-2.8, 0.3, 0.1*s],
            [-2.5, 0.3, 1.6*s],
            [-1.9, 0.3, 1.2*s],
            [-2.2, 0.40, 0.8*s],
        ];
        const f = [[0,3,4],[3,2,4],[4,2,1],[0,4,1],[0,1,2],[0,2,3]];
        return new THREE.Mesh(buildGeo(v, f), bodyMat);
    }
    airplane.add(makeHStab(1));
    airplane.add(makeHStab(-1));

    // ─── Engines: hexagonal prisms ───
    function makeEngine(zPos) {
        const g = new THREE.Group();
        // Nacelle
        const nac = new THREE.CylinderBufferGeometry(0.22, 0.28, 1.6, 6);
        nac.rotateZ(Math.PI / 2);
        g.add(new THREE.Mesh(nac, darkMat));
        // Intake ring
        const intG = new THREE.CylinderBufferGeometry(0.30, 0.30, 0.12, 6);
        intG.rotateZ(Math.PI / 2);
        const intake = new THREE.Mesh(intG, accentMat);
        intake.position.x = 0.85;
        g.add(intake);
        // Exhaust glow
        const exG = new THREE.CylinderBufferGeometry(0.18, 0.24, 0.15, 6);
        exG.rotateZ(Math.PI / 2);
        const exhaust = new THREE.Mesh(exG, glowMat);
        exhaust.position.x = -0.85;
        g.add(exhaust);
        // Pylon
        const pyV = [
            [0.3,0,-0.05],[0.3,0,0.05],[-0.3,0,0.05],[-0.3,0,-0.05],
            [0.2,0.25,-0.03],[0.2,0.25,0.03],[-0.2,0.25,0.03],[-0.2,0.25,-0.03],
        ];
        const pyF = [
            [0,1,5],[0,5,4],[2,3,7],[2,7,6],
            [1,2,6],[1,6,5],[0,4,7],[0,7,3],[4,5,6],[4,6,7],
        ];
        g.add(new THREE.Mesh(buildGeo(pyV, pyF), bodyMat));
        g.position.set(-0.2, -0.3, zPos);
        return g;
    }
    airplane.add(makeEngine(1.5));
    airplane.add(makeEngine(-1.5));

    // ─── Fuselage detail panels ───
    // Spine ridge
    const spV = [[2.0,0.46,0],[0.0,0.46,0],[-1.5,0.36,0],[0.0,0.52,0.05],[1.0,0.52,-0.05]];
    const spF = [[0,3,1],[1,3,2],[0,1,4],[4,1,2]];
    airplane.add(new THREE.Mesh(buildGeo(spV, spF), accentMat));

    // Belly
    const blV = [[1.5,-0.36,-0.2],[1.5,-0.36,0.2],[-0.5,-0.36,0.15],[-0.5,-0.36,-0.15],[0.5,-0.44,0]];
    const blF = [[0,1,4],[1,2,4],[2,3,4],[3,0,4]];
    airplane.add(new THREE.Mesh(buildGeo(blV, blF), darkMat));

    // ─── Add to scene ───
    scene.add(airplane);
    camera.position.set(6, 3, 8);
    camera.lookAt(0, 0, 0);

    // ─── Animation ───
    function animate() {
        requestAnimationFrame(animate);
        const t = Date.now() * 0.001;
        airplane.position.y = Math.sin(t * 1.2) * 0.25;
        airplane.position.x = Math.cos(t * 0.6) * 0.15;
        airplane.rotation.y += 0.004;           // slow spin to show facets
        airplane.rotation.x = Math.sin(t * 0.8) * 0.08;
        airplane.rotation.z = Math.cos(t * 1.0) * 0.04;
        renderer.render(scene, camera);
    }

    window.addEventListener('resize', syncSize);
    animate();
});
