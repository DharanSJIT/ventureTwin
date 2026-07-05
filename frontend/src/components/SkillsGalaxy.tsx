import React, { useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Html, Line, Sphere } from '@react-three/drei';
import * as THREE from 'three';

// Helper to categorize skills into domains
const categorizeSkill = (skill: string) => {
  const lower = skill.toLowerCase();
  
  if (lower.match(/(react|vue|angular|html|css|tailwind|javascript|typescript|next\.js|frontend|ui|ux)/)) return 'Frontend';
  if (lower.match(/(node|express|django|flask|spring|python|java|c\+\+|backend|api|go|rust|ruby)/)) return 'Backend';
  if (lower.match(/(sql|postgres|mysql|mongo|redis|database|supabase|firebase)/)) return 'Database';
  if (lower.match(/(aws|azure|gcp|docker|kubernetes|devops|ci\/cd|cloud|linux)/)) return 'Cloud/DevOps';
  if (lower.match(/(ml|ai|data|machine learning|deep learning|pandas|numpy|tensorflow|pytorch)/)) return 'AI & Data';
  if (lower.match(/(algo|data structure|system design|architecture|security)/)) return 'Core CS';
  if (lower.match(/(agile|scrum|leadership|communication|management)/)) return 'Soft Skills';
  
  return 'Other Tools';
};

const DOMAIN_COLORS: Record<string, string> = {
  'Frontend': '#1d4ed8', // deep blue
  'Backend': '#2563eb', // bright blue
  'Database': '#3b82f6', // blue
  'Cloud/DevOps': '#60a5fa', // light blue
  'AI & Data': '#93c5fd', // lighter blue
  'Core CS': '#bfdbfe', // very light blue
  'Soft Skills': '#0369a1', // sky blue dark
  'Other Tools': '#0ea5e9'  // sky blue
};

function SkillNode({ position, label, color, isDomain = false }: any) {
  const [hovered, setHovered] = useState(false);
  const scale = isDomain ? 1.5 : 0.8;

  return (
    <group position={position}>
      <mesh
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        scale={hovered ? scale * 1.2 : scale}
      >
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial 
          color={color} 
          emissive={color}
          emissiveIntensity={hovered ? 0.8 : 0.2}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>
      
      {/* Label */}
      <Html distanceFactor={15} center>
        <div className={`
          px-2 py-1 rounded-md text-sm font-bold whitespace-nowrap transition-opacity duration-200 pointer-events-none
          ${hovered || isDomain ? 'opacity-100' : 'opacity-40'}
        `}
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          color: hovered ? '#1e3a8a' : color,
          border: `1px solid ${color}`,
          backdropFilter: 'blur(4px)',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
        }}>
          {label}
        </div>
      </Html>
    </group>
  );
}

function GalaxyScene({ skills }: { skills: string[] }) {
  const groupRef = useRef<THREE.Group>(null);
  
  // Slowly rotate the entire galaxy
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.001;
      groupRef.current.rotation.x += 0.0005;
    }
  });

  const { nodes, edges } = useMemo(() => {
    const nodes: any[] = [];
    const edges: any[] = [];
    
    // Central Node (User Core)
    nodes.push({
      id: 'center',
      position: [0, 0, 0],
      label: 'Core Skills',
      color: '#1e3a8a',
      isDomain: true
    });

    const domains = Array.from(new Set(skills.map(categorizeSkill)));
    
    // Distribute domains in a 3D sphere/circle
    const domainRadius = 15;
    domains.forEach((domain, i) => {
      // Golden spiral distribution for cool 3D look, or simple circle on XZ plane
      const angle = (i / domains.length) * Math.PI * 2;
      // alternate height to make it more 3D
      const height = Math.sin(angle * 2) * 5; 
      
      const dx = Math.cos(angle) * domainRadius;
      const dy = height;
      const dz = Math.sin(angle) * domainRadius;
      
      const domainColor = DOMAIN_COLORS[domain] || DOMAIN_COLORS['Other Tools'];
      const domainPos = new THREE.Vector3(dx, dy, dz);

      nodes.push({
        id: `domain-${domain}`,
        position: [dx, dy, dz],
        label: domain,
        color: domainColor,
        isDomain: true
      });
      
      edges.push({
        points: [[0, 0, 0], [dx, dy, dz]],
        color: '#bfdbfe',
        lineWidth: 1
      });

      // Find skills in this domain
      const domainSkills = skills.filter(s => categorizeSkill(s) === domain);
      
      // Place skills orbiting their domain
      const skillRadius = 6;
      domainSkills.forEach((skill, j) => {
        // Distribute around domain
        const phi = Math.acos(-1 + (2 * j) / domainSkills.length);
        const theta = Math.sqrt(domainSkills.length * Math.PI) * phi;
        
        const sx = dx + skillRadius * Math.cos(theta) * Math.sin(phi);
        const sy = dy + skillRadius * Math.sin(theta) * Math.sin(phi);
        const sz = dz + skillRadius * Math.cos(phi);
        
        nodes.push({
          id: `skill-${skill}`,
          position: [sx, sy, sz],
          label: skill,
          color: domainColor,
          isDomain: false
        });
        
        edges.push({
          points: [[dx, dy, dz], [sx, sy, sz]],
          color: domainColor,
          lineWidth: 0.5
        });
      });
    });

    return { nodes, edges };
  }, [skills]);

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      
      {edges.map((edge, i) => (
        <Line 
          key={`edge-${i}`} 
          points={edge.points as [number, number, number][]} 
          color={edge.color} 
          lineWidth={edge.lineWidth} 
          transparent
          opacity={0.3}
        />
      ))}

      {nodes.map((node) => (
        <SkillNode 
          key={node.id} 
          position={node.position} 
          label={node.label} 
          color={node.color} 
          isDomain={node.isDomain} 
        />
      ))}
    </group>
  );
}

export function SkillsGalaxy({ skills }: { skills: string[] }) {
  if (!skills || skills.length === 0) {
    return (
      <div className="w-full h-[600px] flex items-center justify-center bg-slate-900 rounded-xl border border-slate-800">
        <p className="text-slate-400">Add some skills to your profile to generate your 3D Galaxy!</p>
      </div>
    );
  }

  return (
    <div className="w-full h-[700px] bg-white rounded-xl border border-slate-200 overflow-hidden relative shadow-sm">
      <div className="absolute top-4 left-4 z-10 pointer-events-none">
        <h3 className="text-slate-900 font-bold text-lg flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-blue-600 animate-pulse"></span>
          Interactive 3D Universe
        </h3>
        <p className="text-slate-500 text-sm">Drag to rotate • Scroll to zoom</p>
      </div>
      
      <Canvas camera={{ position: [0, 10, 40], fov: 60 }}>
        <color attach="background" args={['#f8fafc']} />
        <GalaxyScene skills={skills} />
        <OrbitControls 
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          autoRotate={false}
          maxDistance={100}
          minDistance={10}
        />
      </Canvas>
    </div>
  );
}
