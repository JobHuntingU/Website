
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAdmin } from '@/context/AdminContext';
import { useToast } from '@/hooks/use-toast';
import apiClient from '@/lib/apiClient';

const AdminDashboard = () => {
  const { admin, token, logout } = useAdmin();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [leads, setLeads] = useState([]);
  const [content, setContent] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // For editing content
  const [editingContent, setEditingContent] = useState(null);
  const [newJob, setNewJob] = useState({ title: '', description: '', location: 'Remote', employment_type: 'INTERN' });

  useEffect(() => {
    if (!token) {
      navigate('/admin/login');
      return;
    }
    fetchData();
  }, [token]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [leadsData, contentData, jobsData] = await Promise.all([
        apiClient.get('/api/admin/leads'),
        apiClient.get('/api/content'),
        apiClient.get('/api/jobs')
      ]);
      setLeads(leadsData);
      setContent(contentData);
      setJobs(jobsData);
    } catch (err) {
      toast({ title: "Error", description: "Failed to fetch dashboard data", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const saveJob = async (e) => {
    e.preventDefault();
    try {
      await apiClient.post('/api/admin/jobs', newJob);
      toast({ title: "Job Posted" });
      setNewJob({ title: '', description: '', location: 'Remote', employment_type: 'INTERN' });
      fetchData();
    } catch (err) {
      toast({ title: "Error", description: "Failed to save job", variant: "destructive" });
    }
  };

  const deleteJob = async (id) => {
    try {
      await apiClient.delete(`/api/admin/jobs/${id}`);
      setJobs(jobs.filter(j => l.id !== id));
      fetchData();
      toast({ title: "Job Removed" });
    } catch (err) {
      toast({ title: "Error", description: "Failed to remove job" });
    }
  };

  const updateLeadStatus = async (id, status) => {
    try {
      await apiClient.put(`/api/admin/leads/${id}/status`, { status });
      setLeads(leads.map(l => l.id === id ? { ...l, status } : l));
      toast({ title: "Status Updated" });
    } catch (err) {
      toast({ title: "Error", description: "Failed to update status", variant: "destructive" });
    }
  };

  const saveContent = async (e) => {
    e.preventDefault();
    try {
      await apiClient.post('/api/content', editingContent);
      setContent(content.map(c => 
        (c.page_name === editingContent.page_name && 
         c.section_name === editingContent.section_name && 
         c.content_key === editingContent.content_key) 
        ? editingContent : c
      ));
      // If it was a new key that didn't exist in 'content' array, we might need to refresh
      if (!content.find(c => c.page_name === editingContent.page_name && c.content_key === editingContent.content_key)) {
        fetchData();
      }
      setEditingContent(null);
      toast({ title: "Content Saved" });
    } catch (err) {
      toast({ title: "Error", description: "Failed to save content", variant: "destructive" });
    }
  };

  if (!admin) return null;

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="flex gap-4 items-center">
          <span className="text-sm text-muted-foreground">{admin.email}</span>
          <Button variant="outline" onClick={logout}>Logout</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Leads Table */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leads.map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell>{new Date(lead.created_at).toLocaleDateString()}</TableCell>
                    <TableCell className="font-medium">{lead.full_name}</TableCell>
                    <TableCell>{lead.email}</TableCell>
                    <TableCell>{lead.service}</TableCell>
                    <TableCell>
                      <Select 
                        value={lead.status || 'new'} 
                        onValueChange={(val) => updateLeadStatus(lead.id, val)}
                      >
                        <SelectTrigger className="w-[130px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">New</SelectItem>
                          <SelectItem value="contacted">Contacted</SelectItem>
                          <SelectItem value="booked">Booked</SelectItem>
                          <SelectItem value="closed">Closed</SelectItem>
                          <SelectItem value="junk">Spam/Junk</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
                {leads.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4">No leads found</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Careers Management */}
        <Card>
          <CardHeader>
            <CardTitle>Post a New Job</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={saveJob} className="space-y-4 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Job Title</Label>
                  <Input value={newJob.title} onChange={e => setNewJob({...newJob, title: e.target.value})} placeholder="e.g. AI Integrator" required />
                </div>
                <div className="space-y-2">
                  <Label>Location</Label>
                  <Input value={newJob.location} onChange={e => setNewJob({...newJob, location: e.target.value})} placeholder="Remote" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Description (Markdown supported)</Label>
                <Textarea rows={6} value={newJob.description} onChange={e => setNewJob({...newJob, description: e.target.value})} required />
              </div>
              <Button type="submit">Post Job</Button>
            </form>

            <h3 className="font-bold mb-4">Active Listings</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Posted</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {jobs.map((job) => (
                  <TableRow key={job.id}>
                    <TableCell className="font-medium">{job.title}</TableCell>
                    <TableCell>{job.location}</TableCell>
                    <TableCell>{new Date(job.date_posted).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Button variant="destructive" size="sm" onClick={() => deleteJob(job.id)}>Remove</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Content Management */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Page Content</CardTitle>
            <Button size="sm" onClick={() => setEditingContent({ page_name: 'home', section_name: 'hero', content_key: '', content_value: '' })}>
              Add New Key
            </Button>
          </CardHeader>
          <CardContent>
            {editingContent ? (
              <form onSubmit={saveContent} className="space-y-4 border p-4 rounded-lg mb-6">
                <h3 className="font-semibold">{editingContent.id ? 'Edit' : 'Add'} Content</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Page</Label>
                    <Input value={editingContent.page_name} onChange={e => setEditingContent({...editingContent, page_name: e.target.value})} required />
                  </div>
                  <div className="space-y-2">
                    <Label>Section</Label>
                    <Input value={editingContent.section_name} onChange={e => setEditingContent({...editingContent, section_name: e.target.value})} required />
                  </div>
                  <div className="space-y-2">
                    <Label>Key</Label>
                    <Input value={editingContent.content_key} onChange={e => setEditingContent({...editingContent, content_key: e.target.value})} required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Value</Label>
                  <Textarea rows={4} value={editingContent.content_value} onChange={e => setEditingContent({...editingContent, content_value: e.target.value})} required />
                </div>
                <div className="flex gap-2">
                  <Button type="submit">Save Changes</Button>
                  <Button variant="ghost" onClick={() => setEditingContent(null)}>Cancel</Button>
                </div>
              </form>
            ) : null}

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Page</TableHead>
                  <TableHead>Section</TableHead>
                  <TableHead>Key</TableHead>
                  <TableHead>Value Preview</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {content.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="capitalize">{item.page_name}</TableCell>
                    <TableCell className="capitalize">{item.section_name}</TableCell>
                    <TableCell className="font-mono text-xs">{item.content_key}</TableCell>
                    <TableCell className="max-w-[200px] truncate">{item.content_value}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" onClick={() => setEditingContent(item)}>Edit</Button>
                    </TableCell>
                  </TableRow>
                ))}
                {content.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4">No custom content defined yet</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
