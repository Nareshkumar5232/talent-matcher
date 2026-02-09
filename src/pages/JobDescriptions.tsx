import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { StatusBadge } from '@/components/common/StatusBadge';
import { SkillList } from '@/components/common/SkillBadge';
import { jobDescriptions, JobDescription } from '@/data/mockData';
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
import { format } from 'date-fns';

export default function JobDescriptions() {
  const [jobs, setJobs] = useState<JobDescription[]>(jobDescriptions);
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newJob: JobDescription = {
      id: `job-${Date.now()}`,
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
      createdAt: new Date().toISOString(),
      status: 'active',
      candidateCount: 0,
    };
    setJobs([newJob, ...jobs]);
    setIsDialogOpen(false);
    resetForm();
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

  return (
    <div className="min-h-screen">
      <Header
        title="Job Descriptions"
        subtitle="Manage job postings and requirements"
      />

      <div className="p-6">
        {/* Actions Bar */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Select defaultValue="all">
              <SelectTrigger className="w-40">
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
              <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
                <Plus className="h-4 w-4 mr-2" />
                Create Job
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
                  <Button type="submit" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                    {selectedJob ? 'Update Job' : 'Create Job'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Jobs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="bg-card rounded-lg border border-border p-5 hover:shadow-card-hover transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                    <Briefcase className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{job.title}</h3>
                    <p className="text-sm text-muted-foreground">{job.department}</p>
                  </div>
                </div>
                <StatusBadge status={job.status} />
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  {job.location}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  {job.candidateCount} candidates
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  {format(new Date(job.createdAt), 'MMM d, yyyy')}
                </div>
              </div>

              <div className="mb-4">
                <p className="text-xs font-medium text-muted-foreground mb-2">Required Skills</p>
                <SkillList skills={job.requiredSkills} variant="required" maxVisible={4} />
              </div>

              <div className="flex items-center gap-2 pt-3 border-t border-border">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => handleEdit(job)}
                >
                  <Pencil className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
