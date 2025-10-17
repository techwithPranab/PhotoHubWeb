'use client';

import { createContext, useContext, useReducer, ReactNode, useMemo, useState, useRef, useEffect, useCallback } from 'react';
import { AlbumPage, AlbumElement, EditorState, HistoryState, Point, AssetLibraryItem } from '@/types/editor';

interface EditorContextType {
  state: EditorState & HistoryState;
  dispatch: React.Dispatch<EditorAction>;
  
  // Helper functions
  addElement: (element: Omit<AlbumElement, 'id' | 'layerIndex'>) => void;
  addElementFromAsset: (asset: AssetLibraryItem, position?: Point) => void;
  updateElement: (elementId: string, updates: Partial<AlbumElement>) => void;
  deleteElement: (elementId: string) => void;
  saveCurrentPage: () => Promise<void>;
  selectElement: (elementId: string) => void;
  toggleElementSelection: (elementId: string) => void;
  addElementToSelection: (elementId: string) => void;
  clearSelection: () => void;
  moveElement: (elementId: string, position: Point) => void;
  resizeElement: (elementId: string, size: { width: number; height: number }) => void;
  rotateElement: (elementId: string, rotation: number) => void;
  bringToFront: (elementId: string) => void;
  sendToBack: (elementId: string) => void;
  duplicateElement: (elementId: string) => void;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
}

type EditorAction =
  | { type: 'SET_CURRENT_PAGE'; payload: AlbumPage }
  | { type: 'ADD_ELEMENT'; payload: AlbumElement }
  | { type: 'UPDATE_ELEMENT'; payload: { elementId: string; updates: Partial<AlbumElement> } }
  | { type: 'DELETE_ELEMENT'; payload: string }
  | { type: 'SELECT_ELEMENTS'; payload: string[] }
  | { type: 'CLEAR_SELECTION' }
  | { type: 'SET_ZOOM'; payload: number }
  | { type: 'SET_TOOL'; payload: EditorState['tool'] }
  | { type: 'SET_GRID_VISIBLE'; payload: boolean }
  | { type: 'SET_SNAP_TO_GRID'; payload: boolean }
  | { type: 'COPY_TO_CLIPBOARD'; payload: AlbumElement[] }
  | { type: 'PASTE_FROM_CLIPBOARD' }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'SAVE_TO_HISTORY' };

const initialState: EditorState & HistoryState = {
  currentPage: null,
  selectedElements: [],
  clipboard: [],
  zoom: 1,
  tool: 'select',
  isGridVisible: true,
  isSnapToGrid: true,
  past: [],
  present: null as AlbumPage | null,
  future: []
};

// Helper functions to reduce complexity
function updateHistory(state: EditorState & HistoryState, newPage: AlbumPage) {
  return {
    past: state.present ? [...state.past, state.present].slice(-50) : state.past,
    present: newPage,
    future: [] as AlbumPage[]
  };
}

function handleElementAction(
  state: EditorState & HistoryState, 
  pageUpdater: (page: AlbumPage) => AlbumPage,
  selectionUpdater?: (selection: string[]) => string[]
) {
  if (!state.currentPage) return state;
  
  const newPage = pageUpdater(state.currentPage);
  const history = updateHistory(state, newPage);
  
  return {
    ...state,
    currentPage: newPage,
    selectedElements: selectionUpdater ? selectionUpdater(state.selectedElements) : state.selectedElements,
    ...history
  };
}

function editorReducer(state: EditorState & HistoryState, action: EditorAction): EditorState & HistoryState {
  switch (action.type) {
    case 'SET_CURRENT_PAGE':
      return {
        ...state,
        currentPage: action.payload,
        present: action.payload,
        selectedElements: []
      };

    case 'ADD_ELEMENT':
      return handleElementAction(state, (page) => ({
        ...page,
        elements: [...page.elements, action.payload]
      }));

    case 'UPDATE_ELEMENT':
      return handleElementAction(state, (page) => ({
        ...page,
        elements: page.elements.map(el => 
          el.id === action.payload.elementId 
            ? { ...el, ...action.payload.updates }
            : el
        )
      }));

    case 'DELETE_ELEMENT':
      return handleElementAction(
        state, 
        (page) => ({
          ...page,
          elements: page.elements.filter(el => el.id !== action.payload)
        }),
        (selection) => selection.filter(id => id !== action.payload)
      );

    case 'SELECT_ELEMENTS':
      return { ...state, selectedElements: action.payload };

    case 'CLEAR_SELECTION':
      return { ...state, selectedElements: [] };

    case 'SET_ZOOM':
      return { ...state, zoom: Math.max(0.1, Math.min(5, action.payload)) };

    case 'SET_TOOL':
      return {
        ...state,
        tool: action.payload,
        selectedElements: action.payload === 'select' ? state.selectedElements : []
      };

    case 'SET_GRID_VISIBLE':
      return { ...state, isGridVisible: action.payload };

    case 'SET_SNAP_TO_GRID':
      return { ...state, isSnapToGrid: action.payload };

    case 'COPY_TO_CLIPBOARD':
      return { ...state, clipboard: action.payload };

    case 'PASTE_FROM_CLIPBOARD':
      return handlePasteFromClipboard(state);

    case 'UNDO':
      return handleUndo(state);

    case 'REDO':
      return handleRedo(state);

    case 'SAVE_TO_HISTORY':
      return handleSaveToHistory(state);

    default:
      return state;
  }
}

function handlePasteFromClipboard(state: EditorState & HistoryState) {
  if (!state.currentPage || state.clipboard.length === 0) return state;
  
  const maxLayerIndex = Math.max(...state.currentPage.elements.map(e => e.layerIndex), 0);
  const pastedElements = state.clipboard.map((el, index) => ({
    ...el,
    id: `${el.id}_copy_${Date.now()}_${index}`,
    x: el.x + 20,
    y: el.y + 20,
    layerIndex: maxLayerIndex + index + 1
  }));
  
  return handleElementAction(
    state,
    (page) => ({ ...page, elements: [...page.elements, ...pastedElements] }),
    () => pastedElements.map(el => el.id)
  );
}

function handleUndo(state: EditorState & HistoryState) {
  if (state.past.length === 0) return state;
  
  const previous = state.past.at(-1)!;
  const newPast = state.past.slice(0, -1);
  
  return {
    ...state,
    past: newPast,
    present: previous,
    future: state.present ? [state.present, ...state.future].slice(0, 50) : state.future,
    currentPage: previous,
    selectedElements: []
  };
}

function handleRedo(state: EditorState & HistoryState) {
  if (state.future.length === 0) return state;
  
  const next = state.future[0];
  const newFuture = state.future.slice(1);
  
  return {
    ...state,
    past: state.present ? [...state.past, state.present].slice(-50) : state.past,
    present: next,
    future: newFuture,
    currentPage: next,
    selectedElements: []
  };
}

function handleSaveToHistory(state: EditorState & HistoryState) {
  if (!state.currentPage) return state;
  
  return {
    ...state,
    past: state.present ? [...state.past, state.present].slice(-50) : state.past,
    present: state.currentPage,
    future: []
  };
}

const EditorContext = createContext<EditorContextType | undefined>(undefined);

export function EditorProvider({ children }: { readonly children: ReactNode }) {
  const [state, dispatch] = useReducer(editorReducer, initialState);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const generateElementId = () => `element_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;

  const addElement = useCallback((elementData: Omit<AlbumElement, 'id' | 'layerIndex'>) => {
    const maxLayerIndex = state.currentPage?.elements.reduce((max, el) => Math.max(max, el.layerIndex), 0) || 0;
    
    const element: AlbumElement = {
      ...elementData,
      id: generateElementId(),
      layerIndex: maxLayerIndex + 1
    };
    
    dispatch({ type: 'ADD_ELEMENT', payload: element });
  }, [state.currentPage?.elements, dispatch]);

  const addElementFromAsset = (asset: AssetLibraryItem, position?: Point) => {
    const defaultPosition = position || { x: 100, y: 100 };
    
    let elementData: Omit<AlbumElement, 'id' | 'layerIndex'>;
    
    switch (asset.type) {
      case 'photo':
        elementData = {
          type: 'photo',
          x: defaultPosition.x,
          y: defaultPosition.y,
          width: Math.min(asset.size?.width || 200, 300),
          height: Math.min(asset.size?.height || 150, 225),
          rotation: 0,
          url: asset.url,
          opacity: 1
        };
        break;
        
      case 'sticker':
        elementData = {
          type: 'sticker',
          x: defaultPosition.x,
          y: defaultPosition.y,
          width: asset.size?.width || 50,
          height: asset.size?.height || 50,
          rotation: 0,
          url: asset.url,
          opacity: 1
        };
        break;
        
      case 'background':
        // Apply as page background or add as element
        if (state.currentPage) {
          dispatch({
            type: 'SET_CURRENT_PAGE',
            payload: {
              ...state.currentPage,
              pageBackground: {
                type: 'image',
                value: asset.url,
                opacity: 1
              }
            }
          });
          return;
        }
        elementData = {
          type: 'background',
          x: 0,
          y: 0,
          width: 800,
          height: 600,
          rotation: 0,
          url: asset.url,
          opacity: 0.8
        };
        break;
        
      default:
        elementData = {
          type: 'photo',
          x: defaultPosition.x,
          y: defaultPosition.y,
          width: 200,
          height: 150,
          rotation: 0,
          url: asset.url || asset.thumbnail,
          opacity: 1
        };
    }
    
    addElement(elementData);
  };

  const updateElement = (elementId: string, updates: Partial<AlbumElement>) => {
    dispatch({ type: 'UPDATE_ELEMENT', payload: { elementId, updates } });
  };

  const deleteElement = (elementId: string) => {
    dispatch({ type: 'DELETE_ELEMENT', payload: elementId });
  };

  const selectElement = (elementId: string) => {
    dispatch({ type: 'SELECT_ELEMENTS', payload: [elementId] });
  };
  
  const toggleElementSelection = (elementId: string) => {
    const currentSelection = state.selectedElements;
    const isSelected = currentSelection.includes(elementId);
    
    if (isSelected) {
      dispatch({ type: 'SELECT_ELEMENTS', payload: currentSelection.filter(id => id !== elementId) });
    } else {
      dispatch({ type: 'SELECT_ELEMENTS', payload: [...currentSelection, elementId] });
    }
  };
  
  const addElementToSelection = (elementId: string) => {
    const currentSelection = state.selectedElements;
    if (!currentSelection.includes(elementId)) {
      dispatch({ type: 'SELECT_ELEMENTS', payload: [...currentSelection, elementId] });
    }
  };

  const clearSelection = () => {
    dispatch({ type: 'CLEAR_SELECTION' });
  };

  const moveElement = (elementId: string, position: Point) => {
    updateElement(elementId, { x: position.x, y: position.y });
  };

  const resizeElement = (elementId: string, size: { width: number; height: number }) => {
    updateElement(elementId, size);
  };

  const rotateElement = (elementId: string, rotation: number) => {
    updateElement(elementId, { rotation });
  };

  const bringToFront = (elementId: string) => {
    if (!state.currentPage) return;
    
    const maxLayerIndex = Math.max(...state.currentPage.elements.map(el => el.layerIndex));
    updateElement(elementId, { layerIndex: maxLayerIndex + 1 });
  };

  const sendToBack = (elementId: string) => {
    if (!state.currentPage) return;
    
    const minLayerIndex = Math.min(...state.currentPage.elements.map(el => el.layerIndex));
    updateElement(elementId, { layerIndex: minLayerIndex - 1 });
  };

  const duplicateElement = (elementId: string) => {
    if (!state.currentPage) return;
    
    const element = state.currentPage.elements.find(el => el.id === elementId);
    if (!element) return;
    
    const { id, layerIndex, ...elementData } = element;
    addElement({
      ...elementData,
      x: element.x + 20,
      y: element.y + 20
    });
  };

  const undo = () => {
    dispatch({ type: 'UNDO' });
  };

  const redo = () => {
    dispatch({ type: 'REDO' });
  };

  const canUndo = () => state.past.length > 0;
  
  const canRedo = () => state.future.length > 0;

  const saveCurrentPage = useCallback(async () => {
    if (!state.currentPage) {
      throw new Error('No current page to save');
    }

    try {
      const response = await fetch(`/api/editor/pages/${state.currentPage.albumId}/${state.currentPage._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          elements: state.currentPage.elements,
          pageBackground: state.currentPage.pageBackground,
          updatedAt: new Date().toISOString()
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save page');
      }

      const data = await response.json();
      if (data.success) {
        setHasUnsavedChanges(false);
        // Update the current page with the saved version
        dispatch({ type: 'SET_CURRENT_PAGE', payload: data.data });
      }
    } catch (error) {
      console.error('Save error:', error);
      throw error;
    }
  }, [state.currentPage, dispatch, setHasUnsavedChanges]);

  // Auto-save functionality
  useEffect(() => {
    if (!hasUnsavedChanges || !state.currentPage) return;

    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Set new timeout for auto-save (3 seconds after last change)
    saveTimeoutRef.current = setTimeout(() => {
      saveCurrentPage().catch(console.error);
    }, 3000);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [hasUnsavedChanges, state.currentPage, saveCurrentPage]);

  // Mark as changed when elements are modified
  useEffect(() => {
    if (state.currentPage) {
      setHasUnsavedChanges(true);
    }
  }, [state.currentPage?.elements]);

  const contextValue: EditorContextType = useMemo(() => ({
    state,
    dispatch,
    addElement,
    addElementFromAsset,
    updateElement,
    deleteElement,
    selectElement,
    toggleElementSelection,
    addElementToSelection,
    clearSelection,
    moveElement,
    resizeElement,
    rotateElement,
    bringToFront,
    sendToBack,
    duplicateElement,
    undo,
    redo,
    canUndo,
    canRedo,
    saveCurrentPage
  }), [
    state, 
    addElement,
    addElementFromAsset,
    updateElement, 
    deleteElement, 
    selectElement,
    toggleElementSelection,
    addElementToSelection,
    clearSelection,
    moveElement,
    resizeElement,
    rotateElement,
    bringToFront,
    sendToBack,
    duplicateElement,
    undo,
    redo,
    canUndo,
    canRedo,
    saveCurrentPage
  ]);

  return (
    <EditorContext.Provider value={contextValue}>
      {children}
    </EditorContext.Provider>
  );
}

export function useEditor() {
  const context = useContext(EditorContext);
  if (context === undefined) {
    throw new Error('useEditor must be used within an EditorProvider');
  }
  return context;
}

export default EditorContext;
