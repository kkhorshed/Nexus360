import React, { useState, useEffect } from 'react';
import { Box, useTheme, alpha } from '@mui/material';

interface LayoutElementsProps {
  elements: {
    container?: boolean;
    header?: boolean;
    sider?: boolean;
    content?: boolean;
    contentWrapper?: boolean;
    headerContainer?: boolean;
    siderContainer?: boolean;
    mainContainer?: boolean;
    menu?: boolean;
  };
}

interface ElementInfo {
  title: string;
  description: string;
  dimensions: string;
}

const elementInfo: Record<string, ElementInfo> = {
  'App.container': {
    title: 'App Container',
    description: 'The root layout container that wraps the entire application.',
    dimensions: 'Full viewport width and height'
  },
  'App.header': {
    title: 'App Header',
    description: 'Top navigation bar containing branding and global actions.',
    dimensions: 'Full width, 64px height'
  },
  'App.sider': {
    title: 'App Sider',
    description: 'Side navigation menu with main application routes.',
    dimensions: '250px width, Full height'
  },
  'App.content': {
    title: 'App Content',
    description: 'Main content area where page components are rendered.',
    dimensions: 'Flexible dimensions'
  },
  'App.contentWrapper': {
    title: 'Content Wrapper',
    description: 'Wrapper that contains both the sider and main content area.',
    dimensions: 'Full width minus header height'
  },
  'App.headerContainer': {
    title: 'Header Container',
    description: 'Container specifically for the header component with its own styling.',
    dimensions: 'Full width, header height'
  },
  'App.siderContainer': {
    title: 'Sider Container',
    description: 'Container specifically for the side navigation with its own styling.',
    dimensions: '250px width, content height'
  },
  'App.mainContainer': {
    title: 'Main Container',
    description: 'Container specifically for the main content area with its own styling.',
    dimensions: 'Remaining width, content height'
  },
  'App.menu': {
    title: 'Navigation Menu',
    description: 'Main navigation menu component within the sider.',
    dimensions: 'Full sider width'
  }
};

const LayoutElements: React.FC<LayoutElementsProps> = ({ elements }) => {
  const theme = useTheme();
  const [highlights, setHighlights] = useState<Array<{ id: string, rect: DOMRect }>>([]);
  const [hoveredElement, setHoveredElement] = useState<string | null>(null);
  const [activeElement, setActiveElement] = useState<string | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updateHighlights = () => {
      const newHighlights: Array<{ id: string, rect: DOMRect }> = [];
      Object.entries(elements).forEach(([key, value]) => {
        if (value) {
          const elementId = `App.${key}`;
          const element = document.getElementById(elementId);
          if (element) {
            newHighlights.push({
              id: elementId,
              rect: element.getBoundingClientRect()
            });
          }
        }
      });
      setHighlights(newHighlights);
    };

    updateHighlights();
    window.addEventListener('resize', updateHighlights);
    window.addEventListener('scroll', updateHighlights);

    return () => {
      window.removeEventListener('resize', updateHighlights);
      window.removeEventListener('scroll', updateHighlights);
    };
  }, [elements]);

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  const handleLabelClick = (id: string) => {
    setActiveElement(id);
  };

  return (
    <>
      {highlights.map(({ id, rect }, index) => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
        const info = elementInfo[id];

        const labelTop = Math.max(rect.top + scrollTop - 25, 0);
        const adjustedTop = labelTop + index * 30;

        return (
          <React.Fragment key={id}>
            <Box
              sx={{
                position: 'absolute',
                border: `2px dashed ${theme.palette.primary.main}`,
                borderRadius: 1,
                pointerEvents: 'none',
                zIndex: 998,
                backgroundColor: activeElement === id
                  ? alpha(theme.palette.warning.main, 0.2)
                  : alpha(theme.palette.primary.main, 0.05),
                top: `${rect.top + scrollTop}px`,
                left: `${rect.left + scrollLeft}px`,
                width: `${rect.width}px`,
                height: `${rect.height}px`,
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
                padding: '6px 12px',
                borderRadius: 1,
                fontSize: '12px',
                fontWeight: 500,
                zIndex: 999,
                boxShadow: theme.shadows[1],
                border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
                fontFamily: 'monospace',
                cursor: 'pointer',
                userSelect: 'none',
                top: `${adjustedTop}px`,
                left: `${rect.left + scrollLeft}px`,
              }}
              onMouseEnter={() => setHoveredElement(id)}
              onMouseLeave={() => setHoveredElement(null)}
              onMouseMove={handleMouseMove}
              onClick={() => handleLabelClick(id)}
            >
              {id}
            </Box>
            {hoveredElement === id && info && (
              <Box
                sx={{
                  position: 'fixed',
                  backgroundColor: theme.palette.background.paper,
                  color: theme.palette.text.primary,
                  padding: '12px 16px',
                  borderRadius: 1,
                  fontSize: '12px',
                  maxWidth: '300px',
                  boxShadow: theme.shadows[2],
                  border: `1px solid ${theme.palette.divider}`,
                  zIndex: 1000,
                  pointerEvents: 'none',
                  top: `${mousePosition.y + 20}px`,
                  left: `${mousePosition.x + 20}px`,
                }}
              >
                <Box sx={{ fontWeight: 600, mb: 1 }}>
                  {info.title}
                </Box>
                <Box sx={{ mb: 1 }}>
                  {info.description}
                </Box>
                <Box>
                  {info.dimensions}
                </Box>
              </Box>
            )}
          </React.Fragment>
        );
      })}
    </>
  );
};

export default LayoutElements;
