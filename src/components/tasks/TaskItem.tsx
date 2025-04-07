
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { removeTask, toggleTaskCompletion, updateTaskPriority, type Task, type Priority } from '@/store/slices/taskSlice';
import { fetchWeatherByLocation } from '@/store/slices/weatherSlice';
import { RootState } from '@/store';
import { Button } from '@/components/ui/button';
import { Trash2, CheckSquare, Square, Cloud } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TaskItemProps {
  task: Task;
}

const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
  const dispatch = useDispatch();
  const weatherData = useSelector((state: RootState) => state.weather.data[task.location || '']);
  const weatherLoading = useSelector((state: RootState) => state.weather.isLoading);

  useEffect(() => {
    if (task.location) {
      dispatch(fetchWeatherByLocation(task.location));
    }
  }, [task.location, dispatch]);

  const handleDeleteTask = () => {
    dispatch(removeTask(task.id));
    toast.success('Task removed successfully');
  };

  const handleToggleCompletion = () => {
    dispatch(toggleTaskCompletion(task.id));
    toast.success(task.completed ? 'Task marked as incomplete' : 'Task marked as complete');
  };

  const handlePriorityChange = (value: Priority) => {
    dispatch(updateTaskPriority({ id: task.id, priority: value }));
  };

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  return (
    <Card className={`mb-4 border-l-4 ${task.completed ? 'border-l-gray-300 bg-gray-50' : `border-l-todo-${task.priority === 'low' ? 'green' : task.priority === 'medium' ? 'yellow' : 'red'}`}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <button onClick={handleToggleCompletion} className="mt-0.5 text-gray-500 hover:text-gray-700">
              {task.completed ? <CheckSquare className="h-5 w-5" /> : <Square className="h-5 w-5" />}
            </button>
            <div className={`flex-1 ${task.completed ? 'text-gray-500 line-through' : ''}`}>
              <h3 className="font-medium text-base">{task.title}</h3>
              {task.description && <p className="text-sm text-gray-600 mt-1">{task.description}</p>}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Select value={task.priority} onValueChange={handlePriorityChange}>
              <SelectTrigger className="w-[120px] h-8">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={handleDeleteTask}
              className="h-8 w-8 text-red-500 hover:text-white hover:bg-red-500"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
      
      {task.location && (
        <CardFooter className="px-4 py-2 bg-gray-50 flex justify-between items-center">
          <div className="text-sm text-gray-600 flex items-center">
            <Cloud className="h-4 w-4 mr-1" />
            {task.location}
          </div>
          
          {weatherData ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center">
                    <img 
                      src={weatherData.icon} 
                      alt={weatherData.description} 
                      className="h-6 w-6 mr-1"
                    />
                    <span className="text-sm font-medium">{weatherData.temperature}°C</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{weatherData.description} in {weatherData.location}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : weatherLoading ? (
            <span className="text-xs text-gray-500">Loading weather...</span>
          ) : (
            <span className="text-xs text-gray-500">Weather unavailable</span>
          )}
        </CardFooter>
      )}
    </Card>
  );
};

export default TaskItem;
