import React, { memo } from 'react';
import { ButtonNode, CatalogNode, StandardNode, ListNode } from './NodeTypes';
import { ButtonNodeHandles, CatalogNodeHandles, StandardNodeHandles, ListNodeHandles } from './NodeHandles';

const CustomNode = memo(({ id, data, selected, onEdit, onDelete, onAddButtons }) => {
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

  const handleAddButtonsClick = (nodeId, nodeData) => {
    if (onAddButtons) {
      onAddButtons(nodeId, nodeData);
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

  // Special rendering for list nodes
  if (data.type === 'list') {
    return (
      <div onDoubleClick={handleDoubleClick}>
        <ListNode 
          data={data} 
          onEdit={handleEditClick} 
          onDelete={handleDeleteClick} 
        />
        <ListNodeHandles listButtons={data.listButtons || []} />
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
        onAddButtons={handleAddButtonsClick}
      />
      <StandardNodeHandles />
    </div>
  );
});

CustomNode.displayName = 'CustomNode';

export default CustomNode;