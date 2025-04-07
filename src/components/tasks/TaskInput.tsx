
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { nanoid } from '@reduxjs/toolkit';
import { addTask } from '@/store/slices/taskSlice';
import { RootState } from '@/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import type { Priority } from '@/store/slices/taskSlice';

const TaskInput: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [location, setLocation] = useState('');
  
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error('Task title is required');
      return;
    }
    
    const newTask = {
      id: nanoid(),
      title: title.trim(),
      description: description.trim(),
      completed: false,
      priority,
      location: location.trim(),
      createdAt: new Date().toISOString(),
      userId: user?.username || 'anonymous',
    };
    
    dispatch(addTask(newTask));
    toast.success('Task added successfully!');
    
    // Reset form
    setTitle('');
    setDescription('');
    setPriority('medium');
    setLocation('');
  };

  return (
    <Card className="mb-6 animate-fade-in">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              placeholder="What do you need to do?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-base"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Textarea
                placeholder="Add description (optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[80px]"
              />
            </div>
            
            <div className="space-y-4">
              <div>
                <Select value={priority} onValueChange={(value: Priority) => setPriority(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low Priority</SelectItem>
                    <SelectItem value="medium">Medium Priority</SelectItem>
                    <SelectItem value="high">High Priority</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Input
                  placeholder="Location (for weather info)"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
            </div>
          </div>
          
          <Button type="submit" className="w-full md:w-auto bg-todo-blue hover:bg-blue-600">
            Add Task
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default TaskInput;
