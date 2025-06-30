import React, { useCallback, useMemo, useEffect, useRef } from 'react';
import ReactFlow, {
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  MiniMap,
  Background,
  BackgroundVariant,
  useReactFlow,
} from 'reactflow';
import 'reactflow/dist/style.css';
import CustomNode from './CustomNode';

const FlowCanvas = ({ flowData, onFlowDataChange, onNodeEdit }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { screenToFlowPosition, setViewport } = useReactFlow();
  
  // Refs to prevent unnecessary re-renders and edge updates
  const isUpdatingEdges = useRef(false);
  const lastConnectionsRef = useRef('');
  const edgeUpdateTimeoutRef = useRef(null);


  // Set default zoom level when component mounts
  useEffect(() => {
    setViewport({ x: 0, y: 0, zoom: 0.6 }, { duration: 0 });
    console.log('🎯 FlowCanvas initialized with default viewport');
  }, [setViewport]);





  const isInitialized = useRef(false);

useEffect(() => {
  if (!isInitialized.current && flowData?.nodes?.length > 0) {
    setNodes(() => [...flowData.nodes]);
    setEdges(() => [...flowData.edges]);
    isInitialized.current = true;
  }

  if (!isInitialized.current && (!flowData?.nodes || flowData.nodes.length === 0)) {
    setNodes([
      {
        id: '1',
        type: 'custom',
        position: { x: 400, y: 100 },
        data: {
          label: 'Welcome Trigger',
          type: 'trigger',
          description: 'Start Flow',
          trigger: 'hi,hello,start',
          text: '',
          messageType: 'trigger',
          nextNodeId: ''
        },
      }
    ]);
    setEdges([]);
    isInitialized.current = true;
  }
}, [flowData, setNodes, setEdges]);

// If switching bots, reset:
useEffect(() => {
  isInitialized.current = false;
}, [flowData?.id]);


    console.log('🧠 Incoming flowData prop:', flowData);

  // Stable node types definition
  const nodeTypes = useMemo(() => ({ 
    custom: (props) => (
      <CustomNode 
        {...props} 
        onEdit={onNodeEdit} 
        onDelete={handleNodeDelete}
      />
    )
  }), [onNodeEdit]);

  // Convert ReactFlow format to clean JSON format
  const convertToCleanFormat = useCallback((nodes, edges) => {
    console.log('🔄 Converting flow to clean format:', {
      inputNodes: nodes.length,
      inputEdges: edges.length
    });

    const processedNodeIds = new Set();
    
    const result = {
      nodes: nodes.map(node => {
        if (processedNodeIds.has(node.id)) {
          return null;
        }

        const cleanNode = {
          id: node.id,
          type: node.data.type === 'trigger' ? 'start' : node.data.type,
          data: {},
          position: node.position
        };

        // For trigger nodes, merge with connected node data
        if (node.data.type === 'trigger') {
          if (node.data.trigger) {
            cleanNode.data.trigger = node.data.trigger;
          }
          
          if (node.data.nextNodeId) {
            const connectedNode = nodes.find(n => n.id === node.data.nextNodeId);
            if (connectedNode) {
              processedNodeIds.add(connectedNode.id);
              
              // Merge ALL data from the connected node
              Object.assign(cleanNode.data, {
                text: connectedNode.data.text,
                messageType: connectedNode.data.messageType,
                imageUrl: connectedNode.data.imageUrl,
                videoUrl: connectedNode.data.videoUrl,
                documentUrl: connectedNode.data.documentUrl,
                listItems: connectedNode.data.listItems?.filter(item => item && item.trim() !== ''),
                buttons: connectedNode.data.buttons?.map(button => ({
                  label: button.label,
                  nextNodeId: button.nextNodeId,
                  type: 'reply'
                })).filter(button => button.label && button.label.trim() !== ''),
                catalog: connectedNode.data.catalog?.items?.length > 0 ? {
                  title: connectedNode.data.catalog.title || 'Catalog',
                  items: connectedNode.data.catalog.items.filter(item => item && item.trim() !== '')
                } : undefined,
                nextNodeId: connectedNode.data.nextNodeId
              });
            }
          }
          return cleanNode;
        }

        // For non-trigger nodes, add their data normally
        Object.assign(cleanNode.data, {
          text: node.data.text,
          messageType: node.data.messageType,
          imageUrl: node.data.imageUrl,
          videoUrl: node.data.videoUrl,
          documentUrl: node.data.documentUrl,
          listItems: node.data.listItems?.filter(item => item && item.trim() !== ''),
          buttons: node.data.buttons?.map(button => ({
            label: button.label,
            nextNodeId: button.nextNodeId,
            type: 'reply'
          })).filter(button => button.label && button.label.trim() !== ''),
          catalog: node.data.catalog?.items?.length > 0 ? {
            title: node.data.catalog.title || 'Catalog',
            items: node.data.catalog.items.filter(item => item && item.trim() !== '')
          } : undefined,
          nextNodeId: node.data.nextNodeId
        });

        return cleanNode;
      }).filter(node => {
        if (!node) return false;
        if (node.type === 'start') {
          return node.data.trigger;
        }
        return Object.keys(node.data).length > 0;
      })
    };

    console.log('✅ Clean format conversion completed:', {
      outputNodes: result.nodes.length,
      mergedNodes: processedNodeIds.size
    });

    return result;
  }, []);

  // Notify parent component when flow data changes
  useEffect(() => {
    if (onFlowDataChange && isInitialized.current) {
      const cleanFormat = convertToCleanFormat(nodes, edges);
      onFlowDataChange({ nodes, edges });
    }
  }, [nodes, edges, onFlowDataChange, convertToCleanFormat]);

  // Debounced edge update function
  const updateEdgesFromConnections = useCallback(() => {
    if (isUpdatingEdges.current) return;
    
    // Clear any pending timeout
    if (edgeUpdateTimeoutRef.current) {
      clearTimeout(edgeUpdateTimeoutRef.current);
    }
    
    // Debounce edge updates to prevent rapid re-renders
    edgeUpdateTimeoutRef.current = setTimeout(() => {
      isUpdatingEdges.current = true;
      
      console.log('🔗 Updating edges from connections...');
      
      const newEdges = [];
      
      nodes.forEach(node => {
        // Handle trigger auto-flow connections
        if (node.data.type === 'trigger' && node.data.nextNodeId) {
          const targetNode = nodes.find(n => n.id === node.data.nextNodeId);
          if (targetNode) {
            newEdges.push({
              id: `${node.id}-trigger-${node.data.nextNodeId}`,
              source: node.id,
              target: node.data.nextNodeId,
              type: 'default',
              animated: true,
              style: { stroke: '#10B981', strokeWidth: 3 },
              label: 'Merges Data'
            });
          }
        }

        // Handle button connections
        if (node.data.buttons) {
          node.data.buttons.forEach((button, index) => {
            if (button.nextNodeId) {
              const targetNode = nodes.find(n => n.id === button.nextNodeId);
              if (targetNode) {
                newEdges.push({
                  id: `${node.id}-button-${index}-${button.nextNodeId}`,
                  source: node.id,
                  target: button.nextNodeId,
                  sourceHandle: `button-${index}`,
                  type: 'default',
                  animated: true,
                  style: { stroke: '#8B5CF6', strokeWidth: 2 },
                  label: button.label
                });
              }
            }
          });
        }
        
        // Handle catalog connections
        if (node.data.catalog && node.data.catalog.connections) {
          Object.entries(node.data.catalog.connections).forEach(([index, targetNodeId]) => {
            if (targetNodeId) {
              const targetNode = nodes.find(n => n.id === targetNodeId);
              if (targetNode) {
                newEdges.push({
                  id: `${node.id}-catalog-${index}-${targetNodeId}`,
                  source: node.id,
                  target: targetNodeId,
                  sourceHandle: `catalog-${index}`,
                  type: 'default',
                  animated: true,
                  style: { stroke: '#6366F1', strokeWidth: 2 }
                });
              }
            }
          });
        }

        // Handle standard nextNodeId for other node types
        if (node.data.type !== 'trigger' && node.data.type !== 'button' && node.data.type !== 'catalog' && node.data.nextNodeId) {
          const targetNode = nodes.find(n => n.id === node.data.nextNodeId);
          if (targetNode) {
            newEdges.push({
              id: `${node.id}-next-${node.data.nextNodeId}`,
              source: node.id,
              target: node.data.nextNodeId,
              type: 'default',
              animated: true,
              style: { stroke: '#6B7280', strokeWidth: 2 }
            });
          }
        }
      });
      
      console.log('✅ Edge update completed:', {
        totalEdges: newEdges.length,
        edgeTypes: {
          trigger: newEdges.filter(e => e.id.includes('-trigger-')).length,
          button: newEdges.filter(e => e.id.includes('-button-')).length,
          catalog: newEdges.filter(e => e.id.includes('-catalog-')).length,
          autoFlow: newEdges.filter(e => e.id.includes('-next-')).length
        }
      });
      
      // Update edges state
      setEdges(currentEdges => {
        const currentConnectionEdges = currentEdges.filter(edge => 
          edge.id.includes('-button-') || edge.id.includes('-catalog-') || 
          edge.id.includes('-trigger-') || edge.id.includes('-next-')
        );
        const manualEdges = currentEdges.filter(edge => 
          !edge.id.includes('-button-') && !edge.id.includes('-catalog-') &&
          !edge.id.includes('-trigger-') && !edge.id.includes('-next-')
        );
        
        // Check if connection edges changed
        const edgesChanged = currentConnectionEdges.length !== newEdges.length ||
          !newEdges.every(newEdge => 
            currentConnectionEdges.some(currentEdge => currentEdge.id === newEdge.id)
          );
        
        if (edgesChanged) {
          console.log('🔄 Edges updated in state');
          return [...manualEdges, ...newEdges];
        }
        
        return currentEdges;
      });
      
      isUpdatingEdges.current = false;
    }, 100); // 100ms debounce
  }, [nodes, setEdges]);

  // Only update edges when connections actually change
  useEffect(() => {
    const currentConnections = JSON.stringify(
      nodes.map(node => ({
        id: node.id,
        type: node.data.type,
        nextNodeId: node.data.nextNodeId || '',
        buttons: node.data.buttons?.map(b => ({ label: b.label, nextNodeId: b.nextNodeId })) || [],
        catalog: node.data.catalog?.connections || {}
      }))
    );
    
    if (currentConnections !== lastConnectionsRef.current) {
      console.log('🔄 Node connections changed, updating edges...');
      lastConnectionsRef.current = currentConnections;
      updateEdgesFromConnections();
    }
  }, [nodes, updateEdgesFromConnections]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (edgeUpdateTimeoutRef.current) {
        clearTimeout(edgeUpdateTimeoutRef.current);
      }
    };
  }, []);

  const onConnect = useCallback((params) => {
    console.log('🔗 Connection attempt:', params);

    // Handle button-specific connections
    if (params.sourceHandle && params.sourceHandle.startsWith('button-')) {
      const buttonIndex = parseInt(params.sourceHandle.split('-')[1]);
      
      setNodes((nodes) =>
        nodes.map((node) => {
          if (node.id === params.source && node.data.buttons) {
            const updatedButtons = [...node.data.buttons];
            if (updatedButtons[buttonIndex]) {
              updatedButtons[buttonIndex] = {
                ...updatedButtons[buttonIndex],
                nextNodeId: params.target
              };
            }
            return {
              ...node,
              data: {
                ...node.data,
                buttons: updatedButtons
              }
            };
          }
          return node;
        })
      );
      return;
    }

    // Handle catalog-specific connections
    if (params.sourceHandle && params.sourceHandle.startsWith('catalog-')) {
      const catalogIndex = parseInt(params.sourceHandle.split('-')[1]);
      
      setNodes((nodes) =>
        nodes.map((node) => {
          if (node.id === params.source && node.data.catalog) {
            const updatedCatalog = { ...node.data.catalog };
            if (!updatedCatalog.connections) {
              updatedCatalog.connections = {};
            }
            updatedCatalog.connections[catalogIndex] = params.target;
            
            return {
              ...node,
              data: {
                ...node.data,
                catalog: updatedCatalog
              }
            };
          }
          return node;
        })
      );
      return;
    }
    
    // For standard connections
    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id === params.source) {
          return {
            ...node,
            data: {
              ...node.data,
              nextNodeId: params.target
            }
          };
        }
        return node;
      })
    );
  }, [setNodes]);

  const handleNodeDelete = useCallback((nodeId) => {
    console.log('🗑️ Deleting node:', { nodeId });
    
    // Remove the node
    setNodes((nodes) => nodes.filter((node) => node.id !== nodeId));
    
    // Remove all edges connected to this node
    setEdges((edges) => 
      edges.filter((edge) => edge.source !== nodeId && edge.target !== nodeId)
    );

    // Remove references to this node from all connections
    setNodes((nodes) =>
      nodes.map((node) => {
        let updatedNode = { ...node };
        
        // Remove from nextNodeId
        if (node.data.nextNodeId === nodeId) {
          updatedNode.data = { ...updatedNode.data, nextNodeId: '' };
        }
        
        // Remove from button connections
        if (node.data.buttons) {
          const updatedButtons = node.data.buttons.map(button => ({
            ...button,
            nextNodeId: button.nextNodeId === nodeId ? '' : button.nextNodeId
          }));
          updatedNode.data = { ...updatedNode.data, buttons: updatedButtons };
        }
        
        // Remove from catalog connections
        if (node.data.catalog && node.data.catalog.connections) {
          const updatedConnections = { ...node.data.catalog.connections };
          Object.keys(updatedConnections).forEach(key => {
            if (updatedConnections[key] === nodeId) {
              delete updatedConnections[key];
            }
          });
          updatedNode.data = {
            ...updatedNode.data,
            catalog: {
              ...updatedNode.data.catalog,
              connections: updatedConnections
            }
          };
        }
        
        return updatedNode;
      })
    );

    console.log('✅ Node deleted and references cleaned up');
  }, [setNodes, setEdges]);

  // Stable nodes change handler
  const handleNodesChange = useCallback((changes) => {
    // Allow position and selection changes without triggering edge updates
    const isPositionOrSelectionChange = changes.every(change => 
      change.type === 'position' || change.type === 'select' || change.type === 'dimensions'
    );
    
    if (isPositionOrSelectionChange) {
      onNodesChange(changes);
    } else {
      console.log('📝 Node changes:', changes);
      onNodesChange(changes);
    }
  }, [onNodesChange]);

  // Stable drag handlers
  const onDragOverHandler = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDropHandler = useCallback((event) => {
    event.preventDefault();

    const type = event.dataTransfer.getData('application/reactflow');

    if (typeof type === 'undefined' || !type) {
      return;
    }

    const position = screenToFlowPosition({
      x: event.clientX,
      y: event.clientY,
    });

    console.log('➕ Adding new node:', {
      type,
      position,
      timestamp: new Date().toISOString()
    });

    const getNodeData = (nodeType) => {
      const nodeConfigs = {
        node: {
          label: 'Node Container',
          description: 'Multi-component container',
          components: []
        },
        trigger: { 
          label: 'Trigger', 
          description: 'Trigger keywords only',
          messageType: 'trigger',
          text: '',
          trigger: 'hi,hello,start',
          nextNodeId: ''
        },
        text: { 
          label: 'Text', 
          description: 'Send message',
          messageType: 'text',
          text: 'Your message here...',
          nextNodeId: ''
        },
        image: { 
          label: 'Image', 
          description: 'Send image',
          messageType: 'image',
          text: 'Check out this image!',
          imageUrl: '',
          nextNodeId: ''
        },
        video: { 
          label: 'Video', 
          description: 'Send video',
          messageType: 'video',
          text: 'Watch this video!',
          videoUrl: '',
          nextNodeId: ''
        },
        document: { 
          label: 'Document', 
          description: 'Send document',
          messageType: 'document',
          text: 'Here is a document for you.',
          documentUrl: '',
          nextNodeId: ''
        },
        list: { 
          label: 'List', 
          description: 'Interactive list',
          messageType: 'list',
          text: 'Choose from the list:',
          listItems: [],
          nextNodeId: ''
        },
        button: { 
          label: 'Button', 
          description: 'Interactive buttons',
          messageType: 'button',
          text: 'Choose an option:',
          buttons: [
            { label: 'Option 1', description: '', imageUrl: '', nextNodeId: '' },
            { label: 'Option 2', description: '', imageUrl: '', nextNodeId: '' }
          ]
        },
        catalog: { 
          label: 'Catalog', 
          description: 'Product catalog',
          messageType: 'catalog',
          text: 'Browse our catalog:',
          catalog: { 
            title: 'Product Catalog', 
            items: ['Product 1', 'Product 2', 'Product 3'],
            connections: {}
          }
        },
        template: { 
          label: 'Template', 
          description: 'Message template',
          messageType: 'text',
          text: 'Template message...',
          nextNodeId: ''
        }
      };
      return nodeConfigs[nodeType] || nodeConfigs.text;
    };

    const nodeData = getNodeData(type);
    const newNode = {
      id: `${Date.now()}`,
      type: 'custom',
      position,
      data: {
        ...nodeData,
        type: type
      },
    };

    setNodes((nds) => nds.concat(newNode));

    console.log('✅ Node added successfully:', {
      id: newNode.id,
      type: newNode.data.type,
      label: newNode.data.label
    });
  }, [screenToFlowPosition, setNodes]);

  return (
    <div className="w-full h-full">
      <ReactFlow
        key={JSON.stringify(flowData)}
        nodes={nodes}
        edges={edges}
        onNodesChange={handleNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDropHandler}
        onDragOver={onDragOverHandler}
        nodeTypes={nodeTypes}
        defaultViewport={{ x: 0, y: 0, zoom: 0.6 }}
        className="bg-gray-50"
        style={{ width: '100%', height: '100%' }}
        fitView={false}
        nodesDraggable={true}
        nodesConnectable={true}
        elementsSelectable={true}
        selectNodesOnDrag={false}
        panOnDrag={true}
        zoomOnScroll={true}
        zoomOnPinch={true}
        panOnScroll={false}
        preventScrolling={true}
        minZoom={0.1}
        maxZoom={2}
      >
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#e5e7eb" />
        <Controls className="bg-white border border-gray-200 rounded-lg shadow-sm" />
        <MiniMap
          className="bg-white border border-gray-200 rounded-lg shadow-sm"
          maskColor="rgba(0, 0, 0, 0.1)"
          nodeColor="#8B5CF6"
        />
      </ReactFlow>
    </div>
  );
};

export default FlowCanvas;