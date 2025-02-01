import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [username, setUserName] = useState("");
  const [roast, setRoast] = useState("");
  const [leetcodeData, setLeetcodeData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [visitorCount, setVisitorCount] = useState(0);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

  useEffect(() => {
    const storedCount = localStorage.getItem("visitorCount");
    const newCount = storedCount ? parseInt(storedCount) + 1 : 1;
    setVisitorCount(newCount);
    localStorage.setItem("visitorCount", newCount);
  }, []);

  useEffect(() => {
    document.body.className = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  const fetchLeetcodeData = async (url) => {
  
    try {
      const res = await fetch(url);
      const data = await res.json();
   

      if (!data || !data.totalSolved) {
        setRoast("User not found or invalid username!");
        setLeetcodeData(null);
        return null;
      }

      return data;
    } catch (err) {
    
      alert("Error fetching user data!");
      return null;
    }
  };

  async function generateAnswer() {
    if (!username) return;


    setLoading(true);

    const data = await fetchLeetcodeData(`https://leetcode-stats-api.herokuapp.com/${username}`);
    
    if (!data) {
      setLoading(false);
      return;
    }

    setLeetcodeData(data);

    const roastPrompt = `
    You are an AI that roasts LeetCode users based on their performance, especially highlighting flaws in their problem-solving abilities. Your roast should be dynamic, addressing the user's unique LeetCode stats in a savage, witty, and humorous manner.
    
    Here are the stats for ${username}:
    - Total Problems Solved: ${data.totalSolved}
    - Easy Problems Solved: ${data.easySolved}
    - Medium Problems Solved: ${data.mediumSolved}
    - Hard Problems Solved: ${data.hardSolved}
    - Total Questions Available: ${data.totalQuestions}
    - Acceptance Rate: ${data.acceptanceRate}%
    
    - Ranking: ${data.ranking}
    
    Use these stats to create a personalized roast that feels fresh and humorous each time.
    
    
    Keep it funny, sharp, and creative. The goal is to make ${username} laugh at how brutal it is while also reflecting on their stats. Don't make the roast too repetitive, and avoid using the same phrases for different users. Be dynamic, merciless, and keep it under 200 words. Dont show any mercy, make him cry with the roast.
    `;
    
   

    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${import.meta.env.VITE_REACT_APP_API_KEY}`,
        {
          contents: [{ parts: [{ text: roastPrompt }] }]
        }
      );

 
      setRoast(response.data.candidates[0].content.parts[0].text);
    } catch (error) {
     
      setRoast("An error occurred while generating the roast.");
    } finally {
      setLoading(false);
    }
  }

  const toggleTheme = () => {
    setTheme(prev => (prev === "dark" ? "light" : "dark"));
  };

  const waveLoadingText = "Cooking".split("").map((char, index) => (
    <span key={index} className="wave-letter">
      {char}
    </span>
  ));

  return (
    <>
      {loading ? (
        <div className="loading">{waveLoadingText}</div>
      ) : (
        <>
        <div className="app-container">
          <div className="card">
            <h1>Leetcode Roaster 🔥</h1>
            <p>Expect a burn harsher than your acceptance rate</p>
            <input
              value={username}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Enter LeetCode username"
            />
            <button onClick={generateAnswer} disabled={loading} className="roastbtn">
              Generate Roast
            </button>

            {roast && <div className="roast-box"><p>{roast}</p></div>}
          </div>

          

          <button className="theme-toggle" onClick={toggleTheme}>
            {theme === "dark" ? "🌞" : "🌙"}
          </button>
        </div>
        <footer>
            <p>Made by <a href="https://my-portfolio-zeta-six-85.vercel.app/">Arvind Puri</a></p>
            <p>Visitor Count: {visitorCount}</p>
          </footer>
          </>
      )}
    </>
  );
}

export default App;
