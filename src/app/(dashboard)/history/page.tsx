"use client";

import { Video, Download, Play, Loader2, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function HistoryPage() {
  // Mocking run history specifically because it's not present in the FastAPI Swagger schema yet
  const mockRuns = [
    {
      id: "run_req_993jsz",
      title: "Marketing Intro",
      scriptSnippet: "Welcome to OmniPresence. Today we're going to...",
      status: "completed",
      date: "2023-10-25 14:30",
      duration: "00:45",
      videoUrl: "#"
    },
    {
      id: "run_req_827ksm",
      title: "Team Welcome",
      scriptSnippet: "Hello team, I wanted to quickly touch base regarding...",
      status: "rendering",
      date: "2023-10-26 09:15",
      duration: "01:20",
      videoUrl: ""
    },
    {
      id: "run_req_738plq",
      title: "Product Update V2",
      scriptSnippet: "The latest version includes three major features that...",
      status: "failed",
      date: "2023-10-20 16:00",
      duration: "02:10",
      videoUrl: ""
    }
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Run History</h2>
          <p className="text-zinc-500">View and download your generated videos.</p>
        </div>
      </div>

      <div className="grid gap-4">
        {mockRuns.map((run) => (
          <Card key={run.id} className="overflow-hidden">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center">
              
              {/* Left Video Thumbnail Placeholder */}
              <div className="w-full sm:w-48 h-32 bg-zinc-100 flex items-center justify-center border-b sm:border-b-0 sm:border-r border-zinc-100 shrink-0 relative group">
                {run.status === "completed" ? (
                  <>
                    <img src={`https://picsum.photos/seed/${run.id}/400/300`} alt="Thumbnail" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white">
                        <Play className="h-4 w-4 fill-white ml-0.5" />
                      </div>
                    </div>
                  </>
                ) : run.status === "rendering" ? (
                  <div className="flex flex-col items-center text-zinc-400 gap-2">
                    <Loader2 className="h-6 w-6 animate-spin" />
                    <span className="text-xs font-medium uppercase tracking-wider">Rendering</span>
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
                    <h3 className="font-semibold text-lg truncate text-zinc-900">{run.title}</h3>
                    {run.status === "completed" && <Badge variant="secondary" className="bg-emerald-100/50 text-emerald-700 hover:bg-emerald-100/50">Done</Badge>}
                    {run.status === "rendering" && <Badge variant="secondary" className="bg-blue-100/50 text-blue-700 hover:bg-blue-100/50">Processing</Badge>}
                    {run.status === "failed" && <Badge variant="secondary" className="bg-red-100/50 text-red-700 hover:bg-red-100/50">Failed</Badge>}
                  </div>
                  <p className="text-sm text-zinc-500 italic border-l-2 border-zinc-200 pl-3">"{run.scriptSnippet}"</p>
                  <div className="flex items-center gap-4 text-xs text-zinc-400 font-medium pt-1">
                    <span>ID: {run.id}</span>
                    <span>•</span>
                    <span>{run.date}</span>
                    <span>•</span>
                    <span>{run.duration}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 shrink-0 self-end sm:self-center w-full sm:w-auto mt-2 sm:mt-0">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 sm:flex-initial border-zinc-200 text-zinc-600 hover:text-zinc-900" 
                    disabled={run.status !== "completed"}
                  >
                    <Play className="h-4 w-4 mr-2" /> Watch
                  </Button>
                  <Button 
                    size="sm" 
                    className="flex-1 sm:flex-initial bg-zinc-900 hover:bg-zinc-800 text-white" 
                    disabled={run.status !== "completed"}
                  >
                    <Download className="h-4 w-4 mr-2" /> Download
                  </Button>
                </div>
              </CardContent>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
