"use client";

import { useState, useEffect, useRef } from "react";
import { Plus, User, Mic, FileAudio, FileImage, Loader2, Camera, StopCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import api from "@/lib/api";
import { Avatar, Audio as AudioModel } from "@/types";

export default function AssetLibraryPage() {
  const [avatars, setAvatars] = useState<Avatar[]>([]);
  const [audios, setAudios] = useState<AudioModel[]>([]);
  const [loading, setLoading] = useState(true);

  // Upload states
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploadType, setUploadType] = useState<"avatar" | "audio">("avatar");
  const [uploadMode, setUploadMode] = useState<"file" | "capture">("file");
  const [assetName, setAssetName] = useState("");
  const [assetFile, setAssetFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  // Capture refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  
  const [isRecording, setIsRecording] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    fetchAssets();
  }, []);

  // Cleanup media streams when modal closes
  useEffect(() => {
    if (!uploadModalOpen) {
      stopMediaTracks(); // clean up when modal closes
      setAssetFile(null); // reset selected file
      setUploadMode("file"); // reset mode
    }
  }, [uploadModalOpen]);

  // Restart stream when mode switches to capture
  useEffect(() => {
    if (uploadModalOpen && uploadMode === "capture") {
      startMediaStream();
    } else {
      stopMediaTracks();
    }
  }, [uploadMode, uploadModalOpen]);

  const fetchAssets = async () => {
    try {
      setLoading(true);
      const [avatarRes, audioRes] = await Promise.all([
        api.get("/api/avatars/"),
        api.get("/api/audios/")
      ]);
      setAvatars(avatarRes.data);
      setAudios(audioRes.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load assets. Are you logged in?");
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assetFile || !assetName) {
      toast.error("Please provide a name and select/capture a file.");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("name", assetName);
    formData.append("file", assetFile);

    try {
      if (uploadType === "avatar") {
        await api.post("/api/avatars/", formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        toast.success("Avatar uploaded successfully!");
      } else {
        await api.post("/api/audios/", formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        toast.success("Voice sample uploaded successfully!");
      }

      setUploadModalOpen(false);
      setAssetName("");
      setAssetFile(null);
      fetchAssets(); // Refresh lists
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const openUpload = (type: "avatar" | "audio") => {
    setUploadType(type);
    setUploadModalOpen(true);
  };

  // --- Capture Subsystem ---
  
  const startMediaStream = async () => {
    try {
      if (uploadType === "avatar") {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setStream(stream);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } else {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        setStream(stream);
      }
    } catch (err) {
      toast.error("Failed to access camera or microphone. Please check permissions.");
    }
  };

  const stopMediaTracks = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    setStream(null);
    if (isRecording) {
      setIsRecording(false);
    }
  };

  const captureImage = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          if (blob) {
            const fi = new File([blob], "captured-avatar.jpg", { type: "image/jpeg" });
            setAssetFile(fi);
            toast.success("Picture captured!");
          }
        }, "image/jpeg");
      }
    }
  };

  const toggleAudioRecording = () => {
    if (isRecording) {
      // Stop recording
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        mediaRecorderRef.current.stop();
        setIsRecording(false);
      }
    } else {
      // Start recording
      if (stream) {
        audioChunksRef.current = [];
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        
        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) audioChunksRef.current.push(e.data);
        };
        
        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
          const fi = new File([audioBlob], "recorded-voice.webm", { type: "audio/webm" });
          setAssetFile(fi);
          toast.success("Voice recorded!");
        };
        
        mediaRecorder.start();
        setIsRecording(true);
      }
    }
  };

  // --- Render ---

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Asset Library</h2>
          <p className="text-zinc-500">Manage your trained visual avatars and voice clones.</p>
        </div>
        <Dialog open={uploadModalOpen} onOpenChange={setUploadModalOpen}>
          <DialogTrigger asChild>
            {/* The actual buttons are in the tabs below, but this is a global hidden trigger or fallback */}
            <div className="hidden"></div>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Upload or Capture {uploadType === "avatar" ? "Avatar" : "Voice"}</DialogTitle>
              <DialogDescription>
                {uploadType === "avatar" 
                  ? "Upload a clear picture, or use your webcam to take one right now." 
                  : "Upload a clean audio sample, or record it directly via your microphone."}
              </DialogDescription>
            </DialogHeader>

            <Tabs value={uploadMode} onValueChange={(val: any) => setUploadMode(val)} className="w-full mt-2">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="file">Upload File</TabsTrigger>
                <TabsTrigger value="capture">Use {uploadType === "avatar" ? "Camera" : "Microphone"}</TabsTrigger>
              </TabsList>
            </Tabs>

            <form onSubmit={handleUpload} className="space-y-6 pt-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Display Name</Label>
                <Input 
                  id="name" 
                  value={assetName} 
                  onChange={(e) => setAssetName(e.target.value)} 
                  placeholder={uploadType === "avatar" ? "e.g., Casual Office Look" : "e.g., Podcast Voice"} 
                  required 
                />
              </div>
              
              {/* Conditional File Input vs Capture UI */}
              <div className="grid gap-2">
                <Label>{uploadMode === "file" ? "File" : "Capture"}</Label>
                
                {uploadMode === "file" ? (
                  <Input 
                    id="file" 
                    type="file" 
                    accept={uploadType === "avatar" ? "image/png, image/jpeg, image/jpg" : "audio/mpeg, audio/wav, audio/mp3"}
                    onChange={(e) => setAssetFile(e.target.files?.[0] || null)}
                    required 
                    className="cursor-pointer file:text-zinc-600 file:bg-zinc-100 file:border-0 file:mr-4 file:px-4 file:py-1 file:rounded-md hover:file:bg-zinc-200"
                  />
                ) : (
                  <div className="border rounded-md p-4 bg-zinc-50 flex flex-col items-center justify-center min-h-[200px]">
                    {uploadType === "avatar" ? (
                      <>
                        <div className="w-full relative rounded-md overflow-hidden bg-black mb-4 flex items-center justify-center">
                          <video ref={videoRef} autoPlay playsInline muted className="w-full object-cover max-h-[300px]" />
                        </div>
                        <Button type="button" onClick={captureImage} variant="secondary" className="w-full gap-2">
                          <Camera className="w-4 h-4" /> Snap Picture
                        </Button>
                      </>
                    ) : (
                      <div className="flex flex-col items-center gap-4 text-center">
                        <div className="text-sm text-zinc-500 max-w-[250px]">
                          Speak clearly into your microphone for about 10 seconds to generate a good clone.
                        </div>
                        <Button 
                          type="button" 
                          onClick={toggleAudioRecording} 
                          variant={isRecording ? "destructive" : "secondary"} 
                          className="w-full gap-2"
                        >
                          {isRecording ? <StopCircle className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                          {isRecording ? "Stop Recording" : "Start Recording"}
                        </Button>
                      </div>
                    )}

                    {assetFile && (
                      <div className="mt-4 text-xs font-medium text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full flex items-center gap-2">
                        <span>Capture ready: {assetFile.name} ({Math.round(assetFile.size / 1024)} KB)</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <Button type="submit" className="w-full bg-zinc-900" disabled={uploading || !assetFile}>
                {uploading ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading...</>
                ) : (
                  "Upload to Library"
                )}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="avatars" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="avatars">Visual Avatars</TabsTrigger>
          <TabsTrigger value="voices">Voice Clones</TabsTrigger>
        </TabsList>
        
        {/* Avatars Tab */}
        <TabsContent value="avatars" className="pt-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <button 
              onClick={() => openUpload("avatar")}
              className="flex flex-col items-center justify-center gap-3 p-6 h-64 rounded-xl border-2 border-dashed border-zinc-200 bg-zinc-50 hover:bg-zinc-100 hover:border-zinc-300 transition-all text-zinc-500 hover:text-zinc-900"
            >
              <div className="w-12 h-12 rounded-full bg-white border border-zinc-200 flex items-center justify-center shadow-sm">
                <Plus className="h-6 w-6" />
              </div>
              <span className="font-medium text-sm">Upload Avatar</span>
            </button>

            {avatars.map((avatar) => (
              <Card key={avatar.id} className="overflow-hidden group h-64 flex flex-col">
                <div className="h-40 bg-zinc-100 relative overflow-hidden border-b border-zinc-100">
                  {/* In a real app we'd use next/image with avatar.image_url */}
                  {avatar.image_url ? (
                    <img src={avatar.image_url} alt={avatar.name} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                  ) : (
                    <div className="flex items-center justify-center h-full text-zinc-400">
                      <User className="h-12 w-12" />
                    </div>
                  )}
                </div>
                <CardContent className="p-4 flex-1 flex flex-col justify-center bg-white z-10">
                  <h3 className="font-medium text-sm truncate" title={avatar.name}>{avatar.name}</h3>
                  <p className="text-xs text-zinc-500 mt-1">{new Date(avatar.created_at).toLocaleDateString()}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          {avatars.length === 0 && (
             <div className="mt-8 text-center text-zinc-500 text-sm">You haven't uploaded any avatars yet.</div>
          )}
        </TabsContent>

        {/* Voices Tab */}
        <TabsContent value="voices" className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <button 
              onClick={() => openUpload("audio")}
              className="flex items-center gap-4 p-6 rounded-xl border-2 border-dashed border-zinc-200 bg-zinc-50 hover:bg-zinc-100 hover:border-zinc-300 transition-all text-zinc-500 hover:text-zinc-900"
            >
              <div className="w-10 h-10 rounded-full bg-white border border-zinc-200 flex items-center justify-center shadow-sm shrink-0">
                <Plus className="h-5 w-5" />
              </div>
              <span className="font-medium text-sm">Upload New Voice Clone</span>
            </button>

            {audios.map((audio) => (
              <Card key={audio.id} className="flex flex-col justify-between">
                <CardContent className="p-5 flex-1">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-zinc-100 rounded-lg border border-zinc-200 text-zinc-600 shrink-0">
                      <Mic className="h-6 w-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-base truncate" title={audio.name}>{audio.name}</h3>
                      <p className="text-xs text-zinc-500 mt-1 mb-4">{new Date(audio.created_at).toLocaleDateString()}</p>
                      
                      <div className="w-full mt-2">
                        <audio controls src={audio.audio_url} className="w-full h-9 rounded-md" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          {audios.length === 0 && (
             <div className="mt-8 text-center text-zinc-500 text-sm">You haven't uploaded any voice samples yet.</div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
