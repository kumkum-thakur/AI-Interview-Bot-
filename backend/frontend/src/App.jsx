import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from "recharts";
import "./App.css";

function App() {
  const [activePage, setActivePage] = useState("dashboard");

  const [topic, setTopic] = useState("OOP");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);

  const [loading, setLoading] = useState(false);
  const [questionLoading, setQuestionLoading] = useState(false);

  const [questionCount, setQuestionCount] = useState(0);
  const [totalScore, setTotalScore] = useState(0);

  const [mockMode, setMockMode] = useState(false);
  const [mockFinished, setMockFinished] = useState(false);
  const [topicScores, setTopicScores] = useState({});

  const [resumeFile, setResumeFile] = useState(null);
  const [resumeLoading, setResumeLoading] = useState(false);
  const [resumeAnalysis, setResumeAnalysis] = useState(null);

  const averageScore =
    questionCount === 0 ? 0 : (totalScore / questionCount).toFixed(1);

  const fetchHistory = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/history");
      const data = await response.json();
      setHistory(data.reverse().slice(0, 5));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const generateQuestion = async () => {
    setQuestionLoading(true);

    const response = await fetch(
      `http://127.0.0.1:8000/generate-question?topic=${topic}`
    );

    const data = await response.json();
    setQuestion(data.question);
    setQuestionLoading(false);
  };

  const analyzeResume = async () => {
    if (!resumeFile) {
      alert("Please upload a resume PDF first");
      return;
    }

    setResumeLoading(true);

    const formData = new FormData();
    formData.append("file", resumeFile);

    try {
      const response = await fetch("http://127.0.0.1:8000/analyze-resume", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.error) {
        alert(data.error);
      } else {
        setResumeAnalysis(data);
        setQuestion(data.question);
        setAnswer("");
      }
    } catch (error) {
      console.log(error);
      alert("Something went wrong while analyzing resume");
    }

    setResumeLoading(false);
  };

  const handleAdaptiveQuestion = async () => {
    if (!result) {
      alert("Evaluate an answer first");
      return;
    }

    const response = await fetch(
      `http://127.0.0.1:8000/adaptive-question?topic=${result.topic}&previous_score=${result.overall_score}`
    );

    const data = await response.json();

    setQuestion(data.question);
    setAnswer("");
    setActivePage("dashboard");
  };

  const handleSubmit = async () => {
    if (!question.trim() || !answer.trim()) {
      alert("Please enter both question and answer");
      return;
    }

    if (mockFinished) {
      alert("Mock interview is already completed. Start a new mock interview.");
      return;
    }

    setLoading(true);

    const response = await fetch("http://127.0.0.1:8000/evaluate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ question, answer }),
    });

    const data = await response.json();

    const newCount = questionCount + 1;
    const newTotal = totalScore + data.overall_score;

    setResult(data);
    setQuestionCount(newCount);
    setTotalScore(newTotal);

    setTopicScores((prev) => {
      const current = prev[data.topic] || {
        total: 0,
        count: 0,
      };

      return {
        ...prev,
        [data.topic]: {
          total: current.total + data.overall_score,
          count: current.count + 1,
        },
      };
    });

    if (mockMode && newCount >= 5) {
      setMockFinished(true);
    }

    setQuestion("");
    setAnswer("");
    fetchHistory();
    setLoading(false);
  };

  const clearHistory = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete all interview history?"
    );

    if (!confirmDelete) return;

    try {
      await fetch("http://127.0.0.1:8000/history", {
        method: "DELETE",
      });

      setHistory([]);
    } catch (error) {
      console.log(error);
    }
  };

  const radarData = result
    ? [
        { skill: "Technical", score: result.technical_accuracy },
        { skill: "Clarity", score: result.clarity },
        { skill: "Depth", score: result.depth },
        { skill: "Communication", score: result.communication },
      ]
    : [];

  const strongestSkill =
    radarData.length > 0
      ? radarData.reduce((a, b) => (a.score > b.score ? a : b))
      : null;

  const weakestSkill =
    radarData.length > 0
      ? radarData.reduce((a, b) => (a.score < b.score ? a : b))
      : null;

  const downloadReport = () => {
    if (!result) {
      alert("Evaluate an answer first");
      return;
    }

    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.text("InterviewIQ AI Report", 20, 20);

    doc.setFontSize(12);
    doc.text(`Topic: ${result.topic}`, 20, 40);
    doc.text(`Difficulty: ${result.difficulty_level}`, 20, 50);
    doc.text(`Overall Score: ${result.overall_score}/10`, 20, 60);

    autoTable(doc, {
      startY: 75,
      head: [["Skill", "Score"]],
      body: [
        ["Technical", `${result.technical_accuracy}/10`],
        ["Clarity", `${result.clarity}/10`],
        ["Depth", `${result.depth}/10`],
        ["Communication", `${result.communication}/10`],
        [
          "Strongest Skill",
          `${strongestSkill?.skill} (${strongestSkill?.score}/10)`,
        ],
        [
          "Weakest Skill",
          `${weakestSkill?.skill} (${weakestSkill?.score}/10)`,
        ],
      ],
    });

    let y = doc.lastAutoTable.finalY + 15;

    doc.text("Strengths:", 20, y);
    y += 10;
    result.strengths?.forEach((item) => {
      doc.text(`• ${item}`, 25, y);
      y += 8;
    });

    y += 5;
    doc.text("Weaknesses:", 20, y);
    y += 10;
    result.weaknesses?.forEach((item) => {
      doc.text(`• ${item}`, 25, y);
      y += 8;
    });

    y += 5;
    doc.text("Improvements:", 20, y);
    y += 10;
    result.improvements?.forEach((item) => {
      doc.text(`• ${item}`, 25, y);
      y += 8;
    });

    y += 5;
    doc.text("Learning Roadmap:", 20, y);
    y += 10;
    doc.text(`Focus Area: ${result.focus_area}`, 25, y);
    y += 10;

    result.roadmap_steps?.forEach((step) => {
      doc.text(`• ${step}`, 25, y);
      y += 8;
    });

    doc.save("InterviewIQ_Report.pdf");
  };

  const resetSession = () => {
    setQuestionCount(0);
    setTotalScore(0);
    setResult(null);
    setQuestion("");
    setAnswer("");
    setMockMode(false);
    setMockFinished(false);
    setTopicScores({});
  };

  const startMockInterview = () => {
    setMockMode(true);
    setMockFinished(false);
    setQuestionCount(0);
    setTotalScore(0);
    setResult(null);
    setQuestion("");
    setAnswer("");
    setTopicScores({});
    setActivePage("dashboard");
  };

  const ResultCard = () =>
    result && (
      <div className="result-card">
        <h2>Latest Evaluation</h2>

        <div className="score-box">
          <span>Overall Score</span>
          <strong>{result.overall_score}/10</strong>
        </div>

        <div className="grid">
          <p><b>Topic:</b> {result.topic}</p>
          <p>
            <b>Difficulty:</b>{" "}
            <span className={`badge ${result.difficulty_level?.toLowerCase()}`}>
              {result.difficulty_level}
            </span>
          </p>
          <p><b>Quality:</b> {result.answer_quality}</p>
          <p><b>Technical:</b> {result.technical_accuracy}/10</p>
          <p><b>Clarity:</b> {result.clarity}/10</p>
          <p><b>Depth:</b> {result.depth}/10</p>
          <p><b>Communication:</b> {result.communication}/10</p>
        </div>

        <div className="feedback-section">
          <div className="feedback-box">
            <h3>📊 Skill Radar</h3>

            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="skill" />
                <PolarRadiusAxis domain={[0, 10]} />
                <Radar
                  dataKey="score"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.6}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="feedback-box">
            <h3>🏆 Strongest Skill</h3>
            <p>{strongestSkill?.skill} ({strongestSkill?.score}/10)</p>
          </div>

          <div className="feedback-box">
            <h3>⚠️ Weakest Skill</h3>
            <p>{weakestSkill?.skill} ({weakestSkill?.score}/10)</p>
          </div>

          <div className="feedback-box">
            <h3>Strengths</h3>
            <ul>
              {result.strengths?.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="feedback-box">
            <h3>Weaknesses</h3>
            <ul>
              {result.weaknesses?.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="feedback-box">
            <h3>Improvements</h3>
            <ul>
              {result.improvements?.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="feedback-box">
            <h3>🎯 Focus Area</h3>
            <p>{result.focus_area}</p>

            <h3>📚 Learning Steps</h3>
            <ul>
              {result.roadmap_steps?.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ul>

            <button onClick={downloadReport} type="button">
              📄 Download Report
            </button>
          </div>
        </div>
      </div>
    );

  return (
    <div className="layout">
      <aside className="sidebar">
        <h2>InterviewIQ</h2>

        <button onClick={() => setActivePage("dashboard")}>🏠 Dashboard</button>
        <button onClick={() => setActivePage("resume")}>📄 Resume Interview</button>
        <button onClick={() => setActivePage("history")}>📜 History</button>
        <button onClick={() => setActivePage("analytics")}>📊 Analytics</button>
        <button onClick={() => setActivePage("mock")}>🎤 Mock Interview</button>
      </aside>

      <main className="app">
        <h1>InterviewIQ AI</h1>
        <p className="subtitle">AI-powered interview answer evaluation system</p>

        {activePage === "dashboard" && (
          <>
            <div className="session-card">
              <p>
                <b>Questions Attempted:</b> {questionCount}
                {mockMode && !mockFinished ? " / 5" : ""}
              </p>

              <p><b>Average Score:</b> {averageScore}/10</p>
            </div>

            <div className="form-card">
              <select value={topic} onChange={(e) => setTopic(e.target.value)}>
                <option value="OOP">OOP</option>
                <option value="DBMS">DBMS</option>
                <option value="OS">Operating System</option>
                <option value="CN">Computer Networks</option>
                <option value="DSA">DSA</option>
              </select>

              <input
                type="text"
                placeholder="Enter interview question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                disabled={mockFinished}
              />

              <textarea
                placeholder="Enter candidate answer"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                disabled={mockFinished}
              />

              <button onClick={generateQuestion} type="button" disabled={mockFinished}>
                {questionLoading ? "Generating Question..." : "Generate AI Question"}
              </button>

              <button onClick={handleSubmit} disabled={mockFinished}>
                {loading ? "Evaluating..." : "Evaluate Answer"}
              </button>

              {result && !mockFinished && (
                <button onClick={handleAdaptiveQuestion} type="button">
                  Generate Next Adaptive Question
                </button>
              )}
            </div>

            <ResultCard />
          </>
        )}

        {activePage === "resume" && (
          <>
            <div className="form-card">
              <h2>📄 Resume-Based Interview</h2>
              <p>
                Upload your resume PDF. InterviewIQ will analyze your skills,
                projects, resume strength, and generate a personalized question.
              </p>

              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => setResumeFile(e.target.files[0])}
              />

              <button onClick={analyzeResume} type="button">
                {resumeLoading ? "Analyzing Resume..." : "Analyze Resume"}
              </button>
            </div>

            {resumeAnalysis && (
              <div className="result-card">
                <h2>Resume Analysis</h2>

                <div className="score-box">
                  <span>Resume Strength Score</span>
                  <strong>{resumeAnalysis.resume_strength_score}/100</strong>
                </div>

                <div className="feedback-box">
                  <h3>🧠 Candidate Summary</h3>
                  <p>{resumeAnalysis.summary}</p>
                </div>

                <div className="feedback-box">
                  <h3>✅ Detected Skills</h3>
                  <ul>
                    {resumeAnalysis.detected_skills?.map((skill, index) => (
                      <li key={index}>{skill}</li>
                    ))}
                  </ul>
                </div>

                <div className="feedback-box">
                  <h3>🚀 Projects Found</h3>
                  <ul>
                    {resumeAnalysis.projects?.map((project, index) => (
                      <li key={index}>{project}</li>
                    ))}
                  </ul>
                </div>

                <div className="feedback-box">
                  <h3>🎯 Resume-Based Question</h3>
                  <p>{resumeAnalysis.question}</p>
                </div>
              </div>
            )}

            <div className="form-card">
              <input
                type="text"
                placeholder="Resume-based question will appear here"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
              />

              <textarea
                placeholder="Enter your answer"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
              />

              <button onClick={handleSubmit}>
                {loading ? "Evaluating..." : "Evaluate Resume Answer"}
              </button>
            </div>

            <ResultCard />
          </>
        )}

        {activePage === "history" && (
          <div className="history-section">
            <h2>Interview History</h2>

            <button onClick={clearHistory} type="button">
              Clear History
            </button>

            {history.length === 0 && <p>No interview history found.</p>}

            {history.map((item) => (
              <div className="history-card" key={item.id}>
                <h3>{item.topic}</h3>
                <p><b>Question:</b> {item.question}</p>
                <p><b>Score:</b> {item.overall_score}/10</p>
                <p><b>Quality:</b> {item.answer_quality}</p>
                <p><b>Recommendation:</b> {item.final_recommendation}</p>
              </div>
            ))}
          </div>
        )}

        {activePage === "analytics" && (
          <div className="session-summary">
            <h2>Session Analytics</h2>
            <p><b>Total Questions:</b> {questionCount}</p>
            <p><b>Average Score:</b> {averageScore}/10</p>
            <p>
              <b>Session Status:</b>{" "}
              {averageScore >= 7
                ? "Strong performance"
                : averageScore >= 5
                ? "Needs moderate improvement"
                : "Needs more practice"}
            </p>

            <h3 style={{ marginTop: "25px" }}>Topic Performance</h3>

            {Object.keys(topicScores).length === 0 ? (
              <p>No topic data yet.</p>
            ) : (
              Object.entries(topicScores).map(([topicName, stats]) => (
                <p key={topicName}>
                  <b>{topicName}</b> : {(stats.total / stats.count).toFixed(1)}/10
                </p>
              ))
            )}

            <button onClick={resetSession} type="button">
              Reset Session
            </button>
          </div>
        )}

        {activePage === "mock" && (
          <div className="session-summary">
            <h2>Mock Interview Mode</h2>

            <p><b>Interview Type:</b> 5-question adaptive interview</p>
            <p>
              <b>Status:</b>{" "}
              {mockFinished
                ? "Completed"
                : mockMode
                ? "In Progress"
                : "Not Started"}
            </p>
            <p><b>Progress:</b> {questionCount}/5</p>
            <p><b>Average Score:</b> {averageScore}/10</p>

            <button onClick={startMockInterview} type="button">
              {mockMode ? "Restart Mock Interview" : "Start Mock Interview"}
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;