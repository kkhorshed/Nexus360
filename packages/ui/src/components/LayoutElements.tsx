import React, { useState, useEffect } from 'react';

const styles = {
  label: {
    position: 'absolute' as const,
    background: '#1890ff',
    color: '#fff',
    padding: '6px 12px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: '500' as const,
    zIndex: 999,
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    border: '1px solid rgba(255,255,255,0.1)',
    fontFamily: 'monospace',
    cursor: 'pointer',
    userSelect: 'none' as const,
  },
  highlight: {
    position: 'absolute' as const,
    border: '2px dashed #1890ff',
    borderRadius: '4px',
    pointerEvents: 'none' as const,
    zIndex: 998,
    backgroundColor: 'rgba(24, 144, 255, 0.05)',
  },
  highlightActive: {
    backgroundColor: 'rgba(255, 193, 7, 0.2)', // Different background color for active highlight
  },
  cueCard: {
    position: 'fixed' as const,
    background: '#ffffff',
    color: '#1f2937',
    padding: '12px 16px',
    borderRadius: '6px',
    fontSize: '12px',
    maxWidth: '300px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    border: '1px solid #e5e7eb',
    zIndex: 1000,
    pointerEvents: 'none' as const,
  }
};

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

const elementInfo = {
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
  const [highlights, setHighlights] = useState<Array<{ id: string, rect: DOMRect }>>([]);
  const [hoveredElement, setHoveredElement] = useState<string | null>(null);
  const [activeElement, setActiveElement] = useState<string | null>(null); // Track the active element
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
    setActiveElement(id); // Set the clicked element as active
  };

  return (
    <>
      {highlights.map(({ id, rect }, index) => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
        const info = elementInfo[id as keyof typeof elementInfo];

        // Ensure labels are within the viewport and do not overlap
        const labelTop = Math.max(rect.top + scrollTop - 25, 0); // Ensure label is not above the viewport
        const adjustedTop = labelTop + index * 30; // Add spacing for each label

        return (
          <React.Fragment key={id}>
            <div
              style={{
                ...styles.highlight,
                ...(activeElement === id ? styles.highlightActive : {}), // Apply active style if clicked
                top: `${rect.top + scrollTop}px`,
                left: `${rect.left + scrollLeft}px`,
                width: `${rect.width}px`,
                height: `${rect.height}px`,
              }}
            />
            <div
              style={{
                ...styles.label,
                top: `${adjustedTop}px`,
                left: `${rect.left + scrollLeft}px`,
              }}
              onMouseEnter={() => setHoveredElement(id)}
              onMouseLeave={() => setHoveredElement(null)}
              onMouseMove={handleMouseMove}
              onClick={() => handleLabelClick(id)} // Handle label click
            >
              {id}
            </div>
            {hoveredElement === id && info && (
              <div
                style={{
                  ...styles.cueCard,
                  top: `${mousePosition.y + 20}px`,
                  left: `${mousePosition.x + 20}px`,
                }}
              >
                <div style={{ fontWeight: 600, marginBottom: '8px' }}>
                  {info.title}
                </div>
                <div style={{ marginBottom: '8px' }}>
                  {info.description}
                </div>
                <div>
                  {info.dimensions}
                </div>
              </div>
            )}
          </React.Fragment>
        );
      })}
    </>
  );
};

export default LayoutElements;
