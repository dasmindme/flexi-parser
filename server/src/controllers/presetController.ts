import { Request, Response } from 'express';
import { validationResult } from 'express-validator';

const mockPresets = [
  {
    id: '1',
    name: 'JSONPlaceholder Posts',
    url: 'https://jsonplaceholder.typicode.com/posts',
    description: 'Example posts API',
    category: 'Testing',
    user: '1',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '2',
    name: 'JSONPlaceholder Users',
    url: 'https://jsonplaceholder.typicode.com/users',
    description: 'Example users API',
    category: 'Testing',
    user: '1',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

export const getPresets = async (req: Request, res: Response) => {
  try {
    res.json(mockPresets);
  } catch (error: any) {
    console.error('Get presets error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const getPresetById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const preset = mockPresets.find(p => p.id === id);
    
    if (!preset) {
      return res.status(404).json({ error: 'Preset not found' });
    }

    res.json(preset);
  } catch (error: any) {
    console.error('Get preset by id error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Остальные функции временно возвращают мок-данные
export const getPresetsByCategory = async (req: Request, res: Response) => {
  const { category } = req.params;
  const filtered = mockPresets.filter(p => p.category === category);
  res.json(filtered);
};

export const searchPresets = async (req: Request, res: Response) => {
  const { q } = req.query;
  const filtered = mockPresets.filter(p => 
    p.name.toLowerCase().includes((q as string)?.toLowerCase() || '')
  );
  res.json(filtered);
};

export const createPreset = async (req: Request, res: Response) => {
  try {
    const { name, url, description, category } = req.body;
    
    const newPreset = {
      id: Date.now().toString(),
      name,
      url,
      description,
      category: category || '',
      user: '1',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    mockPresets.push(newPreset);
    
    res.status(201).json(newPreset);
  } catch (error: any) {
    console.error('Create preset error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const updatePreset = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, url, description, category } = req.body;
    
    const index = mockPresets.findIndex(p => p.id === id);
    
    if (index === -1) {
      return res.status(404).json({ error: 'Preset not found' });
    }
    
    mockPresets[index] = {
      ...mockPresets[index],
      name,
      url,
      description,
      category,
      updatedAt: new Date()
    };
    
    res.json(mockPresets[index]);
  } catch (error: any) {
    console.error('Update preset error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const deletePreset = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const index = mockPresets.findIndex(p => p.id === id);
    
    if (index === -1) {
      return res.status(404).json({ error: 'Preset not found' });
    }
    
    mockPresets.splice(index, 1);
    
    res.json({ 
      success: true, 
      message: 'Preset deleted successfully' 
    });
  } catch (error: any) {
    console.error('Delete preset error:', error);
    res.status(500).json({ error: error.message });
  }
};