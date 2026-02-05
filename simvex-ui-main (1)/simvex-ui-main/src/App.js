// App.js
import { useState } from "react";
import SimvexLanding from "./Simvexlanding";
import StudyPage from "./Studypage";
import ProductListPage from "./Productlistpage";
import LearnPage from "./Learnpage";
import WorkflowPage from "./Workflowpage";
import ExamPage from "./Exampage";
import ExamFieldSelectPage from "./Examfieldselectpage";
import ExamProductSelectPage from "./Examproductselectpage";

export default function App() {
  const [page, setPage] = useState("landing");
  const [selectedField, setSelectedField] = useState(null);
  const [selectedModel, setSelectedModel] = useState(null);
  const [examField, setExamField] = useState(null); // 시험 분야
  const [examProduct, setExamProduct] = useState(null); // 시험 완제품

  // Test 페이지 (모의고사)
  if (page === "exam") {
    return (
      <ExamPage
        selectedProduct={examProduct}
        onHome={() => setPage("landing")}
        onStudy={() => setPage("study")}
        onLab={() => setPage("workflow")}
        onTest={() => setPage("examFieldSelect")}
        onBack={() => setPage("examProductSelect")}
      />
    );
  }

  // 시험 완제품 선택 페이지
  if (page === "examProductSelect") {
    return (
      <ExamProductSelectPage
        field={examField}
        onHome={() => setPage("landing")}
        onBack={() => setPage("examFieldSelect")}
        onProductSelect={(product) => {
          setExamProduct(product);
          setPage("exam");
        }}
      />
    );
  }

  // 시험 분야 선택 페이지
  if (page === "examFieldSelect") {
    return (
      <ExamFieldSelectPage
        onHome={() => setPage("landing")}
        onStudy={() => setPage("study")}
        onLab={() => setPage("workflow")}
        onTest={() => setPage("examFieldSelect")}
        onFieldSelect={(fieldName) => {
          setExamField(fieldName);
          setPage("examProductSelect");
        }}
      />
    );
  }

  // Lab 페이지 (워크플로우)
  if (page === "workflow") {
    return (
      <WorkflowPage
        onHome={() => setPage("landing")}
        onStudy={() => setPage("study")}
        onTest={() => setPage("examFieldSelect")}
      />
    );
  }

  // Learn 페이지 (3D 뷰어)
  if (page === "learn") {
    return (
      <LearnPage
        selectedModel={selectedModel}
        onHome={() => setPage("landing")}
        onStudy={() => setPage("study")}
        onLab={() => setPage("workflow")}
        onTest={() => setPage("examFieldSelect")}
      />
    );
  }

  // 제품 목록 페이지
  if (page === "productList") {
    return (
      <ProductListPage
        field={selectedField}
        onHome={() => setPage("landing")}
        onBack={() => setPage("study")}
        onLab={() => setPage("workflow")}
        onTest={() => setPage("examFieldSelect")}
        onLearn={(model) => {
          setSelectedModel(model);
          setPage("learn");
        }}
      />
    );
  }

  // Study 페이지
  if (page === "study") {
    return (
      <StudyPage
        onHome={() => setPage("landing")}
        onLab={() => setPage("workflow")}
        onTest={() => setPage("examFieldSelect")}
        onFieldSelect={(fieldName) => {
          setSelectedField(fieldName);
          setPage("productList");
        }}
      />
    );
  }

  // Landing 페이지
  return (
    <SimvexLanding
      onStart={() => setPage("study")}
      onLab={() => setPage("workflow")}
      onTest={() => setPage("examFieldSelect")}
    />
  );
}