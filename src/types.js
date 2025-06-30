// Component item interface
export const ComponentItemType = {
  id: '',
  type: '',
  label: '',
  description: '',
  icon: '',
  color: ''
};

// Flow node interface
export const FlowNodeType = {
  id: '',
  type: '',
  position: { x: 0, y: 0 },
  data: {
    label: '',
    description: '',
    config: {}
  }
};

// Navigation item interface
export const NavigationItemType = {
  id: '',
  label: '',
  icon: '',
  active: false,
  section: ''
};