"use client";

import { useMemo, useState } from "react";
import { MAP } from "@/data/map";
import {
  DRIVERS,
  FC,
  KPBN_SPARK,
  LATEST,
  NAT,
  PERIOD,
  PROVINCES,
  WORLD,
  type Province,
} from "@/data/prices";

const ISLC: Record<string, string> = {
  Sumatera: "#0E3B2A",
  Kalimantan: "#2E7A93",
  Sulawesi: "#A07414",
  Papua: "#6B4E9A",
  Jawa: "#8A3646",
};

type Metric = "pl" | "sw" | "gap" | "fc";
type SortKey = "name" | "pl" | "sw" | "gap" | "d" | "proj" | "k";

const GREEN = ["#E3ECE7", "#B4D0C3", "#79AE97", "#3A7860", "#0E3B2A"];
const HEAT = ["#F3E7CE", "#E9C98D", "#DDA654", "#C9772F", "#A6301F"];

function fmt(n: number | null | undefined) {
  return n == null ? "–" : Math.round(n).toLocaleString("id-ID");
}
function pct(n: number) {
  return `${n > 0 ? "+" : ""}${n.toFixed(1).replace(".", ",")}%`;
}
function mval(r: Province, metric: Metric) {
  if (metric === "sw") return r.sw;
  if (metric === "gap") return -r.gap;
  if (metric === "fc") return r.proj;
  return r.pl;
}
function quantiles(vals: number[], ramp: string[]) {
  const s = [...vals].sort((a, b) => a - b);
  const q: number[] = [];
  for (let i = 1; i < ramp.length; i++) q.push(s[Math.floor((i / ramp.length) * s.length)] ?? s[s.length - 1]!);
  return q;
}
function colorFor(v: number | null, vals: number[], metric: Metric) {
  if (v == null) return "#ECEAE3";
  const R = metric === "gap" ? HEAT : GREEN;
  const q = quantiles(vals, R);
  for (let i = 0; i < q.length; i++) if (v < q[i]!) return R[i]!;
  return R[R.length - 1]!;
}
function sparkPath(vals: number[], w: number, h: number, p: number) {
  const mn = Math.min(...vals);
  const mx = Math.max(...vals);
  const rg = mx - mn || 1;
  return vals
    .map((v, i) => {
      const x = p + (i / (vals.length - 1)) * (w - 2 * p);
      const y = p + (1 - (v - mn) / rg) * (h - 2 * p);
      return `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");
}

const TITLES: Record<Metric, string> = {
  pl: "TBS Plasma · Rp/kg",
  sw: "TBS Swadaya · Rp/kg",
  gap: "Selisih Plasma−Swadaya · Rp/kg",
  fc: "Proyeksi ~4 pekan · Rp/kg",
};

export function Dashboard() {
  const [sortKey, setSortKey] = useState<SortKey>("pl");
  const [sortDir, setSortDir] = useState<-1 | 1>(-1);
  const [island, setIsland] = useState("all");
  const [q, setQ] = useState("");
  const [metric, setMetric] = useState<Metric>("pl");
  const [tip, setTip] = useState<{ n: string; x: number; y: number } | null>(null);

  const byName = useMemo(() => {
    const m: Record<string, Province> = {};
    for (const r of PROVINCES) m[r.name] = r;
    return m;
  }, []);

  const HIDX = FC.hidx;
  const GROW = FC.growth[HIDX] ?? 1;
  const BANDF = (FC.fc.tbs_band[HIDX] ?? 0) / FC.nat_now;
  const vals = PROVINCES.map((r) => mval(r, metric));
  const ramp = metric === "gap" ? HEAT : GREEN;
  const qtiles = quantiles(vals, ramp);
  const mn = Math.min(...vals);
  const mx = Math.max(...vals);
  const bounds = [mn, ...qtiles, mx];

  const ranked = useMemo(() => {
    const o = [...PROVINCES].sort((a, b) => b.pl - a.pl);
    const m: Record<string, number> = {};
    o.forEach((r, i) => {
      m[r.name] = i + 1;
    });
    return m;
  }, []);

  const boardRows = useMemo(() => {
    const out = PROVINCES.filter((r) => {
      if (island !== "all" && r.isl !== island) return false;
      if (q && !r.name.toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
    out.sort((a, b) => {
      if (sortKey === "name") return a.name < b.name ? -sortDir : a.name > b.name ? sortDir : 0;
      const av = a[sortKey] ?? -1e9;
      const bv = b[sortKey] ?? -1e9;
      return (Number(av) - Number(bv)) * sortDir;
    });
    return out;
  }, [island, q, sortKey, sortDir]);

  const moversUp = [...PROVINCES].filter((r) => r.d > 0).sort((a, b) => b.d - a.d).slice(0, 4);
  const moversDown = [...PROVINCES].filter((r) => r.d < 0).sort((a, b) => a.d - b.d).slice(0, 4);
  const fairWorst = [...PROVINCES]
    .filter((r) => r.wgap != null)
    .sort((a, b) => (a.wgap ?? 0) - (b.wgap ?? 0));
  const worstW = Math.min(...fairWorst.map((r) => r.wgap ?? 0));
  const lead = [...PROVINCES].sort((a, b) => mval(b, metric) - mval(a, metric))[0]!;

  function toggleSort(k: SortKey) {
    if (sortKey === k) setSortDir((d) => (d === -1 ? 1 : -1));
    else {
      setSortKey(k);
      setSortDir(k === "name" ? 1 : -1);
    }
  }

  const chgNat = ((FC.fc.tbs[HIDX]! / FC.nat_now - 1) * 100);
  const tbsDelta = FC.hist.tbs[FC.hist.tbs.length - 1]! - FC.hist.tbs[FC.hist.tbs.length - 2]!;
  const kpbnDelta = KPBN_SPARK[KPBN_SPARK.length - 1]! - KPBN_SPARK[0]!;
  const kpbnChg = ((WORLD.kpbn / WORLD.kpbnPrev - 1) * 100);
  const mysChg = 9.8;
  const plChg = ((NAT.plasma / 3556 - 1) * 100);

  return (
    <>
      <header className="topbar">
        <div className="wrap">
          <div className="brand">
            <PalmMark />
            <div>
              <b>Sunrise Palm Oil Price</b> <span className="tag">TBS & CPO</span>
            </div>
          </div>
          <div className="grow" />
          <span className="srcpill">APKASINDO · {PERIOD.label}</span>
          <button className="lnk" type="button" title="Cetak / simpan PDF" onClick={() => window.print()}>
            <PrintIcon />
            Cetak
          </button>
        </div>
      </header>

      <div className="hero">
        <div className="wrap">
          <div className="eyebrow">Pantauan Harga Petani · 22 Provinsi</div>
          <h1>Harga TBS & CPO Kelapa Sawit Indonesia</h1>
          <p>
            Harga Tandan Buah Segar petani — Plasma (mitra) & Swadaya (mandiri) — menurut penetapan Disbun
            (rangkuman APKASINDO), acuan CPO dunia dalam Rp/kg, analisis harga wajar, dan proyeksi 4 pekan
            berbasis CPO, B50, iklim, dan musim.
          </p>
          <div className="period">
            <span className="d" />
            <span>
              Ranking {PERIOD.label} · diperbarui {PERIOD.asOf}
            </span>
          </div>

          <div className="kpis">
            <div className="kpi">
              <div className="l">TBS Plasma Nasional</div>
              <div className="v">
                <small>Rp</small>
                {fmt(NAT.plasma)}
                <span className="u">/kg</span>
              </div>
              <div className={`d ${plChg >= 0 ? "up" : "down"}`}>
                {plChg >= 0 ? "↑" : "↓"} {pct(plChg)} <em>vs {PERIOD.prev}</em>
              </div>
            </div>
            <div className="kpi">
              <div className="l">TBS Swadaya Nasional</div>
              <div className="v">
                <small>Rp</small>
                {fmt(NAT.swadaya)}
                <span className="u">/kg</span>
              </div>
              <div className="d down">
                selisih {fmt(NAT.gap)} <em>vs plasma ({pct(NAT.gapp)})</em>
              </div>
            </div>
            <div className="kpi">
              <div className="l">Indeks “K” rata-rata</div>
              <div className="v">
                {NAT.k}
                <span className="u">%</span>
              </div>
              <div className="d flat">
                <em>Faktor bagi hasil TBS ↔ CPO</em>
              </div>
            </div>
            <div className="kpi">
              <div className="l">Plasma vs Harga Wajar Dunia</div>
              <div className="v" style={{ color: "var(--amber)" }}>
                {NAT.wgap.toFixed(1).replace(".", ",")}
                <span className="u">%</span>
              </div>
              <div className="d warn">
                <em>di bawah nilai wajar CPO Rotterdam</em>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="wrap">
        <section id="latest">
          <div className="sh">
            <h2>Snapshot Terbaru per Provinsi</h2>
            <div className="rule" />
            <div className="note">Penetapan Disbun terbaru · s/d 23 Agustus 2026</div>
          </div>
          <div className="card" style={{ padding: "14px 16px" }}>
            <div className="lbanner">
              Ranking 22 provinsi di peta & tabel = periode <b>{PERIOD.label}</b> (rilis konsolidasi
              APKASINDO / hargasawitindonesia.id, extraction {PERIOD.extracted}). Baris di bawah adalah
              penetapan Disbun yang sudah keluar setelah ranking, atau yang dipakai ranking.
            </div>
            <div style={{ overflowX: "auto" }}>
              <table className="ltab">
                <thead>
                  <tr>
                    <th>Provinsi</th>
                    <th>Periode</th>
                    <th className="n">Plasma</th>
                    <th className="n">Δ vs periode lalu</th>
                    <th>Catatan pasar</th>
                  </tr>
                </thead>
                <tbody>
                  {LATEST.map((r) => {
                    const d = r.prev == null ? null : r.pl - r.prev;
                    const cls = d == null ? "flat" : d > 0 ? "up" : d < 0 ? "down" : "flat";
                    const ar = d != null && d > 0 ? "↑ +" : d != null && d < 0 ? "↓ " : "– ";
                    const pctv = r.prev && d != null ? (d / r.prev) * 100 : 0;
                    return (
                      <tr key={r.name}>
                        <td className="pnm">{r.name}</td>
                        <td className="per">{r.period}</td>
                        <td className="pl">Rp {fmt(r.pl)}</td>
                        <td className={`dl ${cls}`}>
                          {r.prev == null ? (
                            <span className="dl flat">—</span>
                          ) : d === 0 ? (
                            "stabil"
                          ) : (
                            `${ar}${fmt(Math.abs(d!))} (${pctv > 0 ? "+" : ""}${pctv.toFixed(1).replace(".", ",")}%)`
                          )}
                        </td>
                        <td className="nt">{r.note}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section id="peta">
          <div className="sh">
            <h2>Peta Harga per Provinsi</h2>
            <div className="rule" />
            <div className="note">Ketuk metrik untuk ganti pewarnaan</div>
          </div>
          <div className="map-layout">
            <div className="card map-card">
              <div className="map-top">
                <div className="note" style={{ color: "var(--muted)", fontSize: ".78rem" }}>
                  {TITLES[metric]}
                </div>
                <div className="toggle" role="group" aria-label="Metrik peta">
                  {(
                    [
                      ["pl", "Plasma"],
                      ["sw", "Swadaya"],
                      ["gap", "Selisih P/S"],
                      ["fc", "Proyeksi"],
                    ] as const
                  ).map(([k, lab]) => (
                    <button
                      key={k}
                      type="button"
                      data-metric={k}
                      aria-pressed={metric === k}
                      onClick={() => setMetric(k)}
                    >
                      {lab}
                    </button>
                  ))}
                </div>
              </div>
              <div className="mapwrap">
                <svg
                  className="map"
                  viewBox={MAP.viewBox}
                  preserveAspectRatio="xMidYMid meet"
                  role="img"
                  aria-label="Peta harga TBS per provinsi"
                >
                  {MAP.provinces.map((p) => {
                    const r = p.n ? byName[p.n] : undefined;
                    const fill = r ? colorFor(mval(r, metric), vals, metric) : "#ECEAE3";
                    return (
                      <path
                        key={p.g}
                        d={p.d}
                        data-n={p.n || ""}
                        className={r ? "hasdata" : undefined}
                        fill={fill}
                        onMouseMove={
                          r
                            ? (e) => {
                                const wrap = (e.currentTarget.closest(".mapwrap") as HTMLElement).getBoundingClientRect();
                                let x = e.clientX - wrap.left + 12;
                                const y = e.clientY - wrap.top + 12;
                                if (x > wrap.width - 165) x = e.clientX - wrap.left - 165;
                                setTip({ n: r.name, x, y });
                              }
                            : undefined
                        }
                        onMouseLeave={() => setTip(null)}
                      />
                    );
                  })}
                </svg>
                {tip && byName[tip.n] && (
                  <div
                    className="maptip"
                    style={{ left: tip.x, top: tip.y, opacity: 1, transform: "translateY(0)" }}
                  >
                    <MapTip r={byName[tip.n]!} />
                  </div>
                )}
              </div>
            </div>
            <div className="card legend-card">
              <h3>Skala</h3>
              <p className="s">{TITLES[metric]}</p>
              <div className="scale">
                {ramp.map((c, i) => {
                  const lo = bounds[i]!;
                  const hi = bounds[i + 1]!;
                  const lbl =
                    metric === "gap"
                      ? `−${fmt(lo)}${i === ramp.length - 1 ? "+" : ` – −${fmt(hi)}`}`
                      : `${fmt(lo)}${i === ramp.length - 1 ? "+" : ` – ${fmt(hi)}`}`;
                  return (
                    <div className="row" key={c}>
                      <span className="sw" style={{ background: c }} />
                      {lbl}
                    </div>
                  );
                })}
              </div>
              <div className="scale nd">
                <div className="row">
                  <span className="sw" style={{ background: "#ECEAE3" }} />
                  Tanpa data / luar cakupan
                </div>
              </div>
              <div className="maplead">
                <div className="big">
                  {metric === "gap"
                    ? `−Rp ${fmt(-lead.gap)} · ${lead.name}`
                    : `Rp ${fmt(mval(lead, metric))} · ${lead.name}`}
                </div>
                <div className="lo">
                  {metric === "gap"
                    ? "Selisih P/S terlebar"
                    : metric === "fc"
                      ? "Proyeksi tertinggi"
                      : "Tertinggi pekan ini"}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="cpo-dunia">
          <div className="sh">
            <h2>Acuan Harga CPO Dunia</h2>
            <div className="rule" />
            <div className="note">Setara Rp/kg — nilai TBS ≈ rendemen 21% × K</div>
          </div>
          <div className="cpo">
            <div className="card c">
              <span className="t">CPO Indonesia</span>
              <span className="src">KPBN Dumai</span>
              <div className="p">
                <small>Rp</small> {fmt(WORLD.kpbn)} <small>/kg</small>
              </div>
              <div className="nat">Penawaran tertinggi 21 Agu 2026 (tender WD)</div>
              <div className={`chg ${kpbnChg >= 0 ? "up" : "down"}`}>
                {kpbnChg >= 0 ? "▲" : "▼"} {pct(kpbnChg)} vs 14 Agu (Rp {fmt(WORLD.kpbnPrev)})
              </div>
            </div>
            <div className="card c">
              <span className="t">CPO Malaysia</span>
              <span className="src">Bursa (BMD)</span>
              <div className="p">
                <small>Rp</small> {fmt(WORLD.mys)} <small>/kg</small>
              </div>
              <div className="nat">
                ≈ RM {WORLD.mysRm.toLocaleString("id-ID")}/ton · kurs Rp {fmt(WORLD.kursRm)}/RM
              </div>
              <div className="chg up">▲ {pct(mysChg)} · 20-bulan high 21 Agu</div>
            </div>
            <div className="card c">
              <span className="t">CPO Rotterdam</span>
              <span className="src">CIF Eropa</span>
              <div className="p">
                <small>Rp</small> {fmt(WORLD.rott)} <small>/kg</small>
              </div>
              <div className="nat">
                USD {WORLD.rottUsd.toLocaleString("id-ID")}/ton · kurs Rp {fmt(WORLD.kursUsd)}/US$
              </div>
              <div className="chg down">▼ −1,4% dalam Rp (rupiah menguat)</div>
            </div>
            <div className="card c fairc">
              <span className="t" style={{ color: "var(--amber)" }}>
                Harga Wajar TBS
              </span>
              <span className="src">dari CPO dunia</span>
              <div className="p">
                <small>Rp</small> {fmt(NAT.fair)} <small>/kg</small>
              </div>
              <div className="sub">
                Rotterdam × 21% × K. TBS plasma nasional (Rp {fmt(NAT.plasma)}){" "}
                <b style={{ color: "var(--amber)" }}>{NAT.wgap.toFixed(1).replace(".", ",")}%</b> di bawah ini.
              </div>
            </div>
          </div>
          <div className="kurs">
            Kurs snapshot 23 Agu: <b>Rp {fmt(WORLD.kursUsd)}/US$</b> · <b>Rp {fmt(WORLD.kursRm)}/RM</b>. Harga TBS
            petani mengikuti CPO dunia (jeda 1–2 pekan) × rendemen ~21% dikurangi biaya. BMD melonjak ke RM 5.018
            sementara penetapan Disbun 17–23 masih lag — ini basis catch-up proyeksi.
          </div>
        </section>

        <section id="wajar">
          <div className="sh">
            <h2>Analisis Harga Wajar</h2>
            <div className="rule" />
            <div className="note">Posisi tawar petani vs nilai CPO dunia</div>
          </div>
          <div className="fair-layout">
            <div className="card fair-hero">
              <div className="lbl">Rata-rata plasma nasional di bawah harga wajar dunia</div>
              <div className="big">{NAT.wgap.toFixed(1).replace(".", ",")}%</div>
              <div className="sub">
                TBS plasma Rp {fmt(NAT.plasma)}/kg vs harga wajar ≈ Rp {fmt(NAT.fair)}/kg (berdasarkan CPO
                Rotterdam).
              </div>
              <div className="formula">
                <b>Harga wajar</b> = CPO Rotterdam (Rp/kg) × rendemen <b>21%</b> × Indeks <b>K</b> provinsi.
                <br />
                Selisih ini menggambarkan ruang penguatan posisi tawar petani, bukan target harga penetapan.
              </div>
            </div>
            <div className="card fair-bars">
              <div className="cap">
                Provinsi dengan posisi tawar paling lemah (plasma paling jauh di bawah harga wajar dunia)
              </div>
              {fairWorst.slice(0, 10).map((r) => {
                const w = Math.round((Math.abs(r.wgap ?? 0) / Math.abs(worstW)) * 100);
                return (
                  <div className="fbrow" key={r.name}>
                    <span className="nm">{r.name}</span>
                    <span className="tr">
                      <span className="fl" style={{ width: `${w}%` }} />
                    </span>
                    <span className="pc">{(r.wgap ?? 0).toFixed(1).replace(".", ",")}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section id="ranking">
          <div className="sh">
            <h2>Ranking & Selisih per Provinsi</h2>
            <div className="rule" />
            <div className="note">Plasma vs Swadaya · Δ vs {PERIOD.prev}</div>
          </div>
          <div className="board-layout">
            <div className="card board">
              <div className="tools">
                <label className="search">
                  <SearchIcon />
                  <input
                    type="search"
                    placeholder="Cari provinsi…"
                    aria-label="Cari provinsi"
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                  />
                </label>
                <div className="chips" role="group" aria-label="Filter pulau">
                  {["all", "Sumatera", "Kalimantan", "Sulawesi", "Papua", "Jawa"].map((isl) => (
                    <button
                      key={isl}
                      type="button"
                      className="chip"
                      data-isl={isl}
                      aria-pressed={island === isl}
                      onClick={() => setIsland(isl)}
                    >
                      {isl === "all" ? "Semua" : isl}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ overflowX: "auto" }}>
                <table>
                  <thead>
                    <tr>
                      <th style={{ width: 24 }}>#</th>
                      <SortTh k="name" cur={sortKey} dir={sortDir} onClick={toggleSort}>
                        Provinsi
                      </SortTh>
                      <SortTh k="pl" cur={sortKey} dir={sortDir} onClick={toggleSort} n>
                        Plasma
                      </SortTh>
                      <SortTh k="sw" cur={sortKey} dir={sortDir} onClick={toggleSort} n>
                        Swadaya
                      </SortTh>
                      <SortTh k="gap" cur={sortKey} dir={sortDir} onClick={toggleSort} n>
                        Selisih P/S
                      </SortTh>
                      <SortTh k="d" cur={sortKey} dir={sortDir} onClick={toggleSort} n>
                        Δ pekan
                      </SortTh>
                      <SortTh k="proj" cur={sortKey} dir={sortDir} onClick={toggleSort} n hide>
                        Proyeksi
                      </SortTh>
                      <SortTh k="k" cur={sortKey} dir={sortDir} onClick={toggleSort} n hide>
                        K
                      </SortTh>
                    </tr>
                  </thead>
                  <tbody>
                    {boardRows.length === 0 ? (
                      <tr>
                        <td colSpan={8} style={{ textAlign: "center", padding: 26, color: "var(--muted)" }}>
                          Tidak ada provinsi yang cocok.
                        </td>
                      </tr>
                    ) : (
                      boardRows.map((r) => {
                        const rank = ranked[r.name] ?? 0;
                        const dc = r.d > 0 ? "up" : r.d < 0 ? "down" : "flat";
                        const da = r.d > 0 ? "↑" : r.d < 0 ? "↓" : "–";
                        const hl = r.name === "Riau" || r.name === "Sumatera Utara";
                        return (
                          <tr key={r.name} className={hl ? "hl" : undefined}>
                            <td className={`rank${rank <= 3 ? " top" : ""}`}>{rank}</td>
                            <td className="prov">
                              <span className="dot" style={{ background: ISLC[r.isl] }} />
                              {r.name}
                            </td>
                            <td className="n strong">{fmt(r.pl)}</td>
                            <td className="n muted">{fmt(r.sw)}</td>
                            <td className="n gap">−{fmt(-r.gap)}</td>
                            <td className={`delta ${dc}`}>
                              {r.d === 0 ? (
                                <span className="na">0</span>
                              ) : (
                                `${da} ${r.d > 0 ? "+" : ""}${fmt(r.d)}`
                              )}
                            </td>
                            <td className="n proj col-hide">
                              {fmt(r.proj)} <span className="pp">{pct((GROW - 1) * 100)}</span>
                            </td>
                            <td className="n muted col-hide">{r.k == null ? <span className="na">–</span> : r.k}</td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <aside className="side">
              <div className="card panel">
                <h3>Pergerakan pekan ini</h3>
                <p className="ps">Perubahan plasma vs {PERIOD.prev}</p>
                <div className="mv-h up">▲ Naik tertinggi</div>
                <ul className="movers">
                  {moversUp.length === 0 ? (
                    <li className="muted" style={{ padding: "4px 0" }}>
                      Tidak ada.
                    </li>
                  ) : (
                    moversUp.map((r) => {
                      const p = (r.d / (r.pl - r.d)) * 100;
                      return (
                        <li key={r.name}>
                          <span>{r.name}</span>
                          <span className="m up">
                            ↑ +{fmt(r.d)} · {pct(p)}
                          </span>
                        </li>
                      );
                    })
                  )}
                </ul>
                <div className="mv-h down">▼ Turun terdalam</div>
                <ul className="movers">
                  {moversDown.map((r) => {
                    const p = (r.d / (r.pl - r.d)) * 100;
                    return (
                      <li key={r.name}>
                        <span>{r.name}</span>
                        <span className="m down">
                          ↓ {fmt(r.d)} · {pct(p)}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
              <div className="card panel">
                <h3>Tren Nasional 2026</h3>
                <p className="ps">Periodik · Rp/kg</p>
                <svg className="spark" viewBox="0 0 300 66" preserveAspectRatio="none" aria-hidden="true">
                  <path d={sparkPath(FC.hist.cpo, 300, 66, 7)} fill="none" stroke="#C9A227" strokeWidth="1.6" opacity=".9" />
                  <path d={sparkPath(FC.hist.tbs, 300, 66, 7)} fill="none" stroke="#0E3B2A" strokeWidth="2" />
                </svg>
                <div className="lg">
                  <span>
                    <span className="sw" style={{ background: "var(--green)" }} />
                    TBS
                  </span>
                  <span>
                    <span className="sw" style={{ background: "#C9A227" }} />
                    CPO mill
                  </span>
                  <span style={{ marginLeft: "auto" }}>
                    TBS{" "}
                    <b style={{ color: tbsDelta >= 0 ? "var(--up)" : "var(--down)" }}>
                      {tbsDelta >= 0 ? "+" : ""}
                      {fmt(tbsDelta)}
                    </b>
                  </span>
                </div>
              </div>
              <div className="card panel">
                <h3>Tender CPO KPBN — Agu III</h3>
                <p className="ps">14–21 Agustus · Rp/kg</p>
                <KpbnSpark />
                <div className="lg">
                  <span>
                    14→21 Agu{" "}
                    <b style={{ color: "var(--up)" }}>+{fmt(kpbnDelta)}</b> · terakhir Rp{fmt(KPBN_SPARK[KPBN_SPARK.length - 1])}
                  </span>
                </div>
              </div>
              <div className="card panel">
                <h3>Kisaran di PKS</h3>
                <p className="ps">Rp/kg · periode {PERIOD.label}</p>
                <div className="rb">
                  <div className="t">
                    <span>Plasma/mitra</span>
                    <b>
                      {fmt(NAT.plasmaRange[0])}–{fmt(NAT.plasmaRange[1])}
                    </b>
                  </div>
                  <div className="tr">
                    <div className="fl" style={{ left: "34%", right: 0 }} />
                  </div>
                </div>
                <div className="rb">
                  <div className="t">
                    <span>Swadaya</span>
                    <b>
                      {fmt(NAT.swadayaRange[0])}–{fmt(NAT.swadayaRange[1])}
                    </b>
                  </div>
                  <div className="tr">
                    <div className="fl o" style={{ left: "6%", right: "14%" }} />
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </section>

        <section id="prediksi">
          <div className="sh">
            <h2>Prediksi Harga 4 Pekan ke Depan</h2>
            <div className="rule" />
            <div className="note">Model: CPO-linked catch-up + B50 + ENSO + musim + FX</div>
          </div>

          <div className="drivers">
            {DRIVERS.map((d) => (
              <div className="card dcard" key={d.id}>
                <div className="t" style={{ color: d.tone === "up" ? "var(--up)" : "var(--down)" }}>
                  {d.tone === "up" ? "Pendukung" : "Penahan"}
                </div>
                <div className="eff" style={{ color: d.tone === "up" ? "var(--up)" : "var(--down)" }}>
                  {d.title}
                </div>
                <div style={{ fontSize: ".74rem", fontWeight: 500, marginTop: 4 }}>{d.effect}</div>
                <p>{d.body}</p>
              </div>
            ))}
          </div>

          <div className="fc-highlight">
            {(["Nasional", "Riau", "Sumatera Utara"] as const).map((lbl) => {
              const now = lbl === "Nasional" ? FC.nat_now : byName[lbl]!.pl;
              const proj = lbl === "Nasional" ? FC.fc.tbs[HIDX]! : byName[lbl]!.proj;
              const chg = (proj / now - 1) * 100;
              const band = Math.round(proj * BANDF);
              const cls = chg >= 0 ? "up" : "down";
              return (
                <div className="hcard" key={lbl}>
                  <span className="star">prioritas</span>
                  <div className="hl-lbl">{lbl}</div>
                  <div className="hl-now">
                    Kini Rp {fmt(now)}/kg → proyeksi ~4 pekan (Sep-III)
                  </div>
                  <div className="hl-proj">Rp {fmt(proj)}</div>
                  <div className="hl-meta">
                    <span className={`hl-chg ${cls}`}>
                      {chg >= 0 ? "↑" : "↓"} {pct(chg)}
                    </span>
                    <span className="hl-band">
                      ± Rp {fmt(band)} (~{(BANDF * 100).toFixed(1)}%)
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="fc-layout">
            <div className="card fc-chart">
              <div className="cap">
                <span className="h">TBS Nasional — riwayat & proyeksi</span>
                <span className="sub">Rp/kg · pita ≈80% interval</span>
              </div>
              <ForecastChart />
            </div>
            <div className="card fc-note">
              <h3>Ringkasan model</h3>
              <div className="stat">
                <span>TBS proyeksi ~4 pekan</span>
                <b>Rp {fmt(FC.fc.tbs[HIDX])} /kg</b>
              </div>
              <div className="stat">
                <span>Perubahan vs kini</span>
                <b style={{ color: chgNat >= 0 ? "var(--up)" : "var(--down)" }}>{pct(chgNat)}</b>
              </div>
              <div className="stat">
                <span>CPO KPBN proyeksi ~4 pekan</span>
                <b>Rp {fmt(FC.fc.cpo[HIDX])} /kg</b>
              </div>
              <div className="stat">
                <span>Rentang (±) TBS</span>
                <b>
                  ± Rp {fmt(FC.fc.tbs_band[HIDX])} (~{((FC.fc.tbs_band[HIDX]! / FC.nat_now) * 100).toFixed(1)}%)
                </b>
              </div>
              <div className="stat">
                <span>Akurasi 1-langkah · backtest</span>
                <b>
                  ± Rp {fmt(FC.backtest.mae)} (±{FC.backtest.mape.toFixed(1).replace(".", ",")}%)
                  <span style={{ color: "var(--muted)", fontWeight: 400, fontSize: ".82em" }}>
                    {" "}
                    vs ±{FC.backtest.base_mape.toFixed(1).replace(".", ",")}% damped
                  </span>
                </b>
              </div>
              <div className="warn">
                Metode: TBS<sub>t</sub> = f(CPO KPBN dengan jeda 1–2 pekan) × rendemen/K, lalu overlay B50
                (+0,3%/pekan, decay), El Niño (+0,15%), puncak panen Sep (−0,2%), dan IDR menguat (−0,05%).
                Dipilih karena Disbun 17–23 belum merefleksikan rally BMD ke RM 5.018. Pita melebar = ketidakpastian
                kebijakan B50 + cuaca.
              </div>
              <details style={{ marginTop: 10 }}>
                <summary style={{ fontSize: ".78rem", color: "var(--green)", cursor: "pointer", fontWeight: 500 }}>
                  Rincian akurasi · 8 periode terakhir
                </summary>
                <table className="bt">
                  <thead>
                    <tr>
                      <th>Periode</th>
                      <th>Prediksi</th>
                      <th>Aktual</th>
                      <th>Selisih</th>
                    </tr>
                  </thead>
                  <tbody>
                    {FC.backtest.rows.map((r) => (
                      <tr key={r.lbl}>
                        <td>{r.lbl}</td>
                        <td>{fmt(r.pred)}</td>
                        <td>{fmt(r.act)}</td>
                        <td className={`e ${r.err > 0 ? "up" : r.err < 0 ? "down" : ""}`}>
                          {r.err > 0 ? "+" : ""}
                          {fmt(r.err)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div style={{ fontSize: ".72rem", color: "var(--muted)", marginTop: 6 }}>
                  Prediksi 1-langkah-ke-depan vs harga aktual. Ensemble CPO-linked mengalahkan damped-trend murni
                  pada backtest (MAPE 1,9% vs 2,7%).
                </div>
              </details>
            </div>
          </div>

          <div className="commod-wrap">
            <div className="commod-h">Proyeksi komoditas turunan · ~4 pekan (nasional, Rp/kg)</div>
            <div className="commod">
              <CommodCard lbl="CPO" full="minyak sawit mentah" d={FC.commodity.cpo} />
              <CommodCard lbl="PKO" full="minyak inti sawit" d={FC.commodity.pko} />
              <CommodCard lbl="PKE" full="bungkil inti sawit" d={null} />
            </div>
          </div>
        </section>
      </main>

      <footer>
        <div className="wrap">
          <h4>Sumber & metode</h4>
          <p>
            Harga per provinsi (Plasma & Swadaya, Indeks K, selisih P/S): rangkuman penetapan Disbun oleh
            APKASINDO / hargasawitindonesia.id, periode {PERIOD.label} (extraction {PERIOD.extracted}). Acuan CPO:
            KPBN Inacom Franco Dumai (penawaran tertinggi 21 Agu Rp {fmt(WORLD.kpbn)}, tender WD), Bursa Malaysia
            BMD November RM {fmt(WORLD.mysRm)} (21 Agu, 20-bulan high), CIF Rotterdam USD {fmt(WORLD.rottUsd)}/ton —
            dikonversi Rp/kg dengan kurs Rp {fmt(WORLD.kursUsd)}/US$ dan Rp {fmt(WORLD.kursRm)}/RM. Sumber utama:{" "}
            <a href="https://hargasawitindonesia.id/" target="_blank" rel="noreferrer">
              hargasawitindonesia.id
            </a>{" "}
            / APKASINDO, InfoSAWIT, KPBN, BMD.
          </p>
          <p>
            Proyeksi 4 pekan: ensemble CPO-linked (TBS menyusul KPBN dengan jeda 1–2 pekan, pass-through ~75%) +
            overlay kebijakan B50 Indonesia (implementasi penuh Oktober), onset El Niño (premi risiko, physical lag
            3–6 bulan), puncak produksi musiman Sep–Okt, dan penguatan rupiah. Bukan ramalan transaksi.
          </p>
          <p className="disc">
            Catatan: “Harga wajar” = CPO Rotterdam (Rp/kg) × rendemen 21% × Indeks K provinsi — ilustrasi posisi
            tawar, bukan target penetapan. Proyeksi per provinsi diturunkan dari faktor pertumbuhan nasional × harga
            terkini (spread antar-daerah dianggap tetap). Harga penetapan berlaku bagi petani bermitra/plasma di
            tingkat pabrik; swadaya APKASINDO memakai harga pasar PKS (bukan mitra swadaya Disbun Riau). Purwarupa
            pemantauan pasar, bukan acuan transaksi resmi.
          </p>
        </div>
      </footer>
    </>
  );
}

function MapTip({ r }: { r: Province }) {
  const dc = r.d > 0 ? "up" : r.d < 0 ? "down" : "";
  const da = r.d > 0 ? "↑ +" : r.d < 0 ? "↓ " : "– ";
  return (
    <>
      <b className="h">{r.name}</b>
      <div className="r">
        <span>Plasma</span>
        <b>Rp {fmt(r.pl)}</b>
      </div>
      <div className="r">
        <span>Swadaya</span>
        <b>Rp {fmt(r.sw)}</b>
      </div>
      <div className="r">
        <span>Selisih P/S</span>
        <b className="down">−Rp {fmt(-r.gap)}</b>
      </div>
      {r.d !== 0 && (
        <div className="r">
          <span>Δ pekan</span>
          <b className={dc}>
            {da}
            {fmt(Math.abs(r.d))}
          </b>
        </div>
      )}
      {r.wgap != null && (
        <div className="r">
          <span>vs wajar dunia</span>
          <b className="am">{r.wgap.toFixed(1).replace(".", ",")}%</b>
        </div>
      )}
      <div className="r">
        <span>Proyeksi</span>
        <b>Rp {fmt(r.proj)}</b>
      </div>
    </>
  );
}

function SortTh({
  k,
  cur,
  dir,
  onClick,
  n,
  hide,
  children,
}: {
  k: SortKey;
  cur: SortKey;
  dir: number;
  onClick: (k: SortKey) => void;
  n?: boolean;
  hide?: boolean;
  children: string;
}) {
  return (
    <th className={`sortable${n ? " n" : ""}${hide ? " col-hide" : ""}`} data-sort={k} onClick={() => onClick(k)}>
      {children} <span className="arw">{cur === k ? (dir < 0 ? "▾" : "▴") : ""}</span>
    </th>
  );
}

function KpbnSpark() {
  const W = 300,
    H = 66,
    P = 7;
  const vals = KPBN_SPARK;
  const mn = Math.min(...vals);
  const mx = Math.max(...vals);
  const rg = mx - mn || 1;
  const pts = vals.map((v, i) => [P + (i / (vals.length - 1)) * (W - 2 * P), P + (1 - (v - mn) / rg) * (H - 2 * P)] as const);
  let area = `M${pts[0]![0].toFixed(1)} ${H - P}`;
  pts.forEach((p) => {
    area += `L${p[0].toFixed(1)} ${p[1].toFixed(1)}`;
  });
  area += `L${pts[pts.length - 1]![0].toFixed(1)} ${H - P}Z`;
  return (
    <svg className="spark" viewBox="0 0 300 66" preserveAspectRatio="none" aria-hidden="true">
      <path d={area} fill="#0E3B2A" opacity=".08" />
      <path d={sparkPath(vals, W, H, P)} fill="none" stroke="#0E3B2A" strokeWidth="1.9" />
    </svg>
  );
}

function ForecastChart() {
  const W = 640,
    H = 210,
    PL = 6,
    PR = 6,
    PT = 12,
    PB = 22;
  const hist = FC.hist.tbs.slice(-12);
  const f = FC.fc.tbs;
  const b = FC.fc.tbs_band;
  const histN = hist.length;
  const n = histN + f.length;
  const up = f.map((v, i) => v + b[i]!);
  const dn = f.map((v, i) => v - b[i]!);
  const lo = Math.min(...dn, ...hist);
  const hi = Math.max(...up, ...hist);
  const rg = hi - lo || 1;
  const X = (i: number) => PL + (i / (n - 1)) * (W - PL - PR);
  const Y = (v: number) => PT + (1 - (v - lo) / rg) * (H - PT - PB);
  const bx0 = histN - 1;
  let band = `M${X(bx0)} ${Y(hist[histN - 1]!)}`;
  up.forEach((v, i) => {
    band += ` L${X(histN + i)} ${Y(v)}`;
  });
  for (let i = dn.length - 1; i >= 0; i--) band += ` L${X(histN + i)} ${Y(dn[i]!)}`;
  band += ` L${X(bx0)} ${Y(hist[histN - 1]!)}Z`;
  const hp = hist
    .map((v, i) => `${i ? "L" : "M"}${X(i).toFixed(1)} ${Y(v).toFixed(1)}`)
    .join(" ");
  let fp = `M${X(bx0)} ${Y(hist[histN - 1]!)}`;
  f.forEach((v, i) => {
    fp += ` L${X(histN + i)} ${Y(v)}`;
  });
  const lastY = Y(hist[histN - 1]!);
  return (
    <svg className="fchart" viewBox="0 0 640 210" preserveAspectRatio="none" aria-hidden="true">
      <line
        x1={PL}
        x2={W - PR}
        y1={lastY}
        y2={lastY}
        stroke="#E9E8E3"
        strokeWidth="1"
        strokeDasharray="3 3"
      />
      <path d={band} fill="#0E3B2A" opacity=".10" />
      <path d={hp} fill="none" stroke="#0E3B2A" strokeWidth="2" />
      <path d={fp} fill="none" stroke="#0E3B2A" strokeWidth="1.8" strokeDasharray="4 3" opacity=".85" />
      {f.map((v, i) => (
        <circle key={i} cx={X(histN + i)} cy={Y(v)} r="2.3" fill="#0E3B2A" />
      ))}
      {FC.fc.labels.map((t, i) => (
        <text key={t} x={X(histN + i)} y={H - 6} fontSize="9" fill="#9AA09B" textAnchor="middle">
          {t}
        </text>
      ))}
      <text x={X(0)} y={H - 6} fontSize="9" fill="#9AA09B" textAnchor="start">
        {FC.hist.labels[FC.hist.labels.length - 12]}
      </text>
    </svg>
  );
}

function CommodCard({
  lbl,
  full,
  d,
}: {
  lbl: string;
  full: string;
  d: { now: number; proj: number; band: number; mape: number; base_mape: number } | null;
}) {
  if (!d) {
    return (
      <div className="ccard na">
        <div className="cl">
          {lbl} <span className="s2">· {full}</span>
        </div>
        <div className="cnow">Proyeksi ~4 pekan</div>
        <div className="cproj">Belum ada data</div>
        <div className="cacc">Kolom {lbl} tak tersedia di sumber APKASINDO untuk periode ini.</div>
      </div>
    );
  }
  const chg = (d.proj / d.now - 1) * 100;
  return (
    <div className="ccard">
      <div className="cl">
        {lbl} <span className="s2">· {full}</span>
      </div>
      <div className="cnow">
        Kini Rp {fmt(d.now)}/kg → ~4 pekan
      </div>
      <div className="cproj">Rp {fmt(d.proj)}</div>
      <div className="cmeta">
        <span className={`cchg ${chg >= 0 ? "up" : "down"}`}>
          {chg >= 0 ? "↑" : "↓"} {pct(chg)}
        </span>
        <span className="cband">
          ± Rp {fmt(d.band)} (~{((d.band / d.now) * 100).toFixed(1)}%)
        </span>
      </div>
      <div className="cacc">
        Akurasi backtest ±{d.mape.toFixed(1).replace(".", ",")}% · vs ±{d.base_mape.toFixed(1).replace(".", ",")}% damped
      </div>
    </div>
  );
}

function PalmMark() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 21V11" stroke="#0E3B2A" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M12 11C12 11 8 4 2.5 5.2 2.5 5.2 5 11 12 11Z" fill="#6FA588" />
      <path d="M12 11C12 11 16 4 21.5 5.2 21.5 5.2 19 11 12 11Z" fill="#3A7860" />
      <path d="M12 12C12 12 7.5 7 3.5 9.5 3.5 9.5 7 13.5 12 12Z" fill="#175E43" />
      <path d="M12 12C12 12 16.5 7 20.5 9.5 20.5 9.5 17 13.5 12 12Z" fill="#0E3B2A" />
    </svg>
  );
}
function PrintIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M6 9V3h12v6M6 18H4a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2M6 14h12v7H6z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function SearchIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
      <path d="m20 20-3-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}


