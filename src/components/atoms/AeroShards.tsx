'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export interface AeroShardsProps {
  backgroundColor?: string;
  shardColor?: string;
  accentColor?: string;
  placement?: 'full' | 'center';
  material?: string;
  detail?: string;
  effect?: string;
  flow?: string;
  rippleIntensity?: number;
  holdToGather?: boolean;
  scale?: number;
  spread?: number;
  depth?: number;
  speed?: number;
  spin?: number;
  interaction?: 'repel' | 'attract';
  density?: number;
  shardSize?: number;
  stretch?: number;
  turbulence?: number;
  glow?: number;
  edgeSoftness?: number;
  bloom?: number;
  grain?: number;
  chromaticAberration?: number;
  transitionDuration?: number;
  interactionRadius?: number;
  interactionStrength?: number;
  paused?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

export default function AeroShards({
  backgroundColor = 'transparent',
  shardColor = '#EC170F',
  accentColor = '#0B3B9B',
  speed = 1,
  spin = 1,
  interaction = 'repel',
  density = 1.5,
  shardSize = 1.1,
  interactionRadius = 2.5,
  interactionStrength = 0.8,
  paused = false,
  style,
  className,
}: AeroShardsProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.z = 12;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    if (backgroundColor !== 'transparent') {
      renderer.setClearColor(new THREE.Color(backgroundColor), 1);
    } else {
      renderer.setClearColor(0x000000, 0);
    }
    container.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 2.5);
    dirLight1.position.set(10, 20, 15);
    scene.add(dirLight1);

    const redPointLight = new THREE.PointLight(new THREE.Color(shardColor), 3, 20);
    redPointLight.position.set(-5, 5, 5);
    scene.add(redPointLight);

    const bluePointLight = new THREE.PointLight(new THREE.Color(accentColor), 3, 20);
    bluePointLight.position.set(5, -5, 5);
    scene.add(bluePointLight);

    // Shard Geometries (Low-poly 3D polyhedrons)
    const geometries = [
      new THREE.OctahedronGeometry(shardSize * 0.45, 0),
      new THREE.IcosahedronGeometry(shardSize * 0.4, 0),
      new THREE.TetrahedronGeometry(shardSize * 0.5, 0),
      new THREE.ConeGeometry(shardSize * 0.35, shardSize * 0.7, 4),
    ];

    // Colors matching brand palette
    const colorPalette = [
      new THREE.Color(shardColor),   // Crimson Red
      new THREE.Color(accentColor),  // Royal Blue
      new THREE.Color('#07060E'),    // Navy / Black Shard
      new THREE.Color('#2563EB'),    // Bright Blue
      new THREE.Color('#FF4D4D'),    // Coral Light Red
    ];

    // Create Shard Objects
    const shardCount = Math.floor(35 * density);
    const shards: Array<{
      mesh: THREE.Mesh;
      basePos: THREE.Vector3;
      velocity: THREE.Vector3;
      rotSpeed: THREE.Vector3;
      floatPhase: number;
    }> = [];

    const shardGroup = new THREE.Group();
    scene.add(shardGroup);

    for (let i = 0; i < shardCount; i++) {
      const geom = geometries[i % geometries.length];
      const color = colorPalette[i % colorPalette.length];

      const material = new THREE.MeshStandardMaterial({
        color: color,
        metalness: 0.35,
        roughness: 0.25,
        transparent: true,
        opacity: 0.35,
        flatShading: true,
      });

      const mesh = new THREE.Mesh(geom, material);

      // Wireframe overlay for HUD edge effect
      const wireGeo = new THREE.WireframeGeometry(geom);
      const wireMat = new THREE.LineBasicMaterial({
        color: i % 2 === 0 ? 0xffffff : 0xEC170F,
        transparent: true,
        opacity: 0.15,
      });
      const wireframe = new THREE.LineSegments(wireGeo, wireMat);
      mesh.add(wireframe);

      // Position shards strictly around perimeter to keep central content corridor clean
      let x = (Math.random() - 0.5) * 32;
      let y = (Math.random() - 0.5) * 22;
      if (Math.abs(x) < 11 && Math.abs(y) < 7.5) {
        x = x >= 0 ? 11 + Math.random() * 5 : -11 - Math.random() * 5;
        y = y >= 0 ? 7.5 + Math.random() * 4 : -7.5 - Math.random() * 4;
      }
      const z = -6 - Math.random() * 8;

      mesh.position.set(x, y, z);

      const randomScale = 0.4 + Math.random() * 0.45;
      mesh.scale.set(randomScale, randomScale, randomScale);

      mesh.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );

      shardGroup.add(mesh);

      shards.push({
        mesh,
        basePos: new THREE.Vector3(x, y, z),
        velocity: new THREE.Vector3(),
        rotSpeed: new THREE.Vector3(
          (Math.random() - 0.5) * 0.015 * spin,
          (Math.random() - 0.5) * 0.015 * spin,
          (Math.random() - 0.5) * 0.015 * spin
        ),
        floatPhase: Math.random() * Math.PI * 2,
      });
    }

    // Mouse Interaction Raycasting
    const mouse = new THREE.Vector2(-999, -999);
    const mouseWorld = new THREE.Vector3();
    const raycaster = new THREE.Raycaster();

    const handleMouseMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (paused) return;

      const elapsedTime = clock.getElapsedTime() * speed;

      // Update Mouse World Position at Z=0 plane
      raycaster.setFromCamera(mouse, camera);
      const targetZ = 0;
      const distance = (targetZ - camera.position.z) / raycaster.ray.direction.z;
      raycaster.ray.at(distance, mouseWorld);

      // Update Shards
      shards.forEach((shard) => {
        // Continuous float animation
        shard.floatPhase += 0.015 * speed;
        const floatY = Math.sin(shard.floatPhase) * 0.35;
        const floatX = Math.cos(shard.floatPhase * 0.7) * 0.25;

        const targetPos = shard.basePos.clone().add(new THREE.Vector3(floatX, floatY, 0));

        // Mouse Repel Physics
        if (mouse.x !== -999) {
          const distToMouse = shard.mesh.position.distanceTo(mouseWorld);
          if (distToMouse < interactionRadius) {
            const force = (1 - distToMouse / interactionRadius) * interactionStrength;
            const dir = shard.mesh.position.clone().sub(mouseWorld).normalize();

            if (interaction === 'repel') {
              shard.velocity.add(dir.multiplyScalar(force * 0.12));
            } else {
              shard.velocity.sub(dir.multiplyScalar(force * 0.12));
            }
          }
        }

        // Apply velocity with damping & spring back to base position
        shard.mesh.position.add(shard.velocity);
        shard.velocity.multiplyScalar(0.92); // Damping friction

        // Spring back to base position
        const spring = targetPos.sub(shard.mesh.position).multiplyScalar(0.03);
        shard.mesh.position.add(spring);

        // Rotation
        shard.mesh.rotation.x += shard.rotSpeed.x;
        shard.mesh.rotation.y += shard.rotSpeed.y;
        shard.mesh.rotation.z += shard.rotSpeed.z;
      });

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      geometries.forEach(g => g.dispose());
    };
  }, [backgroundColor, shardColor, accentColor, speed, spin, interaction, density, shardSize, interactionRadius, interactionStrength, paused]);

  return (
    <div
      ref={mountRef}
      className={className}
      style={{
        width: '100%',
        height: '100%',
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        zIndex: 0,
        ...style,
      }}
    />
  );
}
