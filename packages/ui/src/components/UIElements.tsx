import React, { useState, useEffect, ReactNode } from 'react';
import { useLocation } from 'react-router-dom';

const styles = {
  label: {
    position: 'absolute' as const,
    background: '#1f2937',
    color: '#fff',
    padding: '6px 12px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: '500' as const,
    zIndex: 999,
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    border: '1px solid rgba(255,255,255,0.1)',
    fontFamily: 'monospace',
    cursor: 'help',
    userSelect: 'none' as const,
  },
  highlight: {
    position: 'absolute' as const,
    border: '2px dashed #3b82f6',
    borderRadius: '4px',
    pointerEvents: 'none' as const,
    zIndex: 998,
    backgroundColor: 'rgba(59, 130, 246, 0.05)',
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

interface UIElementsProps {
  elements: {
    container?: boolean;
    pageWrapper?: boolean;
    mainFrame?: boolean;
    section?: boolean;
    controls?: boolean;
    content?: boolean;
    cards?: boolean;
    board?: boolean;
    catalog?: boolean;
    members?: boolean;
    sso?: boolean;
    environment?: boolean;
    navigation?: boolean;
    toc?: boolean;
  };
}

const UIElements: React.FC<UIElementsProps> = ({ elements }) => {
  const location = useLocation();
  const pageName = location.pathname.split('/')[1];
  const currentPage = pageName ? pageName.charAt(0).toUpperCase() + pageName.slice(1) : 'Home';

  const [highlights, setHighlights] = useState<Array<{ id: string, rect: DOMRect }>>([]);
  const [hoveredElement, setHoveredElement] = useState<string | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updateHighlights = () => {
      const newHighlights: Array<{ id: string, rect: DOMRect }> = [];
      Object.entries(elements).forEach(([key, value]) => {
        if (value) {
          const elementId = `${currentPage}.${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
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
  }, [elements, currentPage]);

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  return (
    <>
      {highlights.map(({ id, rect }) => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

        return (
          <React.Fragment key={id}>
            <div
              style={{
                ...styles.highlight,
                top: `${rect.top + scrollTop}px`,
                left: `${rect.left + scrollLeft}px`,
                width: `${rect.width}px`,
                height: `${rect.height}px`,
              }}
            />
            <div
              style={{
                ...styles.label,
                top: `${rect.top + scrollTop - 25}px`,
                left: `${rect.left + scrollLeft}px`,
              }}
              onMouseEnter={() => setHoveredElement(id)}
              onMouseLeave={() => setHoveredElement(null)}
              onMouseMove={handleMouseMove}
            >
              {id}
            </div>
            {hoveredElement === id && (
              <div
                style={{
                  ...styles.cueCard,
                  top: `${mousePosition.y + 20}px`,
                  left: `${mousePosition.x + 20}px`,
                }}
              >
                <div style={{ fontWeight: 600, marginBottom: '8px' }}>
                  {id}
                </div>
                <div>
                  Dimensions: {Math.round(rect.width)}x{Math.round(rect.height)}px
                </div>
              </div>
            )}
          </React.Fragment>
        );
      })}
    </>
  );
};

export default UIElements;
