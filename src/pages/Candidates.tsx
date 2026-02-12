import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { StatusBadge } from '@/components/common/StatusBadge';
import { MatchScoreBadge, SkillProgressBar } from '@/components/common/MatchScore';
import { SkillList } from '@/components/common/SkillBadge';
import { Candidate } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Search,
  Filter,
  ChevronUp,
  ChevronDown,
  Eye,
  Download,
  CheckCircle,
  XCircle,
  MapPin,
  Mail,
  Phone,
  GraduationCap,
  Briefcase,
} from 'lucide-react';
import { getCandidates, updateCandidate } from '@/lib/api';
import { toast } from 'sonner';

type SortField = 'rank' | 'name' | 'skillMatch' | 'overallScore' | 'experience';
type SortOrder = 'asc' | 'desc';

export default function Candidates() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<SortField>('rank');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);

  useEffect(() => {
    loadCandidates();
  }, []);

  const loadCandidates = async () => {
    try {
      const data = await getCandidates();
      setCandidates(data);
    } catch (error) {
      toast.error("Failed to load candidates");
    }
  };

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      await updateCandidate(id, { status: newStatus });
      toast.success(`Candidate ${newStatus}`);
      loadCandidates();
      if (selectedCandidate) {
        setSelectedCandidate(null);
      }
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const filteredCandidates = candidates
    .filter((candidate) => {
      const matchesSearch =
        candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.skills.some((skill) =>
          skill.toLowerCase().includes(searchTerm.toLowerCase())
        );
      const matchesStatus =
        statusFilter === 'all'
          ? candidate.status !== 'rejected'
          : candidate.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'skillMatch':
          comparison = a.skillMatch - b.skillMatch;
          break;
        case 'overallScore':
          comparison = a.overallScore - b.overallScore;
          break;
        case 'experience':
          comparison = a.experience - b.experience;
          break;
        default:
          comparison = a.rank - b.rank;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortOrder === 'asc' ? (
      <ChevronUp className="h-4 w-4" />
    ) : (
      <ChevronDown className="h-4 w-4" />
    );
  };

  return (
    <div className="min-h-screen">
      <Header
        title="Candidates"
        subtitle="View and manage candidate rankings"
      />

      <div className="p-6">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, or skill..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="reviewed">Reviewed</SelectItem>
                <SelectItem value="shortlisted">Shortlisted</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Candidates Table */}
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort('rank')}
                  >
                    <div className="flex items-center gap-1">
                      Rank <SortIcon field="rank" />
                    </div>
                  </th>
                  <th
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center gap-1">
                      Candidate <SortIcon field="name" />
                    </div>
                  </th>
                  <th
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort('experience')}
                  >
                    <div className="flex items-center gap-1">
                      Experience <SortIcon field="experience" />
                    </div>
                  </th>
                  <th
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort('skillMatch')}
                  >
                    <div className="flex items-center gap-1">
                      Skill Match <SortIcon field="skillMatch" />
                    </div>
                  </th>
                  <th>Exp. Match</th>
                  <th>Edu. Match</th>
                  <th
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort('overallScore')}
                  >
                    <div className="flex items-center gap-1">
                      Overall <SortIcon field="overallScore" />
                    </div>
                  </th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCandidates.map((candidate) => (
                  <tr key={candidate.id}>
                    <td>
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-semibold">
                        {candidate.rank}
                      </span>
                    </td>
                    <td>
                      <div>
                        <p className="font-medium text-foreground">{candidate.name}</p>
                        <p className="text-xs text-muted-foreground">{candidate.location}</p>
                      </div>
                    </td>
                    <td className="text-foreground">{candidate.experience} yrs</td>
                    <td>
                      <MatchScoreBadge score={candidate.skillMatch} />
                    </td>
                    <td>
                      <MatchScoreBadge score={candidate.experienceMatch} />
                    </td>
                    <td>
                      <MatchScoreBadge score={candidate.educationMatch} />
                    </td>
                    <td>
                      <MatchScoreBadge score={candidate.overallScore} />
                    </td>
                    <td>
                      <StatusBadge status={candidate.status} />
                    </td>
                    <td>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => setSelectedCandidate(candidate)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-success hover:text-success"
                          onClick={() => handleStatusUpdate(candidate.id, 'shortlisted')}
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => handleStatusUpdate(candidate.id, 'rejected')}
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Results count */}
        <p className="mt-4 text-sm text-muted-foreground">
          Showing {filteredCandidates.length} of {candidates.length} candidates
        </p>
      </div>

      {/* Candidate Detail Dialog */}
      <Dialog
        open={!!selectedCandidate}
        onOpenChange={(open) => !open && setSelectedCandidate(null)}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedCandidate && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-accent flex items-center justify-center text-accent-foreground font-semibold text-lg">
                    {selectedCandidate.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      {selectedCandidate.name}
                      <StatusBadge status={selectedCandidate.status} />
                    </div>
                    <p className="text-sm font-normal text-muted-foreground">
                      Rank #{selectedCandidate.rank} • Overall Score:{' '}
                      <span className="font-semibold text-foreground">
                        {selectedCandidate.overallScore}%
                      </span>
                    </p>
                  </div>
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-6 mt-4">
                {/* Contact Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    {selectedCandidate.email}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    {selectedCandidate.phone}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {selectedCandidate.location}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Briefcase className="h-4 w-4" />
                    {selectedCandidate.experience} years experience
                  </div>
                </div>

                {/* Education */}
                <div>
                  <div className="flex items-center gap-2 text-sm font-medium text-foreground mb-1">
                    <GraduationCap className="h-4 w-4" />
                    Education
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {selectedCandidate.education}
                  </p>
                </div>

                {/* Summary */}
                <div>
                  <h4 className="text-sm font-medium text-foreground mb-2">Summary</h4>
                  <p className="text-sm text-muted-foreground">
                    {selectedCandidate.summary}
                  </p>
                </div>

                {/* Match Breakdown */}
                <div>
                  <h4 className="text-sm font-medium text-foreground mb-3">
                    Match Breakdown
                  </h4>
                  <div className="space-y-3">
                    <SkillProgressBar
                      label="Skill Match"
                      value={selectedCandidate.skillMatch}
                    />
                    <SkillProgressBar
                      label="Experience Match"
                      value={selectedCandidate.experienceMatch}
                    />
                    <SkillProgressBar
                      label="Education Match"
                      value={selectedCandidate.educationMatch}
                    />
                  </div>
                </div>

                {/* Skills */}
                <div>
                  <h4 className="text-sm font-medium text-foreground mb-2">
                    Matched Skills
                  </h4>
                  <SkillList
                    skills={selectedCandidate.matchedSkills}
                    variant="matched"
                  />
                </div>

                {selectedCandidate.missingSkills.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-foreground mb-2">
                      Missing Skills
                    </h4>
                    <SkillList
                      skills={selectedCandidate.missingSkills}
                      variant="missing"
                    />
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-3 pt-4 border-t border-border">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      if (selectedCandidate.resumeUrl) {
                        const url = selectedCandidate.resumeUrl.startsWith('/')
                          ? selectedCandidate.resumeUrl
                          : `/${selectedCandidate.resumeUrl}`;
                        window.open(url, '_blank');
                      } else {
                        toast.error("Resume not available");
                      }
                    }}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Resume
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 text-success border-success hover:bg-success/10"
                    onClick={() => handleStatusUpdate(selectedCandidate.id, 'shortlisted')}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Shortlist
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 text-destructive border-destructive hover:bg-destructive/10"
                    onClick={() => handleStatusUpdate(selectedCandidate.id, 'rejected')}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
