
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { logout } from '@/store/slices/authSlice';
import TaskInput from '../tasks/TaskInput';
import TaskList from '../tasks/TaskList';
import { Button } from '@/components/ui/button';
import { LogOut, UserCircle } from 'lucide-react';
import { toast } from 'sonner';

const Dashboard: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Logged out successfully');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">TaskMaster</h1>
            <p className="text-gray-600">Organize your tasks with weather integration</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <UserCircle className="h-5 w-5 text-gray-700" />
              <span className="text-sm font-medium">{user?.username}</span>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout} className="flex items-center space-x-1">
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
        
        {/* Main content */}
        <div className="max-w-4xl mx-auto">
          {/* Task input form */}
          <TaskInput />
          
          {/* Task list */}
          <TaskList />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
