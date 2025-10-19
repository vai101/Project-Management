import React, { useState } from 'react';
import styled from 'styled-components';
import * as api from '../api/projectApi';

import { 
    DragDropContext, 
    Droppable, 
    Draggable, 
    DropResult,
    DroppableProvided, 
    DroppableStateSnapshot,
    DraggableProvided,
    DraggableStateSnapshot
} from '@hello-pangea/dnd';

import { useProjectContext } from '../context/ProjectContext';
import { IProject, ITask, TaskStatus } from '../types/models';
import TaskCard from './TaskCard';
import { theme } from '../styles/theme';
import { Button, Card, Spinner, Input, Textarea } from '../styles/components';

const STATUS_COLUMNS: TaskStatus[] = ['To Do', 'In Progress', 'Done'];

interface KanbanBoardProps {
    project: IProject;
}

const BoardContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 80vh;
  gap: ${theme.spacing[6]};
`;

const BoardHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[4]};
`;

const ProjectInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[2]};
`;

const ProjectTitle = styled.h1`
  font-size: ${theme.typography.fontSize['3xl']};
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${theme.colors.text.primary};
  margin: 0;
  background: linear-gradient(135deg, ${theme.colors.primary[600]}, ${theme.colors.primary[800]});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const ProjectDescription = styled.p`
  font-size: ${theme.typography.fontSize.lg};
  color: ${theme.colors.text.secondary};
  margin: 0;
  max-width: 600px;
`;

const ProjectStats = styled.div`
  display: flex;
  gap: ${theme.spacing[4]};
  flex-wrap: wrap;
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${theme.spacing[3]};
  background: ${theme.colors.background.primary};
  border-radius: ${theme.borderRadius.lg};
  border: 1px solid ${theme.colors.neutral[200]};
  min-width: 100px;
`;

const StatValue = styled.span`
  font-size: ${theme.typography.fontSize['2xl']};
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${theme.colors.text.primary};
`;

const StatLabel = styled.span`
  font-size: ${theme.typography.fontSize.sm};
  color: ${theme.colors.text.secondary};
  text-align: center;
`;

const AISummarySection = styled(Card)`
  background: linear-gradient(135deg, ${theme.colors.primary[50]}, ${theme.colors.primary[100]});
  border: 1px solid ${theme.colors.primary[200]};
  position: relative;
  overflow: hidden;
  margin-bottom: ${theme.spacing[6]};
  min-height: 200px;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, ${theme.colors.primary[500]}, ${theme.colors.primary[600]});
  }
`;

const AISummaryHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};
  margin-bottom: ${theme.spacing[4]};
`;

const AISummaryTitle = styled.h3`
  font-size: ${theme.typography.fontSize.lg};
  font-weight: ${theme.typography.fontWeight.semibold};
  color: ${theme.colors.text.primary};
  margin: 0;
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};
`;

const AISummaryContent = styled.div`
  background: ${theme.colors.background.primary};
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing[4]};
  border: 1px solid ${theme.colors.primary[200]};
  white-space: pre-wrap;
  font-size: ${theme.typography.fontSize.sm};
  line-height: ${theme.typography.lineHeight.relaxed};
  color: ${theme.colors.text.secondary};
  max-height: 600px;
  min-height: 300px;
  overflow-y: auto;
  word-wrap: break-word;
  margin-bottom: ${theme.spacing[4]};
  
  /* Custom scrollbar for summary */
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: ${theme.colors.neutral[100]};
    border-radius: ${theme.borderRadius.full};
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${theme.colors.neutral[300]};
    border-radius: ${theme.borderRadius.full};
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: ${theme.colors.neutral[400]};
  }
`;

const TaskControls = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${theme.spacing[4]};
  flex-wrap: wrap;
`;

const AddTaskButton = styled(Button)`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};
  font-weight: ${theme.typography.fontWeight.semibold};
`;

const BoardColumns = styled.div`
  display: flex;
  gap: ${theme.spacing[6]};
  flex: 1;
  min-height: 60vh;
  overflow-x: auto;
  padding-bottom: ${theme.spacing[4]};
  
  @media (max-width: ${theme.breakpoints.md}) {
    flex-direction: column;
    gap: ${theme.spacing[4]};
    min-height: auto;
  }
`;

const Column = styled.div<{ status: TaskStatus }>`
  flex: 1;
  min-width: 320px;
  min-height: 500px;
  display: flex;
  flex-direction: column;
  background: ${theme.colors.background.primary};
  border-radius: ${theme.borderRadius.xl};
  border: 1px solid ${theme.colors.neutral[200]};
  box-shadow: ${theme.shadows.sm};
  overflow: hidden;
  transition: all ${theme.transitions.normal};

  &:hover {
    box-shadow: ${theme.shadows.md};
    transform: translateY(-2px);
  }
  
  @media (max-width: ${theme.breakpoints.md}) {
    min-width: 100%;
    min-height: 300px;
  }
`;

const ColumnHeader = styled.div<{ status: TaskStatus }>`
  padding: ${theme.spacing[4]} ${theme.spacing[5]};
  background: ${({ status }) => {
    switch (status) {
      case 'To Do':
        return `linear-gradient(135deg, ${theme.colors.neutral[100]}, ${theme.colors.neutral[200]})`;
      case 'In Progress':
        return `linear-gradient(135deg, ${theme.colors.warning[100]}, ${theme.colors.warning[200]})`;
      case 'Done':
        return `linear-gradient(135deg, ${theme.colors.success[100]}, ${theme.colors.success[200]})`;
      default:
        return theme.colors.neutral[100];
    }
  }};
  border-bottom: 1px solid ${theme.colors.neutral[200]};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ColumnTitle = styled.h2`
  font-size: ${theme.typography.fontSize.lg};
  font-weight: ${theme.typography.fontWeight.semibold};
  color: ${theme.colors.text.primary};
  margin: 0;
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};
`;

const ColumnIcon = styled.div<{ status: TaskStatus }>`
  width: 24px;
  height: 24px;
  border-radius: ${theme.borderRadius.full};
  background: ${({ status }) => {
    switch (status) {
      case 'To Do':
        return theme.colors.neutral[500];
      case 'In Progress':
        return theme.colors.warning[500];
      case 'Done':
        return theme.colors.success[500];
      default:
        return theme.colors.neutral[500];
    }
  }};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${theme.colors.text.inverse};
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.bold};
`;

const TaskCount = styled.div<{ status: TaskStatus }>`
  display: inline-flex;
  align-items: center;
  padding: ${theme.spacing[1]} ${theme.spacing[3]};
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.medium};
  border-radius: ${theme.borderRadius.full};
  background: ${({ status }) => {
    switch (status) {
      case 'To Do':
        return theme.colors.neutral[200];
      case 'In Progress':
        return theme.colors.warning[200];
      case 'Done':
        return theme.colors.success[200];
      default:
        return theme.colors.neutral[200];
    }
  }};
  color: ${({ status }) => {
    switch (status) {
      case 'To Do':
        return theme.colors.neutral[700];
      case 'In Progress':
        return theme.colors.warning[700];
      case 'Done':
        return theme.colors.success[700];
      default:
        return theme.colors.neutral[700];
    }
  }};
`;

const DroppableArea = styled.div<{ isDraggingOver: boolean; status: TaskStatus }>`
  flex: 1;
  padding: ${theme.spacing[4]};
  min-height: 400px;
  max-height: 85vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[3]};
  background: ${({ isDraggingOver, status }) => {
    if (isDraggingOver) {
      switch (status) {
        case 'To Do':
          return theme.colors.neutral[50];
        case 'In Progress':
          return theme.colors.warning[50];
        case 'Done':
          return theme.colors.success[50];
        default:
          return theme.colors.neutral[50];
      }
    }
    return 'transparent';
  }};
  border-radius: 0 0 ${theme.borderRadius.xl} ${theme.borderRadius.xl};
  transition: background-color ${theme.transitions.fast};
  
  /* Custom scrollbar styling */
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: ${theme.colors.neutral[100]};
    border-radius: ${theme.borderRadius.full};
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${theme.colors.neutral[300]};
    border-radius: ${theme.borderRadius.full};
    transition: background-color ${theme.transitions.fast};
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: ${theme.colors.neutral[400]};
  }
`;

const EmptyColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${theme.spacing[8]} ${theme.spacing[4]};
  color: ${theme.colors.text.muted};
  text-align: center;
  min-height: 200px;
`;

const EmptyColumnIcon = styled.div`
  font-size: ${theme.typography.fontSize['3xl']};
  margin-bottom: ${theme.spacing[2]};
  opacity: 0.5;
`;

const EmptyColumnText = styled.p`
  font-size: ${theme.typography.fontSize.sm};
  margin: 0;
  opacity: 0.7;
`;

// Add Task Modal Components
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: ${theme.zIndex.modal};
  padding: ${theme.spacing[4]};
`;

const ModalContent = styled(Card)`
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${theme.spacing[6]};
`;

const ModalTitle = styled.h2`
  font-size: ${theme.typography.fontSize.xl};
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${theme.colors.text.primary};
  margin: 0;
`;

const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  background: ${theme.colors.neutral[100]};
  border-radius: ${theme.borderRadius.full};
  cursor: pointer;
  transition: all ${theme.transitions.fast};
  
  &:hover {
    background: ${theme.colors.neutral[200]};
  }
`;

const ModalForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[4]};
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[2]};
`;

const FormLabel = styled.label`
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.medium};
  color: ${theme.colors.text.primary};
`;

const FormInput = styled(Input)`
  width: 100%;
`;

const FormTextarea = styled(Textarea)`
  width: 100%;
  min-height: 100px;
  resize: vertical;
`;

const ModalActions = styled.div`
  display: flex;
  gap: ${theme.spacing[3]};
  justify-content: flex-end;
  margin-top: ${theme.spacing[6]};
  padding-top: ${theme.spacing[4]};
  border-top: 1px solid ${theme.colors.neutral[200]};
`;

const DraggableTaskWrapper = styled.div<{ isDragging: boolean }>`
  margin-bottom: ${theme.spacing[3]};
  transform: ${({ isDragging }) => isDragging ? 'rotate(5deg)' : 'none'};
  transition: transform ${theme.transitions.fast};
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${theme.spacing[8]};
  gap: ${theme.spacing[4]};
`;

const LoadingText = styled.p`
  font-size: ${theme.typography.fontSize.lg};
  color: ${theme.colors.text.secondary};
  margin: 0;
`;

const KanbanBoard: React.FC<KanbanBoardProps> = ({ project }) => {
    const { currentTasks, handleDragEnd, isLoading, addTask } = useProjectContext(); 
    const [summary, setSummary] = useState<string>('');
    const [isSummarizing, setIsSummarizing] = useState(false);
    const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [newTaskDescription, setNewTaskDescription] = useState('');

    const onDragEnd = (result: DropResult) => {
        const { source, destination, draggableId } = result;

        handleDragEnd(
            { droppableId: source.droppableId as TaskStatus, index: source.index },
            destination ? { droppableId: destination.droppableId as TaskStatus, index: destination.index } : null,
            draggableId
        );
    };

    const fetchSummary = async () => {
        setIsSummarizing(true);
        setSummary('Generating executive summary...');
        try {
            const response = await api.getProjectSummary(project._id);
            setSummary(response.data.summary);
        } catch (error) {
            console.warn("AI Summary Error (Backend not available):", error);
            // Provide a helpful fallback summary when backend is not available
            const totalTasks = getTotalTasks();
            const todoTasks = currentTasks['To Do']?.length || 0;
            const inProgressTasks = currentTasks['In Progress']?.length || 0;
            const doneTasks = currentTasks['Done']?.length || 0;
            
            setSummary(`📊 Project Summary (Demo Mode)\n\nProject: ${project.name}\nDescription: ${project.description}\n\nTask Overview:\n• Total Tasks: ${totalTasks}\n• To Do: ${todoTasks} tasks\n• In Progress: ${inProgressTasks} tasks\n• Completed: ${doneTasks} tasks\n• Progress: ${totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0}% complete\n\nProject Status:\n${totalTasks === 0 ? '• No tasks created yet - consider adding your first task' : 
  doneTasks === totalTasks ? '• All tasks completed - great job!' :
  inProgressTasks > 0 ? '• Active development in progress' :
  '• Ready to start - tasks are planned and ready to begin'}\n\nRecommendations:\n• Review task priorities and deadlines\n• Ensure team alignment on project goals\n• Consider breaking down complex tasks\n• Set up regular progress reviews\n\nFor detailed AI insights and analysis, ensure the backend server is running with a valid Gemini API key.`);
        } finally {
            setIsSummarizing(false);
        }
    };

    const handleAddTask = () => {
        console.log('Opening add task modal');
        setIsAddTaskModalOpen(true);
    };

    const handleSubmitTask = async () => {
        console.log('Submitting task:', { title: newTaskTitle, description: newTaskDescription });
        if (!newTaskTitle.trim() || !newTaskDescription.trim()) {
            console.log('Validation failed: missing title or description');
            return;
        }
        
        try {
            await addTask(newTaskTitle, newTaskDescription);
            setNewTaskTitle('');
            setNewTaskDescription('');
            setIsAddTaskModalOpen(false);
            console.log('Task created successfully');
        } catch (error) {
            console.error('Error creating task:', error);
        }
    };

    const handleCancelTask = () => {
        setNewTaskTitle('');
        setNewTaskDescription('');
        setIsAddTaskModalOpen(false);
    };

    const getTotalTasks = () => {
        return Object.values(currentTasks).reduce((total, tasks) => total + (tasks?.length || 0), 0);
    };

    if (isLoading) {
        return (
            <LoadingContainer>
                <Spinner size="lg" color={theme.colors.primary[500]} />
                <LoadingText>Loading tasks...</LoadingText>
            </LoadingContainer>
        );
    }

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <BoardContainer>
                <BoardHeader>
                    <ProjectInfo>
                        <ProjectTitle>{project.name}</ProjectTitle>
                        <ProjectDescription>{project.description}</ProjectDescription>
                    </ProjectInfo>

                    <ProjectStats>
                        <StatItem>
                            <StatValue>{getTotalTasks()}</StatValue>
                            <StatLabel>Total Tasks</StatLabel>
                        </StatItem>
                        <StatItem>
                            <StatValue>{currentTasks['To Do']?.length || 0}</StatValue>
                            <StatLabel>To Do</StatLabel>
                        </StatItem>
                        <StatItem>
                            <StatValue>{currentTasks['In Progress']?.length || 0}</StatValue>
                            <StatLabel>In Progress</StatLabel>
                        </StatItem>
                        <StatItem>
                            <StatValue>{currentTasks['Done']?.length || 0}</StatValue>
                            <StatLabel>Completed</StatLabel>
                        </StatItem>
                    </ProjectStats>
                </BoardHeader>

                <AISummarySection>
                    <AISummaryHeader>
                        <AISummaryTitle>
                            🤖 Executive Summary (Powered by Gemini)
                        </AISummaryTitle>
                        <Button
                            variant="primary"
                            size="sm"
                            onClick={fetchSummary}
                            disabled={isSummarizing}
                            $isLoading={isSummarizing}
                        >
                            {isSummarizing ? 'Analyzing...' : 'Generate Summary'}
                        </Button>
                    </AISummaryHeader>
                    {summary && (
                        <AISummaryContent>
                            {summary}
                        </AISummaryContent>
                    )}
                </AISummarySection>

                <TaskControls>
                    <AddTaskButton
                        variant="primary"
                        onClick={handleAddTask}
                    >
                        ➕ Add New Task
                    </AddTaskButton>
                </TaskControls>

                <BoardColumns>
                    {STATUS_COLUMNS.map((columnId) => (
                        <DroppableColumn key={columnId} columnId={columnId} tasks={currentTasks[columnId] || []} />
                    ))}
                </BoardColumns>
            </BoardContainer>

            {/* Add Task Modal */}
            {isAddTaskModalOpen && (
                <ModalOverlay onClick={handleCancelTask}>
                    <ModalContent onClick={(e) => e.stopPropagation()}>
                        <ModalHeader>
                            <ModalTitle>Add New Task</ModalTitle>
                            <CloseButton onClick={handleCancelTask}>
                                ✕
                            </CloseButton>
                        </ModalHeader>
                        
                        <ModalForm onSubmit={(e) => { 
                            e.preventDefault(); 
                            console.log('Form submitted');
                            handleSubmitTask(); 
                        }}>
                            <FormGroup>
                                <FormLabel>Task Title *</FormLabel>
                                <FormInput
                                    type="text"
                                    placeholder="Enter task title"
                                    value={newTaskTitle}
                                    onChange={(e) => setNewTaskTitle(e.target.value)}
                                    required
                                />
                            </FormGroup>
                            
                            <FormGroup>
                                <FormLabel>Task Description *</FormLabel>
                                <FormTextarea
                                    placeholder="Enter task description"
                                    value={newTaskDescription}
                                    onChange={(e) => setNewTaskDescription(e.target.value)}
                                    required
                                />
                            </FormGroup>
                            
                            <ModalActions>
                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={handleCancelTask}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    variant="primary"
                                    disabled={!newTaskTitle.trim() || !newTaskDescription.trim()}
                                >
                                    Create Task
                                </Button>
                            </ModalActions>
                        </ModalForm>
                    </ModalContent>
                </ModalOverlay>
            )}
        </DragDropContext>
    );
};

const DroppableColumn: React.FC<{ columnId: TaskStatus, tasks: ITask[] }> = ({ columnId, tasks = [] }) => (
    <Column status={columnId}>
        <ColumnHeader status={columnId}>
            <ColumnTitle>
                <ColumnIcon status={columnId}>
                    {columnId === 'To Do' ? '📋' : columnId === 'In Progress' ? '⚡' : '✅'}
                </ColumnIcon>
                {columnId}
            </ColumnTitle>
            <TaskCount status={columnId}>
                {tasks.length}
            </TaskCount>
        </ColumnHeader>
        <Droppable droppableId={columnId}>
            {(provided: DroppableProvided, snapshot: DroppableStateSnapshot) => ( 
                <DroppableArea
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    isDraggingOver={snapshot.isDraggingOver}
                    status={columnId}
                >
                    {tasks.length === 0 ? (
                        <EmptyColumn>
                            <EmptyColumnIcon>
                                {columnId === 'To Do' ? '📝' : columnId === 'In Progress' ? '⚡' : '🎉'}
                            </EmptyColumnIcon>
                            <EmptyColumnText>
                                {columnId === 'To Do' ? 'No tasks to do' : 
                                 columnId === 'In Progress' ? 'No tasks in progress' : 
                                 'No completed tasks'}
                            </EmptyColumnText>
                        </EmptyColumn>
                    ) : (
                        tasks.map((task, index) => (
                            <DraggableTask key={task._id} task={task} index={index} />
                        ))
                    )}
                    {provided.placeholder}
                </DroppableArea>
            )}
        </Droppable>
    </Column>
);

const DraggableTask: React.FC<{ task: ITask, index: number }> = ({ task, index }) => (
    <Draggable draggableId={task._id} index={index}>
        {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => ( 
            <DraggableTaskWrapper
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                isDragging={snapshot.isDragging}
            >
                <TaskCard task={task} />
            </DraggableTaskWrapper>
        )}
    </Draggable>
);

export default KanbanBoard;