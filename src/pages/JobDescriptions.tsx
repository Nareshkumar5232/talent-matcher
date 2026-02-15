import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { StatusBadge } from '@/components/common/StatusBadge';
import { SkillList } from '@/components/common/SkillBadge';
import { JobDescription } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Briefcase, MapPin, Users, Calendar, Pencil, Trash2, X } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { toast } from 'sonner';
import { getJobs, createJob, updateJob, deleteJob } from '@/lib/api';

export default function JobDescriptions() {
  const [jobs, setJobs] = useState<JobDescription[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobDescription | null>(null);
  const [skillInput, setSkillInput] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    department: '',
    location: '',
    requiredSkills: [] as string[],
    preferredSkills: [] as string[],
    experienceMin: '',
    experienceMax: '',
    education: '',
    description: '',
  });

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      const data = await getJobs();
      setJobs(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load jobs");
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      department: '',
      location: '',
      requiredSkills: [],
      preferredSkills: [],
      experienceMin: '',
      experienceMax: '',
      education: '',
      description: '',
    });
    setSelectedJob(null);
  };

  const handleAddSkill = (type: 'required' | 'preferred') => {
    if (skillInput.trim()) {
      const key = type === 'required' ? 'requiredSkills' : 'preferredSkills';
      if (!formData[key].includes(skillInput.trim())) {
        setFormData({
          ...formData,
          [key]: [...formData[key], skillInput.trim()],
        });
      }
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (type: 'required' | 'preferred', skill: string) => {
    const key = type === 'required' ? 'requiredSkills' : 'preferredSkills';
    setFormData({
      ...formData,
      [key]: formData[key].filter((s) => s !== skill),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const jobData: any = {
      title: formData.title,
      department: formData.department,
      location: formData.location,
      requiredSkills: formData.requiredSkills,
      preferredSkills: formData.preferredSkills,
      experience: {
        min: parseInt(formData.experienceMin) || 0,
        max: parseInt(formData.experienceMax) || 10,
      },
      education: formData.education,
      description: formData.description,
      status: 'active',
    };

    try {
      if (selectedJob) {
        await updateJob(selectedJob.id, jobData);
        toast.success("Job updated successfully");
      } else {
        await createJob(jobData);
        toast.success("Job created successfully");
      }
      loadJobs();
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      toast.error("Failed to save job");
    }
  };

  const handleEdit = (job: JobDescription) => {
    setSelectedJob(job);
    setFormData({
      title: job.title,
      department: job.department,
      location: job.location,
      requiredSkills: job.requiredSkills,
      preferredSkills: job.preferredSkills,
      experienceMin: job.experience.min.toString(),
      experienceMax: job.experience.max.toString(),
      education: job.education,
      description: job.description,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (jobId: string) => {
    try {
      await deleteJob(jobId);
      setJobs(jobs.filter(job => job.id !== jobId));
      toast.success("Job posting deleted successfully");
    } catch (error) {
      toast.error("Failed to delete job");
    }
  };

  return (
    <div className="min-h-screen bg-transparent">
      <Header
        title="Job Descriptions"
        subtitle="Manage job postings and requirements"
      />

      <div className="p-6 md:p-8 max-w-7xl mx-auto">
        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Select defaultValue="all">
              <SelectTrigger className="w-full sm:w-48 h-10 bg-card border-input/60 shadow-sm">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto h-10 bg-primary hover:bg-primary/90 text-primary-foreground shadow-md transition-all hover:translate-y-[1px]">
                <Plus className="h-4 w-4 mr-2" />
                Create New Job
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {selectedJob ? 'Edit Job Description' : 'Create New Job Description'}
                </DialogTitle>
                <DialogDescription>
                  Define the job requirements and skills needed for this position.
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Job Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g., Senior Frontend Developer"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Input
                      id="department"
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      placeholder="e.g., Engineering"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="e.g., San Francisco, CA"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="education">Education</Label>
                    <Input
                      id="education"
                      value={formData.education}
                      onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                      placeholder="e.g., Bachelor's in CS"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="experienceMin">Min Experience (years)</Label>
                    <Input
                      id="experienceMin"
                      type="number"
                      min="0"
                      value={formData.experienceMin}
                      onChange={(e) => setFormData({ ...formData, experienceMin: e.target.value })}
                      placeholder="0"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="experienceMax">Max Experience (years)</Label>
                    <Input
                      id="experienceMax"
                      type="number"
                      min="0"
                      value={formData.experienceMax}
                      onChange={(e) => setFormData({ ...formData, experienceMax: e.target.value })}
                      placeholder="10"
                      required
                    />
                  </div>
                </div>

                {/* Required Skills */}
                <div className="space-y-2">
                  <Label>Required Skills</Label>
                  <div className="flex gap-2">
                    <Input
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      placeholder="Add a skill"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddSkill('required');
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handleAddSkill('required')}
                    >
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.requiredSkills.map((skill) => (
                      <span
                        key={skill}
                        className="skill-tag-required flex items-center gap-1"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill('required', skill)}
                          className="hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe the role and responsibilities..."
                    rows={4}
                    required
                  />
                </div>

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => {
                    setIsDialogOpen(false);
                    resetForm();
                  }}>
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    {selectedJob ? 'Update Job' : 'Create Job'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Jobs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="group bg-card rounded-xl border border-border/60 p-5 hover:shadow-lg hover:border-primary/20 transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-primary/0 group-hover:bg-primary/10 transition-colors"></div>

              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Briefcase className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-foreground line-clamp-1">{job.title}</h3>
                    <p className="text-sm text-muted-foreground">{job.department}</p>
                  </div>
                </div>
                <StatusBadge status={job.status} />
              </div>

              <div className="space-y-2.5 mb-5 pl-1">
                <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 text-primary/60" />
                  {job.location}
                </div>
                <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
                  <Users className="h-4 w-4 text-primary/60" />
                  {job.candidateCount} candidates applied
                </div>
                <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4 text-primary/60" />
                  Posted {formatDate(job.createdAt, 'MMM d, yyyy')}
                </div>
              </div>

              <div className="mb-5">
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2.5">Required Skills</div>
                <SkillList skills={job.requiredSkills} variant="required" maxVisible={3} />
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-border/60">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 hover:border-primary/50 hover:text-primary transition-colors"
                  onClick={() => handleEdit(job)}
                >
                  <Pencil className="h-3.5 w-3.5 mr-2" />
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="px-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                  onClick={() => handleDelete(job.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}

          {jobs.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
              <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <Briefcase className="h-8 w-8 opacity-50" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-1">No jobs found</h3>
              <p>Get started by creating a new job posting.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
