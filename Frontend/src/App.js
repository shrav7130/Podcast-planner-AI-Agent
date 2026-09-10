import { marked } from 'marked';
import React, { useState } from 'react';

function App() {
  const [guestName, setGuestName] = useState('');
  const [guestBackground, setGuestBackground] = useState('');
  const [planTone, setPlanTone] = useState('Professional/Informative'); 
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState(null);
  const [suggestions, setSuggestions] = useState(null); 
  const [isGeneratingSuggestions, setIsGeneratingSuggestions] = useState(false);


  const handleGeneratePlan = async () => {
    if (!guestName || !guestBackground) return;
    
    setIsGenerating(true);

    try {

      const response = await fetch(
        `http://127.0.0.1:8000/plan?guest_name=${encodeURIComponent(
          guestName
        )}&topic=${encodeURIComponent(guestBackground)}&tone=${encodeURIComponent(planTone)}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const newPlan = data.podcast_plan;
      setGeneratedPlan(newPlan); // string from backend
      
      setSuggestions(null); 
      const newEntry = {
        guestName,
        guestBackground,
        plan: newPlan,
        timestamp: new Date().toLocaleString()
      };

      const updatedHistory = [newEntry, ...history].slice(0, 10); 
      setHistory(updatedHistory);
      localStorage.setItem("podcastHistory", JSON.stringify(updatedHistory));

    } catch (error) {
      console.error('Error generating plan:', error);
      setGeneratedPlan("Error fetching plan. Please check backend.");
    }

    setIsGenerating(false);
  };


  const handleGenerateSuggestions = async () => {
    if (!guestName || !guestBackground) return;

    setIsGeneratingSuggestions(true);
    setSuggestions(null); // Clear previous suggestions

    try {
        const response = await fetch(
            `http://127.0.0.1:8000/suggestions/?guest_name=${encodeURIComponent(guestName)}&topic=${encodeURIComponent(guestBackground)}`
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setSuggestions(data.suggestions);
    } catch (error) {
        console.error('Error generating suggestions:', error);
        setSuggestions("Error fetching suggestions. Please try again.");
    } finally {
        setIsGeneratingSuggestions(false);
    }
  };


  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem("podcastHistory");
    return saved ? JSON.parse(saved) : [];
  });

  const loadHistoryPlan = (planContent) => {
    setGeneratedPlan(planContent);
  };
  
  const handleClearHistory = () => {
    const confirmClear = window.confirm("Are you sure you want to delete all history? This cannot be undone.");
    if (confirmClear) {
        setHistory([]); 
        localStorage.removeItem("podcastHistory"); // Clear local storage
        setGeneratedPlan(null); 
    }
  };


  
 
  const handleDownloadPDF = async () => {
    if (!generatedPlan) return;

    try {
      const response = await fetch("http://127.0.0.1:8000/generate-pdf/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: generatedPlan }),
      });

      if (!response.ok) throw new Error("Failed to generate PDF");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "episode_plan.pdf"; // filename user will see
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading PDF:", error);
    }
  };
  
  return (
    <>
      <style jsx>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: linear-gradient(180deg, hsl(220, 26%, 6%), hsl(220, 26%, 4%)); color: hsl(220, 15%, 96%); min-height: 100vh; line-height: 1.6; }
        .container { 
            max-width: 1200px; 
            width: 100%; 
            padding: 2rem; 
        }
        .hero-section { text-align: center; margin-bottom: 4rem; }
        .hero-icon { display: inline-flex; align-items: center; gap: 1rem; margin-bottom: 2rem; animation: float 6s ease-in-out infinite; }
        .icon-container { padding: 0.75rem; background: hsla(260, 85%, 65%, 0.1); border: 1px solid hsla(260, 85%, 65%, 0.2); border-radius: 50%; font-size: 2rem; }
        .hero-title { font-size: 4rem; font-weight: 700; margin-bottom: 1.5rem; line-height: 1.1; }
        .gradient-text { background: linear-gradient(135deg, hsl(260, 85%, 65%), hsl(260, 85%, 75%)); background-clip: text; -webkit-background-clip: text; color: transparent; }
        .hero-description { font-size: 1.25rem; color: hsl(220, 15%, 65%); max-width: 600px; margin: 0 auto 2rem; }
        .form-card { background: linear-gradient(145deg, hsl(220, 26%, 8%), hsl(220, 20%, 10%)); backdrop-filter: blur(8px); border: 1px solid hsla(220, 20%, 18%, 0.5); border-radius: 1rem; padding: 2rem; max-width: 600px; margin: 0 auto 4rem; box-shadow: 0 8px 24px hsla(260, 85%, 65%, 0.15); }
        .input-group { margin-bottom: 1.5rem; }
        .input-label { display: block; font-weight: 500; margin-bottom: 0.5rem; color: hsl(220, 15%, 96%); }
        .input-field { 
            width: 100%; 
            padding: 0.75rem 1rem; 
            background: hsl(220, 20%, 12%); 
            border: 1px solid hsl(220, 20%, 18%); 
            border-radius: 0.5rem; 
            color: hsl(220, 15%, 96%); 
            font-size: 1rem; 
            transition: all 0.2s ease;
            -webkit-appearance: none; 
            -moz-appearance: none;
            appearance: none;
        }
        .input-field:focus { outline: none; background: hsl(220, 20%, 20%); border-color: hsla(260, 85%, 65%, 0.5); box-shadow: 0 0 0 3px hsla(260, 85%, 65%, 0.1); }
        .input-field::placeholder { color: hsla(220, 15%, 65%, 0.6); }
        .generate-btn { width: 100%; padding: 1rem 2rem; background: linear-gradient(135deg, hsl(260, 85%, 65%), hsl(260, 85%, 75%)); color: hsl(220, 15%, 96%); border: 1px solid hsla(260, 85%, 65%, 0.2); border-radius: 0.5rem; font-size: 1.125rem; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem; }
        .generate-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .spinner { width: 1.25rem; height: 1.25rem; border: 2px solid transparent; border-top: 2px solid currentColor; border-radius: 50%; animation: spin 1s linear infinite; }
        .results-container { display: flex; flex-direction: column; gap: 2rem; animation: fadeIn 0.5s ease-out; width: 100%; }
        .result-card { background: linear-gradient(145deg, hsl(220, 26%, 8%), hsl(220, 20%, 10%)); backdrop-filter: blur(8px); border: 1px solid hsla(220, 20%, 18%, 0.5); border-radius: 1rem; padding: 2rem; box-shadow: 0 16px 40px hsla(260, 85%, 65%, 0.1); }
        .intro-text { font-size: 1.125rem; line-height: 1.7; color: hsla(220, 15%, 96%, 0.9); padding: 1rem; background: hsla(220, 20%, 14%, 0.3); border-radius: 0.5rem; border-left: 4px solid hsl(200, 80%, 55%); white-space: pre-wrap; }
        @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-10px); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .intro-text h1, .intro-text h2, .intro-text h3 {
          color: hsl(260, 85%, 75%);
          margin-top: 1rem;
        }

        .intro-text p {
          margin-bottom: 1rem;
        }

        .intro-text ul {
          padding-left: 1.5rem;
          list-style-type: disc;
        }

        .intro-text ol {
          padding-left: 2rem; 
          margin-left: 0;
          
        }

        .intro-text li {
          margin-bottom: 0.75rem;
          line-height: 1.4;
        }
          .intro-text {
          font-size: 1.125rem;
          line-height: 1.7;
          
        }
        .card-title{
          font-size:1.7rem;
          padding-left: 2rem;
        }
        
        /* Layout Styles for Sidebar */
        .app-layout {
            display: flex;
            min-height: 100vh; 
            gap: 2rem;
            
        }

        .sidebar {
            width: 250px; 
            flex-shrink: 0;
            background: linear-gradient(145deg, hsl(220, 26%, 8%), hsl(220, 20%, 10%));
            border: 1px solid hsla(220, 20%, 18%, 0.5);
            border-radius: 0; 
            padding: 1.5rem 1rem;
            max-height: 100vh; 
            overflow-y: auto;
            box-shadow: 0 8px 24px hsla(260, 85%, 65%, 0.15);
            position: sticky; 
            top: 0;
            margin-left: 0;
            border-right: 1px solid hsla(220, 20%, 18%, 0.5);
        }

        .sidebar-header {
          display: flex;
          align-items: center;
          justify-content: space-between; 
          margin-bottom: 1rem; /* Reduced margin for button */
          padding-left: 0.5rem;
        }

        .sidebar-header h3 {
          font-size: 1.5rem;
          font-weight: 600;
          color: hsl(220, 15%, 96%);
        }

        .main-content {
            flex-grow: 1; 
            display: flex;
            flex-direction: column;
            align-items: center; 
            padding-right: 2rem; 
        }
        .history-list li {
          margin-bottom: 0.5rem !important;
          border-bottom: 1px solid hsla(220, 20%, 18%, 0.5);
          padding-bottom: 0.5rem;
          transition: background-color 0.2s;
        }

        .history-list li:hover {
          background-color: hsla(260, 85%, 65%, 0.05);
          cursor: pointer;
        }

        .history-btn {
            display: block;
            width: 100%;
            background: none !important;
            border: none !important;
            color: hsl(220, 15%, 96%) !important;
            cursor: pointer;
            text-align: left;
            padding: 0.5rem;
            border-radius: 0.25rem;
            transition: color 0.2s;
            line-height: 1.3;
        }

        .history-btn:hover {
          color: hsl(260, 85%, 75%) !important;
        }
        
        .history-btn strong {
            font-weight: 600;
            display: block;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .history-btn span {
            font-size: 0.75rem;
            color: hsla(220, 15%, 65%, 0.8);
            display: block;
            margin-top: 0.2rem;
        }
        
        .clear-history-btn {
            background: none;
            border: 1px solid hsla(0, 80%, 50%, 0.5);
            color: hsla(0, 80%, 70%, 1);
            padding: 0.3rem 0.5rem;
            border-radius: 0.5rem;
            font-size: 0.85rem;
            cursor: pointer;
            transition: background-color 0.2s;
        }

        .clear-history-btn:hover {
            background-color: hsla(0, 80%, 50%, 0.1);
        }
        
      `}</style>
      
      <div className="app-layout">
     
        <div className="sidebar">
          <div className="sidebar-header">
            <h3 className="card-title" style={{paddingLeft: 0, fontSize: '1.5rem'}}>History</h3>
       
            {history.length > 0 && (
                <button 
                    onClick={handleClearHistory} 
                    className="clear-history-btn"
                >
                    Clear History
                </button>
            )}
            
          </div>
          
          {history.length === 0 ? (
            <p style={{ color: "gray", paddingLeft: "0.5rem", fontSize: "0.9rem" }}>No previous plans.</p>
          ) : (
            <ul className="history-list" style={{ listStyle: "none", padding: 0 }}>
              {history.map((entry, idx) => (
                <li key={idx}>
                  <button
                    onClick={() => loadHistoryPlan(entry.plan)}
                    className="history-btn"
                  >
                    <strong>{entry.guestName}</strong>
                    <span>{entry.guestBackground} - {new Date(entry.timestamp).toLocaleDateString()}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Main Content Area */}
        <div className="main-content">
          <div className="container">
            <div className="hero-section">
              <div className="hero-icon">
                <div className="icon-container">🎙️</div>
              </div>
              <h1 className="hero-title">
                <span className="gradient-text">Podcast Planner</span><br />
                <span>AI Agent</span>
              </h1>
              <p className="hero-description">
                Transform your podcast ideas into comprehensive episode plans with AI-powered content generation.
              </p>
            </div>

            <div className="form-card">
              <div className="input-group">
                <label className="input-label">Guest Name</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g., Elon Musk"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                />
              </div>

              <div className="input-group">
                <label className="input-label">Guest Background / Topic</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g., entrepreneur, technology, space exploration"
                  value={guestBackground}
                  onChange={(e) => setGuestBackground(e.target.value)}
                />
              </div>
              
              <div className="input-group">
                <label className="input-label">Desired Podcast Tone/Style</label>
                <select
                    className="input-field"
                    value={planTone}
                    onChange={(e) => setPlanTone(e.target.value)}
                >
                    <option value="Professional/Informative">Professional/Informative 🧐</option>
                    <option value="Casual/Conversational">Casual/Conversational ☕</option>
                    <option value="Deep Dive/Academic">Deep Dive/Academic 🧠</option>
                    <option value="Humorous/Lighthearted">Humorous/Lighthearted 😂</option>
                    <option value="Interview-Style/Q&A">Interview-Style/Q&A 🎤</option>
                </select>
              </div>

              <button
                onClick={handleGeneratePlan}
                disabled={isGenerating || !guestName || !guestBackground}
                className="generate-btn"
                type="button"
                
              >
                {isGenerating ? <><div className="spinner"></div> Generating...</> : "Generate Plan"}
              </button>
            </div>
            
            {generatedPlan && (
              <div className="results-container">
                <div className="result-card">
                  
                  <h3 className="card-title">Podcast Plan</h3>
                  <div
                      className="intro-text"
                      dangerouslySetInnerHTML={{ __html: marked(generatedPlan) }}
                  ></div>
                  <button
                    onClick={handleGenerateSuggestions}
                    disabled={isGeneratingSuggestions || !guestName || !guestBackground}
                    className="generate-btn"
                    type="button" 
                    style={{ marginTop: "1.5rem", background: 'hsl(170, 85%, 35%)' }} 
                >
                    {isGeneratingSuggestions ? <>Generating Suggestions...</> : "Get Similar Profile Suggestions"}
                </button>
                {suggestions && (
                    <div className="intro-text" style={{ marginTop: "1.5rem" }}>
                        <div dangerouslySetInnerHTML={{ __html: marked(suggestions) }}></div>
                    </div>
                )}
                  <button
                    onClick={handleDownloadPDF}
                    className="generate-btn"
                    type="button" 
                    style={{ marginTop: "1rem" }}
                  >
                    Download PDF
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
