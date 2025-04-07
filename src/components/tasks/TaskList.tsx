
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import TaskItem from './TaskItem';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Priority, Task } from '@/store/slices/taskSlice';
import { Search } from 'lucide-react';

const TaskList: React.FC = () => {
  const { tasks } = useSelector((state: RootState) => state.tasks);
  const { user } = useSelector((state: RootState) => state.auth);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState<Priority | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'active'>('all');

  // Get user-specific tasks
  const userTasks = tasks.filter(task => task.userId === user?.username);

  // Apply filters
  const filteredTasks = userTasks.filter(task => {
    // Search filter
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Priority filter
    const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
    
    // Status filter
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'completed' && task.completed) || 
                         (filterStatus === 'active' && !task.completed);
    
    return matchesSearch && matchesPriority && matchesStatus;
  });

  // Group tasks by priority
  const highPriorityTasks = filteredTasks.filter(task => task.priority === 'high');
  const mediumPriorityTasks = filteredTasks.filter(task => task.priority === 'medium');
  const lowPriorityTasks = filteredTasks.filter(task => task.priority === 'low');

  // Combine all tasks in priority order
  const orderedTasks = [...highPriorityTasks, ...mediumPriorityTasks, ...lowPriorityTasks];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Select value={filterPriority} onValueChange={(value) => setFilterPriority(value as Priority | 'all')}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Filter Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="high">High Priority</SelectItem>
              <SelectItem value="medium">Medium Priority</SelectItem>
              <SelectItem value="low">Low Priority</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={filterStatus} onValueChange={(value) => setFilterStatus(value as 'all' | 'completed' | 'active')}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Filter Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tasks</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {filteredTasks.length > 0 ? (
        <div className="space-y-4">
          {orderedTasks.map((task) => (
            <TaskItem key={task.id} task={task} />
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500">No tasks found</p>
          <p className="text-sm text-gray-400 mt-1">
            {searchQuery || filterPriority !== 'all' || filterStatus !== 'all' 
              ? 'Try adjusting your filters' 
              : 'Add a new task to get started'}
          </p>
        </div>
      )}
    </div>
  );
};

export default TaskList;
