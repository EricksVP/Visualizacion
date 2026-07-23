// airplane.js - Three.js 3D Airplane Render
document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('threejs-container-ANIMATION_2');
    if (!container) return;
    
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    // Configure renderer for better look
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    container.appendChild(renderer.domElement);
  
    function syncSize() {
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      if(w && h) {
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
          renderer.setSize(w, h);
      }
    }
    if (typeof ResizeObserver !== 'undefined') {
      new ResizeObserver(syncSize).observe(container);
    }
    syncSize();
  
    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
    directionalLight.position.set(10, 10, 10);
    scene.add(directionalLight);
    
    // Blue accent light
    const pointLight = new THREE.PointLight(0x7bd0ff, 2, 50);
    pointLight.position.set(0, -2, 5);
    scene.add(pointLight);
  
    // Airplane Construction (Sleek Modern Jet)
    const airplane = new THREE.Group();
    
    // Premium Aerospace Material
    const bodyMat = new THREE.MeshStandardMaterial({ 
        color: 0xE2E8F0, 
        metalness: 0.7, 
        roughness: 0.2 
    });
    const darkMat = new THREE.MeshStandardMaterial({ 
        color: 0x1E293B, 
        metalness: 0.8, 
        roughness: 0.1 
    });
    const engineGlow = new THREE.MeshStandardMaterial({
        color: 0x7bd0ff,
        emissive: 0x7bd0ff,
        emissiveIntensity: 2,
        toneMapped: false
    });
  
    // Fuselage (Body)
    const fuselageGeom = new THREE.CylinderGeometry(0.4, 0.4, 4, 32);
    fuselageGeom.rotateZ(Math.PI / 2);
    const fuselage = new THREE.Mesh(fuselageGeom, bodyMat);
    airplane.add(fuselage);
    
    // Nose cone
    const noseGeom = new THREE.ConeGeometry(0.4, 1.5, 32);
    noseGeom.rotateZ(-Math.PI / 2);
    noseGeom.translate(2.75, 0, 0);
    const nose = new THREE.Mesh(noseGeom, bodyMat);
    airplane.add(nose);
    
    // Cockpit window
    const cockpitGeom = new THREE.BoxGeometry(0.8, 0.2, 0.5);
    cockpitGeom.translate(2.2, 0.35, 0);
    const cockpit = new THREE.Mesh(cockpitGeom, darkMat);
    airplane.add(cockpit);
  
    // Delta Wings
    const wingShape = new THREE.Shape();
    wingShape.moveTo(0, 0);
    wingShape.lineTo(-1.5, 3.5);
    wingShape.lineTo(-2.0, 3.5);
    wingShape.lineTo(1.0, 0);
    wingShape.lineTo(0, 0);
    
    const extrudeSettings = { depth: 0.1, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: 0.02, bevelThickness: 0.02 };
    
    const rightWingGeom = new THREE.ExtrudeGeometry(wingShape, extrudeSettings);
    rightWingGeom.rotateX(Math.PI / 2);
    rightWingGeom.translate(0, 0.05, 0);
    const rightWing = new THREE.Mesh(rightWingGeom, bodyMat);
    airplane.add(rightWing);
    
    const leftWingGeom = new THREE.ExtrudeGeometry(wingShape, extrudeSettings);
    leftWingGeom.rotateX(-Math.PI / 2);
    leftWingGeom.translate(0, -0.05, 0);
    const leftWing = new THREE.Mesh(leftWingGeom, bodyMat);
    airplane.add(leftWing);
  
    // Tail Fin (Vertical Stabilizer)
    const tailShape = new THREE.Shape();
    tailShape.moveTo(0, 0);
    tailShape.lineTo(-1.2, 1.5);
    tailShape.lineTo(-1.5, 1.5);
    tailShape.lineTo(-0.5, 0);
    tailShape.lineTo(0, 0);
    
    const tailGeom = new THREE.ExtrudeGeometry(tailShape, extrudeSettings);
    tailGeom.translate(-1.5, 0.4, -0.05);
    const tail = new THREE.Mesh(tailGeom, bodyMat);
    airplane.add(tail);
    
    // Horizontal Stabilizers
    const hStabShape = new THREE.Shape();
    hStabShape.moveTo(0, 0);
    hStabShape.lineTo(-0.8, 1.5);
    hStabShape.lineTo(-1.0, 1.5);
    hStabShape.lineTo(0.2, 0);
    hStabShape.lineTo(0, 0);
    
    const rStabGeom = new THREE.ExtrudeGeometry(hStabShape, extrudeSettings);
    rStabGeom.rotateX(Math.PI / 2);
    rStabGeom.translate(-1.5, 0.05, 0);
    const rStab = new THREE.Mesh(rStabGeom, bodyMat);
    airplane.add(rStab);
    
    const lStabGeom = new THREE.ExtrudeGeometry(hStabShape, extrudeSettings);
    lStabGeom.rotateX(-Math.PI / 2);
    lStabGeom.translate(-1.5, -0.05, 0);
    const lStab = new THREE.Mesh(lStabGeom, bodyMat);
    airplane.add(lStab);
    
    // Engines
    const engineGeom = new THREE.CylinderGeometry(0.25, 0.25, 1.2, 32);
    engineGeom.rotateZ(Math.PI / 2);
    
    const rightEngine = new THREE.Mesh(engineGeom, darkMat);
    rightEngine.position.set(-0.5, -0.2, 1.2);
    airplane.add(rightEngine);
    
    const leftEngine = new THREE.Mesh(engineGeom, darkMat);
    leftEngine.position.set(-0.5, -0.2, -1.2);
    airplane.add(leftEngine);
    
    // Engine exhaust glow
    const exhaustGeom = new THREE.CylinderGeometry(0.2, 0.2, 0.1, 32);
    exhaustGeom.rotateZ(Math.PI / 2);
    
    const rightExhaust = new THREE.Mesh(exhaustGeom, engineGlow);
    rightExhaust.position.set(-1.15, -0.2, 1.2);
    airplane.add(rightExhaust);
    
    const leftExhaust = new THREE.Mesh(exhaustGeom, engineGlow);
    leftExhaust.position.set(-1.15, -0.2, -1.2);
    airplane.add(leftExhaust);
  
    scene.add(airplane);
    camera.position.z = 10;
    camera.position.y = 2;
    camera.lookAt(0, 0, 0);
  
    // Animation Loop
    function animate() {
        requestAnimationFrame(animate);
        
        const time = Date.now() * 0.001;
        
        // Smooth flying motion
        airplane.position.y = Math.sin(time * 1.5) * 0.3;
        airplane.position.z = Math.cos(time * 0.8) * 0.2;
        
        // Pitch and roll
        airplane.rotation.x = Math.sin(time * 0.7) * 0.15; // Roll
        airplane.rotation.y = Math.PI * 0.15; // Slight angle towards camera
        airplane.rotation.z = Math.cos(time * 1.2) * 0.05; // Pitch
        
        renderer.render(scene, camera);
    }
  
    window.addEventListener('resize', syncSize);
    animate();
});
