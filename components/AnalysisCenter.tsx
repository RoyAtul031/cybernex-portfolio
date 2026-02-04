import React, { useState } from 'react';
import { analyzeMedia } from '../services/geminiService';

const AnalysisCenter: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>('');
  const [prompt, setPrompt] = useState('Describe this image in detail and check for any security vulnerabilities visible.');
  const [analysis, setAnalysis] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMimeType(file.type);
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!image) return;
    setLoading(true);
    try {
      // Analyze Image using Gemini 3 Pro
      const result = await analyzeMedia(prompt, 'image', image, mimeType);
      setAnalysis(result || "No analysis returned.");
    } catch (error: any) {
      setAnalysis(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#0b1221] border border-gray-800 rounded-lg p-6 shadow-2xl">
       <h2 className="text-3xl font-cyber text-green-400 mb-6 flex items-center gap-2">
        <span className="material-icons">visibility</span> VISION_SYSTEM
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="border-2 border-dashed border-green-800/50 rounded-lg p-8 flex flex-col items-center justify-center bg-black hover:border-green-500 transition-colors">
            <input type="file" accept="image/*" onChange={handleUpload} className="hidden" id="visionUpload" />
            <label htmlFor="visionUpload" className="cursor-pointer text-center">
              {image ? (
                <img src={image} alt="To Analyze" className="max-h-64 object-contain border border-green-900" />
              ) : (
                <>
                  <span className="material-icons text-4xl text-green-700 mb-2">add_a_photo</span>
                  <p className="text-green-500 font-mono text-sm">UPLOAD_IMAGE_TARGET</p>
                </>
              )}
            </label>
          </div>
          
          <textarea 
            value={prompt} 
            onChange={e => setPrompt(e.target.value)}
            className="w-full bg-black border border-gray-700 text-green-100 p-2 font-mono text-sm h-20 focus:border-green-500 outline-none"
          />

          <button 
            onClick={handleAnalyze} 
            disabled={loading || !image}
            className="w-full bg-green-700 hover:bg-green-600 text-white font-cyber py-2 rounded disabled:opacity-50"
          >
            {loading ? 'ANALYZING_DATA_STREAM...' : 'INITIATE_SCAN'}
          </button>
        </div>

        <div className="bg-black border border-gray-800 p-4 rounded h-[400px] overflow-y-auto">
          <p className="text-gray-500 font-mono text-xs mb-2">OUTPUT_LOG:</p>
          {analysis ? (
            <pre className="whitespace-pre-wrap font-mono text-sm text-green-300">
              {analysis}
            </pre>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-700 font-mono text-sm">
              [NO_DATA]
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalysisCenter;