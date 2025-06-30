import React, { memo } from 'react';
import { ButtonNode, CatalogNode, StandardNode } from './NodeTypes';
import { ButtonNodeHandles, CatalogNodeHandles, StandardNodeHandles } from './NodeHandles';

const CustomNode = memo(({ id, data, selected, onEdit, onDelete }) => {
  const handleDoubleClick = (e) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit(id, data);
    }
  };

  const handleEditClick = (e) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit(id, data);
    }
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(id);
    }
  };

  // Special rendering for button nodes
  if (data.type === 'button') {
    return (
      <div onDoubleClick={handleDoubleClick}>
        <ButtonNode 
          data={data} 
          onEdit={handleEditClick} 
          onDelete={handleDeleteClick} 
        />
        <ButtonNodeHandles buttons={data.buttons || []} />
      </div>
    );
  }

  // Special rendering for catalog nodes
  if (data.type === 'catalog') {
    return (
      <div onDoubleClick={handleDoubleClick}>
        <CatalogNode 
          data={data} 
          onEdit={handleEditClick} 
          onDelete={handleDeleteClick} 
        />
        <CatalogNodeHandles 
          catalogItems={data.catalog?.items || []} 
          hasTitle={!!data.catalog?.title} 
        />
      </div>
    );
  }

  // Standard node rendering
  return (
    <div onDoubleClick={handleDoubleClick}>
      <StandardNode 
        id={id}
        data={data} 
        selected={selected}
        onEdit={handleEditClick} 
        onDelete={handleDeleteClick} 
      />
      <StandardNodeHandles />
    </div>
  );
});

CustomNode.displayName = 'CustomNode';

export default CustomNode;