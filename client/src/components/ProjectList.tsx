import React, { useState } from 'react';
import styled from 'styled-components';
import { useProjectContext } from '../context/ProjectContext';
import { theme } from '../styles/theme';
import { Button, Input, Textarea, Badge } from '../styles/components';

const SidebarContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: ${theme.colors.background.primary};
`;

const SidebarHeader = styled.div`
  padding: ${theme.spacing[6]};
  border-bottom: 1px solid ${theme.colors.neutral[200]};
  background: linear-gradient(135deg, ${theme.colors.primary[50]}, ${theme.colors.primary[100]});
`;

const SidebarTitle = styled.h2`
  font-size: ${theme.typography.fontSize.xl};
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${theme.colors.text.primary};
  margin: 0 0 ${theme.spacing[2]} 0;
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};
`;

const ProjectCount = styled(Badge)`
  background: ${theme.colors.primary[200]};
  color: ${theme.colors.primary[800]};
`;

const SearchContainer = styled.div`
  padding: ${theme.spacing[4]} ${theme.spacing[6]};
  border-bottom: 1px solid ${theme.colors.neutral[200]};
`;

const SearchInput = styled(Input)`
  background: ${theme.colors.neutral[50]};
  border: 1px solid ${theme.colors.neutral[200]};
  
  &:focus {
    background: ${theme.colors.background.primary};
    border-color: ${theme.colors.primary[400]};
  }
`;

const AddProjectSection = styled.div`
  padding: ${theme.spacing[4]} ${theme.spacing[6]};
  border-bottom: 1px solid ${theme.colors.neutral[200]};
`;

const AddProjectForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[3]};
  margin-top: ${theme.spacing[4]};
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[1]};
`;

const FormLabel = styled.label`
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.medium};
  color: ${theme.colors.text.secondary};
`;

const FormActions = styled.div`
  display: flex;
  gap: ${theme.spacing[2]};
`;

const ProjectsList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: ${theme.spacing[2]};
`;

const ProjectItem = styled.div<{ $isSelected: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${theme.spacing[4]};
  margin-bottom: ${theme.spacing[2]};
  border-radius: ${theme.borderRadius.lg};
  cursor: pointer;
  transition: all ${theme.transitions.fast};
  border: 1px solid ${({ $isSelected }) => 
    $isSelected ? theme.colors.primary[300] : theme.colors.neutral[200]};
  background: ${({ $isSelected }) => 
    $isSelected ? theme.colors.primary[50] : theme.colors.background.primary};
  box-shadow: ${({ $isSelected }) => 
    $isSelected ? theme.shadows.md : theme.shadows.sm};

  &:hover {
    transform: translateY(-1px);
    box-shadow: ${theme.shadows.lg};
    border-color: ${({ $isSelected }) => 
      $isSelected ? theme.colors.primary[400] : theme.colors.neutral[300]};
  }

  &:active {
    transform: translateY(0);
  }
`;

const ProjectInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const ProjectName = styled.h3`
  font-size: ${theme.typography.fontSize.base};
  font-weight: ${theme.typography.fontWeight.semibold};
  color: ${theme.colors.text.primary};
  margin: 0 0 ${theme.spacing[1]} 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ProjectDescription = styled.p`
  font-size: ${theme.typography.fontSize.sm};
  color: ${theme.colors.text.secondary};
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ProjectActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};
  opacity: 0;
  transition: opacity ${theme.transitions.fast};

  ${ProjectItem}:hover & {
    opacity: 1;
  }
`;

const DeleteButton = styled(Button)`
  padding: ${theme.spacing[1]};
  min-width: auto;
  width: 32px;
  height: 32px;
  border-radius: ${theme.borderRadius.full};
  font-size: ${theme.typography.fontSize.sm};
`;

const ProjectIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: ${theme.borderRadius.lg};
  background: linear-gradient(135deg, ${theme.colors.primary[500]}, ${theme.colors.primary[600]});
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${theme.colors.text.inverse};
  font-weight: ${theme.typography.fontWeight.bold};
  font-size: ${theme.typography.fontSize.lg};
  margin-right: ${theme.spacing[3]};
  flex-shrink: 0;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${theme.spacing[8]} ${theme.spacing[4]};
  text-align: center;
  color: ${theme.colors.text.muted};
`;

const EmptyStateIcon = styled.div`
  font-size: ${theme.typography.fontSize['4xl']};
  margin-bottom: ${theme.spacing[4]};
`;

const EmptyStateText = styled.p`
  font-size: ${theme.typography.fontSize.sm};
  margin: 0;
`;

interface ProjectListProps {
    onClose?: () => void;
}

const ProjectList: React.FC<ProjectListProps> = ({ onClose }) => {
    const { projects, selectedProject, selectProject, addProject, deleteProject } = useProjectContext();
    const [isAdding, setIsAdding] = useState(false);
    const [projectName, setProjectName] = useState('');
    const [projectDesc, setProjectDesc] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const handleAddProject = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!projectName.trim() || !projectDesc.trim()) return;
        try {
            await addProject(projectName, projectDesc);
            setProjectName('');
            setProjectDesc('');
            setIsAdding(false);
        } catch (error) {
        }
    };

    const handleDelete = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (window.confirm('Are you sure you want to delete this project and ALL its tasks?')) {
            await deleteProject(id);
        }
    };

    const handleProjectSelect = (projectId: string) => {
        selectProject(projectId);
        if (onClose) {
            onClose();
        }
    };

    const filteredProjects = projects.filter(project =>
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getProjectInitial = (name: string) => {
        return name.charAt(0).toUpperCase();
    };

    return (
        <SidebarContainer>
            <SidebarHeader>
                <SidebarTitle>
                    📁 Projects
                    <ProjectCount variant="info">
                        {projects.length}
                    </ProjectCount>
                </SidebarTitle>
            </SidebarHeader>

            <SearchContainer>
                <SearchInput
                    type="text"
                    placeholder="Search projects..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </SearchContainer>

            <AddProjectSection>
                <Button
                    variant={isAdding ? "secondary" : "primary"}
                    onClick={() => setIsAdding(!isAdding)}
                    $fullWidth
                    size="md"
                >
                    {isAdding ? '✕ Cancel' : '+ New Project'}
                </Button>
                
                {isAdding && (
                    <AddProjectForm onSubmit={handleAddProject}>
                        <FormGroup>
                            <FormLabel>Project Name</FormLabel>
                            <Input
                                type="text"
                                placeholder="Enter project name"
                                value={projectName}
                                onChange={(e) => setProjectName(e.target.value)}
                                required
                            />
                        </FormGroup>
                        <FormGroup>
                            <FormLabel>Description</FormLabel>
                            <Textarea
                                placeholder="Enter project description (min 10 characters)"
                                value={projectDesc}
                                onChange={(e) => setProjectDesc(e.target.value)}
                                rows={3}
                                required
                            />
                        </FormGroup>
                        <FormActions>
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => {
                                    setIsAdding(false);
                                    setProjectName('');
                                    setProjectDesc('');
                                }}
                                $fullWidth
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                variant="primary"
                                $fullWidth
                                disabled={!projectName.trim() || !projectDesc.trim() || projectDesc.trim().length < 10}
                            >
                                Create Project
                            </Button>
                        </FormActions>
                    </AddProjectForm>
                )}
            </AddProjectSection>

            <ProjectsList>
                {filteredProjects.length === 0 ? (
                    <EmptyState>
                        <EmptyStateIcon>📂</EmptyStateIcon>
                        <EmptyStateText>
                            {searchTerm ? 'No projects found' : 'No projects yet'}
                        </EmptyStateText>
                    </EmptyState>
                ) : (
                    filteredProjects.map((project) => (
                        <ProjectItem
                            key={project._id}
                            $isSelected={selectedProject?._id === project._id}
                            onClick={() => handleProjectSelect(project._id)}
                        >
                            <ProjectIcon>
                                {getProjectInitial(project.name)}
                            </ProjectIcon>
                            <ProjectInfo>
                                <ProjectName>{project.name}</ProjectName>
                                <ProjectDescription>{project.description}</ProjectDescription>
                            </ProjectInfo>
                            <ProjectActions>
                                <DeleteButton
                                    variant="danger"
                                    size="sm"
                                    onClick={(e) => handleDelete(e, project._id)}
                                    title="Delete project"
                                >
                                    🗑️
                                </DeleteButton>
                            </ProjectActions>
                        </ProjectItem>
                    ))
                )}
            </ProjectsList>
        </SidebarContainer>
    );
};

export default ProjectList;