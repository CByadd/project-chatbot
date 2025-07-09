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
  
  // Refs to track state and prevent unnecessary updates
  const isInitialized = useRef(false);
  const lastFlowDataRef = useRef(null);
  const updateTimeoutRef = useRef(null);
  const flowDataIdRef = useRef(null);

  // Set default zoom level when component mounts
  useEffect(() => {
    setViewport({ x: 0, y: 0, zoom: 0.6 }, { duration: 0 });
    console.log('🎯 FlowCanvas initialized with default viewport');
  }, [setViewport]);

  // Initialize or update flow data when it changes
  useEffect(() => {
    const flowDataString = JSON.stringify(flowData);
    const hasNodes = flowData?.nodes?.length > 0;
    const hasEdges = flowData?.edges?.length > 0;
    
    // Create a unique identifier for this flow data
    const newFlowDataId = hasNodes ? `flow-${flowData.nodes[0]?.id}-${flowData.nodes.length}` : 'empty';
    
    // Check if this is actually new data
    const isDataChanged = lastFlowDataRef.current !== flowDataString;
    const isFlowChanged = flowDataIdRef.current !== newFlowDataId;
    
    console.log('🔍 FlowCanvas data check:', {
      hasNodes,
      hasEdges,
      nodeCount: flowData?.nodes?.length || 0,
      edgeCount: flowData?.edges?.length || 0,
      isDataChanged,
      isFlowChanged,
      newFlowDataId,
      previousId: flowDataIdRef.current
    });

    // Only update if data has actually changed
    if (!isDataChanged && !isFlowChanged) {
      console.log('⏭️ Skipping update - no changes detected');
      return;
    }
    
    // Update refs
    lastFlowDataRef.current = flowDataString;
    flowDataIdRef.current = newFlowDataId;
    
    // Reset initialization for new flows
    if (isFlowChanged) {
      console.log('🔄 Flow changed - resetting initialization');
      isInitialized.current = false;
    }

    if (hasNodes) {
      // Load existing flow data
      console.log('📊 Loading flow data with nodes');
      setNodes(flowData.nodes);
      setEdges(flowData.edges || []);
      isInitialized.current = true;
    } else {
      // Empty flow - clear everything and wait for user to add nodes
      console.log('🧹 Clearing canvas for empty flow');
      setNodes([]);
      setEdges([]);
      isInitialized.current = false;
    }
  }, [flowData, setNodes, setEdges]);

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

  // Debounced flow data update to parent
  const notifyFlowDataChange = useCallback((newNodes, newEdges) => {
    // Clear existing timeout
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
    }
    
    // Debounce updates to prevent excessive re-renders
    updateTimeoutRef.current = setTimeout(() => {
      if (onFlowDataChange) {
        const newFlowData = { 
          nodes: newNodes, 
          edges: newEdges
        };
        console.log('📤 Notifying parent of flow data change:', {
          nodeCount: newNodes.length,
          edgeCount: newEdges.length
        });
        onFlowDataChange(newFlowData);
      }
    }, 200); // Reduced debounce time for better responsiveness
  }, [onFlowDataChange]);

  // Update parent when nodes or edges change (only after initialization)
  useEffect(() => {
    if (isInitialized.current || nodes.length > 0) {
      console.log('🔄 Nodes/edges changed, notifying parent');
      notifyFlowDataChange(nodes, edges);
    }
  }, [nodes, edges, notifyFlowDataChange]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
    };
  }, []);

  // Optimized edge update function
  const updateEdgesFromConnections = useCallback(() => {
    console.log('🔗 Updating edges from node connections...');
    
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

      // Handle button connections (for any node type that has buttons)
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

      // Handle list button connections
      if (node.data.listButtons) {
        node.data.listButtons.forEach((listButton, index) => {
          if (listButton.nextNodeId) {
            const targetNode = nodes.find(n => n.id === listButton.nextNodeId);
            if (targetNode) {
              newEdges.push({
                id: `${node.id}-list-${index}-${listButton.nextNodeId}`,
                source: node.id,
                target: listButton.nextNodeId,
                sourceHandle: `list-${index}`,
                type: 'default',
                animated: true,
                style: { stroke: '#EAB308', strokeWidth: 2 },
                label: listButton.label
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

      // Handle standard nextNodeId for other node types (but not if they have buttons)
      if (node.data.type !== 'trigger' && node.data.type !== 'button' && node.data.type !== 'catalog' && node.data.type !== 'list' && node.data.nextNodeId && !node.data.buttons) {
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
    
    // Update edges only if they've actually changed
    setEdges(currentEdges => {
      const connectionEdges = newEdges;
      const manualEdges = currentEdges.filter(edge => 
        !edge.id.includes('-button-') && !edge.id.includes('-catalog-') &&
        !edge.id.includes('-trigger-') && !edge.id.includes('-next-') && !edge.id.includes('-list-')
      );
      
      const combinedEdges = [...manualEdges, ...connectionEdges];
      
      // Only update if edges have actually changed
      if (JSON.stringify(currentEdges) !== JSON.stringify(combinedEdges)) {
        console.log('✅ Edges updated:', {
          total: combinedEdges.length,
          manual: manualEdges.length,
          connections: connectionEdges.length
        });
        return combinedEdges;
      }
      
      return currentEdges;
    });
  }, [nodes, setEdges]);

  // Update edges when node connections change (debounced)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      updateEdgesFromConnections();
    }, 100);
    
    return () => clearTimeout(timeoutId);
  }, [updateEdgesFromConnections]);

  const onConnect = useCallback((params) => {
    console.log('🔗 Connection attempt:', params);

    // Handle button-specific connections (for any node type with buttons)
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

    // Handle list button connections
    if (params.sourceHandle && params.sourceHandle.startsWith('list-')) {
      const listIndex = parseInt(params.sourceHandle.split('-')[1]);
      
      setNodes((nodes) =>
        nodes.map((node) => {
          if (node.id === params.source && node.data.listButtons) {
            const updatedListButtons = [...node.data.listButtons];
            if (updatedListButtons[listIndex]) {
              updatedListButtons[listIndex] = {
                ...updatedListButtons[listIndex],
                nextNodeId: params.target
              };
            }
            return {
              ...node,
              data: {
                ...node.data,
                listButtons: updatedListButtons
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

        // Remove from list button connections
        if (node.data.listButtons) {
          const updatedListButtons = node.data.listButtons.map(listButton => ({
            ...listButton,
            nextNodeId: listButton.nextNodeId === nodeId ? '' : listButton.nextNodeId
          }));
          updatedNode.data = { ...updatedNode.data, listButtons: updatedListButtons };
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

  // Optimized nodes change handler
  const handleNodesChange = useCallback((changes) => {
    // Only log non-position changes to reduce noise
    const nonPositionChanges = changes.filter(change => 
      change.type !== 'position' && change.type !== 'dimensions'
    );
    
    if (nonPositionChanges.length > 0) {
      console.log('📝 Node changes:', nonPositionChanges);
    }
    
    onNodesChange(changes);
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

    console.log('➕ Adding new node:', { type, position });

    const getNodeData = (nodeType) => {
      const nodeConfigs = {
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
          description: 'Interactive list buttons',
          messageType: 'list',
          text: 'Choose an option:',
          listButtons: [],
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

    setNodes((nds) => {
      const updatedNodes = nds.concat(newNode);
      // Mark as initialized when first node is added
      if (!isInitialized.current) {
        isInitialized.current = true;
      }
      return updatedNodes;
    });
    
    console.log('✅ Node added successfully:', { id: newNode.id, type: newNode.data.type });
  }, [screenToFlowPosition, setNodes]);

  return (
    <div className="w-full h-full">
      <ReactFlow
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