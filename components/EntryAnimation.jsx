"use client";
// ============================================================
// EntryAnimation.jsx
// Three.js 3D rotating tablet with glass-morphism MAHMOUD text.
// Transitions smoothly into the homepage on user interaction.
// Requires: npm install three @react-three/fiber @react-three/drei framer-motion
// ============================================================

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as THREE from "three";

// ─── Constants ───────────────────────────────────────────────
const COLORS = {
  bg: "#F5F5F7",          // Apple pearl white
  graphite: "#1D1D1F",    // Graphite
  paleGreen: "#E8F5E9",   // Accent
  glowBlue: "#0A84FF",    // Apple blue
  glowCyan: "#30D5C8",    // Accent glow
};

export default function EntryAnimation({ onComplete }) {
  const canvasRef  = useRef(null);
  const sceneRef   = useRef({});
  const [phase, setPhase] = useState("enter");   // "enter" | "idle" | "exit"
  const [showTap, setShowTap]   = useState(false);

  // ── Setup Three.js scene ────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type    = THREE.PCFSoftShadowMap;
    renderer.toneMapping       = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    // Scene
    const scene = new THREE.Scene();
    scene.background = null; // transparent; CSS handles the background

    // Camera — slight upward tilt for dramatic 3/4 view
    const camera = new THREE.PerspectiveCamera(
      40,
      canvas.clientWidth / canvas.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 0.8, 5);
    camera.lookAt(0, 0, 0);

    // ── Lights ─────────────────────────────────────────────────
    const ambient = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambient);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.8);
    keyLight.position.set(3, 5, 4);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(COLORS.glowCyan, 0.6);
    rimLight.position.set(-4, -1, -3);
    scene.add(rimLight);

    const fillLight = new THREE.PointLight(COLORS.glowBlue, 0.8, 12);
    fillLight.position.set(0, -2, 3);
    scene.add(fillLight);

    // ── Tablet Body ────────────────────────────────────────────
    // We build the tablet procedurally: a rounded box for the body + a bezel plane
    const bodyGeo = new THREE.BoxGeometry(2.6, 3.6, 0.08, 1, 1, 1);

    // Round the corners by manipulating the position attribute
    const pos = bodyGeo.attributes.position;
    const radius = 0.18;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      // Clamp corners towards center for a rounded look (simplified approach)
      const ax = Math.abs(x), ay = Math.abs(y);
      if (ax > 1.15 && ay > 1.65) {
        pos.setX(i, Math.sign(x) * (ax - radius * 0.3));
        pos.setY(i, Math.sign(y) * (ay - radius * 0.3));
      }
    }
    pos.needsUpdate = true;
    bodyGeo.computeVertexNormals();

    const bodyMat = new THREE.MeshPhysicalMaterial({
      color: 0x2A2A2C,          // Space Gray
      metalness: 0.75,
      roughness: 0.18,
      clearcoat: 0.9,
      clearcoatRoughness: 0.1,
      envMapIntensity: 1.4,
    });
    const tabletBody = new THREE.Mesh(bodyGeo, bodyMat);
    tabletBody.castShadow = true;
    scene.add(tabletBody);

    // ── Screen (slightly inset plane on front face) ─────────────
    const screenGeo = new THREE.PlaneGeometry(2.2, 3.1);
    const screenCanvas = document.createElement("canvas");
    screenCanvas.width  = 440;
    screenCanvas.height = 620;
    const ctx = screenCanvas.getContext("2d");

    function drawScreen(glowAlpha = 1) {
      // Background gradient — deep dark blue similar to provided images
      const bgGrad = ctx.createLinearGradient(0, 0, 440, 620);
      bgGrad.addColorStop(0, "#0D1B2A");
      bgGrad.addColorStop(1, "#112240");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, 440, 620);

      // Subtle grid lines
      ctx.strokeStyle = "rgba(30,100,200,0.12)";
      ctx.lineWidth = 1;
      for (let gx = 0; gx < 440; gx += 30) {
        ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, 620); ctx.stroke();
      }
      for (let gy = 0; gy < 620; gy += 30) {
        ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(440, gy); ctx.stroke();
      }

      // Glow halo behind text
      const halo = ctx.createRadialGradient(220, 290, 10, 220, 290, 160);
      halo.addColorStop(0, `rgba(10,132,255,${0.35 * glowAlpha})`);
      halo.addColorStop(1, "rgba(10,132,255,0)");
      ctx.fillStyle = halo;
      ctx.fillRect(0, 0, 440, 620);

      // Glass-morphism card
      ctx.save();
      ctx.globalAlpha = 0.18 * glowAlpha;
      ctx.fillStyle   = "#FFFFFF";
      const rx = 60, ry = 200, rw = 320, rh = 190, r = 24;
      ctx.beginPath();
      ctx.moveTo(rx + r, ry);
      ctx.lineTo(rx + rw - r, ry);
      ctx.quadraticCurveTo(rx + rw, ry, rx + rw, ry + r);
      ctx.lineTo(rx + rw, ry + rh - r);
      ctx.quadraticCurveTo(rx + rw, ry + rh, rx + rw - r, ry + rh);
      ctx.lineTo(rx + r, ry + rh);
      ctx.quadraticCurveTo(rx, ry + rh, rx, ry + rh - r);
      ctx.lineTo(rx, ry + r);
      ctx.quadraticCurveTo(rx, ry, rx + r, ry);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // Card border glow
      ctx.save();
      ctx.globalAlpha = 0.4 * glowAlpha;
      ctx.strokeStyle = `rgba(48,213,200,${glowAlpha})`;
      ctx.lineWidth   = 1.5;
      ctx.stroke();
      ctx.restore();

      // "MAHMOUD" text with electric glow
      ctx.save();
      ctx.globalAlpha = glowAlpha;
      ctx.textAlign    = "center";
      ctx.textBaseline = "middle";

      // Outer glow layers (paint multiple times with decreasing blur effect via shadow)
      for (let layer = 3; layer >= 0; layer--) {
        const blur  = [30, 18, 10, 0][layer];
        const alpha = [0.25, 0.4, 0.6, 1][layer];
        ctx.font        = `700 68px -apple-system, "SF Pro Display", sans-serif`;
        ctx.fillStyle   = `rgba(48,213,200,${alpha * glowAlpha})`;
        ctx.shadowColor = `rgba(10,132,255,${alpha * glowAlpha})`;
        ctx.shadowBlur  = blur;
        ctx.fillText("MAHMOUD", 220, 295);
      }
      ctx.restore();

      // Sub-label
      ctx.save();
      ctx.globalAlpha  = 0.7 * glowAlpha;
      ctx.font         = `400 18px -apple-system, "SF Pro Text", sans-serif`;
      ctx.fillStyle    = "rgba(200,230,255,0.9)";
      ctx.textAlign    = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("تقني في الثانوية", 220, 360);
      ctx.restore();

      // Bottom status bar
      ctx.save();
      ctx.globalAlpha  = 0.5 * glowAlpha;
      ctx.font         = "12px monospace";
      ctx.fillStyle    = "#4FC3F7";
      ctx.textAlign    = "center";
      ctx.fillText("● SECURE MODE ACTIVE", 220, 560);
      ctx.restore();
    }

    drawScreen();

    const screenTex = new THREE.CanvasTexture(screenCanvas);
    const screenMat = new THREE.MeshPhysicalMaterial({
      map: screenTex,
      metalness: 0,
      roughness: 0.05,
      transmission: 0.05,
    });
    const screen = new THREE.Mesh(screenGeo, screenMat);
    screen.position.z = 0.045;
    tabletBody.add(screen);

    // ── Particles (floating data dots) ─────────────────────────
    const particleCount = 120;
    const pGeo  = new THREE.BufferGeometry();
    const pPos  = new Float32Array(particleCount * 3);
    const pSizes = new Float32Array(particleCount);
    for (let i = 0; i < particleCount; i++) {
      pPos[i * 3]     = (Math.random() - 0.5) * 10;
      pPos[i * 3 + 1] = (Math.random() - 0.5) * 10;
      pPos[i * 3 + 2] = (Math.random() - 0.5) * 5;
      pSizes[i] = Math.random() * 3 + 1;
    }
    pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
    pGeo.setAttribute("size",     new THREE.BufferAttribute(pSizes, 1));
    const pMat = new THREE.PointsMaterial({
      color: 0x30D5C8,
      size: 0.04,
      transparent: true,
      opacity: 0.6,
      depthWrite: false,
    });
    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    // ── Shadow plane ────────────────────────────────────────────
    const shadowGeo  = new THREE.PlaneGeometry(8, 8);
    const shadowMat  = new THREE.ShadowMaterial({ opacity: 0.12 });
    const shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -2.5;
    shadowPlane.receiveShadow = true;
    scene.add(shadowPlane);

    // ── Animation loop ──────────────────────────────────────────
    let frameId;
    let elapsed = 0;
    let glowPhase = 0;

    const clock = new THREE.Clock();
    function animate() {
      frameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      elapsed    += delta;

      // Gentle continuous Y-rotation + slight tilt sway
      tabletBody.rotation.y = elapsed * 0.4;
      tabletBody.rotation.x = Math.sin(elapsed * 0.5) * 0.08;
      tabletBody.rotation.z = Math.sin(elapsed * 0.3) * 0.03;

      // Floating bob
      tabletBody.position.y = Math.sin(elapsed * 0.8) * 0.12;

      // Pulsing screen glow
      glowPhase += delta * 1.5;
      const glowAlpha = 0.75 + Math.sin(glowPhase) * 0.25;
      drawScreen(glowAlpha);
      screenTex.needsUpdate = true;

      // Slowly rotate particles
      particles.rotation.y += delta * 0.05;
      particles.rotation.x += delta * 0.02;

      // Pulse fill light
      fillLight.intensity = 0.5 + Math.sin(elapsed * 2) * 0.3;

      renderer.render(scene, camera);
    }
    animate();

    // ── Resize handler ──────────────────────────────────────────
    function onResize() {
      const w = canvas.clientWidth, h = canvas.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    }
    window.addEventListener("resize", onResize);

    // Show "tap to enter" hint after 1.5 s
    const hintTimer = setTimeout(() => setShowTap(true), 1500);

    // Store refs for cleanup
    sceneRef.current = { renderer, scene, camera, frameId };

    return () => {
      clearTimeout(hintTimer);
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
    };
  }, []);

  // ── Handle transition out ────────────────────────────────────
  function handleEnter() {
    if (phase !== "idle" && phase !== "enter") return;
    setPhase("exit");
    setTimeout(() => onComplete?.(), 900); // match exit animation duration
  }

  return (
    <AnimatePresence>
      {phase !== "done" && (
        <motion.div
          key="entry"
          className="entry-root"
          initial={{ opacity: 0 }}
          animate={{ opacity: phase === "exit" ? 0 : 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: "easeInOut" }}
          onClick={handleEnter}
          onAnimationComplete={() => {
            if (phase === "enter") setPhase("idle");
            if (phase === "exit") setPhase("done");
          }}
          style={{
            position: "fixed", inset: 0, zIndex: 9999,
            cursor: "pointer",
            background: "radial-gradient(ellipse at 50% 60%, #E8F5E9 0%, #F5F5F7 55%, #E8EDF2 100%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Three.js canvas */}
          <canvas
            ref={canvasRef}
            style={{ width: "100%", height: "100%", position: "absolute", inset: 0 }}
          />

          {/* Tap hint overlay */}
          <AnimatePresence>
            {showTap && phase !== "exit" && (
              <motion.div
                key="taphint"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5 }}
                style={{
                  position: "absolute",
                  bottom: "12%",
                  textAlign: "center",
                  pointerEvents: "none",
                  zIndex: 10,
                }}
              >
                <p style={{
                  fontFamily: "-apple-system, 'SF Pro Display', sans-serif",
                  fontSize: "clamp(13px, 1.8vw, 17px)",
                  color: "#1D1D1F",
                  letterSpacing: "0.12em",
                  opacity: 0.55,
                  textTransform: "uppercase",
                }}>
                  انقر للدخول &nbsp;·&nbsp; Tap to Enter
                </p>
                {/* Animated underline pulse */}
                <motion.div
                  animate={{ scaleX: [0.3, 1, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  style={{
                    height: 1,
                    background: "linear-gradient(90deg, transparent, #0A84FF, transparent)",
                    marginTop: 8,
                    borderRadius: 2,
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
