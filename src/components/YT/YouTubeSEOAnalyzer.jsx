import { useState, useEffect } from "react";
import axios from "axios";
import "./YT.css";

export default function YouTubeSEOAnalyzer() {
  const [videoUrl, setVideoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [seoData, setSeoData] = useState(null);
  const [extractedTitles, setExtractedTitles] = useState([]);
  const [Descriptions, setExtractedDescriptions] = useState([]);
  const [networkSpeed, setNetworkSpeed] = useState(null);
  const [internetQuality, setInternetQuality] = useState("Checking...");
  const [copyStatus, setCopyStatus] = useState({});

  const analyzeSEO = async () => {
    setLoading(true);
    try {
      console.log("Analyzing SEO for:", videoUrl);

      const response = await axios.post("/api/analyze-seo", { url: videoUrl });
      setSeoData(response.data);
      console.log("SEO Data:", response.data);

      const titlesArray = [response.data.optimizedTitles[0]];

      // Ensure optimizedTitles exists and is an array before mapping
      console.log("Titlearray", titlesArray[0]);
      const extractedTitles = titlesArray[0].map((title) =>
        title.includes(",") ? title.split(",").map((part) => part.trim()) : [title]
      );
      console.log("title", extractedTitles[0]);
      setExtractedTitles(extractedTitles[0]);

      // Extract Descriptions
      const descriptionsArray = response.data.optimizedDescription || [];
      console.log("Descriptions:", descriptionsArray);
      setExtractedDescriptions(descriptionsArray);
    } catch (error) {
      console.error("Error fetching SEO data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Function to handle copying text to clipboard
  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text).then(
      () => {
        // Set this specific button's status to "copied"
        setCopyStatus({ ...copyStatus, [id]: true });
        
        // Reset the copied status after 2 seconds
        setTimeout(() => {
          setCopyStatus({ ...copyStatus, [id]: false });
        }, 2000);
      },
      (err) => {
        console.error("Could not copy text: ", err);
      }
    );
  };

  // Function to copy all optimized content
  const copyAllOptimized = () => {
    if (!seoData) return;
    
    const allTitles = extractedTitles.join('\n\n');
    const allTags = seoData.optimizedTags?.join(' ') || '';
    const allHashtags = seoData.optimizedHasTags?.join(' ') || '';
    const description = Descriptions || '';
    
    const allContent = `--- OPTIMIZED TITLES ---\n${allTitles}\n\n--- OPTIMIZED DESCRIPTION ---\n${description}\n\n--- OPTIMIZED TAGS ---\n${allTags}\n\n--- HASHTAGS ---\n${allHashtags}`;
    
    copyToClipboard(allContent, 'all');
  };

  useEffect(() => {
    // Measure network speed
    const testImage = new Image();
    const startTime = performance.now();

    testImage.src = "https://upload.wikimedia.org/wikipedia/commons/3/3a/Cat03.jpg?t=" + startTime;

    testImage.onload = () => {
      const endTime = performance.now();
      const duration = (endTime - startTime) / 1000; // in seconds
      const fileSize = 300; // KB (approximate size of test image)
      const speed = fileSize / duration; // KBps

      setNetworkSpeed(speed.toFixed(2) + " KBps");

      if (speed > 500) {
        setInternetQuality("🚀 Excellent Internet Speed");
      } else if (speed > 200) {
        setInternetQuality("👍 Good Internet Speed");
      } else if (speed > 50) {
        setInternetQuality("⚠️ Slow Internet, expect delays");
      } else {
        setInternetQuality("❌ Very Slow Internet");
      }
    };
  }, []);

  return (
    <div className="container">
      <h1 className="heading">🎯 YouTube SEO Analyzer</h1>

      <div className="input-section">
        <input
          type="text"
          placeholder="Enter YouTube Video URL"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          className="input-field"
        />
        <div className="analyze-container">
          <button
            onClick={analyzeSEO}
            className={`analyze-btn ${loading ? "loading" : ""}`}
            disabled={!videoUrl || loading}
          >
            {loading ? (
              <>
                <span className="loader"></span> Analyzing...
              </>
            ) : (
              "Analyze"
            )}
          </button>
          <p className="internet-status">{internetQuality} ({networkSpeed || "Checking..."})</p>
        </div>
      </div>

      {seoData && (
        <div className="result-container">
          <div className="result-box">
            <h2>📌 SEO Analysis</h2>

            <div className="content">
              <h3>Original Title</h3>
              <div className="content-wrapper">
                <p className="content-text">{seoData.title || "No title available"}</p>
                <button 
                  className={`copy-btn ${copyStatus['title'] ? 'copied' : ''}`}
                  onClick={() => copyToClipboard(seoData.title || "", 'title')}
                >
                  <span className="copy-icon"></span>
                  {copyStatus['title'] ? 'Copied!' : 'Copy'}
                  <span className="copy-tooltip">Copy to clipboard</span>
                </button>
              </div>
            </div>

            <div className="content">
              <h3>📝 Extracted Optimized Titles</h3>
              <ul>
                {extractedTitles.length > 0 ? (
                  extractedTitles.map((title, index) => (
                    <li key={index} className="content-wrapper">
                      <span className="content-text">{title}</span>
                      <button 
                        className={`copy-btn ${copyStatus[`title-${index}`] ? 'copied' : ''}`}
                        onClick={() => copyToClipboard(title, `title-${index}`)}
                      >
                        <span className="copy-icon"></span>
                        {copyStatus[`title-${index}`] ? 'Copied!' : 'Copy'}
                        <span className="copy-tooltip">Copy title</span>
                      </button>
                    </li>
                  ))
                ) : (
                  <li>No extracted titles available</li>
                )}
              </ul>
            </div>

            <div className="content" style={{ fontSize: "18.5px" }}>
              <h3>#️⃣ Hashtags</h3>
              <div className="content-wrapper">
                <p className="content-text">{seoData.optimizedHasTags?.length ? seoData.optimizedHasTags.join(" ") : "No optimized tags available"}</p>
                {seoData.optimizedHasTags?.length > 0 && (
                  <button 
                    className={`copy-btn ${copyStatus['hashtags'] ? 'copied' : ''}`}
                    onClick={() => copyToClipboard(seoData.optimizedHasTags.join(" "), 'hashtags')}
                  >
                    <span className="copy-icon"></span>
                    {copyStatus['hashtags'] ? 'Copied!' : 'Copy'}
                    <span className="copy-tooltip">Copy hashtags</span>
                  </button>
                )}
              </div>
            </div>

          <div className="result-box">
            <div className="content">
              <h3>🔖 Best Tags</h3>
              <div className="content-wrapper">
                <p className="content-text">{seoData.tags?.length ? seoData.tags.join(", ") : "No tags available"}</p>
                {seoData.tags?.length > 0 && (
                  <button 
                    className={`copy-btn ${copyStatus['tags'] ? 'copied' : ''}`}
                    onClick={() => copyToClipboard(seoData.tags.join(", "), 'tags')}
                  >
                    <span className="copy-icon"></span>
                    {copyStatus['tags'] ? 'Copied!' : 'Copy'}
                    <span className="copy-tooltip">Copy all tags</span>
                  </button>
                )}
              </div>
            </div>

            <div className="content">
              <h3>📌 Optimized Tags</h3>
              <div className="content-wrapper">
                <p className="content-text">{seoData.optimizedTags?.length ? seoData.optimizedTags.join(" ") : "No optimized tags available"}</p>
                {seoData.optimizedTags?.length > 0 && (
                  <button 
                    className={`copy-btn ${copyStatus['optimizedTags'] ? 'copied' : ''}`}
                    onClick={() => copyToClipboard(seoData.optimizedTags.join(" "), 'optimizedTags')}
                  >
                    <span className="copy-icon"></span>
                    {copyStatus['optimizedTags'] ? 'Copied!' : 'Copy'}
                    <span className="copy-tooltip">Copy optimized tags</span>
                  </button>
                )}
              </div>
            </div>

          

            
            <div className="content">
              <h3>📜 Extracted Optimized Descriptions</h3>
              <ul>
                {Descriptions ? (
                  <li className="content-wrapper">
                    <span className="content-text">{Descriptions}</span>
                    <button 
                      className={`copy-btn ${copyStatus['description'] ? 'copied' : ''}`}
                      onClick={() => copyToClipboard(Descriptions, 'description')}
                    >
                      <span className="copy-icon"></span>
                      {copyStatus['description'] ? 'Copied!' : 'Copy'}
                      <span className="copy-tooltip">Copy description</span>
                    </button>
                  </li>
                ) : (
                  <li>No extracted descriptions available</li>
                )}
              </ul>
            </div>

            
          </div>


            <div className="seo-score">
              <h3>🔥 SEO Score</h3>
              <p>{seoData.seoScore}/100</p>
            </div>
            
            <button
              onClick={copyAllOptimized}
              className={`copy-all-btn ${copyStatus['all'] ? 'copied' : ''}`}
            >
              <span className="copy-icon"></span>
              {copyStatus['all'] ? 'All Content Copied!' : 'Copy All Optimized Content'}
            </button>
            
            <button
              onClick={analyzeSEO}
              className={`analyze-btn ${loading ? "loading" : ""}`}
              disabled={!videoUrl || loading}
              style={{ marginTop: "1rem" }}
            >
              {loading ? (
                <>
                  <span className="loader"></span> Analyzing...
                </>
              ) : (
                "Re-Analyze"
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}