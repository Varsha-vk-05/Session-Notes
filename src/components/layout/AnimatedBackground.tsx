import React, { useEffect, useRef, useState } from 'react';
import { getThemePreset, getAnimationsEnabled, subscribeToStorage, ThemePreset } from '../../services/storage';

interface Point3D {
  x: number;
  y: number;
  z: number;
  baseRadius: number;
  color: string;
  vx: number;
  vy: number;
  vz: number;
  alpha: number;
}

interface GeometricRing {
  x: number;
  y: number;
  z: number;
  radius: number;
  rotX: number;
  rotY: number;
  rotZ: number;
  speedX: number;
  speedY: number;
  speedZ: number;
  segments: number;
  color: string;
}

export const AnimatedBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [theme, setTheme] = useState<ThemePreset>(getThemePreset());
  const [animationsEnabled, setAnimations] = useState<boolean>(getAnimationsEnabled());
  const mouseRef = useRef<{ x: number; y: number; targetX: number; targetY: number }>({
    x: 0.5,
    y: 0.5,
    targetX: 0.5,
    targetY: 0.5,
  });

  useEffect(() => {
    return subscribeToStorage(() => {
      setTheme(getThemePreset());
      setAnimations(getAnimationsEnabled());
    });
  }, []);

  const getThemeConfig = (t: ThemePreset) => {
    switch (t) {
      case 'azure':
        return {
          bgGradient: ['#f8fbff', '#f0f7ff', '#eaf2ff'],
          orbs: [
            { color: 'rgba(56, 189, 248, 0.45)', x: 0.2, y: 0.15, z: -100, r: 0.45 },
            { color: 'rgba(99, 102, 241, 0.35)', x: 0.85, y: 0.2, z: 120, r: 0.4 },
            { color: 'rgba(14, 165, 233, 0.3)', x: 0.5, y: 0.75, z: -50, r: 0.45 },
            { color: 'rgba(129, 140, 248, 0.25)', x: 0.15, y: 0.85, z: 80, r: 0.35 },
          ],
          particleColors: [
            'rgba(56, 189, 248, 0.7)',
            'rgba(99, 102, 241, 0.6)',
            'rgba(14, 165, 233, 0.65)',
            'rgba(165, 180, 252, 0.7)',
          ],
          ringColors: ['rgba(56, 189, 248, 0.18)', 'rgba(99, 102, 241, 0.14)'],
        };
      case 'lavender':
        return {
          bgGradient: ['#faf8ff', '#f5f0ff', '#fdf2f8'],
          orbs: [
            { color: 'rgba(192, 132, 252, 0.4)', x: 0.2, y: 0.15, z: -80, r: 0.45 },
            { color: 'rgba(251, 113, 133, 0.35)', x: 0.8, y: 0.25, z: 100, r: 0.4 },
            { color: 'rgba(168, 85, 247, 0.3)', x: 0.55, y: 0.7, z: -40, r: 0.45 },
            { color: 'rgba(244, 114, 182, 0.28)', x: 0.15, y: 0.85, z: 70, r: 0.35 },
          ],
          particleColors: [
            'rgba(192, 132, 252, 0.7)',
            'rgba(244, 114, 182, 0.6)',
            'rgba(168, 85, 247, 0.6)',
            'rgba(251, 113, 133, 0.7)',
          ],
          ringColors: ['rgba(192, 132, 252, 0.18)', 'rgba(244, 114, 182, 0.14)'],
        };
      case 'sunlight':
        return {
          bgGradient: ['#fffbf5', '#fef7ee', '#fef3e2'],
          orbs: [
            { color: 'rgba(251, 191, 36, 0.45)', x: 0.18, y: 0.15, z: -90, r: 0.45 },
            { color: 'rgba(251, 146, 60, 0.35)', x: 0.82, y: 0.2, z: 110, r: 0.4 },
            { color: 'rgba(245, 158, 11, 0.3)', x: 0.5, y: 0.75, z: -60, r: 0.45 },
            { color: 'rgba(253, 186, 116, 0.3)', x: 0.12, y: 0.85, z: 80, r: 0.35 },
          ],
          particleColors: [
            'rgba(251, 191, 36, 0.7)',
            'rgba(251, 146, 60, 0.6)',
            'rgba(245, 158, 11, 0.6)',
            'rgba(253, 186, 116, 0.7)',
          ],
          ringColors: ['rgba(251, 191, 36, 0.18)', 'rgba(251, 146, 60, 0.14)'],
        };
      case 'mint':
      default:
        return {
          bgGradient: ['#f8fdfb', '#f0fdfa', '#e6fcf5'],
          orbs: [
            { color: 'rgba(45, 212, 191, 0.45)', x: 0.18, y: 0.15, z: -100, r: 0.45 },
            { color: 'rgba(56, 189, 248, 0.35)', x: 0.82, y: 0.2, z: 120, r: 0.4 },
            { color: 'rgba(52, 211, 153, 0.35)', x: 0.5, y: 0.75, z: -50, r: 0.45 },
            { color: 'rgba(20, 184, 166, 0.3)', x: 0.15, y: 0.85, z: 90, r: 0.35 },
          ],
          particleColors: [
            'rgba(45, 212, 191, 0.7)',
            'rgba(56, 189, 248, 0.6)',
            'rgba(52, 211, 153, 0.6)',
            'rgba(13, 148, 136, 0.6)',
          ],
          ringColors: ['rgba(45, 212, 191, 0.18)', 'rgba(56, 189, 248, 0.14)'],
        };
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.targetX = e.clientX / window.innerWidth;
      mouseRef.current.targetY = e.clientY / window.innerHeight;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    const config = getThemeConfig(theme);

    // 3D Spatial Particles in a sphere cube
    const pointCount = width < 640 ? 30 : 60;
    const points: Point3D[] = [];
    for (let i = 0; i < pointCount; i++) {
      points.push({
        x: (Math.random() - 0.5) * width * 1.3,
        y: (Math.random() - 0.5) * height * 1.3,
        z: (Math.random() - 0.5) * 600,
        baseRadius: Math.random() * 3.5 + 1.5,
        color: config.particleColors[Math.floor(Math.random() * config.particleColors.length)],
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        vz: (Math.random() - 0.5) * 0.8,
        alpha: Math.random() * 0.6 + 0.3,
      });
    }

    // 3D Floating Geometry Rings
    const rings: GeometricRing[] = [
      {
        x: width * 0.22,
        y: height * 0.28,
        z: -50,
        radius: width < 640 ? 110 : 180,
        rotX: 0.6,
        rotY: 0.3,
        rotZ: 0,
        speedX: 0.005,
        speedY: 0.008,
        speedZ: 0.004,
        segments: 18,
        color: config.ringColors[0],
      },
      {
        x: width * 0.78,
        y: height * 0.68,
        z: 50,
        radius: width < 640 ? 130 : 220,
        rotX: -0.4,
        rotY: 0.7,
        rotZ: 0.2,
        speedX: -0.006,
        speedY: 0.007,
        speedZ: -0.003,
        segments: 22,
        color: config.ringColors[1],
      },
    ];

    const fov = 500;
    let time = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse parallax lerp
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      const mouseOffset3DX = (mouseRef.current.x - 0.5) * 60;
      const mouseOffset3DY = (mouseRef.current.y - 0.5) * 60;

      // 1. Draw smooth base gradient
      const bgGrad = ctx.createLinearGradient(0, 0, width, height);
      bgGrad.addColorStop(0, config.bgGradient[0]);
      bgGrad.addColorStop(0.5, config.bgGradient[1]);
      bgGrad.addColorStop(1, config.bgGradient[2]);
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. Draw 3D Floating Ambient Light Spheres (with depth scaling)
      config.orbs.forEach((orb, idx) => {
        const moveScale = animationsEnabled ? 40 : 0;
        const orbDepth = orb.z + Math.sin(time * 0.001 + idx) * 30;
        const scale3D = fov / (fov + orbDepth);

        const orbScreenX = orb.x * width + Math.sin(time * 0.0008 + idx * 1.5) * moveScale + mouseOffset3DX * (1 / scale3D);
        const orbScreenY = orb.y * height + Math.cos(time * 0.001 + idx * 1.2) * moveScale + mouseOffset3DY * (1 / scale3D);
        const radius = Math.max(width, height) * orb.r * scale3D;

        const radial = ctx.createRadialGradient(orbScreenX, orbScreenY, 0, orbScreenX, orbScreenY, radius);
        radial.addColorStop(0, orb.color);
        radial.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.save();
        ctx.fillStyle = radial;
        ctx.fillRect(0, 0, width, height);
        ctx.restore();
      });

      // 3. Draw 3D Floating Geometric Rings
      rings.forEach((ring) => {
        if (animationsEnabled) {
          ring.rotX += ring.speedX;
          ring.rotY += ring.speedY;
          ring.rotZ += ring.speedZ;
        }

        const ringPoints: { sx: number; sy: number; z: number }[] = [];

        for (let i = 0; i <= ring.segments; i++) {
          const theta = (i / ring.segments) * Math.PI * 2;
          // Local circle coordinates
          let lx = Math.cos(theta) * ring.radius;
          let ly = Math.sin(theta) * ring.radius;
          let lz = 0;

          // Apply 3D Rotations (Euler angles)
          // Rotate X
          const y1 = ly * Math.cos(ring.rotX) - lz * Math.sin(ring.rotX);
          const z1 = ly * Math.sin(ring.rotX) + lz * Math.cos(ring.rotX);
          // Rotate Y
          const x2 = lx * Math.cos(ring.rotY) + z1 * Math.sin(ring.rotY);
          const z2 = -lx * Math.sin(ring.rotY) + z1 * Math.cos(ring.rotY);
          // Rotate Z
          const x3 = x2 * Math.cos(ring.rotZ) - y1 * Math.sin(ring.rotZ);
          const y3 = x2 * Math.sin(ring.rotZ) + y1 * Math.cos(ring.rotZ);

          const worldX = ring.x + x3 + mouseOffset3DX * 0.5;
          const worldY = ring.y + y3 + mouseOffset3DY * 0.5;
          const worldZ = ring.z + z2;

          const scale = fov / (fov + worldZ);
          const sx = worldX * scale + (1 - scale) * (width / 2);
          const sy = worldY * scale + (1 - scale) * (height / 2);

          ringPoints.push({ sx, sy, z: worldZ });
        }

        // Draw ring path in 3D
        ctx.save();
        ctx.beginPath();
        ctx.strokeStyle = ring.color;
        ctx.lineWidth = 1.8;
        ctx.setLineDash([8, 8]);
        for (let i = 0; i < ringPoints.length; i++) {
          const pt = ringPoints[i];
          if (i === 0) ctx.moveTo(pt.sx, pt.sy);
          else ctx.lineTo(pt.sx, pt.sy);
        }
        ctx.stroke();

        // Draw glowing vertex nodes on the 3D ring
        ringPoints.forEach((pt, i) => {
          if (i % 2 === 0) {
            ctx.fillStyle = ring.color.replace(/[\d.]+\)$/, '0.6)');
            ctx.beginPath();
            ctx.arc(pt.sx, pt.sy, 2.5, 0, Math.PI * 2);
            ctx.fill();
          }
        });
        ctx.restore();
      });

      // 4. Project and Draw 3D Spatial Particles
      const centerX = width / 2;
      const centerY = height / 2;

      // Project points from 3D space to 2D screen
      const projected = points.map((p) => {
        if (animationsEnabled) {
          p.x += p.vx;
          p.y += p.vy;
          p.z += p.vz;

          // Wrap 3D bounds
          const halfW = width * 0.7;
          const halfH = height * 0.7;
          if (p.x < -halfW) p.x = halfW;
          if (p.x > halfW) p.x = -halfW;
          if (p.y < -halfH) p.y = halfH;
          if (p.y > halfH) p.y = -halfH;
          if (p.z < -250) p.z = 250;
          if (p.z > 250) p.z = -250;
        }

        const scale = fov / (fov + p.z);
        const screenX = centerX + (p.x + mouseOffset3DX * 1.5) * scale;
        const screenY = centerY + (p.y + mouseOffset3DY * 1.5) * scale;
        const radius = Math.max(0.8, p.baseRadius * scale);
        const alpha = Math.min(1, Math.max(0.1, p.alpha * scale));

        return { screenX, screenY, radius, alpha, color: p.color, z: p.z };
      });

      // Sort by Z for proper 3D depth rendering
      projected.sort((a, b) => b.z - a.z);

      // Draw 3D connections
      for (let i = 0; i < projected.length; i++) {
        const p1 = projected[i];
        for (let j = i + 1; j < projected.length; j++) {
          const p2 = projected[j];
          const dist = Math.hypot(p1.screenX - p2.screenX, p1.screenY - p2.screenY);
          const maxDist = width < 640 ? 65 : 95;
          if (dist < maxDist) {
            ctx.save();
            ctx.globalAlpha = (1 - dist / maxDist) * 0.22 * Math.min(p1.alpha, p2.alpha);
            ctx.strokeStyle = p1.color;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(p1.screenX, p1.screenY);
            ctx.lineTo(p2.screenX, p2.screenY);
            ctx.stroke();
            ctx.restore();
          }
        }
      }

      // Draw 3D Particle nodes with specular glint
      projected.forEach((p) => {
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.screenX, p.screenY, p.radius, 0, Math.PI * 2);
        ctx.fill();

        // 3D Inner specular core for depth
        if (p.radius > 2) {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
          ctx.beginPath();
          ctx.arc(p.screenX - p.radius * 0.3, p.screenY - p.radius * 0.3, p.radius * 0.35, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      });

      if (animationsEnabled) {
        time += 1;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [theme, animationsEnabled]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 print:hidden" aria-hidden="true">
      {/* 3D Spatial Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />

      {/* 3D Isometric Grid Overlay with perspective feel */}
      <div
        className="absolute inset-0 bg-grid-pattern opacity-35 mix-blend-multiply"
        style={{
          transform: 'perspective(1000px) rotateX(15deg) scale(1.05)',
          transformOrigin: 'top center',
        }}
      />
    </div>
  );
};
