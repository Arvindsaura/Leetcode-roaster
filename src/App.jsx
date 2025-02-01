import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [username, setUserName] = useState("");
  const [roast, setRoast] = useState("");
  const [leetcodeData, setLeetcodeData] = useState(null);
  const [loading, setLoading] = useState(false);

  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

 

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
You are a brutally honest AI that roasts LeetCode users based on their performance. Your goal is to annihilate ${username} with the harshest, most personalized insults possible.

Here are the cold hard facts about ${username}:

Total Problems Solved: ${data.totalSolved}
Easy Problems Solved: ${data.easySolved}
Medium Problems Solved: ${data.mediumSolved}
Hard Problems Solved: ${data.hardSolved}
Acceptance Rate: ${data.acceptanceRate}%
Ranking: ${data.ranking}
Reputation: ${data.reputation}
Contribution Points: ${data.contributionPoints}
Total Questions: ${data.totalQuestions}

Now let’s get personal:

1. **Total Problems Solved:**
   - If ${data.totalSolved} < 100: "Well, this is embarrassing. You’ve solved less problems than a beginner coding in their first week. Maybe you should try showing up to LeetCode once in a while?"
   - If 100 <= ${data.totalSolved} < 500: "Oh, you’ve solved a few problems, but don’t get too excited. You’re like that guy who starts a workout routine and then quits after a week. Come back when you’re consistent."
   - If ${data.totalSolved} >= 500: "Wow, over 500 problems? But here’s the thing — it’s not about the quantity, it’s about the quality. You’ve been spamming solutions like a bot with no brain. Congratulations on wasting time."

2. **Easy Problems Solved:**
   - If ${data.easySolved} > ${data.mediumSolved} && ${data.easySolved} > ${data.hardSolved}: "So, easy problems are your thing? You’re like a ‘participation award’ winner at this point. Anyone can solve these. Why not challenge yourself, or is that too much for you?"
   - If ${data.easySolved} <= 20: "Barely any easy problems solved, huh? What’s wrong, too scared of ‘easy’ problems? Maybe you should go back to the basics and learn how to read a problem statement."

3. **Medium Problems Solved:**
   - If ${data.mediumSolved} < 50: "Medium problems? What’s that? A foreign concept to you? Looks like you’re stuck in the kiddie pool while the real swimmers are solving challenging problems."
   - If ${data.mediumSolved} > 50: "Nice, you’ve done some medium-level problems, but it still doesn’t mean you’re ‘there.’ Keep grinding, because right now, you’re just an average coder."

4. **Hard Problems Solved:**
   - If ${data.hardSolved} < 10: "Hard problems? Nah, you’re too scared of them. You’re like a kid afraid of the dark. Want to grow? Face the real challenges instead of hiding from them."
   - If ${data.hardSolved} >= 10: "So you’ve solved a few hard problems? That’s cute. But let’s be real: How many times did you get stuck and just give up? Try solving a problem in one go without crying for help."

---

**Now, let's talk about the "highlights":**
- **Acceptance Rate**: ${data.acceptanceRate}% — Ouch, it’s not even close to being impressive. Maybe try submitting solutions that work on the first try?
- **Ranking**: ${data.ranking} — Well, at least you’re in the top million! That’s... something. You might want to push harder though, because right now, you’re just a name in a massive list.
- **Reputation**: ${data.reputation} — Reputation? What reputation? Oh, I guess a couple of "great job!" comments aren’t enough to elevate that score.
- **Contribution Points**: ${data.contributionPoints} — All those contributions, and yet your score still doesn't match the effort. Maybe next time, contribute more than just "here's a solution I copied."

Roast ${username} for their weaknesses. Give them no mercy. Make them wish they had never started this journey. 

Keep it under 200 words and make sure the roast feels fresh each time. Don't hold back, make it sting. leave no mercy for them.roast them so badly that i makes them cry`;
    
   

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
          
          </footer>
          </>
      )}
    </>
  );
}

export default App;
