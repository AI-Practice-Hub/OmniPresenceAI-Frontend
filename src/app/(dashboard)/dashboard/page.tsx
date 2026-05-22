import Link from "next/link";
import { Video, Upload, ArrowRight, Activity, Users, Mic } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function DashboardOverview() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Overview</h2>
        <p className="text-zinc-500">Welcome back! Here is what's happening with your account.</p>
      </div>

      {/* Metrics Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Videos</CardTitle>
            <Video className="h-4 w-4 text-zinc-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-zinc-500">+2 from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saved Avatars</CardTitle>
            <Users className="h-4 w-4 text-zinc-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-zinc-500">2 pending generation tasks</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Voice Clones</CardTitle>
            <Mic className="h-4 w-4 text-zinc-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-zinc-500">All trained & ready</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Runs</CardTitle>
            <Activity className="h-4 w-4 text-zinc-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-zinc-500">Rendering "Marketing Intro"</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions & Recent Activity Split */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        
        {/* Quick Actions */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Get started on your next video instantly.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link href="/studio" className="block">
              <div className="flex items-center gap-4 p-4 rounded-lg border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 transition-colors group">
                <div className="p-2 bg-white rounded-md shadow-sm border border-zinc-200 group-hover:border-zinc-300">
                  <Video className="w-5 h-5 text-zinc-900" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-zinc-900">Create New Video</h4>
                  <p className="text-xs text-zinc-500">Open the Studio to generate a video.</p>
                </div>
                <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:text-zinc-600 transition-colors" />
              </div>
            </Link>

            <Link href="/assets" className="block">
              <div className="flex items-center gap-4 p-4 rounded-lg border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 transition-colors group">
                <div className="p-2 bg-white rounded-md shadow-sm border border-zinc-200 group-hover:border-zinc-300">
                  <Upload className="w-5 h-5 text-zinc-900" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-zinc-900">Upload Assets</h4>
                  <p className="text-xs text-zinc-500">Add a new photo avatar or voice sample.</p>
                </div>
                <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:text-zinc-600 transition-colors" />
              </div>
            </Link>
          </CardContent>
        </Card>

        {/* Recent Activity Table (Mocked) */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Videos</CardTitle>
            <CardDescription>Your latest generations and their statuses.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { id: "1", title: "Marketing Intro", status: "Rendering", date: "Just now" },
                { id: "2", title: "Team Welcome", status: "Completed", date: "2 days ago" },
                { id: "3", title: "Product Update V2", status: "Completed", date: "1 week ago" },
              ].map((run, i) => (
                <div key={run.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-zinc-50 transition-colors border border-transparent hover:border-zinc-100">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${run.status === "Completed" ? "bg-emerald-500" : "bg-amber-500 animate-pulse"}`} />
                    <div>
                      <p className="text-sm font-medium leading-none">{run.title}</p>
                      <p className="text-xs text-zinc-500 mt-1">{run.date}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="h-8 text-xs">
                    {run.status === "Completed" ? "View" : "Status"}
                  </Button>
                </div>
              ))}
            </div>
            
            <div className="mt-4 pt-4 border-t border-zinc-100">
              <Link href="/history">
                <Button variant="outline" className="w-full text-zinc-600">View all history</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
        
      </div>
    </div>
  );
}
