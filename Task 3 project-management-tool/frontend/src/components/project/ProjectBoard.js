import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import io from 'socket.io-client';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  padding: 20px;
`;

const Board = styled.div`
  display: flex;
  flex: 1;
  overflow-x: auto;
  padding: 20px 0;
  gap: 20px;
`;

const Column = styled.div`
  min-width: 300px;
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const ColumnTitle = styled.h3`
  margin-bottom: 16px;
  color: #333;
`;

const TaskList = styled.div`
  min-height: 200px;
`;

const TaskCard = styled.div`
  background: #f5f5f5;
  border-radius: 4px;
  padding: 12px;
  margin-bottom: 8px;
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
  }
`;

const ProjectBoard = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const socketRef = useRef();
  const [tasks, setTasks] = useState({
    todo: [],
    inProgress: [],
    review: [],
    done: []
  });

  useEffect(() => {
    socketRef.current = io(process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000');

    // Fetch initial tasks
    fetchTasks();

    // Join project room
    socketRef.current.emit('join-project', projectId);

    // Listen for task updates
    socketRef.current.on('task-updated', (updatedTask) => {
      updateTaskList(updatedTask);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [projectId]);

  const fetchTasks = async () => {
    try {
      const response = await fetch(`/api/tasks/project/${projectId}`);
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const updateTaskList = (updatedTask) => {
    const newTasks = { ...tasks };
    const currentList = newTasks[updatedTask.status];
    
    // Remove from old list if exists
    if (updatedTask.oldStatus) {
      const oldList = newTasks[updatedTask.oldStatus];
      newTasks[updatedTask.oldStatus] = oldList.filter(task => task._id !== updatedTask._id);
    }
    
    // Add to new list
    newTasks[updatedTask.status] = [...currentList, updatedTask];
    setTasks(newTasks);
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination } = result;
    const sourceList = tasks[source.droppableId];
    const destList = tasks[destination.droppableId];

    // If dragging within same list
    if (source.droppableId === destination.droppableId) {
      const reorderedList = [...sourceList];
      const [removed] = reorderedList.splice(source.index, 1);
      reorderedList.splice(destination.index, 0, removed);
      
      const updatedTasks = { ...tasks, [source.droppableId]: reorderedList };
      setTasks(updatedTasks);
      
      // Update task order in backend
      updateTaskOrder(reorderedList[destination.index]._id, reorderedList);
    } else {
      // Moving between lists
      const movedTask = sourceList[source.index];
      const newStatus = destination.droppableId;
      
      // Update task status in backend
      updateTaskStatus(movedTask._id, newStatus);
    }
  };

  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (response.ok) {
        const updatedTask = await response.json();
        socketRef.current.emit('update-task', { ...updatedTask, oldStatus: tasks[updatedTask.status].find(task => task._id === updatedTask._id)?.status });
      }
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  const updateTaskOrder = async (taskId, reorderedList) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}/order`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ order: reorderedList.map(task => task._id) })
      });
      
      if (!response.ok) {
        throw new Error('Failed to update task order');
      }
    } catch (error) {
      console.error('Error updating task order:', error);
    }
  };

  return (
    <Container>
      <h1>Project Board</h1>
      <DragDropContext onDragEnd={onDragEnd}>
        <Board>
          {Object.entries(tasks).map(([status, taskList]) => (
            <Droppable key={status} droppableId={status}>
              {(provided) => (
                <Column ref={provided.innerRef} {...provided.droppableProps}>
                  <ColumnTitle>{status.charAt(0).toUpperCase() + status.slice(1)}</ColumnTitle>
                  <TaskList>
                    {taskList.map((task, index) => (
                      <Draggable key={task._id} draggableId={task._id} index={index}>
                        {(provided) => (
                          <TaskCard
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <h4>{task.title}</h4>
                            <p>{task.description}</p>
                            <div>
                              <span>Priority: {task.priority}</span>
                              {task.assignee && <span>Assigned to: {task.assignee.name}</span>}
                            </div>
                          </TaskCard>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </TaskList>
                </Column>
              )}
            </Droppable>
          ))}
        </Board>
      </DragDropContext>
    </Container>
  );
};

export default ProjectBoard;
