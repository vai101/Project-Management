import React, { useState } from 'react';
import styled from 'styled-components';
import { ITask } from '../types/models';
import { useProjectContext } from '../context/ProjectContext';
import * as api from '../api/projectApi';
import { theme } from '../styles/theme';
import { Button, Input, Badge, Card } from '../styles/components';

interface TaskCardProps {
    task: ITask;
}

const TaskCardContainer = styled(Card)`
  background: ${theme.colors.background.primary};
  border: 1px solid ${theme.colors.neutral[200]};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing[4]};
  margin-bottom: ${theme.spacing[3]};
  transition: all ${theme.transitions.normal};
  cursor: grab;
  position: relative;
  overflow: hidden;

  &:hover {
    box-shadow: ${theme.shadows.lg};
    transform: translateY(-2px);
    border-color: ${theme.colors.primary[300]};
  }

  &:active {
    cursor: grabbing;
    transform: translateY(-1px);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, ${theme.colors.primary[400]}, ${theme.colors.primary[600]});
    opacity: 0;
    transition: opacity ${theme.transitions.fast};
  }

  &:hover::before {
    opacity: 1;
  }
`;

const TaskHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: ${theme.spacing[3]};
  gap: ${theme.spacing[2]};
`;

const TaskTitle = styled.h4`
  font-size: ${theme.typography.fontSize.base};
  font-weight: ${theme.typography.fontWeight.semibold};
  color: ${theme.colors.text.primary};
  margin: 0;
  line-height: ${theme.typography.lineHeight.tight};
  flex: 1;
  min-width: 0;
`;

const TaskActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[1]};
  opacity: 0;
  transition: opacity ${theme.transitions.fast};

  ${TaskCardContainer}:hover & {
    opacity: 1;
  }
`;

const DeleteButton = styled(Button)`
  padding: ${theme.spacing[1]};
  min-width: auto;
  width: 28px;
  height: 28px;
  border-radius: ${theme.borderRadius.full};
  font-size: ${theme.typography.fontSize.xs};
`;

const TaskDescription = styled.p`
  font-size: ${theme.typography.fontSize.sm};
  color: ${theme.colors.text.secondary};
  margin: 0 0 ${theme.spacing[3]} 0;
  line-height: ${theme.typography.lineHeight.normal};
  min-height: 20px;
`;

const NoDescription = styled.span`
  font-style: italic;
  color: ${theme.colors.text.muted};
  font-size: ${theme.typography.fontSize.sm};
`;

const StatusBadge = styled(Badge)<{ status: string }>`
  background: ${({ status }) => {
    switch (status) {
      case 'To Do':
        return theme.colors.neutral[100];
      case 'In Progress':
        return theme.colors.warning[100];
      case 'Done':
        return theme.colors.success[100];
      default:
        return theme.colors.neutral[100];
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
  font-size: ${theme.typography.fontSize.xs};
  font-weight: ${theme.typography.fontWeight.medium};
`;

const AISection = styled.div`
  margin-top: ${theme.spacing[4]};
  padding-top: ${theme.spacing[3]};
  border-top: 1px solid ${theme.colors.neutral[200]};
`;

const AISectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};
  margin-bottom: ${theme.spacing[3]};
`;

const AISectionTitle = styled.h5`
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.semibold};
  color: ${theme.colors.text.primary};
  margin: 0;
  display: flex;
  align-items: center;
  gap: ${theme.spacing[1]};
`;

const AIInputContainer = styled.div`
  display: flex;
  gap: ${theme.spacing[2]};
  margin-bottom: ${theme.spacing[3]};
`;

const AIInput = styled(Input)`
  flex: 1;
  font-size: ${theme.typography.fontSize.sm};
  padding: ${theme.spacing[2]};
  background: ${theme.colors.neutral[50]};
  border: 1px solid ${theme.colors.neutral[200]};

  &:focus {
    background: ${theme.colors.background.primary};
    border-color: ${theme.colors.primary[400]};
  }
`;

const AIButton = styled(Button)`
  padding: ${theme.spacing[2]} ${theme.spacing[3]};
  font-size: ${theme.typography.fontSize.sm};
  white-space: nowrap;
`;

const AIAnswer = styled.div`
  background: linear-gradient(135deg, ${theme.colors.primary[50]}, ${theme.colors.primary[100]});
  border: 1px solid ${theme.colors.primary[200]};
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing[4]};
  font-size: ${theme.typography.fontSize.sm};
  line-height: ${theme.typography.lineHeight.relaxed};
  color: ${theme.colors.text.secondary};
  position: relative;
  max-height: 300px;
  overflow-y: auto;
  white-space: pre-wrap;
  word-wrap: break-word;
  margin-top: ${theme.spacing[2]};

  &::before {
    content: '🤖';
    position: absolute;
    top: ${theme.spacing[2]};
    right: ${theme.spacing[2]};
    font-size: ${theme.typography.fontSize.sm};
  }

  /* Custom scrollbar for AI answer */
  &::-webkit-scrollbar {
    width: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: ${theme.colors.primary[100]};
    border-radius: ${theme.borderRadius.full};
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${theme.colors.primary[300]};
    border-radius: ${theme.borderRadius.full};
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: ${theme.colors.primary[400]};
  }
`;

const AIAnswerLabel = styled.span`
  font-weight: ${theme.typography.fontWeight.semibold};
  color: ${theme.colors.primary[700]};
  margin-right: ${theme.spacing[1]};
`;

const TaskFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: ${theme.spacing[3]};
  padding-top: ${theme.spacing[2]};
  border-top: 1px solid ${theme.colors.neutral[100]};
`;

const TaskMeta = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};
`;

const TaskId = styled.span`
  font-size: ${theme.typography.fontSize.xs};
  color: ${theme.colors.text.muted};
  font-family: ${theme.typography.fontFamily.mono.join(', ')};
`;

const DragHandle = styled.div`
  position: absolute;
  top: ${theme.spacing[2]};
  right: ${theme.spacing[2]};
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${theme.colors.text.muted};
  font-size: ${theme.typography.fontSize.sm};
  opacity: 0;
  transition: opacity ${theme.transitions.fast};

  ${TaskCardContainer}:hover & {
    opacity: 1;
  }
`;

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
    const { deleteTask, selectedProject } = useProjectContext();
    const [aiQuestion, setAiQuestion] = useState('');
    const [aiAnswer, setAiAnswer] = useState('');
    const [isAsking, setIsAsking] = useState(false);
    const [showAI, setShowAI] = useState(false);

    const handleDelete = () => {
        if (window.confirm(`Are you sure you want to delete task: ${task.title}?`)) {
            deleteTask(task._id); 
        }
    };

    const handleAskAI = async () => {
        if (!aiQuestion.trim() || !selectedProject) {
            setAiAnswer('Please enter a question.');
            return;
        }

        setIsAsking(true);
        setAiAnswer('...Thinking...');
        try {
            const response = await api.askAi(aiQuestion, task._id, 'task'); 
            setAiAnswer(response.data.answer);
        } catch (error) {
            console.warn("AI Q&A Error (Backend not available):", error);
            // Provide a helpful fallback response when backend is not available
            setAiAnswer(`🤖 AI Assistant (Demo Mode)\n\nQuestion: "${aiQuestion}"\nTask: "${task.title}"\n\nSince the backend AI service is not available, here are some general suggestions:\n\n• Review task requirements and resources\n• Break down complex tasks into smaller steps\n• Set realistic deadlines and milestones\n\nTo get real AI assistance, ensure the backend server is running with a valid Gemini API key.`);
        } finally {
            setIsAsking(false);
        }
    };

    const getTaskId = () => {
        return task._id.slice(-6).toUpperCase();
    };

    return (
        <TaskCardContainer>
            <DragHandle>⋮⋮</DragHandle>
            
            <TaskHeader>
                <TaskTitle>{task.title}</TaskTitle>
                <TaskActions>
                    <DeleteButton
                        variant="danger"
                        size="sm"
                        onClick={handleDelete}
                        title="Delete task"
                    >
                        🗑️
                    </DeleteButton>
                </TaskActions>
            </TaskHeader>

            <TaskDescription>
                {task.description ? (
                    task.description
                ) : (
                    <NoDescription>No description provided</NoDescription>
                )}
            </TaskDescription>

            <TaskFooter>
                <TaskMeta>
                    <StatusBadge status={task.status}>
                        {task.status}
                    </StatusBadge>
                    <TaskId>#{getTaskId()}</TaskId>
                </TaskMeta>
                
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAI(!showAI)}
                >
                    {showAI ? '🤖 Hide AI' : '🤖 Ask AI'}
                </Button>
            </TaskFooter>

            {showAI && (
                <AISection>
                    <AISectionHeader>
                        <AISectionTitle>
                            Ask Gemini about this task
                        </AISectionTitle>
                    </AISectionHeader>
                    
                    <AIInputContainer>
                        <AIInput
                            type="text"
                            placeholder="What would you like to know about this task?"
                            value={aiQuestion}
                            onChange={(e) => setAiQuestion(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleAskAI()}
                        />
                        <AIButton
                            variant="primary"
                            onClick={handleAskAI}
                            disabled={isAsking || !aiQuestion.trim()}
                            $isLoading={isAsking}
                        >
                            {isAsking ? 'Asking...' : 'Ask'}
                        </AIButton>
                    </AIInputContainer>

                    {aiAnswer && (
                        <AIAnswer>
                            <AIAnswerLabel>AI Answer:</AIAnswerLabel>
                            {aiAnswer}
                        </AIAnswer>
                    )}
                </AISection>
            )}
        </TaskCardContainer>
    );
};

export default TaskCard;