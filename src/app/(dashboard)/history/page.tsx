"use client";

import { useEffect, useState } from "react";
import { Video, Download, Play, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import api from "@/lib/api";
import { Run } from "@/types";

export default function HistoryPage() {
  const [runs, setRuns] = useState<Run[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRuns = async () => {
      try {
        const response = await api.get("/api/runs/");
        // Ensure runs are sorted so newest is first
        const sortedRuns = (response.data || []).sort((a: Run, b: Run) => {
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        });
        setRuns(sortedRuns);
      } catch (error) {
        toast.error("Failed to load run history.");
      } finally {
        setLoading(false);
      }
    };
    fetchRuns();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-zinc-500" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Run History</h2>
          <p className="text-zinc-500">View and download your generated videos.</p>
        </div>
      </div>

      {runs.length === 0 ? (
        <div className="text-center p-12 border-2 border-dashed border-zinc-200 rounded-lg">
          <p className="text-zinc-500">No runs found. Go to the Studio to generate a video.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {runs.map((run) => (
            <Card key={run.id} className="overflow-hidden">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center">
                
                {/* Left Video Thumbnail Placeholder */}
                <div className="w-full sm:w-48 h-32 bg-zinc-100 flex items-center justify-center border-b sm:border-b-0 sm:border-r border-zinc-100 shrink-0 relative group">
                  {run.status === "completed" ? (
                    <>
                      <img src={run.avatar_url || `https://picsum.photos/seed/${run.id}/400/300`} alt="Thumbnail" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white">
                          <Play className="h-4 w-4 fill-white ml-0.5" />
                        </div>
                      </div>
                    </>
                  ) : run.status === "pending" || run.status === "processing" ? (
                    <div className="flex flex-col items-center text-zinc-400 gap-2">
                      <Loader2 className="h-6 w-6 animate-spin" />
                      <span className="text-xs font-medium uppercase tracking-wider">{run.status}</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center text-red-400 gap-2">
                      <AlertCircle className="h-6 w-6" />
                      <span className="text-xs font-medium uppercase tracking-wider">Failed</span>
                    </div>
                  )}
                </div>

                {/* Right content details */}
                <CardContent className="flex-1 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                  <div className="space-y-2 flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-lg truncate text-zinc-900">{run.name || "Untitled Run"}</h3>
                      {run.status === "completed" && <Badge variant="secondary" className="bg-emerald-100/50 text-emerald-700 hover:bg-emerald-100/50">Done</Badge>}
                      {(run.status === "pending" || run.status === "processing") && <Badge variant="secondary" className="bg-blue-100/50 text-blue-700 hover:bg-blue-100/50">Processing</Badge>}
                      {run.status === "failed" && <Badge variant="secondary" className="bg-red-100/50 text-red-700 hover:bg-red-100/50">Failed</Badge>}
                    </div>
                    <p className="text-sm text-zinc-500 italic border-l-2 border-zinc-200 pl-3 line-clamp-2">"{run.script}"</p>
                    <div className="flex items-center gap-4 text-xs text-zinc-400 font-medium pt-1">
                      <span className="truncate max-w-[120px]" title={run.id}>ID: ...{run.id.slice(-6)}</span>
                      <span>•</span>
                      <span>{new Date(run.created_at).toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 shrink-0 self-end sm:self-center w-full sm:w-auto mt-2 sm:mt-0">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 sm:flex-initial border-zinc-200 text-zinc-600 hover:text-zinc-900" 
                      disabled={run.status !== "completed" || !run.generated_audio_url}
                      onClick={() => run.generated_audio_url && window.open(run.generated_audio_url, '_blank')}
                    >
                      <Play className="h-4 w-4 mr-2" /> Watch
                    </Button>
                  </div>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
