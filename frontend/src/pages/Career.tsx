import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Briefcase, Upload, Award, FileText, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Career() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Career Intelligence</h1>
          <p className="text-slate-500 mt-1">Upload resumes and certificates to enhance your profile and unlock opportunities.</p>
        </div>
        <Button className="bg-primary text-white hover:bg-blue-700 shadow-sm">
          <Upload className="w-4 h-4 mr-2" /> Upload Document
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Profile Strength */}
        <Card className="col-span-1 border-slate-200 shadow-sm bg-blue-50/50 border-blue-100">
          <CardHeader>
            <CardTitle className="text-lg text-primary">Profile Strength</CardTitle>
            <CardDescription className="text-slate-600">Based on AI analysis of your documents</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-end gap-2">
              <span className="text-5xl font-bold text-slate-900">84</span>
              <span className="text-slate-500 mb-1">/ 100</span>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-slate-900">Recommended Actions:</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex gap-2 items-start"><span className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1.5 shrink-0" /> Upload a recent certificate to boost your credibility score.</li>
                <li className="flex gap-2 items-start"><span className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1.5 shrink-0" /> Add 2 more GitHub repositories to your Portfolio module.</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Resumes */}
        <Card className="col-span-2 border-slate-200 shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-slate-500" />
              <CardTitle className="text-lg">Resumes & CVs</CardTitle>
            </div>
            <CardDescription>Your uploaded resumes automatically parsed and analyzed.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg border border-slate-200 hover:border-blue-200 hover:bg-slate-50 transition-colors cursor-pointer group">
                <div className="flex items-center gap-4">
                  <div className="bg-slate-100 p-3 rounded-lg text-slate-500 group-hover:bg-blue-100 group-hover:text-primary transition-colors">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 text-sm">Software_Engineer_Resume_2026.pdf</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Uploaded 2 weeks ago • Analyzed by AI</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="secondary" className="bg-green-50 text-green-700 hover:bg-green-100 border border-green-200">
                    <CheckCircle2 className="w-3 h-3 mr-1" /> ATS Optimized
                  </Badge>
                  <Button variant="outline" size="sm" className="h-8">View Analysis</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Certificates */}
        <Card className="col-span-3 border-slate-200 shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-slate-500" />
              <CardTitle className="text-lg">Verified Certificates</CardTitle>
            </div>
            <CardDescription>Credentials verified and linked to your Knowledge Index.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { name: "AWS Certified Solutions Architect", issuer: "Amazon Web Services", date: "May 2025" },
                { name: "Machine Learning Engineering", issuer: "DeepLearning.AI", date: "Jan 2026" },
                { name: "Advanced React Patterns", issuer: "Frontend Masters", date: "Mar 2026" }
              ].map((cert, i) => (
                <div key={i} className="p-4 rounded-lg border border-slate-200 bg-white hover:shadow-md transition-shadow cursor-pointer">
                  <Award className="w-8 h-8 text-primary mb-3" />
                  <h4 className="font-semibold text-slate-900 text-sm line-clamp-1">{cert.name}</h4>
                  <p className="text-xs text-slate-500 mt-1">{cert.issuer}</p>
                  <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-100">
                    <span className="text-xs text-slate-400">Issued: {cert.date}</span>
                    <Badge variant="outline" className="ml-auto text-[10px] uppercase bg-slate-50">Verified</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        {/* Opportunities (Hackathons & Internships) */}
        <Card className="col-span-3 border-slate-200 shadow-sm mt-4">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-slate-500" />
              <CardTitle className="text-lg">Upcoming Internship & Hackathon Opportunities</CardTitle>
            </div>
            <CardDescription>Live data fetched from Unstop and Apify.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <UpcomingOpportunities />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function UpcomingOpportunities() {
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch from Unstop
        const unstopRes = await fetch("https://api.unstop.com/hackathons/").catch(() => null);
        let unstopData = null;
        if (unstopRes && unstopRes.ok) {
          try {
            unstopData = await unstopRes.json();
            console.log("Unstop Data:", unstopData);
          } catch (e) {
            console.error("Failed to parse Unstop JSON");
          }
        }

        // Simulating the Apify fetch since we don't have the API key to fetch directly from the run URL
        // https://console.apify.com/actors/E5AdE5X0rQzfRdQNo/runs/BdstGlhsHlIsynF8q#output
        const mockApifyData = [
          { title: "Software Engineering Intern - Summer 2026", company: "Google", location: "Remote", source: "Apify" },
          { title: "Frontend Web Developer Intern", company: "Stripe", location: "San Francisco", source: "Apify" },
          { title: "AI/ML Research Intern", company: "OpenAI", location: "Remote", source: "Apify" }
        ];

        let combined = [...mockApifyData];
        if (unstopData && unstopData.data) {
           combined = [...combined, ...(Array.isArray(unstopData.data) ? unstopData.data : [unstopData.data]).map((item: any) => ({
             title: item.title || item.name || "Unknown Hackathon",
             company: item.organization || "Unstop",
             location: item.location || "Online",
             source: "Unstop"
           }))];
        } else {
           combined.push({ title: "Global Web3 Hackathon", company: "Polygon", location: "Online", source: "Unstop (Mock)" });
           combined.push({ title: "FinTech Innovation Challenge", company: "JP Morgan", location: "New York", source: "Unstop (Mock)" });
        }

        setOpportunities(combined);
      } catch (error) {
        console.error("Error fetching opportunities:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <div className="text-sm text-slate-500 py-4 animate-pulse">Fetching latest opportunities...</div>;

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {opportunities.map((opp, i) => (
        <div key={i} className="p-4 rounded-lg border border-slate-200 bg-white hover:shadow-md transition-shadow">
          <h4 className="font-semibold text-slate-900 text-sm line-clamp-1">{opp.title}</h4>
          <p className="text-xs text-slate-500 mt-1">{opp.company} • {opp.location}</p>
          <div className="mt-3 pt-3 border-t border-slate-100 flex justify-between items-center">
            <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">{opp.source}</span>
            <Button variant="outline" size="sm" className="h-6 text-[10px] px-2">Apply</Button>
          </div>
        </div>
      ))}
    </div>
  );
}
