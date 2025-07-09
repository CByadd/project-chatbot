import React from 'react';
import { Handle, Position } from 'reactflow';

export const ButtonNodeHandles = ({ buttons }) => {
  return (
    <>
      <Handle type="target" position={Position.Left} className="w-3 h-3 bg-gray-400" />
      
      {/* Individual output handles for buttons */}
      {buttons.length > 0 && (
        <>
          {buttons.map((button, index) => (
            <Handle
              key={`button-${index}`}
              type="source"
              position={Position.Right}
              id={`button-${index}`}
              className="w-3 h-3 bg-blue-400 hover:bg-blue-500 transition-colors"
              style={{
                top: `${120 + (index * 52) + 26}px`
              }}
            />
          ))}
        </>
      )}

      {/* Default output handles for empty button nodes */}
      {buttons.length === 0 && (
        <>
          {[0, 1, 2].map((index) => (
            <Handle 
              key={`button-${index}`}
              type="source" 
              position={Position.Right} 
              id={`button-${index}`}
              className="w-3 h-3 bg-gray-300" 
              style={{ top: `${120 + (index * 52) + 26}px` }}
            />
          ))}
        </>
      )}
    </>
  );
};

export const CatalogNodeHandles = ({ catalogItems, hasTitle }) => {
  return (
    <>
      <Handle type="target" position={Position.Left} className="w-3 h-3 bg-gray-400" />
      
      {/* Individual output handles for catalog items */}
      {catalogItems.length > 0 && (
        <>
          {catalogItems.map((item, index) => (
            <Handle
              key={`catalog-${index}`}
              type="source"
              position={Position.Right}
              id={`catalog-${index}`}
              className="w-3 h-3 bg-blue-400 hover:bg-blue-500 transition-colors"
              style={{
                top: `${(hasTitle ? 160 : 120) + (index * 52) + 26}px`,
                right: '-6px'
              }}
            />
          ))}
        </>
      )}

      {/* Default output handles for empty catalog nodes */}
      {catalogItems.length === 0 && (
        <>
          {[0, 1, 2].map((index) => (
            <Handle 
              key={`catalog-${index}`}
              type="source" 
              position={Position.Right} 
              id={`catalog-${index}`}
              className="w-3 h-3 bg-gray-300" 
              style={{ top: `${160 + (index * 52) + 26}px`, right: '-6px' }}
            />
          ))}
        </>
      )}
    </>
  );
};

export const ListNodeHandles = ({ buttons }) => {
  return (
    <>
      <Handle type="target" position={Position.Left} className="w-3 h-3 bg-gray-400" />
      
      {/* Individual output handles for buttons */}
      {buttons.length > 0 && (
        <>
          {buttons.map((button, index) => (
            <Handle
              key={`button-${index}`}
              type="source"
              position={Position.Right}
              id={`list-${index}`}
              className="w-3 h-3 bg-blue-400 hover:bg-blue-500 transition-colors"
              style={{
                top: `${120 + (index * 52) + 26}px`
              }}
            />
          ))}
        </>
      )}

      {/* Default output handles for empty nodes */}
      {buttons.length === 0 && (
        <>
          {[0, 1, 2].map((index) => (
            <Handle 
              key={`button-${index}`}
              type="source" 
              position={Position.Right} 
              id={`list-${index}`}
              className="w-3 h-3 bg-gray-300" 
              style={{ top: `${120 + (index * 52) + 26}px` }}
            />
          ))}
        </>
      )}
    </>
  );
};

export const StandardNodeHandles = ({ hasButtons }) => {
  return (
    <>
      <Handle type="target" position={Position.Left} className="w-3 h-3 bg-gray-400" />
      
      {/* Show button handles if node has buttons */}
      {hasButtons ? (
        // Dynamic button handles will be added by the button system
        <Handle type="source" position={Position.Right} className="w-3 h-3 bg-purple-400" />
      ) : (
        // Standard single output handle
        <Handle type="source" position={Position.Right} className="w-3 h-3 bg-gray-400" />
      )}
    </>
  );
};