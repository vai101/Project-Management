import React from 'react';
import styled from 'styled-components';
import { useProjectContext } from './context/ProjectContext';
import ProjectList from './components/ProjectList'; 
import KanbanBoard from './components/KanbanBoard';
import { GlobalStyles } from './styles/GlobalStyles';
import { theme } from './styles/theme';
import { Spinner, Card } from './styles/components';

const AppContainer = styled.div`
  display: flex;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  background: ${theme.colors.background.secondary};
  
  @media (max-width: ${theme.breakpoints.md}) {
    flex-direction: column;
  }
`;

const Sidebar = styled.aside`
  width: 320px;
  background: ${theme.colors.background.primary};
  border-right: 1px solid ${theme.colors.neutral[200]};
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  box-shadow: ${theme.shadows.sm};
  z-index: ${theme.zIndex.docked};
  
  @media (max-width: ${theme.breakpoints.md}) {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    width: 280px;
    z-index: ${theme.zIndex.modal};
    transform: translateX(-100%);
    transition: transform ${theme.transitions.normal};
    
    &.open {
      transform: translateX(0);
    }
  }
`;

const MainContent = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: ${theme.colors.background.secondary};
  
  @media (max-width: ${theme.breakpoints.md}) {
    width: 100%;
  }
`;

const MobileHeader = styled.div`
  display: none;
  
  @media (max-width: ${theme.breakpoints.md}) {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: ${theme.spacing[4]};
    background: ${theme.colors.background.primary};
    border-bottom: 1px solid ${theme.colors.neutral[200]};
    box-shadow: ${theme.shadows.sm};
    z-index: ${theme.zIndex.sticky};
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  
  @media (max-width: ${theme.breakpoints.md}) {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border: none;
    background: ${theme.colors.neutral[100]};
    border-radius: ${theme.borderRadius.md};
    cursor: pointer;
    transition: all ${theme.transitions.fast};
    
    &:hover {
      background: ${theme.colors.neutral[200]};
    }
  }
`;

const MobileTitle = styled.h1`
  display: none;
  
  @media (max-width: ${theme.breakpoints.md}) {
    display: block;
    font-size: ${theme.typography.fontSize.lg};
    font-weight: ${theme.typography.fontWeight.bold};
    color: ${theme.colors.text.primary};
    margin: 0;
  }
`;

const Overlay = styled.div`
  display: none;
  
  @media (max-width: ${theme.breakpoints.md}) {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: ${theme.zIndex.overlay};
    opacity: 0;
    visibility: hidden;
    transition: all ${theme.transitions.fast};
    
    &.open {
      opacity: 1;
      visibility: visible;
    }
  }
`;

const Header = styled.header`
  background: ${theme.colors.background.primary};
  border-bottom: 1px solid ${theme.colors.neutral[200]};
  padding: ${theme.spacing[4]} ${theme.spacing[6]};
  box-shadow: ${theme.shadows.sm};
  z-index: ${theme.zIndex.sticky};
`;

const HeaderTitle = styled.h1`
  font-size: ${theme.typography.fontSize['2xl']};
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${theme.colors.text.primary};
  margin: 0;
  background: linear-gradient(135deg, ${theme.colors.primary[600]}, ${theme.colors.primary[800]});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const ContentArea = styled.div`
  flex: 1;
  padding: ${theme.spacing[6]};
  overflow: auto;
  position: relative;
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  gap: ${theme.spacing[4]};
`;

const LoadingText = styled.p`
  font-size: ${theme.typography.fontSize.lg};
  color: ${theme.colors.text.secondary};
  margin: 0;
`;

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  gap: ${theme.spacing[4]};
  padding: ${theme.spacing[6]};
`;

const ErrorCard = styled(Card)`
  max-width: 500px;
  text-align: center;
  border-color: ${theme.colors.error[300]};
  background: ${theme.colors.error[50]};
`;

const ErrorTitle = styled.h2`
  color: ${theme.colors.error[700]};
  font-size: ${theme.typography.fontSize.xl};
  margin-bottom: ${theme.spacing[2]};
`;

const ErrorMessage = styled.p`
  color: ${theme.colors.error[600]};
  margin: 0;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
  gap: ${theme.spacing[4]};
`;

const EmptyStateIcon = styled.div`
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, ${theme.colors.primary[100]}, ${theme.colors.primary[200]});
  border-radius: ${theme.borderRadius.full};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${theme.typography.fontSize['4xl']};
  color: ${theme.colors.primary[600]};
`;

const EmptyStateTitle = styled.h2`
  font-size: ${theme.typography.fontSize['2xl']};
  font-weight: ${theme.typography.fontWeight.semibold};
  color: ${theme.colors.text.primary};
  margin: 0;
`;

const EmptyStateDescription = styled.p`
  font-size: ${theme.typography.fontSize.lg};
  color: ${theme.colors.text.secondary};
  margin: 0;
  max-width: 400px;
`;

const App: React.FC = () => {
    const { isLoading, error, selectedProject } = useProjectContext();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    if (isLoading) {
        return (
            <>
                <GlobalStyles />
                <LoadingContainer>
                    <Spinner size="lg" color={theme.colors.primary[500]} />
                    <LoadingText>Loading Application Data...</LoadingText>
                </LoadingContainer>
            </>
        );
    }

    if (error) {
        return (
            <>
                <GlobalStyles />
                <ErrorContainer>
                    <ErrorCard>
                        <ErrorTitle>Something went wrong</ErrorTitle>
                        <ErrorMessage>{error}</ErrorMessage>
                    </ErrorCard>
                </ErrorContainer>
            </>
        );
    }

    return (
        <>
            <GlobalStyles />
            <AppContainer>
                <MobileHeader>
                    <MobileMenuButton onClick={toggleMobileMenu}>
                        ☰
                    </MobileMenuButton>
                    <MobileTitle>Project Manager</MobileTitle>
                </MobileHeader>

                <Overlay 
                    className={isMobileMenuOpen ? 'open' : ''} 
                    onClick={closeMobileMenu}
                />

                <Sidebar className={isMobileMenuOpen ? 'open' : ''}>
                    <ProjectList onClose={closeMobileMenu} />
                </Sidebar>

                <MainContent>
                    <Header>
                        <HeaderTitle>Project Manager</HeaderTitle>
                    </Header>
                    
                    <ContentArea>
                        {selectedProject ? (
                            <KanbanBoard project={selectedProject} />
                        ) : (
                            <EmptyState>
                                <EmptyStateIcon>📋</EmptyStateIcon>
                                <EmptyStateTitle>Welcome to Project Manager</EmptyStateTitle>
                                <EmptyStateDescription>
                                    Create a new project or select an existing one to start managing your tasks with our beautiful Kanban board.
                                </EmptyStateDescription>
                            </EmptyState>
                        )}
                    </ContentArea>
                </MainContent>
            </AppContainer>
        </>
    );
};

export default App;