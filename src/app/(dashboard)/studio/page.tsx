"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User, Mic, Sparkles, Loader2, ArrowRight } from "lucide-react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import api from "@/lib/api";
import { Avatar, Audio as AudioModel } from "@/types";

export default function StudioPage() {
  const router = useRouter();
  
  const [avatars, setAvatars] = useState<Avatar[]>([]);
  const [audios, setAudios] = useState<AudioModel[]>([]);
  
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
  const [selectedAudio, setSelectedAudio] = useState<string | null>(null);
  const [script, setScript] = useState("");
  const [runName, setRunName] = useState("");
  
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        setLoading(true);
        const [avatarRes, audioRes] = await Promise.all([
          api.get("/api/avatars/"),
          api.get("/api/audios/")
        ]);
        setAvatars(avatarRes.data || []);
        setAudios(audioRes.data || []);
        
        // Auto-select first items if available
        if (avatarRes.data?.[0]) setSelectedAvatar(avatarRes.data[0].id);
        if (audioRes.data?.[0]) setSelectedAudio(audioRes.data[0].id);
      } catch (err) {
        toast.error("Failed to load your assets.");
      } finally {
        setLoading(false);
      }
    };
    fetchAssets();
  }, []);

  const handleEnhance = async () => {
    if (!script.trim()) {
      toast.error("Please write a rough idea first.");
      return;
    }
    setIsEnhancing(true);
    try {
      const response = await api.post("/api/scripts/generate", { idea: script });
      setScript(response.data.script);
      toast.success("Script magically enhanced!");
    } catch (err) {
      toast.error("Failed to enhance script.");
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleGenerate = async () => {
    if (!selectedAvatar || !selectedAudio || !script.trim()) {
      toast.error("Please select an avatar, voice, and write a script.");
      return;
    }

    const avatar = avatars.find(a => a.id === selectedAvatar);
    const audio = audios.find(a => a.id === selectedAudio);

    if (!avatar || !audio) return;

    setGenerating(true);
    try {
      await api.post("/api/runs/", {
        script,
        audio_prompt_url: audio.audio_url,
        avatar_url: avatar.image_url,
        name: runName.trim() || null
      });
      
      toast.success("Generation started successfully! Redirecting to History.");
      router.push("/history");
    } catch (err) {
      toast.error("Failed to start generation.");
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">The Studio</h2>
        <p className="text-zinc-500">Configure your digital twin and generate a new video.</p>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        
        {/* Left Column: Selections */}
        <div className="lg:col-span-5 space-y-8">
          {/* Step 1: Avatar */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-zinc-900 border-b pb-2">
              <div className="w-6 h-6 rounded-full bg-zinc-900 text-white flex items-center justify-center text-xs font-bold">1</div>
              <h3 className="font-semibold text-lg">Select Avatar</h3>
            </div>
            
            {avatars.length === 0 ? (
               <div className="p-4 border rounded-lg bg-zinc-50 text-sm text-zinc-500 text-center">
                 No avatars found. Go to Asset Library to upload one.
               </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-2 pb-2">
                {avatars.map((avatar) => (
                  <div 
                    key={avatar.id}
                    onClick={() => setSelectedAvatar(avatar.id)}
                    className={`cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${selectedAvatar === avatar.id ? 'border-zinc-900 ring-2 ring-zinc-900 ring-offset-2' : 'border-transparent hover:border-zinc-300'} bg-zinc-100 flex flex-col`}
                  >
                    <div className="h-28 bg-zinc-200 relative overflow-hidden">
                       {avatar.image_url ? (
                         <img src={avatar.image_url} alt={avatar.name} className="w-full h-full object-cover" />
                       ) : (
                         <div className="flex items-center justify-center h-full text-zinc-400"><User className="w-8 h-8" /></div>
                       )}
                    </div>
                    <div className="p-2 bg-white flex-1 flex flex-col justify-center">
                      <p className="text-xs font-medium truncate text-center" title={avatar.name}>{avatar.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Step 2: Audio */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-zinc-900 border-b pb-2">
              <div className="w-6 h-6 rounded-full bg-zinc-900 text-white flex items-center justify-center text-xs font-bold">2</div>
              <h3 className="font-semibold text-lg">Select Voice</h3>
            </div>

            {audios.length === 0 ? (
               <div className="p-4 border rounded-lg bg-zinc-50 text-sm text-zinc-500 text-center">
                 No voices found. Go to Asset Library to upload one.
               </div>
            ) : (
              <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2">
                {audios.map(audio => (
                  <div 
                    key={audio.id}
                    onClick={() => setSelectedAudio(audio.id)}
                    className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${selectedAudio === audio.id ? 'border-zinc-900 bg-zinc-50 shadow-sm' : 'border-zinc-100 hover:border-zinc-300'}`}
                  >
                    <div className={`p-2 rounded-md ${selectedAudio === audio.id ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-zinc-600'}`}>
                      <Mic className="h-4 w-4" />
                    </div>
                    <p className="text-sm font-medium flex-1 truncate">{audio.name}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Script & Generate */}
        <div className="lg:col-span-7 bg-zinc-50 rounded-2xl p-6 border border-zinc-100 flex flex-col">
          <div className="mb-4">
            <Input 
              placeholder="e.g. Acme Promo Video (Optional)" 
              value={runName} 
              onChange={(e) => setRunName(e.target.value)} 
              className="bg-white border-zinc-200"
            />
          </div>
          
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-zinc-900">
              <div className="w-6 h-6 rounded-full bg-zinc-900 text-white flex items-center justify-center text-xs font-bold">3</div>
              <h3 className="font-semibold text-lg">Write Script</h3>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className={`h-8 text-xs gap-1.5 transition-all
                ${isEnhancing 
                  ? 'border-indigo-200 bg-indigo-50 text-indigo-600' 
                  : 'bg-white text-zinc-600 border-zinc-200 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50/50'
                }
              `}
              onClick={handleEnhance}
              disabled={isEnhancing || !script.trim()}
            >
              {isEnhancing ? (
                <><Sparkles className="w-3.5 h-3.5 animate-pulse" /> Enhancing...</>
              ) : (
                <><Sparkles className="w-3.5 h-3.5" /> Enhance with AI</>
              )}
            </Button>
          </div>

          <div className="relative flex-1 min-h-[300px] sm:min-h-[400px]">
            <Textarea 
              disabled={isEnhancing}
              placeholder="Type what you want your digital twin to say here... Make sure to use natural sentence structures for the best lip-sync results."
              className={`absolute inset-0 h-full w-full resize-none transition-all duration-300 shadow-sm text-base leading-relaxed p-4 bg-white border-zinc-200 focus-visible:ring-zinc-900
                ${isEnhancing ? 'opacity-30 blur-[1px]' : 'opacity-100'}
              `}
              value={script}
              onChange={(e) => setScript(e.target.value)}
            />
            {isEnhancing && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                <div className="w-64 h-64 opacity-80">
                  <DotLottieReact
                    src="/sparkles.lottie"
                    loop
                    autoplay
                  />
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 pt-6 border-t border-zinc-200 flex items-center justify-between">
            <div className="text-sm text-zinc-500 hidden sm:block">
              {script.length > 0 ? `${script.trim().split(/\s+/).length} words estimating ~${Math.ceil(script.trim().split(/\s+/).length / 2.5)} seconds` : "0 words"}
            </div>
            <Button 
              size="lg" 
              className="bg-zinc-900 hover:bg-zinc-800 text-white w-full sm:w-auto shadow-sm"
              onClick={handleGenerate}
              disabled={generating || !script.trim() || !selectedAvatar || !selectedAudio}
            >
              {generating ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Starting Engine...</>
              ) : (
                <>Generate Video <ArrowRight className="ml-2 w-4 h-4" /></>
              )}
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
}
