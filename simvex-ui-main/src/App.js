// App.js
import { useState } from "react";
import SimvexLanding from "./Simvexlanding";
import StudyPage from "./Studypage";
import ProductListPage from "./Productlistpage";
import LearnPage from "./Learnpage";

export default function App() {
  const [page, setPage] = useState("landing");
  const [selectedField, setSelectedField] = useState(null);
  const [selectedModel, setSelectedModel] = useState(null); // ✅ 추가 (선택한 모델)

  if (page === "learn") {
    return (
      <LearnPage
        selectedModel={selectedModel} // ✅ 추가
        onHome={() => setPage("landing")}
        onStudy={() => setPage("study")}
      />
    );
  }

  if (page === "productList") {
    return (
      <ProductListPage
        field={selectedField}
        onHome={() => setPage("landing")}
        onBack={() => setPage("study")}
        onLearn={(model) => {
          setSelectedModel(model);    // ✅ 선택 모델 저장
          setPage("learn");           // ✅ Learn 로 이동
        }}
      />
    );
  }

  if (page === "study") {
    return (
      <StudyPage
        onHome={() => setPage("landing")}
        onFieldSelect={(fieldName) => {
          setSelectedField(fieldName);
          setPage("productList");
        }}
      />
    );
  }

  return <SimvexLanding onStart={() => setPage("study")} />;
}
