import React, { useState } from "react";
import Navbar from "../user_components/Navbar";
import Sidebar from "../user_components/Sidebar.jsx";
import { API_ENDPOINTS } from "../config";
import { handleError, handleSuccess } from "../utils";
import { ToastContainer } from "react-toastify";

const Dashboard = () => {
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);

  const handleSummarize = async () => {
    try {
      setLoading(true); // START LOADER
      setSummary("");   // Clear old summary

      if (!file) {
        handleError("Please upload a PDF!");
        setLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(API_ENDPOINTS.ML.SUMMARIZE, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to summarize PDF");
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      const formattedSummary = data.summary.replace(/\*\*(.*?)\*\*/g, '<br/><span class="font-bold text-[#fd1a01]">$1</span>');
      setSummary(formattedSummary);
      handleSuccess("PDF summarized successfully!");
    } catch (error) {
      console.error("Error during summarization:", error);
      handleError(error.message || "An error occurred while summarizing the PDF.");
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

            <div className="mb-6">
              <label className="block text-gray-700 font-bold mb-2">Upload Document (PDF)</label>
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => {
                  setFile(e.target.files[0]);
                }}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-3 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-[#1b5cb8]
                  hover:file:bg-blue-100
                  border border-dashed border-gray-300 rounded-lg p-2 bg-gray-50 cursor-pointer"
              />
            </div>
            <br />

            {/* BUTTON */}
            <button
              onClick={handleSummarize}
              className="ml-[80%] mt-4 hover:bg-[#ad31aff3] group relative inline-block w-[20%] cursor-pointer border-none bg-gradient-to-r from-[#207dff] to-[#950fc6] hover:shadow-xl p-[1vw] text-center text-[1.5vw] text-white rounded-[7px] shadow-[5px_5px_10px_rgba(0,0,0,0.8)] transition-all duration-[400ms]"
            >
              <span className="relative inline-block transition-all duration-[400ms] group-hover:pr-[3.55em] after:absolute after:top-0 after:right-[-20px] after:opacity-0 after:content-['_using_AI'] after:transition-all after:duration-[700ms] group-hover:after:right-0 group-hover:after:opacity-100">
                Summarize&nbsp;
              </span>
            </button>

            <div className="border-2 mt-4 w-[100%] pb-[15%] shadow-[5px_5px_10px_rgba(0,0,0,0.8)] rounded-2xl">
              {loading ? (
                <div className="flex justify-center items-center mt-40">
                  <div className="w-10 h-10 border-4 border-[#1b5cb8] border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                <div className="opacity-[80%] m-3 pb-[9%] text-lg font-monteserrat">
                  <div dangerouslySetInnerHTML={{ 
                  __html: summary.length > 0 ? summary : "Summary Output will be shown here..." 
                }} 
                />
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Dashboard;
