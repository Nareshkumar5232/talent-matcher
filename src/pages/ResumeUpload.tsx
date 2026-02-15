import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { SkillList } from '@/components/common/SkillBadge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Upload, FileText, X, CheckCircle, AlertCircle, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { uploadResume } from '@/lib/api';
import { format } from 'date-fns';

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  progress: number;
  errorMessage?: string;
  candidateId?: string;
  parsedData?: {
    name: string;
    email: string;
    skills: string[];
    experience: string;
  };
}

export default function ResumeUpload() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const navigate = useNavigate();

  const startUpload = async (file: File) => {
    const uploadId = `upload-${Date.now()}-${Math.random()}`;
    const newFile: UploadedFile = {
      id: uploadId,
      name: file.name,
      size: file.size,
      status: 'uploading',
      progress: 0,
    };

    setFiles((prev) => [newFile, ...prev]);

    // Fake progress animation
    const progressInterval = setInterval(() => {
      setFiles((prev) => prev.map(f => {
        if (f.id === uploadId && f.status === 'uploading') {
          const nextProgress = f.progress + 10;
          return { ...f, progress: nextProgress > 90 ? 90 : nextProgress };
        }
        return f;
      }));
    }, 200);

    try {
      const response: any = await uploadResume(file);

      clearInterval(progressInterval);

      setFiles((prev) =>
        prev.map((f) =>
          f.id === uploadId
            ? {
              ...f,
              status: 'completed',
              progress: 100,
              candidateId: response.candidate.id,
              parsedData: {
                name: response.candidate.name,
                email: response.candidate.email,
                skills: response.candidate.skills,
                experience: `${response.candidate.experience} years`
              },
            }
            : f
        )
      );

    } catch (error: any) {
      clearInterval(progressInterval);
      setFiles((prev) =>
        prev.map((f) =>
          f.id === uploadId ? {
            ...f,
            status: 'error',
            progress: 0,
            errorMessage: error.message || 'Failed to process resume'
          } : f
        )
      );
    }
  };

  const SUPPORTED_TYPES = [
    'image/png',
    'image/jpeg',
    'image/jpg'
  ];

  const isValidFileType = (file: File) => SUPPORTED_TYPES.includes(file.type);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files).filter(isValidFileType);

    if (e.dataTransfer.files.length > droppedFiles.length) {
      // Some files were filtered out
      alert("Some files were skipped because they are not valid image files (PNG, JPG).");
    }

    droppedFiles.forEach((file) => startUpload(file));
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);

    selectedFiles.forEach((file) => {
      if (isValidFileType(file)) {
        startUpload(file);
      } else {
        // Add a file item that immediately shows error
        const uploadId = `error-${Date.now()}-${Math.random()}`;
        const errorFile: UploadedFile = {
          id: uploadId,
          name: file.name,
          size: file.size,
          status: 'error',
          progress: 0,
          errorMessage: 'Invalid file format. Only image files (PNG, JPG) are allowed.'
        };
        setFiles((prev) => [errorFile, ...prev]);
      }
    });
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="min-h-screen">
      <Header
        title="Upload Resumes"
        subtitle="Upload and process candidate resumes"
      />

      <div className="p-6">
        {/* Drop Zone */}
        <div
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          className={`dropzone mb-6 ${isDragging ? 'dropzone-active' : ''}`}
        >
          <input
            type="file"
            accept=".png,.jpg,.jpeg,image/png,image/jpeg"
            multiple
            onChange={handleFileSelect}
            className="hidden"
            id="file-upload"
          />
          <label htmlFor="file-upload" className="cursor-pointer">
            <div className="flex flex-col items-center">
              <div className="h-16 w-16 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                <Upload className="h-8 w-8 text-accent" />
              </div>
              <p className="text-lg font-medium text-foreground mb-1">
                Drop resume images here or click to upload
              </p>
              <p className="text-sm text-muted-foreground">
                Supports PNG and JPG images only (max 10MB each)
              </p>
            </div>
          </label>
        </div>

        {/* Uploaded Files */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-foreground">
              Uploaded Files ({files.length})
            </h2>
            {files.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setFiles([])}
                className="text-muted-foreground"
              >
                Clear All
              </Button>
            )}
          </div>

          <AnimatePresence>
            {files.map((file) => (
              <motion.div
                key={file.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-card rounded-lg border border-border p-4"
              >
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <FileText className="h-6 w-6 text-accent" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-foreground truncate">
                          {file.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {formatFileSize(file.size)}
                        </p>
                      </div>
                      <button
                        onClick={() => removeFile(file.id)}
                        className="text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>

                    {/* Status Indicator */}
                    <div className="mt-3">
                      {file.status === 'uploading' && (
                        <div className="space-y-2">
                          <Progress value={file.progress} className="h-2" />
                          <p className="text-xs text-muted-foreground">
                            Uploading... {Math.round(file.progress)}%
                          </p>
                        </div>
                      )}

                      {file.status === 'processing' && (
                        <div className="flex items-center gap-2 text-sm text-accent">
                          <div className="h-4 w-4 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                          Processing resume...
                        </div>
                      )}

                      {file.status === 'completed' && file.parsedData && (
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-sm text-success">
                            <CheckCircle className="h-4 w-4" />
                            Successfully parsed
                          </div>
                          <div className="bg-muted/30 rounded-lg p-3 space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">Candidate:</span>
                              <span className="font-medium text-foreground">{file.parsedData.name}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">Experience:</span>
                              <span className="font-medium text-foreground">{file.parsedData.experience}</span>
                            </div>
                            <div className="pt-2 border-t border-border">
                              <p className="text-xs text-muted-foreground mb-2">Detected Skills:</p>
                              <SkillList skills={file.parsedData.skills} variant="matched" />
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => navigate('/candidates')}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View Details
                            </Button>
                          </div>
                        </div>
                      )}

                      {file.status === 'error' && (
                        <div className="flex items-center gap-2 text-sm text-destructive">
                          <AlertCircle className="h-4 w-4" />
                          {file.errorMessage || 'Failed to process resume'}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {files.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-40" />
              <p>No resumes uploaded yet</p>
              <p className="text-sm">Upload resumes to start processing</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
