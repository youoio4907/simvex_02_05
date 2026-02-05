import { useState } from "react";
import "./Shared.css";
import "./Exampage.css";

/* ════════════════════════════════════════════ */
/*  모의고사 문제 데이터                         */
/* ════════════════════════════════════════════ */
const EXAM_DATA = [
  {
    question: "제트 엔진의 브레이톤 순환(Brayton Cycle)에서 가장 먼저 일어나는 과정은?",
    options: ["압축", "연소", "팽창", "배기"],
    answer: 0
  },
  {
    question: "터빈 블레이드의 재료로 주로 사용되는 초내열 합금의 특징이 아닌 것은?",
    options: ["고온에서 강도 유지", "내식성 우수", "저밀도·경량", "크리프 저항성"],
    answer: 2
  },
  {
    question: "제트 엔진의 추력을 증가시키는 방법으로 적절하지 않은 것은?",
    options: ["압축비 증가", "터빈 입구 온도 상승", "질량 유량 증가", "배기 속도 감소"],
    answer: 3
  },
  {
    question: "항공기 엔진의 바이패스 비(Bypass Ratio)가 높을수록 나타나는 특성은?",
    options: ["연료 효율 향상", "최고 속도 증가", "엔진 중량 감소", "소음 증가"],
    answer: 0
  },
  {
    question: "압축기의 서지(Surge) 현상을 방지하기 위한 방법이 아닌 것은?",
    options: ["가변 스테이터 베인 사용", "블리드 밸브 개방", "회전수 급격히 증가", "입구 가이드 베인 조절"],
    answer: 2
  },
  {
    question: "제트 엔진의 열효율을 나타내는 지표로 가장 적절한 것은?",
    options: ["압력비", "온도비", "비추력", "열효율"],
    answer: 3
  },
  {
    question: "터보팬 엔진에서 팬(Fan)의 주된 역할은?",
    options: ["연료 분사", "공기 압축", "바이패스 공기 생성", "배기가스 냉각"],
    answer: 2
  },
  {
    question: "제트 엔진의 연소실 설계 시 고려해야 할 가장 중요한 요소는?",
    options: ["연소 효율 및 안정성", "무게 최소화", "제조 비용 절감", "외관 디자인"],
    answer: 0
  },
  {
    question: "항공기 엔진의 추력 역전(Thrust Reversal) 장치의 목적은?",
    options: ["이륙 시 추력 증가", "착륙 시 제동력 제공", "연료 절약", "소음 감소"],
    answer: 1
  },
  {
    question: "제트 엔진의 노즐(Nozzle)이 수렴-발산(Convergent-Divergent) 형태인 이유는?",
    options: ["무게 감소", "초음속 유동 생성", "소음 감소", "제조 용이성"],
    answer: 1
  },
  {
    question: "터빈의 냉각 방법이 아닌 것은?",
    options: ["필름 냉각", "대류 냉각", "충돌 냉각", "복사 냉각"],
    answer: 3
  },
  {
    question: "제트 엔진의 성능을 나타내는 지표 중 '비추력(Specific Thrust)'의 단위는?",
    options: ["N/kg", "N·s/kg", "kg/s", "N"],
    answer: 0
  },
  {
    question: "압축기 실속(Compressor Stall)의 원인으로 적절하지 않은 것은?",
    options: ["높은 받음각", "낮은 회전수", "외부 물체 흡입", "정상 작동 조건"],
    answer: 3
  },
  {
    question: "제트 엔진의 흡입구(Inlet) 설계 시 가장 중요한 목표는?",
    options: ["압력 손실 최소화", "무게 최소화", "제조 비용 절감", "외관 개선"],
    answer: 0
  },
  {
    question: "터보제트 엔진과 터보팬 엔진의 가장 큰 차이점은?",
    options: ["연소실 구조", "터빈 개수", "바이패스 덕트 유무", "노즐 형태"],
    answer: 2
  },
  {
    question: "제트 엔진의 SFC(Specific Fuel Consumption)는 무엇을 나타내는가?",
    options: ["단위 추력당 연료 소모량", "시간당 연료 소모량", "거리당 연료 소모량", "무게당 연료 소모량"],
    answer: 0
  },
  {
    question: "항공기 엔진의 EPR(Engine Pressure Ratio)은 무엇을 측정하는가?",
    options: ["압축기 입구와 출구의 압력비", "터빈 입구와 출구의 압력비", "엔진 전체 입구와 출구의 압력비", "연소실 입구와 출구의 압력비"],
    answer: 2
  },
  {
    question: "제트 엔진의 압축기 블레이드가 겪는 주요 응력 형태는?",
    options: ["인장 응력", "압축 응력", "전단 응력", "비틀림 응력"],
    answer: 0
  },
  {
    question: "터빈 블레이드의 크리프(Creep) 현상이란?",
    options: ["순간적인 파손", "피로 균열", "고온에서 시간에 따른 변형", "부식"],
    answer: 2
  },
  {
    question: "제트 엔진의 애프터버너(Afterburner)의 주된 목적은?",
    options: ["연료 효율 향상", "소음 감소", "단시간 추력 증대", "엔진 수명 연장"],
    answer: 2
  }
];

/* ════════════════════════════════════════════ */
/*  ExamPage                                    */
/* ════════════════════════════════════════════ */
export default function ExamPage({ onHome, onStudy, onLab, onTest, selectedProduct, onBack }) {
  const [activeNav, setActiveNav] = useState("Test");
  const navItems = ["Home", "Study", "CAD", "Lab", "Test"];

  // 시험 상태
  const [examStarted, setExamStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState(Array(EXAM_DATA.length).fill(null));
  const [examFinished, setExamFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30 * 60); // 30분 (초 단위)

  const handleNav = (item) => {
    setActiveNav(item);
    if (item === "Home") onHome();
    if (item === "Study") onStudy?.();
    if (item === "Lab") onLab?.();
    if (item === "Test") onTest?.();
  };

  // 시험 시작
  const startExam = () => {
    setExamStarted(true);
    setCurrentQuestion(0);
    setAnswers(Array(EXAM_DATA.length).fill(null));
    setExamFinished(false);
    setTimeLeft(30 * 60);
  };

  // 답안 선택
  const selectAnswer = (answerIndex) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerIndex;
    setAnswers(newAnswers);
  };

  // 다음 문제
  const nextQuestion = () => {
    if (currentQuestion < EXAM_DATA.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  // 이전 문제
  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  // 시험 제출
  const submitExam = () => {
    setExamFinished(true);
  };

  // 점수 계산
  const calculateScore = () => {
    let correct = 0;
    answers.forEach((answer, index) => {
      if (answer === EXAM_DATA[index].answer) correct++;
    });
    return correct;
  };

  // 시간 포맷 (분:초)
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <>
      <div className="noise-overlay" />
      <div className="ambient-glow glow-1" />
      <div className="ambient-glow glow-2" />

      <div className="page-wrapper">
        {/* NAV */}
        <nav className="nav">
          <div className="inner">
            <div className="nav-logo" onClick={onHome}>
              <div className="nav-logo-icon">
                <svg viewBox="0 0 18 18" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round">
                  <circle cx="9" cy="9" r="3" /><path d="M9 2v2M9 14v2M2 9h2M14 9h2" />
                </svg>
              </div>
              <span className="nav-logo-text">SIMVEX</span>
            </div>
            <div className="nav-links">
              {navItems.map(item => (
                <button key={item} className={`nav-link${activeNav === item ? " active" : ""}`} onClick={() => handleNav(item)}>{item}</button>
              ))}
            </div>
          </div>
        </nav>

        {/* EXAM BODY */}
        <section className="exam-body">
          <div className="inner">

            {!examStarted ? (
              /* 시작 화면 */
              <div className="exam-start">
                <div className="exam-start-icon">
                  <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                    <rect x="15" y="10" width="50" height="60" rx="4" fill="rgba(37,99,235,0.1)" stroke="#2563eb" strokeWidth="2" />
                    <line x1="25" y1="22" x2="55" y2="22" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" />
                    <line x1="25" y1="32" x2="50" y2="32" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" />
                    <line x1="25" y1="42" x2="52" y2="42" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" />
                    <line x1="25" y1="52" x2="48" y2="52" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" />
                    <circle cx="21" cy="32" r="2" fill="#2563eb" />
                    <circle cx="21" cy="42" r="2" fill="#2563eb" />
                    <circle cx="21" cy="52" r="2" fill="#2563eb" />
                  </svg>
                </div>
                <h2 className="exam-start-title">
                  {selectedProduct?.title || "항공 우주 공학"} 모의고사
                </h2>
                <div className="exam-start-info">
                  <div className="exam-info-item">
                    <span className="exam-info-label">문항 수</span>
                    <span className="exam-info-value">{EXAM_DATA.length}문항</span>
                  </div>
                  <div className="exam-info-item">
                    <span className="exam-info-label">시험 시간</span>
                    <span className="exam-info-value">30분</span>
                  </div>
                  <div className="exam-info-item">
                    <span className="exam-info-label">합격 점수</span>
                    <span className="exam-info-value">60점 이상</span>
                  </div>
                </div>
                <div className="exam-start-desc">
                  제트 엔진의 작동 원리, 구조, 성능에 관한 문제로 구성되어 있습니다.<br />
                  각 문항은 4지선다형이며, 시험 중 이전 문제로 돌아가 답을 수정할 수 있습니다.
                </div>
                <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
                  {onBack && (
                    <button className="exam-back-btn" onClick={onBack}>
                      뒤로가기
                    </button>
                  )}
                  <button className="exam-start-btn" onClick={startExam}>시험 시작하기</button>
                </div>
              </div>
            ) : examFinished ? (
              /* 결과 화면 */
              <div className="exam-result">
                <div className="exam-result-icon">
                  <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                    <circle cx="40" cy="40" r="35" fill="rgba(34,197,94,0.1)" stroke="#22c55e" strokeWidth="3" />
                    <path d="M25 40l10 10 20-20" stroke="#22c55e" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <h2 className="exam-result-title">시험 완료</h2>
                <div className="exam-result-score">
                  <span className="exam-score-num">{calculateScore()}</span>
                  <span className="exam-score-den">/ {EXAM_DATA.length}</span>
                </div>
                <div className="exam-result-percent">
                  {Math.round((calculateScore() / EXAM_DATA.length) * 100)}점
                </div>
                <div className="exam-result-msg">
                  {calculateScore() >= EXAM_DATA.length * 0.6
                    ? "🎉 합격입니다! 훌륭한 성적입니다."
                    : "아쉽게도 불합격입니다. 다시 도전해보세요!"}
                </div>
                <div className="exam-result-btns">
                  <button className="exam-retry-btn" onClick={startExam}>다시 보기</button>
                  <button className="exam-home-btn" onClick={onHome}>홈으로</button>
                </div>
              </div>
            ) : (
              /* 시험 진행 화면 */
              <div className="exam-progress">
                {/* 상단 정보 바 */}
                <div className="exam-header">
                  <div className="exam-progress-info">
                    문제 {currentQuestion + 1} / {EXAM_DATA.length}
                  </div>
                  <div className="exam-timer">
                    ⏱ 남은 시간: {formatTime(timeLeft)}
                  </div>
                </div>

                {/* 진행률 바 */}
                <div className="exam-progress-bar-bg">
                  <div className="exam-progress-bar-fill" style={{ width: `${((currentQuestion + 1) / EXAM_DATA.length) * 100}%` }} />
                </div>

                {/* 문제 */}
                <div className="exam-question-card">
                  <div className="exam-question-num">Q{currentQuestion + 1}.</div>
                  <div className="exam-question-text">{EXAM_DATA[currentQuestion].question}</div>

                  {/* 선택지 */}
                  <div className="exam-options">
                    {EXAM_DATA[currentQuestion].options.map((option, idx) => (
                      <button
                        key={idx}
                        className={`exam-option${answers[currentQuestion] === idx ? " selected" : ""}`}
                        onClick={() => selectAnswer(idx)}
                      >
                        <span className="exam-option-num">{idx + 1}</span>
                        <span className="exam-option-text">{option}</span>
                        {answers[currentQuestion] === idx && (
                          <span className="exam-option-check">✓</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 하단 버튼 */}
                <div className="exam-nav-btns">
                  <button className="exam-prev-btn" disabled={currentQuestion === 0} onClick={prevQuestion}>
                    이전 문제
                  </button>
                  {currentQuestion === EXAM_DATA.length - 1 ? (
                    <button className="exam-submit-btn" onClick={submitExam}>
                      제출하기
                    </button>
                  ) : (
                    <button className="exam-next-btn" onClick={nextQuestion}>
                      다음 문제
                    </button>
                  )}
                </div>

                {/* 문제 번호 네비게이션 */}
                <div className="exam-question-nav">
                  {EXAM_DATA.map((_, idx) => (
                    <button
                      key={idx}
                      className={`exam-q-num${currentQuestion === idx ? " active" : ""}${answers[idx] !== null ? " answered" : ""}`}
                      onClick={() => setCurrentQuestion(idx)}
                    >
                      {idx + 1}
                    </button>
                  ))}
                </div>
              </div>
            )}

          </div>
        </section>

        {/* FOOTER */}
        <footer className="footer">
          <div className="inner">
            <div className="footer-links">{navItems.map(item => <button key={item} onClick={() => handleNav(item)}>{item}</button>)}</div>
            <div className="footer-right"><span>문의 및 연락</span><span>010-235-7890</span></div>
          </div>
        </footer>
      </div>
    </>
  );
}