import React, { useState } from "react";
import Navbar from "../user_components/Navbar";
import Sidebar from "../user_components/Sidebar.jsx";
import Performance_score from "../user_components/Dashbord_comp/Performance_score.jsx";
import Weak_areas from "../user_components/Dashbord_comp/Weak_areas.jsx";
import AI_suggestions from "../user_components/Dashbord_comp/AI_suggestions.jsx";
import Subjects_marks from "../user_components/Dashbord_comp/Subjects_marks.jsx";

const Dashboard = () => {
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);

  const handleSummarize = async () => {
    try {
      setLoading(true); // START LOADER
      setSummary("");   // Clear old summary

      if (!file) {
        alert("Please upload a PDF!");
        setLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("http://127.0.0.1:5000/summarize_pdf", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setSummary(data.summary);
    } catch (error) {
      console.error("Error during summarization:", error);
      alert("An error occurred while summarizing the PDF.");
    }

    setLoading(false); // STOP LOADER
  };

  return (
    <div>
      <div className="flex">
        <div><Sidebar /></div>

        <div className="w-screen">
          <div className="mt-3 ml-[43%] text-2xl font-bold font-monteserrat text-[#0B2C59]">
            <h1>AI Summerizer</h1>
          </div>

          <div className="m-5 bg-white">

            <input
              type="file"
              accept=".pdf"
              onChange={(e) => setFile(e.target.files[0])}
              className="shadow-[5px_5px_10px_rgba(0,0,0,0.8)] border-gray-300 w-full p-5 bg-[#01ecfd67] outline-none"
            />
            <br />

            {/* BUTTON */}
            <button
              onClick={handleSummarize}
              className="ml-[80%] mt-4 hover:bg-[#ad31aff3] group relative inline-block w-[20%] cursor-pointer border-none bg-[#1b5cb8] p-[1vw] text-center text-[1.5vw] text-white rounded-[7px] shadow-[5px_5px_10px_rgba(0,0,0,0.8)] transition-all duration-[400ms]"
            >
              <span className="relative inline-block transition-all duration-[400ms] group-hover:pr-[3.55em] after:absolute after:top-0 after:right-[-20px] after:opacity-0 after:content-['_using_AI'] after:transition-all after:duration-[700ms] group-hover:after:right-0 group-hover:after:opacity-100">
                Summarize&nbsp;
              </span>
            </button>

            {/* SUMMARY BOX */}
            <div className="border-2 mt-4 w-[100%] pb-[15%] shadow-[5px_5px_10px_rgba(0,0,0,0.8)] rounded-2xl">
              {loading ? (
                <div className="flex justify-center items-center mt-40">
                  <div className="w-10 h-10 border-4 border-[#1b5cb8] border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                <h2 className="opacity-[80%] m-3 pb-[9%]">
                  {summary.length > 0 ? summary : "Summary Output will be shown here..."}
                </h2>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
