import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';

/* ================= DATA LAYER ================= */
export const SAMPLE = {
  R1: ['Dairy Rack', 'Front', ['Amul Milk 1L|Amul Gold Milk 1L|Mother Dairy Milk 1L|Nandini Milk 500ml', 'Amul Butter 100g|Amul Cheese Slices|Mother Dairy Paneer|Amul Ghee 500ml', 'Epigamia Greek Yogurt|Amul Masti Dahi|Amul Kool Lassi|Amul Cheese Cubes']],
  R4: ['Bakery Rack', 'Front', ['Britannia Bread|Harvest Gold Brown Bread|Modern Pav|English Oven Buns', 'Britannia Cake Rusk|Winkies Choco Cake|Monginis Muffin|Croissant 2pk', 'Bourbon Biscuits|Hide and Seek|Oreo Original|Marie Gold']],
  R2: ['Grocery Rack', 'Center', ['Aashirvaad Atta 5kg|India Gate Basmati 1kg|Tata Salt 1kg|Tata Sampann Toor Dal 1kg|Sugar 1kg', 'Saffola Gold Oil 1L|Dhara Mustard Oil 1L|Fortune Sunflower Oil 1L|Patanjali Ghee 1L|Fortune Soya Chunks 200g', 'MDH Garam Masala|Everest Turmeric Powder|Catch Red Chilli Powder|Tata Tea Gold 500g|Nescafe Classic 100g', 'Maggi Noodles 12pk|Kissan Tomato Ketchup|Parle-G Biscuits|Britannia Good Day|Sunfeast Dark Fantasy']],
  R5: ['Beverage Rack', 'Center', ['Coca-Cola 750ml|Pepsi 750ml|Sprite 750ml|Thums Up 750ml|Fanta 750ml', 'Real Fruit Juice 1L|Tropicana Orange 1L|Paper Boat Aamras|Frooti 600ml|Maaza 600ml', 'Bisleri Water 1L|Kinley Soda 750ml|Red Bull 250ml|Sting Energy 250ml|Amul Kool Milkshake']],
  R3: ['Snacks Rack', 'Back', ['Lays Classic Salted|Lays Magic Masala|Kurkure Masala Munch|Bingo Mad Angles', 'Haldiram Aloo Bhujia|Pringles Original|Doritos Nacho|Act II Popcorn']],
};

export async function sampleFetchMap(_storeId) {
  const racks = [], slots = [], products = [];
  let n = 0;
  Object.entries(SAMPLE).forEach(([code, [name, zone, rows]]) => {
    racks.push({
      rackCode: code,
      name,
      floor: 0,
      zone,
      totalRows: rows.length,
      totalColumns: rows[0].split('|').length,
      mapEnabled: true,
      mapOrientation: 'north'
    });
    rows.forEach((r, ri) => r.split('|').forEach((pn, ci) => {
      const id = 'sp_' + ++n, loc = `${code}-R${ri + 1}-C${ci + 1}`;
      products.push({ storeProductId: id, productName: pn, category: name.replace(' Rack', ''), imageUrl: '' });
      slots.push({ rackCode: code, rackName: name, rowNo: ri + 1, columnNo: ci + 1, shelfLevel: ri + 1, locationCode: loc, mapLabel: loc, storeProductId: id, productName: pn, highlightable: true });
    }));
  });
  return { racks, slots, products, mapData: {} };
}

/** Real Firestore reader: fetchMap={firestoreFetcher(db)} where db = getFirestore(app) */
export const firestoreFetcher = (db) => async (storeId) => {
  const { collection, getDocs } = await import('firebase/firestore');
  const read = async (n) => (await getDocs(collection(db, 'stores', storeId, n))).docs.map((d) => ({ id: d.id, ...d.data() }));
  const [racks, slots, products] = await Promise.all([read('racks'), read('slots'), read('products')]);
  return { racks, slots, products, mapData: {} };
};

/** Convert live in-memory store data (aisles, products, storeConfig) into 3D racks & slots */
export function buildMapFromStoreData(aisles = [], products = [], _storeConfig = {}) {
  if (!aisles || aisles.length === 0) return null;
  const racks = [], slots = [], prods = [];
  const zones = ['Front', 'Center', 'Back'];
  const total = aisles.length;

  aisles.forEach((aisle, idx) => {
    const rackCode = `R${idx + 1}`;
    const zoneIdx = total <= 2 ? 0 : Math.min(2, Math.floor((idx / total) * 3));
    const zone = zones[zoneIdx];
    const levels = aisle.levels || ['A', 'B', 'C', 'D'];
    const totalCols = levels.length || 4;
    const totalRows = 3; // 3 vertical shelf tiers per rack

    racks.push({
      rackCode,
      aisleId: aisle.id,
      name: `${aisle.name || `Row ${idx + 1}`} (${aisle.category || 'Goods'})`,
      floor: 0,
      zone,
      totalRows,
      totalColumns: totalCols,
      mapEnabled: true,
      mapOrientation: 'north'
    });

    const aisleProducts = products.filter((p) => p.aisleId === aisle.id);

    for (let r = 1; r <= totalRows; r++) {
      for (let c = 1; c <= totalCols; c++) {
        const levelCode = levels[c - 1] || 'A';
        const loc = `${rackCode}-R${r}-C${c}`;

        // Match product by shelfLevel or distribute aisle products
        let matched = aisleProducts.find((p) => p.shelfLevel === levelCode && !slots.some((s) => s.storeProductId === `sp_${p.id}_${loc}`));
        if (!matched && aisleProducts.length > 0) {
          const pIdx = ((r - 1) * totalCols + (c - 1)) % aisleProducts.length;
          matched = aisleProducts[pIdx];
        }

        if (matched) {
          const spId = `sp_${matched.id}_${loc}`;
          prods.push({
            storeProductId: spId,
            productName: matched.name,
            category: matched.category || aisle.category || 'General',
            imageUrl: matched.image && matched.image.startsWith('http') ? matched.image : '',
            icon: matched.image && !matched.image.startsWith('http') ? matched.image : null,
            price: matched.price,
            stock: matched.stock,
            brand: matched.brand
          });
          slots.push({
            rackCode,
            rackName: aisle.name || `Row ${idx + 1}`,
            rowNo: r,
            columnNo: c,
            shelfLevel: r,
            locationCode: loc,
            mapLabel: `${aisle.name} · Shelf ${levelCode}`,
            storeProductId: spId,
            productName: matched.name,
            highlightable: true
          });
        }
      }
    }
  });

  return { racks, slots, products: prods, mapData: {} };
}

export function useStoreMap(storeId, fetcher = sampleFetchMap, storeData = null, useDemoData = false) {
  const [s, set] = useState({ racks: [], slots: [], products: [], mapData: {}, loading: true, error: null });

  useEffect(() => {
    let ok = true;

    if (!useDemoData && storeData && storeData.aisles && storeData.aisles.length > 0) {
      const generated = buildMapFromStoreData(storeData.aisles, storeData.products, storeData.storeConfig);
      if (generated && generated.slots.length > 0) {
        set({ ...generated, loading: false, error: null });
        return;
      }
    }

    const runner = fetcher || sampleFetchMap;
    runner(storeId)
      .then((d) => ok && set({ ...d, loading: false, error: null }))
      .catch((e) => ok && set((p) => ({ ...p, loading: false, error: e.message })));

    return () => { ok = false; };
  }, [storeId, fetcher, storeData, useDemoData]);

  return s;
}

/* ================= MAP PROCESSING ================= */
const CW = 1.1, RH = .78, DP = .9, BASE = .18, ZONE_Z = { Front: 5, Center: 0, Back: -6 };
const SZ = { w: 26, d: 22 }, ENT = { x: 0, z: 10.4 };
const hs = (s) => { let h = 0; for (const c of (s || '')) h = (h * 31 + c.charCodeAt(0)) >>> 0; return h; };

function layoutRacks(racks) {
  const cnt = {}, out = {};
  racks.filter((r) => r.mapEnabled !== false).forEach((r) => {
    const i = (cnt[r.zone] = cnt[r.zone] || 0); cnt[r.zone]++;
    const w = (r.totalColumns || 4) * CW, side = i % 2 ? 1 : -1;
    out[r.rackCode] = { rack: r, w, h: BASE + (r.totalRows || 3) * RH, x: side * (3.5 + w / 2), z: (ZONE_Z[r.zone] ?? 0) - Math.floor(i / 2) * 3 };
  });
  return out;
}

const slotLocal = (r, s) => [(s.columnNo - (r.totalColumns + 1) / 2) * CW, BASE + (r.totalRows - s.rowNo) * RH];
const routeTo = (L, x) => {
  if (!L) return [];
  const az = L.z + 1.45;
  return [[ENT.x, ENT.z], [0, ENT.z - .6], [0, az], [x, az], [x, L.z + .8]].map(([a, b]) => new THREE.Vector3(a, .05, b));
};
const sph = (th, ph, r) => [r * Math.sin(ph) * Math.sin(th), r * Math.cos(ph), r * Math.sin(ph) * Math.cos(th)];
const homeGoal = () => ({ pos: new THREE.Vector3(...sph(.55, .95, 40)), target: new THREE.Vector3(0, 0, 0) });
const rackGoal = (L) => ({ pos: new THREE.Vector3(L.x + L.w * .15, L.h * .55 + 1.8, L.z + Math.max(7, L.w * 1.7)), target: new THREE.Vector3(L.x, L.h * .55, L.z) });

/* ================= PRODUCT IMAGES ================= */
const fbCache = new Map(), texCache = new Map();

function fallbackImg(p) {
  if (!p) return '';
  const k = p.productName || 'Product';
  if (fbCache.has(k)) return fbCache.get(k);

  const c = document.createElement('canvas'); c.width = 240; c.height = 186;
  const g = c.getContext('2d');
  if (!g) return '';

  const h = hs(k) % 360, gr = g.createLinearGradient(0, 0, 0, 186);
  gr.addColorStop(0, `hsl(${h},70%,62%)`);
  gr.addColorStop(1, `hsl(${(h + 40) % 360},65%,40%)`);
  g.fillStyle = gr;
  g.fillRect(0, 0, 240, 186);

  g.fillStyle = '#ffffffee';
  g.fillRect(16, 42, 208, 108);

  g.textAlign = 'center';
  g.fillStyle = '#fff';
  g.font = '600 15px sans-serif';
  g.fillText((p.category || 'Store Product').slice(0, 22), 120, 28);

  if (p.icon) {
    g.font = '36px sans-serif';
    g.fillText(p.icon, 120, 82);
    g.fillStyle = '#14212e';
    g.font = '700 15px sans-serif';
    g.fillText(k.slice(0, 20), 120, 122);
  } else {
    g.fillStyle = '#14212e';
    g.font = '700 20px sans-serif';
    const lines = [];
    let cur = '';
    k.split(' ').forEach((w) => {
      const t = cur ? cur + ' ' + w : w;
      if (g.measureText(t).width > 190 && cur) {
        lines.push(cur);
        cur = w;
      } else {
        cur = t;
      }
    });
    lines.push(cur);
    lines.slice(0, 3).forEach((l, i) => g.fillText(l, 120, 80 + i * 26 - (Math.min(lines.length, 3) - 1) * 10));
  }

  const u = c.toDataURL();
  fbCache.set(k, u);
  return u;
}

const imgOf = (p) => (p && p.imageUrl) || fallbackImg(p);

function getTex(url) {
  if (!url) return null;
  if (!texCache.has(url)) {
    const t = new THREE.TextureLoader().setCrossOrigin('anonymous').load(url);
    t.colorSpace = THREE.SRGBColorSpace;
    texCache.set(url, t);
  }
  return texCache.get(url);
}

function useProductTexture(p) {
  const [t, setT] = useState(() => getTex(imgOf(p)));
  useEffect(() => {
    if (!p || !p.imageUrl) return;
    let ok = true;
    new THREE.TextureLoader().setCrossOrigin('anonymous').load(p.imageUrl, (x) => {
      x.colorSpace = THREE.SRGBColorSpace;
      if (ok) setT(x);
    }, undefined, () => {});
    return () => { ok = false; };
  }, [p?.imageUrl]);
  return t;
}

/* ================= 3D COMPONENTS ================= */
const Box = ({ s, c, p, o, ...r }) => (
  <mesh position={p} castShadow receiveShadow {...r}>
    <boxGeometry args={s} />
    <meshStandardMaterial color={c} roughness={.7} transparent={o != null} opacity={o ?? 1} depthWrite={o == null} />
  </mesh>
);

const StoreFloor = () => (
  <group>
    <Box s={[SZ.w, .2, SZ.d]} c="#e9edf1" p={[0, -.1, 0]} castShadow={false} />
    {[['Front', '#dff0e6'], ['Center', '#e0e9f5'], ['Back', '#f4ecdc']].map(([z, c]) => (
      <Box key={z} s={[SZ.w - 1, .02, 6]} c={c} p={[0, .01, ZONE_Z[z] + .4]} castShadow={false} />
    ))}
    <gridHelper args={[SZ.w, SZ.w, '#cdd6de', '#d6dde4']} position={[0, .03, 0]} />
  </group>
);

const StoreWalls = () => (
  <group>
    <Box s={[SZ.w, 3, .25]} c="#f8fafc" o={.8} p={[0, 1.5, -SZ.d / 2]} />
    <Box s={[.25, 3, SZ.d]} c="#f8fafc" o={.8} p={[-SZ.w / 2, 1.5, 0]} />
    <Box s={[.25, .9, SZ.d]} c="#f8fafc" o={.6} p={[SZ.w / 2, .45, 0]} />
    {[-1, 1].map((s) => (
      <Box key={s} s={[SZ.w / 2 - 2, .9, .25]} c="#f8fafc" o={.6} p={[s * (SZ.w / 4 + 1), .45, SZ.d / 2]} />
    ))}
  </group>
);

const Entrance = () => (
  <group>
    <Box s={[4, .03, 2]} c="#2fa36b" p={[0, .04, SZ.d / 2 - 1]} castShadow={false} />
    {[-2, 2].map((x) => <Box key={x} s={[.2, 2.4, .3]} c="#0b6e4f" p={[x, 1.2, SZ.d / 2]} />)}
    <Box s={[4.2, .25, .3]} c="#0b6e4f" p={[0, 2.4, SZ.d / 2]} />
    <Html position={[0, 2.9, SZ.d / 2]} center style={{ pointerEvents: 'none' }}>
      <div className="bc-lab bc-pill">Entrance</div>
    </Html>
  </group>
);

const CheckoutArea = () => (
  <group>
    {[6.5, 9, 11.5].map((x) => (
      <group key={x}>
        <Box s={[1.7, .9, .8]} c="#3a4756" p={[x, .45, 9]} />
        <Box s={[1.7, .06, .8]} c="#dfe5ea" p={[x, .93, 9]} />
        <Box s={[.35, .3, .05]} c="#1f2933" p={[x + .5, 1.2, 8.75]} />
      </group>
    ))}
    <Html position={[9, 1.7, 9]} center style={{ pointerEvents: 'none' }}>
      <div className="bc-lab bc-pill">Checkout</div>
    </Html>
  </group>
);

function Product3D({ slot, product, pos, dim, onPick }) {
  const tex = useProductTexture(product);
  if (!product) return null;
  return (
    <mesh position={pos} castShadow onClick={(e) => { e.stopPropagation(); if (e.delta < 6) onPick(slot.locationCode); }}>
      <boxGeometry args={[.8, .62, .14]} />
      {[0, 1, 2, 3, 5].map((i) => <meshStandardMaterial key={i} attach={`material-${i}`} color={dim ? '#9aa4ad' : '#eef1f4'} />)}
      <meshStandardMaterial attach="material-4" map={tex} color={dim ? '#8d98a3' : '#ffffff'} roughness={.6} />
    </mesh>
  );
}

function Shelf3D({ w, y, opacity, color }) {
  return <Box s={[w, .07, DP]} c={color} o={opacity} p={[0, y, 0]} />;
}

function Rack3D({ L, slots, prod, dim, active, onRack, onSlot }) {
  const r = L.rack, c = active ? '#ffd9a0' : '#8d9aa8', o = dim ? .35 : 1;
  const click = (e) => { e.stopPropagation(); if (e.delta < 6) onRack(r.rackCode); };
  return (
    <group position={[L.x, 0, L.z]}>
      <group onClick={click}>
        {[-1, 1].map((s) => <Box key={s} s={[.07, L.h, DP]} c={c} o={o} p={[s * L.w / 2, L.h / 2, 0]} />)}
        <Box s={[L.w, L.h, .04]} c={c} o={o} p={[0, L.h / 2, -DP / 2 + .02]} />
        {Array.from({ length: (r.totalRows || 3) + 1 }, (_, k) => <Shelf3D key={k} w={L.w} y={BASE + k * RH} color={c} opacity={o} />)}
      </group>
      {slots.map((s) => {
        const [x, yc] = slotLocal(r, s);
        return <Product3D key={s.locationCode} slot={s} product={prod[s.storeProductId]} pos={[x, yc - RH / 2 + .035 + .31, .2]} dim={dim} onPick={onSlot} />;
      })}
    </group>
  );
}

function RackLabel({ L, dim }) {
  return (
    <Html position={[L.x, L.h + .35, L.z]} center style={{ pointerEvents: 'none' }}>
      <div className={'bc-lab' + (dim ? ' bc-dim' : '')}>
        <b>{L.rack.rackCode}</b>{L.rack.name.replace(' Rack', '')}
      </div>
    </Html>
  );
}

function ProductHighlight({ L, slot, product }) {
  const m = useRef(), e = useRef();
  const r = L?.rack;
  if (!r || !product) return null;
  const [x, yb] = slotLocal(r, slot), y = yb + RH / 2, fz = DP / 2 + .03;

  useFrame(({ clock }) => {
    const p = .5 + .5 * Math.sin(clock.elapsedTime * 4);
    if (m.current) m.current.opacity = .1 + .2 * p;
    if (e.current) e.current.scale.setScalar(1 + .04 * p);
  });

  const amb = '#ff9f1c';
  return (
    <group position={[L.x, 0, L.z]}>
      <group ref={e} position={[x, y, 0]}>
        <mesh>
          <boxGeometry args={[CW * .96, RH * .96, DP * 1.06]} />
          <meshBasicMaterial ref={m} color={amb} transparent depthWrite={false} />
        </mesh>
        <lineSegments>
          <edgesGeometry args={[new THREE.BoxGeometry(CW * .96, RH * .96, DP * 1.06)]} />
          <lineBasicMaterial color="#d97a00" />
        </lineSegments>
      </group>
      <mesh position={[0, y, fz]}>
        <boxGeometry args={[L.w, RH * .94, .02]} />
        <meshBasicMaterial color={amb} transparent opacity={.2} depthWrite={false} />
      </mesh>
      <mesh position={[x, BASE + r.totalRows * RH / 2, fz]}>
        <boxGeometry args={[CW * .94, r.totalRows * RH, .02]} />
        <meshBasicMaterial color={amb} transparent opacity={.2} depthWrite={false} />
      </mesh>
      <Html position={[x, L.h + .9, 0]} center style={{ pointerEvents: 'none' }}>
        <div className="bc-lab bc-pop">
          <b>{product.productName}</b>{slot.locationCode}
        </div>
      </Html>
    </group>
  );
}

const RackPad = ({ L }) => (
  <mesh position={[L.x, .045, L.z + .7]} rotation={[-Math.PI / 2, 0, 0]}>
    <planeGeometry args={[L.w + .8, DP + 2.4]} />
    <meshBasicMaterial color="#ff9f1c" transparent opacity={.3} />
  </mesh>
);

function NavigationPath({ points }) {
  const arrows = useRef([]);
  const { segs, len } = useMemo(() => {
    let len = 0; const segs = [];
    if (!points || points.length < 2) return { segs, len };
    for (let i = 0; i < points.length - 1; i++) {
      const a = points[i], b = points[i + 1], l = a.distanceTo(b);
      len += l;
      segs.push({ l, p: a.clone().lerp(b, .5), ry: Math.atan2(a.z - b.z, b.x - a.x) });
    }
    return { segs, len };
  }, [points]);

  const n = Math.max(3, Math.floor(len / 1.6));

  useFrame(({ clock }) => {
    if (!points || points.length < 2) return;
    arrows.current.forEach((g, i) => {
      if (!g) return;
      let d = (clock.elapsedTime * 2.2 + i * len / n) % len, j = 0;
      while (j < points.length - 2 && d > points[j].distanceTo(points[j + 1])) {
        d -= points[j].distanceTo(points[j + 1]);
        j++;
      }
      const a = points[j], dir = points[j + 1].clone().sub(a).normalize();
      g.position.copy(a).addScaledVector(dir, d);
      g.rotation.y = Math.atan2(dir.x, dir.z);
    });
  });

  if (!points || points.length < 2) return null;

  return (
    <group>
      {segs.map((s, i) => (
        <mesh key={i} position={s.p} rotation={[0, s.ry, 0]}>
          <boxGeometry args={[s.l + .24, .03, .24]} />
          <meshBasicMaterial color="#1f6fff" />
        </mesh>
      ))}
      <mesh position={points[points.length - 1]}>
        <cylinderGeometry args={[.35, .35, .04, 24]} />
        <meshBasicMaterial color="#1f6fff" />
      </mesh>
      {Array.from({ length: n }, (_, i) => (
        <group key={i} ref={(el) => (arrows.current[i] = el)}>
          <mesh position={[0, .2, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <coneGeometry args={[.2, .5, 3]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function CameraRig({ goal, controls }) {
  const { camera } = useThree();
  useFrame(() => {
    const g = goal.current, c = controls.current;
    if (!g || !c) return;
    camera.position.lerp(g.pos, .09);
    c.target.lerp(g.target, .09);
    c.update();
    if (camera.position.distanceTo(g.pos) < .03 && c.target.distanceTo(g.target) < .03) goal.current = null;
  });
  return null;
}

function Store3D({ layout, slots, prod, sel, route, goal, onRack, onSlot }) {
  const controls = useRef();
  const activeRack = sel ? (sel.loc ? sel.loc.split('-')[0] : sel.code) : null;
  const selSlot = sel?.loc ? slots.find((s) => s.locationCode === sel.loc) : null;
  const bySlots = useMemo(() => {
    const m = {};
    slots.forEach((s) => (m[s.rackCode] = m[s.rackCode] || []).push(s));
    return m;
  }, [slots]);

  return (
    <>
      <hemisphereLight args={['#ffffff', '#9aa7b4', .85]} />
      <directionalLight position={[14, 26, 16]} intensity={.8} castShadow shadow-mapSize={[2048, 2048]} shadow-camera-left={-20} shadow-camera-right={20} shadow-camera-top={20} shadow-camera-bottom={-20} shadow-camera-far={70} />
      <StoreFloor /><StoreWalls /><Entrance /><CheckoutArea />
      {Object.values(layout).map((L) => {
        const code = L.rack.rackCode, dim = !!activeRack && code !== activeRack;
        return (
          <React.Fragment key={code}>
            <Rack3D L={L} slots={bySlots[code] || []} prod={prod} dim={dim} active={code === activeRack} onRack={onRack} onSlot={onSlot} />
            <RackLabel L={L} dim={dim} />
          </React.Fragment>
        );
      })}
      {activeRack && layout[activeRack] && <RackPad L={layout[activeRack]} />}
      {selSlot && layout[selSlot.rackCode] && <ProductHighlight L={layout[selSlot.rackCode]} slot={selSlot} product={prod[selSlot.storeProductId]} />}
      {route && <NavigationPath points={route} />}
      <OrbitControls ref={controls} makeDefault enableDamping dampingFactor={.1} minDistance={5} maxDistance={70} maxPolarAngle={Math.PI / 2.05} screenSpacePanning onStart={() => (goal.current = null)} />
      <CameraRig goal={goal} controls={controls} />
    </>
  );
}

/* ================= PAGE / EXPORTED COMPONENT ================= */
export default function SmartStoreNavigator({
  storeId = 'store_01',
  fetchMap,
  storeData,
  height = '100vh',
  onSelectSlot: externalOnSelectSlot
}) {
  const [useDemo, setUseDemo] = useState(false);
  const map = useStoreMap(storeId, fetchMap || sampleFetchMap, storeData, useDemo);

  const [sel, setSel] = useState(null), [q, setQ] = useState(''), [open, setOpen] = useState(false), [msg, setMsg] = useState('');
  const goal = useRef(null);

  const { layout, prod, slots, catalog } = useMemo(() => {
    const prod = {};
    (map.products || []).forEach((p) => (prod[p.storeProductId || p.id] = p));
    const slots = (map.slots || []).filter((s) => prod[s.storeProductId]);
    return {
      layout: layoutRacks(map.racks || []),
      prod,
      slots,
      catalog: slots.map((s) => ({ s, p: prod[s.storeProductId] }))
    };
  }, [map]);

  const bySlot = useMemo(() => Object.fromEntries(slots.map((s) => [s.locationCode, s])), [slots]);

  const selectSlot = (loc) => {
    const s = bySlot[loc];
    if (!s || !layout[s.rackCode]) return;
    setSel({ loc });
    setMsg('');
    goal.current = rackGoal(layout[s.rackCode]);
    if (externalOnSelectSlot) externalOnSelectSlot(s, prod[s.storeProductId]);
  };

  const selectRack = (code) => {
    if (!layout[code]) return;
    setSel({ code });
    setMsg('');
    goal.current = rackGoal(layout[code]);
  };

  const results = useMemo(() => {
    const w = q.toLowerCase().split(/\s+/).filter(Boolean);
    if (!w.length) return [];
    return catalog
      .filter(({ s, p }) => {
        const h = `${p.productName} ${p.category || ''} ${s.rackName}`.toLowerCase();
        return w.every((x) => h.includes(x));
      })
      .sort((a, b) => a.p.productName.length - b.p.productName.length)
      .slice(0, 6);
  }, [q, catalog]);

  const search = () => {
    if (!results.length) {
      setMsg(`No product matches “${q}”. Try typing a product or category.`);
      setOpen(false);
      return;
    }
    setQ(results[0].p.productName);
    setOpen(false);
    selectSlot(results[0].s.locationCode);
  };

  const route = useMemo(() => {
    if (!sel) return null;
    if (sel.loc) {
      const s = bySlot[sel.loc];
      if (!s) return null;
      const L = layout[s.rackCode];
      if (!L) return null;
      return routeTo(L, L.x + slotLocal(L.rack, s)[0]);
    }
    if (layout[sel.code]) {
      return routeTo(layout[sel.code], layout[sel.code].x);
    }
    return null;
  }, [sel, bySlot, layout]);

  if (map.loading) {
    return (
      <div className="bc" style={{ height }}>
        <Style />
        <div className="bc-loading-box">
          <div className="bc-spinner" />
          <p className="bc-empty">Loading 3D store map…</p>
        </div>
      </div>
    );
  }

  if (map.error) {
    return (
      <div className="bc" style={{ height }}>
        <Style />
        <p className="bc-empty">Could not load the store map: {map.error}</p>
      </div>
    );
  }

  const selSlot = sel?.loc ? bySlot[sel.loc] : null;
  const rackCode = selSlot ? selSlot.rackCode : sel?.code, RL = rackCode ? layout[rackCode] : null;
  const rackSlots = RL ? slots.filter((s) => s.rackCode === rackCode) : [];
  const quickChips = catalog.slice(0, 4).map(({ p }) => p.productName);

  return (
    <div className="bc" style={{ height }}>
      <Style />
      <header>
        <div className="bc-title-group">
          <span className="bc-logo">BridgeCart</span>
          <span className="bc-sub">Smart Store Navigator</span>
        </div>
        <div className="bc-header-controls">
          {storeData && (
            <button
              className={`bc-toggle-btn ${useDemo ? 'active' : ''}`}
              onClick={() => { setUseDemo(!useDemo); setSel(null); goal.current = homeGoal(); }}
              title="Switch between store inventory and demo layout"
            >
              {useDemo ? '🏬 View My Store' : '🏷️ View Demo Layout'}
            </button>
          )}
          <span className="bc-tag">Find where a product sits on the shelf. Interactive 3D spatial mapping.</span>
        </div>
      </header>

      <div className="bc-search">
        <div className="bc-sbox">
          <input
            value={q}
            placeholder="Search a product, e.g. Amul Milk or Tata Salt"
            aria-label="Search product"
            autoComplete="off"
            onChange={(e) => { setQ(e.target.value); setOpen(true); }}
            onFocus={() => setOpen(true)}
            onKeyDown={(e) => e.key === 'Enter' && search()}
          />
          <button className="bc-pri" onClick={search}>Search</button>
          {open && results.length > 0 && (
            <ul className="bc-sug">
              {results.map(({ s, p }) => (
                <li
                  key={s.locationCode}
                  onMouseDown={() => {
                    setQ(p.productName);
                    setOpen(false);
                    selectSlot(s.locationCode);
                  }}
                >
                  <span className="bc-sug-name">{p.productName}</span>
                  <small className="bc-sug-loc">{s.locationCode}</small>
                </li>
              ))}
            </ul>
          )}
        </div>
        {quickChips.length > 0 && (
          <div className="bc-chips">
            {quickChips.map((n) => (
              <button
                key={n}
                onClick={() => {
                  const r = catalog.find(({ p }) => p.productName === n);
                  if (r) {
                    setQ(n);
                    selectSlot(r.s.locationCode);
                  }
                }}
              >
                {n}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="bc-stage">
        <Canvas shadows dpr={[1, 2]} camera={{ fov: 35, near: .1, far: 300, position: sph(.55, .95, 40) }}>
          <Store3D
            layout={layout}
            slots={slots}
            prod={prod}
            sel={sel}
            route={route}
            goal={goal}
            onRack={selectRack}
            onSlot={selectSlot}
          />
        </Canvas>

        <div className="bc-tools">
          <button onClick={() => (goal.current = homeGoal())}>↺ Reset view</button>
          <button onClick={() => document.querySelector('.bc-sbox input')?.select()}>🔍 Find product</button>
          <button onClick={() => { setSel(null); setQ(''); setMsg(''); goal.current = homeGoal(); }}>🏢 Show full store</button>
        </div>

        {RL && (
          <aside className="bc-rack" aria-label="Rack view">
            <div className="bc-rh">
              <div>
                <b>{RL.rack.rackCode} · {RL.rack.name}</b>
                <span>{RL.rack.zone} zone · {RL.rack.totalRows} rows × {RL.rack.totalColumns} columns</span>
              </div>
              <button onClick={() => { setSel(null); goal.current = homeGoal(); }} aria-label="Close rack view">✕</button>
            </div>
            <div className="bc-grid" style={{ gridTemplateColumns: `repeat(${Math.min(RL.rack.totalColumns, 5)}, 1fr)` }}>
              {rackSlots
                .slice()
                .sort((a, b) => a.rowNo - b.rowNo || a.columnNo - b.columnNo)
                .map((s) => {
                  const p = prod[s.storeProductId];
                  if (!p) return null;
                  return (
                    <button
                      key={s.locationCode}
                      className={'bc-cell' + (sel?.loc === s.locationCode ? ' on' : '')}
                      onClick={() => selectSlot(s.locationCode)}
                      title={`${p.productName} · ${s.locationCode}`}
                    >
                      <img
                        src={imgOf(p)}
                        alt={p.productName}
                        onError={(e) => { e.currentTarget.src = fallbackImg(p); }}
                      />
                      <span>{p.productName}</span>
                    </button>
                  );
                })}
            </div>
          </aside>
        )}

        <div className="bc-hint">Drag to rotate · Scroll to zoom · Right-drag to pan · Click any rack or item to explore</div>
      </div>

      <section className="bc-card" aria-live="polite">
        {selSlot && prod[selSlot.storeProductId] ? (
          <>
            <div className="bc-card-title">
              <h2>{prod[selSlot.storeProductId].productName}</h2>
              {prod[selSlot.storeProductId].price != null && (
                <span className="bc-card-badge">₹{prod[selSlot.storeProductId].price}</span>
              )}
            </div>
            <div className="bc-kv">
              <div><span>Rack</span><b>{selSlot.rackCode} · {RL?.rack?.name || 'Aisle'}</b></div>
              <div><span>Zone</span><b>{RL?.rack?.zone || 'Floor'}</b></div>
              <div><span>Row</span><b>{selSlot.rowNo}</b></div>
              <div><span>Column</span><b>{selSlot.columnNo}</b></div>
              <div><span>Location</span><b>{selSlot.locationCode}</b></div>
            </div>
            <span className="bc-note">Follow the pulsing blue path from the entrance. Row 1 is the top shelf tier.</span>
          </>
        ) : RL ? (
          <>
            <h2>{RL.rack.rackCode} · {RL.rack.name}</h2>
            <span className="bc-note" style={{ marginLeft: 0 }}>Pick a product in the rack shelf view to highlight its exact 3D slot.</span>
          </>
        ) : msg ? (
          <h2>{msg}</h2>
        ) : (
          <>
            <h2>Ready to Navigate</h2>
            <span className="bc-note" style={{ marginLeft: 0 }}>Search any product above or click on a 3D rack in the store to inspect shelves.</span>
          </>
        )}
      </section>
    </div>
  );
}

const Style = () => (
  <style>{`
.bc{--bg:#eef2f5;--panel:#fff;--ink:#14212e;--mute:#5d6b7a;--line:#d9e0e7;--brand:#0b6e4f;--s1:#f4f7fa;--s2:#d7e0e8;display:flex;flex-direction:column;gap:10px;padding:12px;background:var(--bg);color:var(--ink);font:500 14px/1.4 system-ui,sans-serif;box-sizing:border-box;border-radius:16px}
@media(prefers-color-scheme:dark){.bc{--bg:#10171e;--panel:#18222c;--ink:#e8eef4;--mute:#93a3b3;--line:#2a3743;--s1:#243140;--s2:#1a2530}}
.bc *{box-sizing:border-box}
.bc header{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap}
.bc-title-group{display:flex;align-items:baseline;gap:8px}
.bc-logo{font-weight:700;font-size:20px;color:var(--brand)}
.bc-sub{font-weight:600;font-size:16px}
.bc-header-controls{display:flex;align-items:center;gap:10px;margin-left:auto;flex-wrap:wrap}
.bc-toggle-btn{font-size:12px;font-weight:600;padding:5px 10px;border-radius:8px;background:var(--panel);border:1px solid var(--line);cursor:pointer;transition:all .15s}
.bc-toggle-btn:hover{background:var(--s1)}
.bc-toggle-btn.active{background:var(--brand);color:#fff;border-color:var(--brand)}
.bc-tag{color:var(--mute);font-size:12.5px}
.bc-search{display:flex;gap:10px;align-items:flex-start;flex-wrap:wrap}
.bc-sbox{position:relative;flex:1 1 320px;max-width:520px;display:flex;gap:8px}
.bc input{flex:1;min-width:0;font:inherit;padding:10px 14px;border:1px solid var(--line);border-radius:10px;background:var(--panel);color:var(--ink)}
.bc button{font:inherit;font-weight:600;padding:9px 14px;border-radius:10px;border:1px solid var(--line);background:var(--panel);color:var(--ink);cursor:pointer;transition:background .15s}
.bc button.bc-pri{background:var(--brand);border-color:var(--brand);color:#fff}
.bc button:focus-visible,.bc input:focus-visible{outline:2px solid #1f6fff;outline-offset:2px}
.bc-sug{position:absolute;top:100%;left:0;right:0;margin:4px 0 0;padding:4px;list-style:none;background:var(--panel);border:1px solid var(--line);border-radius:10px;box-shadow:0 8px 24px #0002;z-index:25;max-height:220px;overflow-y:auto}
.bc-sug li{padding:8px 10px;border-radius:8px;cursor:pointer;display:flex;justify-content:space-between;gap:10px;align-items:center}
.bc-sug li:hover{background:var(--s1)}
.bc-sug-name{font-weight:600}
.bc-sug-loc{color:var(--mute);font-size:11.5px;background:var(--s1);padding:2px 6px;border-radius:4px}
.bc-chips{display:flex;gap:6px;flex-wrap:wrap}
.bc-chips button{font-weight:500;font-size:12px;padding:6px 10px;border-radius:99px}
.bc-stage{position:relative;flex:1;min-height:380px;border-radius:16px;overflow:hidden;border:1px solid var(--line);background:linear-gradient(var(--s1),var(--s2))}
.bc-stage canvas{touch-action:none}
.bc-tools{position:absolute;top:10px;right:10px;display:flex;gap:6px;flex-wrap:wrap;justify-content:flex-end;z-index:10}
.bc-tools button{font-size:12px;padding:6px 11px;background:rgba(255,255,255,.88);backdrop-filter:blur(6px);box-shadow:0 2px 8px rgba(0,0,0,.08)}
.bc-hint{position:absolute;left:12px;bottom:10px;font-size:11.5px;color:var(--mute);background:var(--panel);padding:4px 10px;border-radius:99px;border:1px solid var(--line);pointer-events:none;z-index:10}
.bc-lab{white-space:nowrap;text-align:center;font-size:11.5px;line-height:1.2;padding:3px 8px;border-radius:8px;background:#fffffff2;color:#14212e;box-shadow:0 2px 8px #0003;transition:opacity .2s;pointer-events:none}
.bc-lab b{display:block;font-size:13px}
.bc-dim{opacity:.35}
.bc-pill{background:#0b6e4f;color:#fff;font-weight:600}
.bc-pop{border:2px solid #ff9f1c;padding:6px 10px;text-align:left}
.bc-rack{position:absolute;top:10px;left:10px;width:min(380px,calc(100% - 20px));max-height:calc(100% - 40px);overflow:auto;background:var(--panel);border:1px solid var(--line);border-radius:14px;padding:12px;box-shadow:0 8px 24px #0003;z-index:15}
.bc-rh{display:flex;justify-content:space-between;gap:8px;margin-bottom:10px}
.bc-rh span{display:block;color:var(--mute);font-size:12px}
.bc-rh button{padding:2px 8px;font-size:13px}
.bc-grid{display:grid;gap:6px}
.bc button.bc-cell{display:flex;flex-direction:column;gap:3px;padding:4px;border-radius:8px;font-weight:500;font-size:10.5px;text-align:center;line-height:1.15;background:var(--s1);border:1px solid var(--line)}
.bc button.bc-cell:hover{border-color:var(--brand)}
.bc-cell img{width:100%;aspect-ratio:240/186;object-fit:cover;border-radius:5px}
.bc button.bc-cell.on{border:2px solid #ff9f1c;background:#fff3df;color:#14212e}
.bc-card{background:var(--panel);border:1px solid var(--line);border-radius:14px;padding:12px 16px;display:flex;gap:18px;flex-wrap:wrap;align-items:center;min-height:68px}
.bc-card-title{display:flex;align-items:center;gap:10px}
.bc-card-badge{font-size:13px;font-weight:700;color:var(--brand);background:#e6f4ea;padding:2px 8px;border-radius:6px}
.bc-card h2{margin:0;font-size:17px}
.bc-kv{display:flex;gap:18px;flex-wrap:wrap}
.bc-kv div{display:flex;flex-direction:column}
.bc-kv span{color:var(--mute);font-size:12px}
.bc-kv b{font-size:14.5px}
.bc-note{color:var(--mute);margin-left:auto;font-size:13px}
.bc-empty{margin:auto;color:var(--mute)}
.bc-loading-box{display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;gap:12px;margin:auto}
.bc-spinner{width:32px;height:32px;border:3px solid var(--line);border-top-color:var(--brand);border-radius:50%;animation:bc-spin 0.8s linear infinite}
@keyframes bc-spin{to{transform:rotate(360deg)}}
@media(max-width:640px){.bc-tag{display:none}.bc-hint{display:none}.bc-rack{max-height:50%}}
`}</style>
);
