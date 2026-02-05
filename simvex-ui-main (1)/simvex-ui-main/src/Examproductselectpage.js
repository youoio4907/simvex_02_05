// ExamProductSelectPage.js
import { useEffect, useMemo, useState } from "react";
import "./Shared.css";
import "./Productlistpage.css";

const FIELD_TO_MODEL_TITLES = {
  "기계 공학": ["V4_Engine", "Robot Arm", "Robot Gripper", "Machine Vice", "Suspension"],
  "전기 전자 공학": ["Leaf Spring"],
  "항공 우주 공학": ["Drone"],
  "재료 과학": ["Suspension"],
  "화학 공학": [],
  "토목 공학": [],
};

export default function ExamProductSelectPage({ field, onHome, onBack, onProductSelect }) {
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState(null);

  useEffect(() => {
    let alive = true;

    async function load() {
      setLoading(true);
      setErrMsg(null);

      try {
        const res = await fetch("/api/models");
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        const data = await res.json();
        if (!alive) return;

        setModels(Array.isArray(data) ? data : []);
      } catch (e) {
        if (!alive) return;
        setErrMsg(e?.message || "로드 실패");
        setModels([]);
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    }

    load();
    return () => {
      alive = false;
    };
  }, []);

  const filteredModels = useMemo(() => {
    const allow = FIELD_TO_MODEL_TITLES[field] || null;
    if (!allow) return models;
    if (allow.length === 0) return [];
    return models.filter((m) => allow.includes(m.title));
  }, [models, field]);

  return (
    <>
      <div className="noise-overlay" />
      <div className="ambient-glow glow-1" />
      <div className="ambient-glow glow-2" />

      <div className="page-wrapper">
        {/* NAV (간소화) */}
        <nav className="nav">
          <div className="inner">
            <div className="nav-logo" onClick={onHome}>
              <div className="nav-logo-icon">
                <svg viewBox="0 0 18 18" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round">
                  <circle cx="9" cy="9" r="3" />
                  <path d="M9 2v2M9 14v2M2 9h2M14 9h2" />
                </svg>
              </div>
              <span className="nav-logo-text">SIMVEX</span>
            </div>
          </div>
        </nav>

        {/* BODY */}
        <section className="pl-body">
          <div className="inner">
            <div className="pl-header">
              <div className="pl-header-left">
                <button className="pl-back-btn" onClick={onBack}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M10 2L4 7l6 5" />
                  </svg>
                </button>
                <h2 className="pl-title">{field} - 모의고사</h2>
              </div>
            </div>

            <div className="pl-divider" />

            {loading && (
              <div style={{ padding: "40px 0", textAlign: "center", color: "rgba(255,255,255,0.5)" }}>
                로딩 중...
              </div>
            )}

            {!loading && errMsg && (
              <div style={{ padding: "40px 0", textAlign: "center", color: "#dc2626" }}>
                오류: {errMsg}
              </div>
            )}

            {!loading && !errMsg && filteredModels.length === 0 && (
              <div style={{ padding: "40px 0", textAlign: "center", color: "rgba(255,255,255,0.5)" }}>
                이 분야에 연결된 모델이 아직 없습니다.
              </div>
            )}

            {!loading && !errMsg && filteredModels.length > 0 && (
              <div className="pl-list">
                {filteredModels.map((model) => (
                  <div
                    key={model.id}
                    className="pl-card"
                    onClick={() => onProductSelect?.(model)}
                  >
                    <div className="pl-card-img">
                      <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                        <circle cx="32" cy="32" r="20" fill="#3b82f6" opacity="0.3" />
                        <circle cx="32" cy="32" r="12" fill="#60a5fa" />
                      </svg>
                    </div>
                    <div className="pl-card-info">
                      <div className="pl-card-title">{model.title}</div>
                      <div className="pl-card-desc">이 완제품에 대한 모의고사를 풀어보세요.</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* FOOTER */}
        <footer className="footer">
          <div className="inner">
            <div className="footer-links">
              <button onClick={onHome}>Home</button>
              <button onClick={onBack}>Back</button>
            </div>
            <div className="footer-right">
              <span>문의 및 연락</span>
              <span>010-235-7890</span>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}