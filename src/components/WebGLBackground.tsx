import { useEffect, useRef } from "react";
import { Renderer, Program, Mesh, Triangle } from "ogl";

/* ─── GLSL Simplex Noise ─── */
const VERT = /* glsl */`
attribute vec2 position;
varying vec2 vUv;
void main() {
  vUv = position * 0.5 + 0.5;
  gl_Position = vec4(position, 0.0, 1.0);
}`;

const FRAG = /* glsl */`
precision highp float;
uniform float uTime;
uniform float uScroll;
varying vec2 vUv;

vec3 mod289v3(vec3 x){return x - floor(x*(1./289.))*289.;}
vec2 mod289v2(vec2 x){return x - floor(x*(1./289.))*289.;}
vec3 permute3(vec3 x){return mod289v3(((x*34.)+10.)*x);}

float snoise(vec2 v){
  const vec4 C = vec4(0.211324865,0.366025404,-0.577350269,0.024390244);
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1  = (x0.x > x0.y) ? vec2(1.,0.) : vec2(0.,1.);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289v2(i);
  vec3 p = permute3(permute3(i.y + vec3(0.,i1.y,1.)) + i.x + vec3(0.,i1.x,1.));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.);
  m = m*m*m*m;
  vec3 xa = 2.*fract(p*C.www) - 1.;
  vec3 h  = abs(xa) - .5;
  vec3 ox = floor(xa + .5);
  vec3 a0 = xa - ox;
  m *= 1.79284291 - 0.85373472*(a0*a0 + h*h);
  vec3 g;
  g.x  = a0.x*x0.x + h.x*x0.y;
  g.yz = a0.yz*x12.xz + h.yz*x12.yw;
  return 130.*dot(m,g);
}

float fbm(vec2 p){
  float v=0.;
  float a=0.5;
  for(int i=0;i<4;i++){
    v += a * snoise(p);
    p  = p*2.1 + vec2(1.7,9.2);
    a *= 0.5;
  }
  return v;
}

void main(){
  vec2 uv = vUv;

  /* scroll-driven UV shift — background "moves" as you scroll */
  uv.y += uScroll * 0.4;
  uv.x += sin(uScroll * 3.14159) * 0.06;

  float t  = uTime * 0.06;
  float n1 = fbm(uv * 1.4 + vec2(t, t * 0.7));
  float n2 = fbm(uv * 2.8 - vec2(t * 0.6, t * 1.1));

  /* Base dark-plum colour */
  vec3 base   = vec3(0.216, 0.008, 0.235);   /* #37023c */
  vec3 darker = vec3(0.075, 0.002, 0.09);

  /* Accent colours — shift with scroll */
  float s = uScroll;
  vec3 pink   = vec3(0.910, 0.216, 0.675);   /* #E837AC  hero */
  vec3 orange = vec3(0.969, 0.545, 0.263);   /* #F78B43  inbox */
  vec3 yellow = vec3(0.969, 0.827, 0.373);   /* #F7D35F  matrix */

  /* Scroll-position blob weights */
  float pinkW   = (1.0 - s) * 0.12 + smoothstep(0.4,0.0,abs(s-0.15))*0.06;
  float orangeW = smoothstep(0.0,0.18,s) * smoothstep(0.6,0.35,s) * 0.10;
  float yellowW = smoothstep(0.5,0.75,s) * smoothstep(1.0,0.8, s) * 0.09;

  /* Noise-based blending */
  float nPos = max(0., n1) * 0.5 + max(0., n2) * 0.3;
  float nNeg = max(0., -n1) * 0.04;

  vec3 col = base;
  col = mix(col, darker, nNeg);
  col += pink   * pinkW   * (0.6 + nPos);
  col += orange * orangeW * (0.5 + nPos);
  col += yellow * yellowW * (0.4 + nPos);
  /* HARD brightness cap — the background can NEVER render light or white,
     no matter what the noise / scroll math produces. Keeps it premium-dark. */
  col  = clamp(col, vec3(0.0), vec3(0.40));

  gl_FragColor = vec4(col, 1.0);
}`;

export default function WebGLBackground() {
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const scrollNorm = useRef(0);
  const scrollSm   = useRef(0);
  const rafId      = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = new Renderer({ canvas, alpha: false, antialias: false, dpr: Math.min(window.devicePixelRatio, 1.5) });
    const gl = renderer.gl;

    const resize = () => {
      const w = Math.max(window.innerWidth, document.documentElement.clientWidth || 0, 320);
      const h = Math.max(window.innerHeight, document.documentElement.clientHeight || 0, 480);
      renderer.setSize(w, h);
    };
    resize();
    window.addEventListener("resize", resize);

    const geo     = new Triangle(gl);
    const program = new Program(gl, {
      vertex: VERT, fragment: FRAG,
      uniforms: { uTime: { value: 0 }, uScroll: { value: 0 } },
    });
    const mesh = new Mesh(gl, { geometry: geo, program });

    const onScroll = () => {
      const maxY = document.body.scrollHeight - window.innerHeight;
      scrollNorm.current = maxY > 0 ? window.scrollY / maxY : 0;
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    const start = performance.now();
    const loop = (now: number) => {
      rafId.current = requestAnimationFrame(loop);
      program.uniforms.uTime.value = (now - start) / 1000;
      /* lerp scroll for buttery smooth background movement */
      scrollSm.current += (scrollNorm.current - scrollSm.current) * 0.035;
      program.uniforms.uScroll.value = scrollSm.current;
      renderer.render({ scene: mesh });
    };
    rafId.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafId.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
      renderer.gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0, backgroundColor: "#14041b" }}
    />
  );
}
