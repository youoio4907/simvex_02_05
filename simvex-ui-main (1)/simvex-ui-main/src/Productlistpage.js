// Productlistpage.js
import { useEffect, useMemo, useState } from "react";
import "./Shared.css";
import "./Productlistpage.css";

/**
 * 분야(한글) -> 포함할 모델 title 매핑 (임시)
 * DB 에 domainKey 가 없어서 일단 프론트에서 필터링한다.
 * 나중에 ModelDto 에 domainKey/categoryKey 추가하면 이 매핑은 제거 가능.
 */
const FIELD_TO_MODEL_TITLES = {
  "기계 공학": ["V4_Engine", "Robot Arm", "Robot Gripper", "Machine Vice", "Suspension"],
  "전기 전자 공학": ["Leaf Spring"], // 임시
  "항공 우주 공학": ["Drone"],
  "재료 과학": ["Suspension"], // 임시
  "화학 공학": [], // 임시
  "토목 공학": [], // 임시
};

export default function ProductListPage({ field, onHome, onBack, onLearn, onLab, onTest }) {
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState(null);

  useEffect(() => {
    let alive = true;

    async function load() {
      setLoading(true);
      setErrMsg(null);

      try {
        // ✅ 존재하는 API 만 사용
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
    if (!allow) return models; // field 없으면 전체
    if (allow.length === 0) return []; // 아직 매핑 안 된 분야
    return models.filter((m) => allow.includes(m.title));
  }, [models, field]);

  // ✅ UI 최대한 유지: 기존 레이아웃 안에서 "목록만" 렌더링
  return (
    <div className="page-root">
      {/* 상단 네비(기존 클래스/구조 유지하려고 최소 변경) */}
      <div style={{ padding: 12 }}>
        <button onClick={onBack}>←</button>
        <button onClick={onHome} style={{ marginLeft: 8 }}>Home</button>
        <span style={{ marginLeft: 12, fontWeight: 700 }}>{field}</span>
      </div>

      {loading && <div style={{ padding: 12 }}>로딩중...</div>}

      {!loading && errMsg && (
        <div style={{ padding: 12 }}>
          오류: {errMsg}
        </div>
      )}

      {!loading && !errMsg && filteredModels.length === 0 && (
        <div style={{ padding: 12 }}>
          이 분야에 연결된 모델이 아직 없다. (FIELD_TO_MODEL_TITLES 매핑을 추가해야 한다)
        </div>
      )}

      {!loading && !errMsg && filteredModels.length > 0 && (
        <div style={{ padding: 12 }}>
          {filteredModels.map((m) => (
            <div
              key={m.id}
              style={{
                padding: 12,
                marginBottom: 10,
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 10,
                cursor: "pointer",
              }}
              onClick={() => onLearn?.(m)}
            >
              <div style={{ fontWeight: 700 }}>{m.title}</div>
              <div style={{ opacity: 0.8, fontSize: 12 }}>{m.modelUrl}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}