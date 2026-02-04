import React, { useState } from 'react';
import { generateImage, editImage, generateVideo } from '../services/geminiService';
import { ImageSize, AspectRatio } from '../types';

type LabTab = 'GEN_IMG' | 'EDIT_IMG' | 'GEN_VIDEO';

const MediaLab: React.FC = () => {
  const [activeTab, setActiveTab] = useState<LabTab>('GEN_IMG');
  const [prompt, setPrompt] = useState('');
  const [selectedSize, setSelectedSize] = useState<ImageSize>(ImageSize.S_1K);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>(AspectRatio.LANDSCAPE);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null); // Base64
  const [resultMedia, setResultMedia] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusText, setStatusText] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleExecute = async () => {
    if (!prompt && activeTab !== 'GEN_VIDEO') return; 
    // Video might just animate an image without text prompt if image provided, strictly speaking Veo supports prompt+image. 
    // We'll enforce prompt for text-to-video or img+prompt.

    setIsProcessing(true);
    setResultMedia(null);
    setStatusText('INITIALIZING_MODEL...');

    try {
      if (activeTab === 'GEN_IMG') {
        setStatusText('GENERATING_PIXELS (Gemini 3 Pro)...');
        const res = await generateImage(prompt, selectedSize);
        setResultMedia(res);
      } else if (activeTab === 'EDIT_IMG') {
        if (!uploadedImage) throw new Error("Upload an image first");
        setStatusText('EDITING_IMAGE (Gemini 2.5 Flash)...');
        const res = await editImage(uploadedImage, prompt);
        setResultMedia(res);
      } else if (activeTab === 'GEN_VIDEO') {
        setStatusText('RENDERING_VIDEO (Veo 3.1) - THIS MAY TAKE TIME...');
        const res = await generateVideo(prompt, aspectRatio, uploadedImage || undefined);
        setResultMedia(res);
      }
    } catch (error: any) {
      setStatusText(`ERROR: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-[#0b1221] border border-gray-800 rounded-lg p-6 shadow-2xl">
      <h2 className="text-3xl font-cyber text-purple-400 mb-6 flex items-center gap-2">
        <span className="material-icons">movie_filter</span> MEDIA_LAB
      </h2>

      {/* Tabs */}
      <div className="flex border-b border-gray-800 mb-6">
        {[
          { id: 'GEN_IMG', label: 'GENERATE IMAGE' },
          { id: 'EDIT_IMG', label: 'EDIT IMAGE' },
          { id: 'GEN_VIDEO', label: 'GENERATE VIDEO' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id as LabTab); setResultMedia(null); setUploadedImage(null); }}
            className={`px-4 py-2 font-mono text-sm transition-colors ${
              activeTab === tab.id 
                ? 'border-b-2 border-purple-500 text-purple-400' 
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          
          {/* File Upload for Edit/Video */}
          {(activeTab === 'EDIT_IMG' || activeTab === 'GEN_VIDEO') && (
            <div className="border border-dashed border-gray-600 rounded p-4 text-center hover:border-purple-500 transition-colors">
               <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" id="fileUpload" />
               <label htmlFor="fileUpload" className="cursor-pointer flex flex-col items-center">
                  <span className="text-gray-400 text-sm mb-2">
                    {uploadedImage ? "IMAGE_LOADED" : activeTab === 'GEN_VIDEO' ? "UPLOAD SOURCE IMAGE (OPTIONAL)" : "UPLOAD SOURCE IMAGE"}
                  </span>
                  {uploadedImage && (
                    <img src={uploadedImage} alt="Preview" className="h-20 object-contain border border-gray-700" />
                  )}
                  {!uploadedImage && <span className="text-purple-500 text-xs">[CLICK TO UPLOAD]</span>}
               </label>
            </div>
          )}

          {/* Prompt Input */}
          <div>
            <label className="block text-xs font-mono text-gray-500 mb-1">PROMPT_INPUT</label>
            <textarea
              className="w-full bg-black border border-gray-700 rounded p-3 text-white font-mono text-sm focus:border-purple-500 outline-none h-24"
              placeholder={activeTab === 'EDIT_IMG' ? "E.g., Add a cyber helmet..." : "Describe the scene..."}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
          </div>

          {/* Configs */}
          {activeTab === 'GEN_IMG' && (
             <div className="flex gap-4">
               {Object.values(ImageSize).map(size => (
                 <button 
                   key={size} 
                   onClick={() => setSelectedSize(size)}
                   className={`px-3 py-1 rounded text-xs font-bold border ${
                     selectedSize === size ? 'bg-purple-900 border-purple-500 text-white' : 'border-gray-700 text-gray-500'
                   }`}
                 >
                   {size}
                 </button>
               ))}
             </div>
          )}

          {activeTab === 'GEN_VIDEO' && (
             <div className="flex gap-4">
               {Object.values(AspectRatio).map(ratio => (
                 <button 
                   key={ratio} 
                   onClick={() => setAspectRatio(ratio)}
                   className={`px-3 py-1 rounded text-xs font-bold border ${
                     aspectRatio === ratio ? 'bg-purple-900 border-purple-500 text-white' : 'border-gray-700 text-gray-500'
                   }`}
                 >
                   {ratio}
                 </button>
               ))}
             </div>
          )}

          <button
            onClick={handleExecute}
            disabled={isProcessing}
            className={`w-full py-3 font-cyber font-bold rounded shadow-lg transition-transform active:scale-95 ${
              isProcessing 
                ? 'bg-gray-700 cursor-not-allowed text-gray-400' 
                : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white'
            }`}
          >
            {isProcessing ? 'PROCESSING...' : 'EXECUTE'}
          </button>
          
          {isProcessing && (
             <div className="text-xs text-purple-300 font-mono animate-pulse text-center">
               STATUS: {statusText}
             </div>
          )}
        </div>

        {/* Output Display */}
        <div className="bg-black border border-gray-800 rounded flex items-center justify-center min-h-[300px] relative overflow-hidden group">
           {!resultMedia && !isProcessing && (
             <div className="text-gray-600 font-mono text-xs text-center">
               [AWAITING_OUTPUT] <br/>
               SYSTEM_READY
             </div>
           )}
           {isProcessing && (
             <div className="absolute inset-0 bg-purple-900/10 flex items-center justify-center">
               <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
             </div>
           )}
           {resultMedia && activeTab !== 'GEN_VIDEO' && (
             <img src={resultMedia} alt="Generated" className="max-w-full max-h-full object-contain" />
           )}
           {resultMedia && activeTab === 'GEN_VIDEO' && (
             <video controls src={resultMedia} className="max-w-full max-h-full" autoPlay loop />
           )}
           
           {/* Decoration */}
           <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-purple-500"></div>
           <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-purple-500"></div>
        </div>
      </div>
    </div>
  );
};

export default MediaLab;