
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
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // For editing content
  const [editingContent, setEditingContent] = useState(null);
  const [newJob, setNewJob] = useState({ 
    title: '', 
    description: '', 
    location: 'Remote', 
    employment_type: 'INTERN',
    apply_url: '' 
  });

  // For editing blog posts
  const [editingBlogPost, setEditingBlogPost] = useState(null);
  const [newBlogPost, setNewBlogPost] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: 'AI Job Search',
    author_name: 'Jerry J Hunter',
    read_time: '5 min read',
    image_url: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&q=80'
  });

  useEffect(() => {
    if (!token) {
      navigate('/admin/login');
      return;
    }
    fetchData();
  }, [token]);

  const fetchData = async () => {
    setLoading(true);
    
    // Fetch each independently so one failure doesn't block others
    try {
      const leadsData = await apiClient.get('/api/admin/leads');
      setLeads(leadsData);
    } catch (err) {
      console.error("Leads fetch failed:", err);
      toast({ 
        title: "Leads Error", 
        description: err.message.includes('401') ? "Session expired. Please logout and login again." : err.message, 
        variant: "destructive" 
      });
    }

    try {
      const contentData = await apiClient.get('/api/content');
      setContent(contentData);
    } catch (err) {
      console.error("Content fetch failed:", err);
    }

    try {
      const jobsData = await apiClient.get('/api/jobs');
      setJobs(jobsData);
    } catch (err) {
      console.error("Jobs fetch failed:", err);
    }

    try {
      const blogData = await apiClient.get('/api/blog');
      setBlogPosts(blogData);
    } catch (err) {
      console.error("Blog fetch failed:", err);
    }

    setLoading(false);
  };

  const saveJob = async (e) => {
    e.preventDefault();
    try {
      await apiClient.post('/api/admin/jobs', newJob);
      toast({ title: "Job Posted" });
      setNewJob({ 
        title: '', 
        description: '', 
        location: 'Remote', 
        employment_type: 'INTERN',
        apply_url: '' 
      });
      fetchData();
    } catch (err) {
      toast({ title: "Error", description: "Failed to save job", variant: "destructive" });
    }
  };

  const deleteJob = async (id) => {
    try {
      await apiClient.delete(`/api/admin/jobs/${id}`);
      setJobs(jobs.filter(j => j.id !== id));
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

  // Helper to generate SEO slugs dynamically
  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // remove non-alphanumeric chars
      .replace(/[\s_]+/g, '-')  // replace spaces/underscores with hyphens
      .replace(/^-+|-+$/g, ''); // trim consecutive hyphens
  };

  const handleBlogPostTitleChange = (val, isEditing) => {
    const slug = generateSlug(val);
    if (isEditing) {
      setEditingBlogPost({ ...editingBlogPost, title: val, slug });
    } else {
      setNewBlogPost({ ...newBlogPost, title: val, slug });
    }
  };

  const saveBlogPost = async (e) => {
    e.preventDefault();
    const postData = editingBlogPost || newBlogPost;
    try {
      await apiClient.post('/api/admin/blog', postData);
      toast({ title: editingBlogPost ? "Blog Post Updated" : "Blog Post Created" });
      setNewBlogPost({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        category: 'AI Job Search',
        author_name: 'Jerry J Hunter',
        read_time: '5 min read',
        image_url: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&q=80'
      });
      setEditingBlogPost(null);
      fetchData();
    } catch (err) {
      toast({ title: "Error", description: "Failed to save blog post", variant: "destructive" });
    }
  };

  const deleteBlogPost = async (id) => {
    if (!window.confirm("Are you sure you want to permanently delete this article?")) return;
    try {
      await apiClient.delete(`/api/admin/blog/${id}`);
      toast({ title: "Blog Post Removed" });
      fetchData();
    } catch (err) {
      toast({ title: "Error", description: "Failed to remove blog post", variant: "destructive" });
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
    <div className="container mx-auto py-10 px-4 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">Manage leads, post careers, write insights articles, and customize copy.</p>
        </div>
        <div className="flex gap-4 items-center self-end md:self-auto">
          <span className="text-sm font-semibold text-muted-foreground bg-muted px-3 py-1.5 rounded-full">{admin.email}</span>
          <Button variant="outline" className="rounded-xl border-2" onClick={logout}>Logout</Button>
        </div>
      </div>

      <Tabs defaultValue="leads" className="space-y-6">
        <TabsList className="bg-muted p-1 rounded-2xl w-full md:w-auto grid grid-cols-4 h-12">
          <TabsTrigger value="leads" className="rounded-xl h-10 font-bold">Leads</TabsTrigger>
          <TabsTrigger value="careers" className="rounded-xl h-10 font-bold">Careers</TabsTrigger>
          <TabsTrigger value="blog" className="rounded-xl h-10 font-bold">Blog Manager</TabsTrigger>
          <TabsTrigger value="content" className="rounded-xl h-10 font-bold">Page Content</TabsTrigger>
        </TabsList>

        {/* Leads Tab */}
        <TabsContent value="leads">
          <Card className="rounded-2xl shadow-md border overflow-hidden">
            <CardHeader className="border-b pb-6">
              <CardTitle className="text-2xl font-bold">Recent Leads</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
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
                      <TableCell className="font-bold">{lead.full_name}</TableCell>
                      <TableCell>{lead.email}</TableCell>
                      <TableCell>{lead.service}</TableCell>
                      <TableCell>
                        <Select 
                          value={lead.status || 'new'} 
                          onValueChange={(val) => updateLeadStatus(lead.id, val)}
                        >
                          <SelectTrigger className="w-[140px] rounded-xl border-2 font-medium">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl">
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
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground font-medium">No leads found</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Careers Tab */}
        <TabsContent value="careers" className="space-y-6">
          <Card className="rounded-2xl shadow-md border">
            <CardHeader className="border-b pb-6">
              <CardTitle className="text-2xl font-bold">Post a New Job</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={saveJob} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="font-semibold text-sm">Job Title</Label>
                    <Input className="rounded-xl h-11 border-2" value={newJob.title} onChange={e => setNewJob({...newJob, title: e.target.value})} placeholder="e.g. AI Integrator" required />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-semibold text-sm">Location</Label>
                    <Input className="rounded-xl h-11 border-2" value={newJob.location} onChange={e => setNewJob({...newJob, location: e.target.value})} placeholder="Remote" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="font-semibold text-sm">Application Form Link (URL)</Label>
                  <Input className="rounded-xl h-11 border-2" value={newJob.apply_url} onChange={e => setNewJob({...newJob, apply_url: e.target.value})} placeholder="https://airtable.com/..." required />
                </div>
                <div className="space-y-2">
                  <Label className="font-semibold text-sm">Description (Markdown supported)</Label>
                  <Textarea className="rounded-xl border-2" rows={6} value={newJob.description} onChange={e => setNewJob({...newJob, description: e.target.value})} required />
                </div>
                <Button type="submit" className="rounded-xl h-11 px-6 font-bold shadow-md hover:shadow-lg transition-all duration-200">Post Job</Button>
              </form>
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-md border overflow-hidden">
            <CardHeader className="border-b pb-6">
              <CardTitle className="text-2xl font-bold">Active Listings</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
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
                      <TableCell className="font-bold">{job.title}</TableCell>
                      <TableCell>{job.location}</TableCell>
                      <TableCell>{new Date(job.date_posted).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Button variant="destructive" className="rounded-xl font-bold" size="sm" onClick={() => deleteJob(job.id)}>Remove</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {jobs.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8 text-muted-foreground font-medium">No job postings found</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Blog Manager Tab */}
        <TabsContent value="blog" className="space-y-6">
          <Card className="rounded-2xl shadow-md border">
            <CardHeader className="border-b pb-6">
              <CardTitle className="text-2xl font-bold">
                {editingBlogPost ? 'Edit Insights Article' : 'Write a New Insights Article'}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={saveBlogPost} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="font-semibold text-sm">Article Title</Label>
                    <Input 
                      className="rounded-xl h-11 border-2" 
                      value={editingBlogPost ? editingBlogPost.title : newBlogPost.title} 
                      onChange={e => handleBlogPostTitleChange(e.target.value, !!editingBlogPost)} 
                      placeholder="e.g. How to use AI to Tailor Your Resume" 
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-semibold text-sm">SEO Slug (Auto-generated)</Label>
                    <Input 
                      className="rounded-xl h-11 border-2 font-mono text-sm bg-muted/30" 
                      value={editingBlogPost ? editingBlogPost.slug : newBlogPost.slug} 
                      onChange={e => {
                        const val = e.target.value;
                        if (editingBlogPost) setEditingBlogPost({ ...editingBlogPost, slug: val });
                        else setNewBlogPost({ ...newBlogPost, slug: val });
                      }} 
                      placeholder="how-to-use-ai-to-tailor-your-resume" 
                      required 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-2 md:col-span-1">
                    <Label className="font-semibold text-sm">Category</Label>
                    <Input 
                      className="rounded-xl h-11 border-2" 
                      value={editingBlogPost ? editingBlogPost.category : newBlogPost.category} 
                      onChange={e => {
                        const val = e.target.value;
                        if (editingBlogPost) setEditingBlogPost({ ...editingBlogPost, category: val });
                        else setNewBlogPost({ ...newBlogPost, category: val });
                      }} 
                      placeholder="e.g. AI Strategy" 
                      required 
                    />
                  </div>
                  <div className="space-y-2 md:col-span-1">
                    <Label className="font-semibold text-sm">Author Name</Label>
                    <Input 
                      className="rounded-xl h-11 border-2" 
                      value={editingBlogPost ? editingBlogPost.author_name : newBlogPost.author_name} 
                      onChange={e => {
                        const val = e.target.value;
                        if (editingBlogPost) setEditingBlogPost({ ...editingBlogPost, author_name: val });
                        else setNewBlogPost({ ...newBlogPost, author_name: val });
                      }} 
                      placeholder="Jerry J Hunter" 
                      required 
                    />
                  </div>
                  <div className="space-y-2 md:col-span-1">
                    <Label className="font-semibold text-sm">Read Time Estimate</Label>
                    <Input 
                      className="rounded-xl h-11 border-2" 
                      value={editingBlogPost ? editingBlogPost.read_time : newBlogPost.read_time} 
                      onChange={e => {
                        const val = e.target.value;
                        if (editingBlogPost) setEditingBlogPost({ ...editingBlogPost, read_time: val });
                        else setNewBlogPost({ ...newBlogPost, read_time: val });
                      }} 
                      placeholder="5 min read" 
                      required 
                    />
                  </div>
                  <div className="space-y-2 md:col-span-1">
                    <Label className="font-semibold text-sm">Cover Image URL</Label>
                    <Input 
                      className="rounded-xl h-11 border-2" 
                      value={editingBlogPost ? editingBlogPost.image_url : newBlogPost.image_url} 
                      onChange={e => {
                        const val = e.target.value;
                        if (editingBlogPost) setEditingBlogPost({ ...editingBlogPost, image_url: val });
                        else setNewBlogPost({ ...newBlogPost, image_url: val });
                      }} 
                      placeholder="https://images.unsplash.com/..." 
                      required 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="font-semibold text-sm">Short Excerpt (SEO Meta Description)</Label>
                  <Input 
                    className="rounded-xl h-11 border-2" 
                    value={editingBlogPost ? editingBlogPost.excerpt : newBlogPost.excerpt} 
                    onChange={e => {
                      const val = e.target.value;
                      if (editingBlogPost) setEditingBlogPost({ ...editingBlogPost, excerpt: val });
                      else setNewBlogPost({ ...newBlogPost, excerpt: val });
                    }} 
                    placeholder="Provide a quick summary that encourages search clicks..." 
                    required 
                  />
                </div>

                <div className="space-y-2">
                  <Label className="font-semibold text-sm">Article Body (Markdown Supported)</Label>
                  <Textarea 
                    className="rounded-xl border-2" 
                    rows={12} 
                    value={editingBlogPost ? editingBlogPost.content : newBlogPost.content} 
                    onChange={e => {
                      const val = e.target.value;
                      if (editingBlogPost) setEditingBlogPost({ ...editingBlogPost, content: val });
                      else setNewBlogPost({ ...newBlogPost, content: val });
                    }} 
                    placeholder="Write the full body of the article here. Use headers, bold weight, lists, etc." 
                    required 
                  />
                </div>

                <div className="flex gap-2">
                  <Button type="submit" className="rounded-xl h-11 px-6 font-bold shadow-md hover:shadow-lg transition-all duration-200">
                    {editingBlogPost ? 'Update Article' : 'Publish Article'}
                  </Button>
                  {editingBlogPost && (
                    <Button variant="ghost" className="rounded-xl h-11 font-semibold" onClick={() => setEditingBlogPost(null)}>Cancel</Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-md border overflow-hidden">
            <CardHeader className="border-b pb-6">
              <CardTitle className="text-2xl font-bold">Published Insights</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cover</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Read Time</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {blogPosts.map((post) => (
                    <TableRow key={post.id}>
                      <TableCell>
                        <div className="h-10 w-16 rounded overflow-hidden">
                          <img src={post.image_url} alt="" className="object-cover h-full w-full" />
                        </div>
                      </TableCell>
                      <TableCell className="font-bold">{post.title}</TableCell>
                      <TableCell>{post.category}</TableCell>
                      <TableCell>{post.read_time}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" className="rounded-xl font-bold" size="sm" onClick={() => setEditingBlogPost(post)}>Edit</Button>
                          <Button variant="destructive" className="rounded-xl font-bold" size="sm" onClick={() => deleteBlogPost(post.id)}>Delete</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {blogPosts.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground font-medium">No published articles yet</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Content Management Tab */}
        <TabsContent value="content" className="space-y-6">
          <Card className="rounded-2xl shadow-md border">
            <CardHeader className="border-b pb-6 flex flex-row items-center justify-between">
              <CardTitle className="text-2xl font-bold">Page Content Variables</CardTitle>
              <Button className="rounded-xl font-bold shadow-sm" onClick={() => setEditingContent({ page_name: 'home', section_name: 'hero', content_key: '', content_value: '' })}>
                Add Custom Variable
              </Button>
            </CardHeader>
            <CardContent className="pt-6">
              {editingContent ? (
                <form onSubmit={saveContent} className="space-y-4 border p-6 rounded-2xl mb-8 border-primary/20 bg-muted/20">
                  <h3 className="text-lg font-bold">{editingContent.id ? 'Edit Variable' : 'Add Variable'}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label className="font-semibold text-sm">Page</Label>
                      <Input className="rounded-xl h-11 border-2" value={editingContent.page_name} onChange={e => setEditingContent({...editingContent, page_name: e.target.value})} required />
                    </div>
                    <div className="space-y-2">
                      <Label className="font-semibold text-sm">Section</Label>
                      <Input className="rounded-xl h-11 border-2" value={editingContent.section_name} onChange={e => setEditingContent({...editingContent, section_name: e.target.value})} required />
                    </div>
                    <div className="space-y-2">
                      <Label className="font-semibold text-sm">Key</Label>
                      <Input className="rounded-xl h-11 border-2 font-mono text-sm" value={editingContent.content_key} onChange={e => setEditingContent({...editingContent, content_key: e.target.value})} required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="font-semibold text-sm">Value</Label>
                    <Textarea className="rounded-xl border-2" rows={4} value={editingContent.content_value} onChange={e => setEditingContent({...editingContent, content_value: e.target.value})} required />
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit" className="rounded-xl h-11 px-6 font-bold shadow-md hover:shadow-lg transition-all duration-200">Save Changes</Button>
                    <Button variant="ghost" className="rounded-xl h-11 font-semibold" onClick={() => setEditingContent(null)}>Cancel</Button>
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
                      <TableCell className="capitalize font-medium">{item.page_name}</TableCell>
                      <TableCell className="capitalize">{item.section_name}</TableCell>
                      <TableCell className="font-mono text-xs text-primary font-semibold">{item.content_key}</TableCell>
                      <TableCell className="max-w-[300px] truncate font-medium text-muted-foreground">{item.content_value}</TableCell>
                      <TableCell>
                        <Button variant="outline" className="rounded-xl font-bold" size="sm" onClick={() => setEditingContent(item)}>Edit</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {content.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground font-medium">No custom content defined yet</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
